'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Sale {
  _id: string;
  title: string;
  brandName: string;
  discountPercentage: number;
  image: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session) return;
      
      try {
        const favRes = await fetch('/api/user/favorites');
        const favData = await favRes.json();
        
        if (favData.success && favData.data.length > 0) {
          // Fetch sale details for each favorite
          const salesRes = await fetch('/api/sales');
          const salesData = await salesRes.json();
          
          if (salesData.success) {
            const favoriteSales = salesData.data.filter((sale: Sale) =>
              favData.data.includes(sale._id)
            );
            setFavorites(favoriteSales);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session]);

  const handleRemoveFavorite = async (saleId: string) => {
    try {
      await fetch('/api/user/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saleId }),
      });
      setFavorites(favorites.filter(f => f._id !== saleId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <div className="profile-page">
        <div className="container">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {session.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="profile-info">
              <h1>{session.user?.name}</h1>
              <p>{session.user?.email}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-outline">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>

          {/* Favorites Section */}
          <div className="favorites-section">
            <h2>❤️ My Favorite Sales ({favorites.length})</h2>
            
            {favorites.length === 0 ? (
              <div className="empty-favorites">
                <span className="empty-icon">🏷️</span>
                <h3>No favorites yet</h3>
                <p>Start browsing and save sales you like!</p>
                <Link href="/sales" className="btn btn-primary">
                  Browse Sales
                </Link>
              </div>
            ) : (
              <div className="favorites-grid">
                {favorites.map(sale => (
                  <div key={sale._id} className="favorite-card">
                    <img src={sale.image} alt={sale.title} className="favorite-image" />
                    <div className="favorite-content">
                      <span className="favorite-brand">{sale.brandName}</span>
                      <h3>{sale.title}</h3>
                      <span className="favorite-discount">{sale.discountPercentage}% OFF</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveFavorite(sale._id)}
                      className="remove-btn"
                      title="Remove from favorites"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          padding: 3rem 0;
          min-height: calc(100vh - 200px);
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--primary-purple);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          background: white;
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-md);
          margin-bottom: 2rem;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          background: var(--primary-gradient);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }

        .profile-info {
          flex: 1;
        }

        .profile-info h1 {
          margin-bottom: 0.25rem;
        }

        .profile-info p {
          color: var(--text-secondary);
        }

        .favorites-section {
          background: white;
          border-radius: var(--radius-2xl);
          padding: 2rem;
          box-shadow: var(--shadow-md);
        }

        .favorites-section h2 {
          margin-bottom: 1.5rem;
        }

        .empty-favorites {
          text-align: center;
          padding: 3rem;
        }

        .empty-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .empty-favorites h3 {
          margin-bottom: 0.5rem;
        }

        .empty-favorites p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .favorite-card {
          position: relative;
          background: var(--bg-light);
          border-radius: var(--radius-xl);
          overflow: hidden;
          transition: all var(--transition-fast);
        }

        .favorite-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .favorite-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .favorite-content {
          padding: 1rem;
        }

        .favorite-brand {
          font-size: 0.75rem;
          color: var(--primary-purple);
          font-weight: 600;
          text-transform: uppercase;
        }

        .favorite-content h3 {
          font-size: 1rem;
          margin: 0.25rem 0;
        }

        .favorite-discount {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background: linear-gradient(135deg, #EF4444, #F97316);
          color: white;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .remove-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 32px;
          height: 32px;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .remove-btn:hover {
          background: #EF4444;
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .profile-header .btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .profile-page {
            padding: 1.5rem 0;
          }

          .profile-header {
            padding: 1.5rem;
          }

          .profile-avatar {
            width: 64px;
            height: 64px;
            font-size: 1.5rem;
          }

          .profile-info h1 {
            font-size: 1.25rem;
          }

          .profile-info p {
            font-size: 0.875rem;
          }

          .favorites-section {
            padding: 1.5rem;
          }

          .favorites-section h2 {
            font-size: 1.125rem;
          }

          .favorites-grid {
            grid-template-columns: 1fr;
          }

          .empty-favorites {
            padding: 2rem 1rem;
          }

          .empty-icon {
            font-size: 3rem;
          }

          .favorite-image {
            height: 120px;
          }
        }
      `}</style>
    </>
  );
}
