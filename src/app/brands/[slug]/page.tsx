"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import SaleCard from "@/components/ui/SaleCard";
import { Brand, Sale } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BrandPage({ params }: PageProps) {
  const { slug } = use(params);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch brand by slug (the [id] route now supports both ID and slug)
        const brandRes = await fetch(`/api/brands/${slug}`);
        const brandData = await brandRes.json();

        if (!brandData.success || !brandData.data) {
          setNotFoundState(true);
          setLoading(false);
          return;
        }

        setBrand(brandData.data);

        // Fetch sales for this brand
        const salesRes = await fetch(
          `/api/sales?brandId=${
            brandData.data._id || brandData.data.id
          }&active=true`
        );
        const salesData = await salesRes.json();

        if (salesData.success) {
          setSales(salesData.data);
        }
      } catch (error) {
        console.error("Error fetching brand:", error);
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (notFoundState) {
    notFound();
  }

  if (loading) {
    return (
      <>
        <section className="brand-hero">
          <div className="container">
            <div className="brand-header">
              <div className="skeleton-logo"></div>
              <div className="brand-info">
                <div className="skeleton-category"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-desc"></div>
              </div>
            </div>
          </div>
        </section>
        <section className="brand-sales">
          <div className="container">
            <div className="loading-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          </div>
        </section>
        <style jsx>{`
          .brand-hero {
            background: linear-gradient(
              135deg,
              rgba(139, 92, 246, 0.08) 0%,
              rgba(236, 72, 153, 0.08) 100%
            );
            padding: 3rem 0 4rem;
          }
          .brand-header {
            display: flex;
            align-items: flex-start;
            gap: 2rem;
          }
          .skeleton-logo {
            width: 120px;
            height: 120px;
            border-radius: var(--radius-2xl);
            background: #e0e0e0;
          }
          .skeleton-category {
            width: 80px;
            height: 24px;
            background: #e0e0e0;
            border-radius: 12px;
            margin-bottom: 0.75rem;
          }
          .skeleton-title {
            width: 200px;
            height: 40px;
            background: #e0e0e0;
            border-radius: 4px;
            margin-bottom: 0.75rem;
          }
          .skeleton-desc {
            width: 400px;
            height: 24px;
            background: #e0e0e0;
            border-radius: 4px;
          }
          .brand-sales {
            padding: 3rem 0 4rem;
          }
          .loading-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
          .skeleton-card {
            height: 280px;
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: var(--radius-xl);
          }
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
      </>
    );
  }

  if (!brand) return null;

  return (
    <>
      {/* Brand Hero */}
      <section className="brand-hero">
        <div className="container">
          <div className="brand-header">
            <div className="brand-logo">
              <img src={brand.logo} alt={brand.name} />
            </div>
            <div className="brand-info">
              <span className="brand-category">{brand.category}</span>
              <h1>{brand.name}</h1>
              <p className="brand-description">{brand.description}</p>
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-website"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Sales */}
      <section className="brand-sales">
        <div className="container">
          <div className="sales-header">
            <h2>Active Sales ({sales.length})</h2>
            <Link href="/sales" className="view-all-link">
              View All Sales →
            </Link>
          </div>

          {sales.length > 0 ? (
            <div className="sales-grid">
              {sales.map((sale) => (
                <SaleCard key={sale._id || sale.id} sale={sale} />
              ))}
            </div>
          ) : (
            <div className="no-sales">
              <span className="no-sales-icon">🏷️</span>
              <h3>No Active Sales</h3>
              <p>
                {brand.name} doesn't have any active sales right now. Check back
                later!
              </p>
              <Link href="/sales" className="btn btn-primary">
                Browse All Sales
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Back Link */}
      <section className="back-section">
        <div className="container">
          <Link href="/brands" className="back-link">
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
            Back to All Brands
          </Link>
        </div>
      </section>

      <style jsx>{`
        .brand-hero {
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.08) 0%,
            rgba(236, 72, 153, 0.08) 100%
          );
          padding: 3rem 0 4rem;
        }

        .brand-header {
          display: flex;
          align-items: flex-start;
          gap: 2rem;
        }

        .brand-logo {
          width: 120px;
          height: 120px;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: var(--shadow-lg);
          background: white;
        }

        .brand-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .brand-info {
          flex: 1;
        }

        .brand-category {
          display: inline-block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--primary-purple);
          font-weight: 600;
          background: rgba(139, 92, 246, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.75rem;
        }

        .brand-info h1 {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }

        .brand-description {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          max-width: 600px;
        }

        .brand-website {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary-purple);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
        }

        .brand-website:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .brand-sales {
          padding: 3rem 0 4rem;
        }

        .sales-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .sales-header h2 {
          font-size: 1.5rem;
          margin: 0;
        }

        .view-all-link {
          color: var(--primary-purple);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        .sales-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .no-sales {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--bg-light);
          border-radius: var(--radius-2xl);
        }

        .no-sales-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .no-sales h3 {
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }

        .no-sales p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .back-section {
          padding: 0 0 3rem;
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
          .sales-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .brand-hero {
            padding: 2rem 0 3rem;
          }

          .brand-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .brand-logo {
            width: 100px;
            height: 100px;
          }

          .brand-info h1 {
            font-size: 2rem;
          }

          .brand-description {
            font-size: 1rem;
          }

          .sales-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .sales-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .brand-hero {
            padding: 1.5rem 0 2rem;
          }

          .brand-logo {
            width: 80px;
            height: 80px;
          }

          .brand-info h1 {
            font-size: 1.5rem;
          }

          .brand-description {
            font-size: 0.875rem;
          }

          .brand-sales {
            padding: 2rem 0;
          }

          .no-sales {
            padding: 2rem 1rem;
          }

          .no-sales-icon {
            font-size: 3rem;
          }
        }
      `}</style>
    </>
  );
}
