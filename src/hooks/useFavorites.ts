'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export function useFavorites() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch favorites on mount
  useEffect(() => {
    if (session?.user) {
      fetchFavorites();
    }
  }, [session]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      if (data.success) {
        setFavorites(data.data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const addFavorite = useCallback(async (saleId: string) => {
    if (!session?.user) {
      return { success: false, error: 'Please login to save favorites' };
    }

    setLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saleId }),
      });
      const data = await res.json();
      
      if (data.success) {
        setFavorites(data.data);
      }
      return data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return { success: false, error: 'Failed to add favorite' };
    } finally {
      setLoading(false);
    }
  }, [session]);

  const removeFavorite = useCallback(async (saleId: string) => {
    if (!session?.user) {
      return { success: false, error: 'Please login' };
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/favorites?saleId=${saleId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        setFavorites(data.data);
      }
      return data;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return { success: false, error: 'Failed to remove favorite' };
    } finally {
      setLoading(false);
    }
  }, [session]);

  const toggleFavorite = useCallback(async (saleId: string) => {
    if (favorites.includes(saleId)) {
      return removeFavorite(saleId);
    } else {
      return addFavorite(saleId);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((saleId: string) => {
    return favorites.includes(saleId);
  }, [favorites]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    isLoggedIn: !!session?.user,
  };
}
