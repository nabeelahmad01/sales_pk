"use client";

import { useState, useEffect } from "react";
import BrandCard from "@/components/ui/BrandCard";
import { Brand, Category } from "@/types";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [brandsRes, categoriesRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/categories"),
        ]);

        const [brandsData, categoriesData] = await Promise.all([
          brandsRes.json(),
          categoriesRes.json(),
        ]);

        if (brandsData.success) setBrands(brandsData.data);
        if (categoriesData.success) setCategories(categoriesData.data);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Group brands by category
  const brandsByCategory = categories
    .map((cat) => ({
      category: cat,
      brands: brands.filter(
        (brand) => brand.category?.toLowerCase() === cat.name.toLowerCase()
      ),
    }))
    .filter((group) => group.brands.length > 0);

  if (loading) {
    return (
      <>
        <section className="page-header">
          <div className="container">
            <h1>All Brands</h1>
            <p>Shop sales from Pakistan's most loved fashion brands</p>
          </div>
        </section>
        <div className="brands-page">
          <div className="container">
            <div className="loading-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          .page-header {
            background: linear-gradient(
              135deg,
              rgba(139, 92, 246, 0.08) 0%,
              rgba(236, 72, 153, 0.08) 100%
            );
            padding: 3rem 0;
            text-align: center;
          }
          .page-header h1 {
            margin-bottom: 0.5rem;
          }
          .page-header p {
            color: var(--text-secondary);
          }
          .brands-page {
            padding: 3rem 0 4rem;
          }
          .loading-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
          .skeleton-card {
            height: 200px;
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
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
          @media (max-width: 768px) {
            .loading-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>All Brands</h1>
          <p>Shop sales from Pakistan's most loved fashion brands</p>
        </div>
      </section>

      <div className="brands-page">
        <div className="container">
          {/* All Brands Grid */}
          <section className="all-brands">
            <div className="brands-grid">
              {brands.map((brand) => (
                <BrandCard key={brand._id || brand.id} brand={brand} />
              ))}
            </div>
          </section>

          {/* Brands by Category */}
          {brandsByCategory.map((group) => (
            <section
              key={group.category._id || group.category.id}
              className="category-section"
            >
              <div className="category-header">
                <span className="category-icon">{group.category.icon}</span>
                <h2>{group.category.name}</h2>
              </div>
              <div className="brands-grid">
                {group.brands.map((brand) => (
                  <BrandCard key={brand._id || brand.id} brand={brand} />
                ))}
              </div>
            </section>
          ))}

          {brands.length === 0 && (
            <div className="no-brands">
              <span className="no-brands-icon">🏪</span>
              <h3>No brands available</h3>
              <p>Check back later for new brands</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .page-header {
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.08) 0%,
            rgba(236, 72, 153, 0.08) 100%
          );
          padding: 3rem 0;
          text-align: center;
        }

        .page-header h1 {
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .brands-page {
          padding: 3rem 0 4rem;
        }

        .all-brands {
          margin-bottom: 4rem;
        }

        .brands-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .category-section {
          margin-bottom: 3rem;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--border-color);
        }

        .category-icon {
          font-size: 1.75rem;
        }

        .category-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .no-brands {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
        }

        .no-brands-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .no-brands h3 {
          margin-bottom: 0.5rem;
        }

        .no-brands p {
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .brands-grid {
            grid-template-columns: 1fr;
          }

          .page-header {
            padding: 2rem 0;
          }

          .page-header h1 {
            font-size: 1.75rem;
          }

          .brands-page {
            padding: 2rem 0 3rem;
          }

          .all-brands {
            margin-bottom: 3rem;
          }

          .category-section {
            margin-bottom: 2rem;
          }

          .category-header {
            margin-bottom: 1rem;
          }

          .category-header h2 {
            font-size: 1.25rem;
          }

          .category-icon {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .page-header {
            padding: 1.5rem 0;
          }

          .page-header h1 {
            font-size: 1.5rem;
          }

          .page-header p {
            font-size: 0.875rem;
          }

          .brands-page {
            padding: 1.5rem 0 2rem;
          }

          .brands-grid {
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}
