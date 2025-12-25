"use client";

import { use, useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SaleCard from "@/components/ui/SaleCard";
import ShareButtons from "@/components/ui/ShareButtons";
import { useFavorites } from "@/hooks/useFavorites";
import { Sale, Brand } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SalePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const { isFavorite, toggleFavorite, loading: favLoading } = useFavorites();
  const [showToast, setShowToast] = useState("");

  const [sale, setSale] = useState<Sale | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [relatedSales, setRelatedSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch sale data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch sale details
        const saleRes = await fetch(`/api/sales/${id}`);
        const saleData = await saleRes.json();

        if (!saleData.success || !saleData.data) {
          notFound();
          return;
        }

        setSale(saleData.data);

        // Track view
        fetch(`/api/sales/views`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ saleId: id }),
        });

        // Fetch brand details
        if (saleData.data.brandId) {
          const brandRes = await fetch(`/api/brands/${saleData.data.brandId}`);
          const brandData = await brandRes.json();
          if (brandData.success) {
            setBrand(brandData.data);
          }
        }

        // Fetch related sales
        const relatedRes = await fetch(
          `/api/sales?category=${saleData.data.category}&limit=3`
        );
        const relatedData = await relatedRes.json();
        if (relatedData.success) {
          setRelatedSales(
            relatedData.data
              .filter((s: Sale) => (s._id || s.id) !== id)
              .slice(0, 3)
          );
        }
      } catch (error) {
        console.error("Error fetching sale:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="container">
          <div className="skeleton-breadcrumb"></div>
          <div className="skeleton-grid">
            <div className="skeleton-image"></div>
            <div className="skeleton-details">
              <div className="skeleton-line short"></div>
              <div className="skeleton-line full"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line full"></div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .loading-page {
            padding: 2rem 0 4rem;
          }
          .skeleton-breadcrumb {
            height: 20px;
            width: 200px;
            background: #e0e0e0;
            border-radius: 4px;
            margin-bottom: 2rem;
          }
          .skeleton-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
          .skeleton-image {
            height: 400px;
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 16px;
          }
          .skeleton-details {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .skeleton-line {
            height: 24px;
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 4px;
          }
          .skeleton-line.short {
            width: 30%;
          }
          .skeleton-line.medium {
            width: 60%;
          }
          .skeleton-line.full {
            width: 100%;
          }
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
          @media (max-width: 1024px) {
            .skeleton-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    );
  }

  if (!sale) {
    notFound();
  }

  const daysLeft = Math.ceil(
    (new Date(sale.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const isExpired = daysLeft < 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleFavorite = async () => {
    if (!session) {
      router.push("/login?callbackUrl=" + encodeURIComponent(`/sales/${id}`));
      return;
    }

    const result = await toggleFavorite(id);
    if (result.success) {
      setShowToast(
        isFavorite(id) ? "Removed from favorites" : "Added to favorites!"
      );
      setTimeout(() => setShowToast(""), 3000);
    }
  };

  const handleShopNowClick = () => {
    // Track click
    fetch("/api/sales/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ saleId: sale._id || sale.id }),
    });
  };

  const isSaved = isFavorite(id);
  const saleId = sale._id || sale.id;

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="toast">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          {showToast}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/sales">Sales</Link>
          <span>/</span>
          <span className="current">{sale.title}</span>
        </div>
      </div>

      {/* Sale Hero */}
      <section className="sale-hero">
        <div className="container">
          <div className="sale-grid">
            {/* Image */}
            <div className="sale-image-section">
              <div className="sale-image">
                <img src={sale.image} alt={sale.title} />
                <span className="discount-badge">
                  -{sale.discountPercentage}%
                </span>
                {sale.isFeatured && (
                  <span className="featured-badge">🔥 HOT DEAL</span>
                )}
                {isExpired && <span className="expired-badge">EXPIRED</span>}
              </div>
              {sale.views && (
                <div className="views-count">
                  👁 {sale.views.toLocaleString()} views
                </div>
              )}
            </div>

            {/* Details */}
            <div className="sale-details">
              {/* Brand */}
              {brand && (
                <Link href={`/brands/${brand.slug}`} className="brand-link">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="brand-logo"
                  />
                  <span>{brand.name}</span>
                </Link>
              )}

              <h1>{sale.title}</h1>

              <p className="sale-description">{sale.description}</p>

              {/* Pricing */}
              <div className="pricing">
                {sale.originalPrice && (
                  <span className="original-price">
                    Rs. {sale.originalPrice.toLocaleString()}
                  </span>
                )}
                {sale.salePrice && (
                  <span className="sale-price">
                    Rs. {sale.salePrice.toLocaleString()}
                  </span>
                )}
                <span className="savings">
                  Save Rs.{" "}
                  {(
                    (sale.originalPrice || 0) - (sale.salePrice || 0)
                  ).toLocaleString()}
                </span>
              </div>

              {/* Meta Info */}
              <div className="sale-meta">
                <div className="meta-item">
                  <span className="meta-label">Category</span>
                  <span className="meta-value">{sale.category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Valid Until</span>
                  <span className="meta-value">{formatDate(sale.endDate)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Time Left</span>
                  <span
                    className={`meta-value ${daysLeft <= 3 ? "urgent" : ""} ${
                      isExpired ? "expired" : ""
                    }`}
                  >
                    {isExpired
                      ? "Expired"
                      : daysLeft > 0
                      ? `${daysLeft} days`
                      : "Ending today!"}
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="cta-buttons">
                {!isExpired && (
                  <>
                    <Link
                      href={`/checkout/${saleId}`}
                      className="btn btn-primary btn-lg"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                      </svg>
                      Buy Now
                    </Link>
                    <a
                      href={sale.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-lg btn-outline"
                      onClick={handleShopNowClick}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Visit Store
                    </a>
                  </>
                )}
                <button
                  className={`btn btn-lg favorite-btn ${
                    isSaved ? "saved" : "btn-outline"
                  }`}
                  onClick={handleFavorite}
                  disabled={favLoading}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={isSaved ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                  {isSaved ? "Saved" : "Save"}
                </button>
              </div>

              {/* Share */}
              <div className="share-section">
                <ShareButtons
                  url={`/sales/${saleId}`}
                  title={`${sale.title} - ${sale.discountPercentage}% OFF!`}
                  description={sale.description}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Sales */}
      {relatedSales.length > 0 && (
        <section className="related-sales">
          <div className="container">
            <div className="section-header">
              <h2>You May Also Like</h2>
              <Link href="/sales" className="view-all">
                View All Sales →
              </Link>
            </div>
            <div className="sales-grid">
              {relatedSales.map((s) => (
                <SaleCard key={s._id || s.id} sale={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back Link */}
      <section className="back-section">
        <div className="container">
          <Link href="/sales" className="back-link">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to All Sales
          </Link>
        </div>
      </section>

      <style jsx>{`
        .breadcrumb {
          background: var(--bg-light);
          padding: 1rem 0;
        }

        .breadcrumb .container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .breadcrumb a {
          color: var(--text-secondary);
          text-decoration: none;
        }

        .breadcrumb a:hover {
          color: var(--primary-purple);
        }

        .breadcrumb span {
          color: var(--text-muted);
        }

        .breadcrumb .current {
          color: var(--text-primary);
          font-weight: 500;
        }

        .sale-hero {
          padding: 2rem 0 4rem;
        }

        .sale-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .sale-image {
          position: relative;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }

        .sale-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        .discount-badge {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 1.25rem;
          box-shadow: var(--shadow-lg);
        }

        .featured-badge {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: linear-gradient(135deg, #f97316, #fbbf24);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .expired-badge {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          background: #6b7280;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .views-count {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .sale-details {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .brand-link {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: var(--bg-light);
          border-radius: var(--radius-lg);
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 500;
          width: fit-content;
          transition: all var(--transition-fast);
        }

        .brand-link:hover {
          background: var(--primary-purple);
          color: white;
        }

        .brand-logo {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .sale-details h1 {
          font-size: 2rem;
          line-height: 1.2;
          margin: 0;
        }

        .sale-description {
          font-size: 1.125rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .pricing {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .original-price {
          font-size: 1.25rem;
          color: var(--text-muted);
          text-decoration: line-through;
        }

        .sale-price {
          font-size: 2rem;
          font-weight: 700;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .savings {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .sale-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          padding: 1.5rem;
          background: var(--bg-light);
          border-radius: var(--radius-xl);
        }

        .meta-item {
          text-align: center;
        }

        .meta-label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .meta-value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .meta-value.urgent {
          color: #ef4444;
        }

        .meta-value.expired {
          color: #6b7280;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
        }

        .cta-buttons .btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .favorite-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
          color: #ef4444;
        }

        .favorite-btn.saved {
          background: #ef4444;
          border-color: #ef4444;
          color: white;
        }

        .favorite-btn.saved:hover {
          background: #dc2626;
        }

        .toast {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: #1f2937;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
          box-shadow: var(--shadow-xl);
          z-index: 1000;
          animation: slideUp 0.3s ease;
        }

        .toast svg {
          color: #ef4444;
        }

        @keyframes slideUp {
          from {
            transform: translateX(-50%) translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }

        .share-section {
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .related-sales {
          padding: 3rem 0 4rem;
          background: var(--bg-light);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .section-header h2 {
          font-size: 1.5rem;
          margin: 0;
        }

        .view-all {
          color: var(--primary-purple);
          text-decoration: none;
          font-weight: 500;
        }

        .view-all:hover {
          text-decoration: underline;
        }

        .sales-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .back-section {
          padding: 2rem 0;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: color var(--transition-fast);
        }

        .back-link:hover {
          color: var(--primary-purple);
        }

        @media (max-width: 1024px) {
          .sale-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .sales-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .sale-meta {
            grid-template-columns: 1fr;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .sales-grid {
            grid-template-columns: 1fr;
          }

          .sale-details h1 {
            font-size: 1.5rem;
          }

          .sale-price {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .breadcrumb .current {
            display: none;
          }

          .discount-badge {
            font-size: 1rem;
            padding: 0.5rem 1rem;
          }

          .pricing {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}
