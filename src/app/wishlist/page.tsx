"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SaleCard from "@/components/ui/SaleCard";
import { Sale } from "@/types";

function WishlistContent() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Shared wishlist params
  const sharedItems = searchParams.get("items");
  const sharedName = searchParams.get("name");

  const [wishlistItems, setWishlistItems] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWishlist() {
      setLoading(true);
      setError(null);

      try {
        if (sharedItems) {
          // Shared wishlist - fetch sales by IDs from URL params
          const itemIds = sharedItems.split(",");
          const salesPromises = itemIds.map((id) =>
            fetch(`/api/sales/${id}`).then((res) => res.json())
          );
          const salesResults = await Promise.all(salesPromises);
          const validSales = salesResults
            .filter((result) => result.success)
            .map((result) => result.data);
          setWishlistItems(validSales);
        } else if (session?.user) {
          // Logged in user's favorites
          const favoritesRes = await fetch("/api/favorites");
          const favoritesData = await favoritesRes.json();

          if (favoritesData.success && favoritesData.data.length > 0) {
            // Fetch full sale details for each favorite
            const salesPromises = favoritesData.data.map((id: string) =>
              fetch(`/api/sales/${id}`).then((res) => res.json())
            );
            const salesResults = await Promise.all(salesPromises);
            const validSales = salesResults
              .filter((result) => result.success)
              .map((result) => result.data);
            setWishlistItems(validSales);
          } else {
            setWishlistItems([]);
          }
        } else {
          setWishlistItems([]);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    }

    if (status !== "loading") {
      fetchWishlist();
    }
  }, [sharedItems, session, status]);

  // Loading state
  if (loading || status === "loading") {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading wishlist...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="empty-state">
        <h2>Oops!</h2>
        <p>{error}</p>
        <Link href="/sales" className="btn btn-primary">
          Browse Sales
        </Link>
      </div>
    );
  }

  // Not logged in and no shared wishlist
  if (!session && !sharedItems) {
    return (
      <div className="empty-state">
        <div className="empty-icon">❤️</div>
        <h2>Your Wishlist is Waiting!</h2>
        <p>Login to save your favorite sales and access them anytime.</p>
        <div className="empty-actions">
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
          <Link href="/signup" className="btn btn-outline">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  // Shared wishlist view
  if (sharedItems) {
    return (
      <>
        <div className="wishlist-header">
          <div className="wishlist-avatar">
            {(sharedName || "A")[0].toUpperCase()}
          </div>
          <div>
            <h1>
              {sharedName ? `${sharedName}'s Wishlist` : "Shared Wishlist"}
            </h1>
            <p>{wishlistItems.length} saved items</p>
          </div>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="wishlist-grid">
            {wishlistItems.map((sale) => (
              <SaleCard key={sale._id || sale.id} sale={sale} />
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
          <Link href="/signup" className="btn btn-primary">
            Create Account
          </Link>
        </div>
      </>
    );
  }

  // User's own wishlist
  return (
    <>
      <div className="wishlist-header">
        <div className="wishlist-avatar">
          {session?.user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h1>My Wishlist</h1>
          <p>{wishlistItems.length} saved items</p>
        </div>
        {wishlistItems.length > 0 && (
          <button
            className="btn btn-outline share-btn"
            onClick={() => {
              const ids = wishlistItems.map((s) => s._id || s.id).join(",");
              const shareUrl = `${
                window.location.origin
              }/wishlist?items=${ids}&name=${encodeURIComponent(
                session?.user?.name || "Friend"
              )}`;
              navigator.clipboard.writeText(shareUrl);
              alert("Wishlist link copied to clipboard!");
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16,6 12,2 8,6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share Wishlist
          </button>
        )}
      </div>

      {wishlistItems.length > 0 ? (
        <div className="wishlist-grid">
          {wishlistItems.map((sale) => (
            <SaleCard key={sale._id || sale.id} sale={sale} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">💔</div>
          <h2>Your wishlist is empty</h2>
          <p>
            Start adding your favorite sales to keep track of the best deals!
          </p>
          <Link href="/sales" className="btn btn-primary">
            Browse Sales
          </Link>
        </div>
      )}
    </>
  );
}

export default function WishlistPage() {
  return (
    <>
      <div className="wishlist-page">
        <div className="container">
          <Suspense
            fallback={
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading wishlist...</p>
              </div>
            }
          >
            <WishlistContent />
          </Suspense>
        </div>
      </div>

      <style jsx>{`
        .wishlist-page {
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
          flex-wrap: wrap;
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
          flex-shrink: 0;
        }

        .wishlist-header h1 {
          margin-bottom: 0.25rem;
        }

        .wishlist-header p {
          color: var(--text-secondary);
        }

        .share-btn {
          margin-left: auto;
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

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h2 {
          margin-bottom: 1rem;
        }

        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .empty-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .loading-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--primary-purple);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-state p {
          color: var(--text-secondary);
        }

        .wishlist-cta {
          margin-top: 3rem;
          text-align: center;
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.1),
            rgba(236, 72, 153, 0.1)
          );
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

          .share-btn {
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
}
