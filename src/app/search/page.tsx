"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import SaleCard from "@/components/ui/SaleCard";
import BrandCard from "@/components/ui/BrandCard";
import { Sale, Brand } from "@/types";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default function SearchPage({ searchParams }: PageProps) {
  const { q: query } = use(searchParams);
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch from real API
        const [salesRes, brandsRes] = await Promise.all([
          fetch(`/api/search?q=${encodeURIComponent(query)}&type=sales`),
          fetch(`/api/search?q=${encodeURIComponent(query)}&type=brands`),
        ]);

        const [salesData, brandsData] = await Promise.all([
          salesRes.json(),
          brandsRes.json(),
        ]);

        if (salesData.success) setSales(salesData.data || []);
        if (brandsData.success) setBrands(brandsData.data || []);
      } catch (error) {
        console.error("Search error:", error);
        // Fallback: try fetching all and filter client-side
        try {
          const [salesRes, brandsRes] = await Promise.all([
            fetch("/api/sales?active=true"),
            fetch("/api/brands"),
          ]);
          const [salesData, brandsData] = await Promise.all([
            salesRes.json(),
            brandsRes.json(),
          ]);

          const searchLower = query.toLowerCase();

          if (salesData.success) {
            const filtered = salesData.data.filter(
              (sale: Sale) =>
                sale.title.toLowerCase().includes(searchLower) ||
                sale.description.toLowerCase().includes(searchLower) ||
                sale.brandName.toLowerCase().includes(searchLower) ||
                sale.category.toLowerCase().includes(searchLower)
            );
            setSales(filtered);
          }

          if (brandsData.success) {
            const filtered = brandsData.data.filter(
              (brand: Brand) =>
                brand.name.toLowerCase().includes(searchLower) ||
                (brand.description &&
                  brand.description.toLowerCase().includes(searchLower)) ||
                (brand.category &&
                  brand.category.toLowerCase().includes(searchLower))
            );
            setBrands(filtered);
          }
        } catch (fallbackError) {
          console.error("Fallback search error:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  const totalResults = sales.length + brands.length;

  return (
    <>
      <section className="search-page">
        <div className="container">
          {/* Search Header */}
          <div className="search-header">
            <h1>
              {query ? (
                <>
                  Search results for "<span className="query">{query}</span>"
                </>
              ) : (
                "Search"
              )}
            </h1>
            {query && !loading && (
              <p className="results-count">
                Found {totalResults} result{totalResults !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Searching...</p>
            </div>
          ) : !query ? (
            <div className="no-query">
              <span className="no-query-icon">🔍</span>
              <h2>Enter a search term</h2>
              <p>Use the search bar to find sales and brands</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">😕</span>
              <h2>No results found</h2>
              <p>Try different keywords or browse our categories</p>
              <Link href="/sales" className="btn btn-primary">
                Browse All Sales
              </Link>
            </div>
          ) : (
            <>
              {/* Brands Section */}
              {brands.length > 0 && (
                <section className="results-section">
                  <h2>Brands ({brands.length})</h2>
                  <div className="brands-grid">
                    {brands.map((brand) => (
                      <BrandCard key={brand._id || brand.id} brand={brand} />
                    ))}
                  </div>
                </section>
              )}

              {/* Sales Section */}
              {sales.length > 0 && (
                <section className="results-section">
                  <h2>Sales ({sales.length})</h2>
                  <div className="sales-grid">
                    {sales.map((sale) => (
                      <SaleCard key={sale._id || sale.id} sale={sale} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </section>

      <style jsx>{`
        .search-page {
          min-height: 60vh;
          padding: 3rem 0 4rem;
        }

        .search-header {
          margin-bottom: 2rem;
        }

        .search-header h1 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .query {
          color: var(--primary-purple);
        }

        .results-count {
          color: var(--text-secondary);
        }

        .loading {
          text-align: center;
          padding: 4rem;
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

        .loading p {
          color: var(--text-secondary);
        }

        .no-query,
        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--bg-light);
          border-radius: var(--radius-2xl);
        }

        .no-query-icon,
        .no-results-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .no-query h2,
        .no-results h2 {
          margin-bottom: 0.5rem;
        }

        .no-query p,
        .no-results p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .results-section {
          margin-bottom: 3rem;
        }

        .results-section h2 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--border-color);
        }

        .brands-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .sales-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .sales-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .brands-grid {
            grid-template-columns: 1fr;
          }

          .sales-grid {
            grid-template-columns: 1fr;
          }

          .search-header h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
