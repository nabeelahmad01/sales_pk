'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SaleCard from '@/components/ui/SaleCard';
import { sales } from '@/data/mockData';

interface SharedWishlist {
  userName: string;
  items: string[];
}

function WishlistContent() {
  const searchParams = useSearchParams();
  const wishlistId = searchParams.get('id');
  const items = searchParams.get('items');
  const name = searchParams.get('name');
  
  const [wishlistItems, setWishlistItems] = useState<typeof sales>([]);

  useEffect(() => {
    if (items) {
      const itemIds = items.split(',');
      const foundItems = sales.filter(sale => itemIds.includes(sale.id));
      setWishlistItems(foundItems);
    }
  }, [items]);

  if (!items) {
    return (
      <div className="empty-state">
        <h2>Invalid Wishlist Link</h2>
        <p>This wishlist link is invalid or has expired.</p>
        <Link href="/sales" className="btn btn-primary">Browse Sales</Link>
      </div>
    );
  }

  return (
    <>
      <div className="wishlist-header">
        <div className="wishlist-avatar">
          {(name || 'A')[0].toUpperCase()}
        </div>
        <div>
          <h1>{name ? `${name}'s Wishlist` : 'Shared Wishlist'}</h1>
          <p>{wishlistItems.length} saved items</p>
        </div>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="wishlist-grid">
          {wishlistItems.map(sale => (
            <SaleCard key={sale.id} sale={sale} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No items found in this wishlist.</p>
        </div>
      )}

      <div className="wishlist-cta">
        <h3>Want to create your own wishlist?</h3>
        <p>Sign up to save your favorite sales and share with friends!</p>
        <Link href="/signup" className="btn btn-primary">Create Account</Link>
      </div>
    </>
  );
}

export default function SharedWishlistPage() {
  return (
    <>
      <div className="shared-wishlist-page">
        <div className="container">
          <Suspense fallback={<div className="loading">Loading wishlist...</div>}>
            <WishlistContent />
          </Suspense>
        </div>
      </div>

      <style jsx>{`
        .shared-wishlist-page {
          padding: 2rem 0 4rem;
          min-height: calc(100vh - 160px);
        }

        .wishlist-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
        }

        .wishlist-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .wishlist-header h1 {
          margin-bottom: 0.25rem;
        }

        .wishlist-header p {
          color: var(--text-secondary);
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-state h2 {
          margin-bottom: 1rem;
        }

        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .wishlist-cta {
          margin-top: 3rem;
          text-align: center;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
          padding: 3rem;
          border-radius: var(--radius-2xl);
        }

        .wishlist-cta h3 {
          margin-bottom: 0.5rem;
        }

        .wishlist-cta p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .loading {
          text-align: center;
          padding: 4rem;
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .wishlist-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .wishlist-grid {
            grid-template-columns: 1fr;
          }

          .wishlist-header {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}
