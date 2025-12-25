"use client";

import { useState, useMemo, useEffect } from "react";
import SaleCard from "@/components/ui/SaleCard";
import { Sale, Brand, Category } from "@/types";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [salesRes, brandsRes, categoriesRes] = await Promise.all([
          fetch("/api/sales?active=true"),
          fetch("/api/brands"),
          fetch("/api/categories"),
        ]);

        const [salesData, brandsData, categoriesData] = await Promise.all([
          salesRes.json(),
          brandsRes.json(),
          categoriesRes.json(),
        ]);

        if (salesData.success) setSales(salesData.data);
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

  const filteredSales = useMemo(() => {
    let result = [...sales];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(
        (sale) => sale.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by brand
    if (selectedBrand !== "all") {
      result = result.filter((sale) => sale.brandId === selectedBrand);
    }

    // Filter by minimum discount
    if (minDiscount > 0) {
      result = result.filter((sale) => sale.discountPercentage >= minDiscount);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (sale) =>
          sale.title.toLowerCase().includes(query) ||
          sale.brandName.toLowerCase().includes(query) ||
          sale.description.toLowerCase().includes(query)
      );
    }

    // Filter out expired sales
    const now = new Date();
    result = result.filter((sale) => new Date(sale.endDate) >= now);

    // Sort
    switch (sortBy) {
      case "discount":
        result.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case "ending":
        result.sort(
          (a, b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [
    sales,
    selectedCategory,
    selectedBrand,
    minDiscount,
    sortBy,
    searchQuery,
  ]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setMinDiscount(0);
    setSortBy("newest");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    minDiscount > 0 ||
    searchQuery;

  if (loading) {
    return (
      <>
        <section className="page-header">
          <div className="container">
            <h1>All Sales</h1>
            <p>Discover amazing discounts from Pakistan's top brands</p>
          </div>
        </section>
        <div className="sales-page">
          <div className="container">
            <div className="loading-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
          .sales-page {
            padding: 2rem 0 4rem;
          }
          .loading-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
          .skeleton-card {
            height: 300px;
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
          @media (max-width: 900px) {
            .loading-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 640px) {
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
          <h1>All Sales</h1>
          <p>Discover amazing discounts from Pakistan's top brands</p>
        </div>
      </section>

      <div className="sales-page">
        <div className="container">
          <div className="sales-layout">
            {/* Sidebar Filters */}
            <button
              className="mobile-filter-btn"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
              </svg>
              {filtersOpen ? "Hide Filters" : "Show Filters"}
              {hasActiveFilters && <span className="filter-count">●</span>}
            </button>
            <aside className={`filters-sidebar ${filtersOpen ? "open" : ""}`}>
              <div className="filter-header">
                <h3>Filters</h3>
                {hasActiveFilters && (
                  <button className="clear-btn" onClick={clearFilters}>
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="filter-group">
                <label className="filter-label">Search</label>
                <input
                  type="text"
                  placeholder="Search sales..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="filter-input"
                />
              </div>

              {/* Category Filter */}
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <div className="filter-options">
                  <button
                    className={`filter-option ${
                      selectedCategory === "all" ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id || cat.id}
                      className={`filter-option ${
                        selectedCategory === cat.slug ? "active" : ""
                      }`}
                      onClick={() => setSelectedCategory(cat.slug)}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="filter-group">
                <label className="filter-label">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Brands</option>
                  {brands.map((brand) => (
                    <option
                      key={brand._id || brand.id}
                      value={brand._id || brand.id}
                    >
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount Filter */}
              <div className="filter-group">
                <label className="filter-label">Minimum Discount</label>
                <div className="discount-buttons">
                  {[0, 20, 30, 50, 70].map((discount) => (
                    <button
                      key={discount}
                      className={`discount-btn ${
                        minDiscount === discount ? "active" : ""
                      }`}
                      onClick={() => setMinDiscount(discount)}
                    >
                      {discount === 0 ? "Any" : `${discount}%+`}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="sales-content">
              {/* Results Header */}
              <div className="results-header">
                <span className="results-count">
                  Showing <strong>{filteredSales.length}</strong> sales
                </span>
                <div className="sort-controls">
                  <label>Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="newest">Newest First</option>
                    <option value="discount">Highest Discount</option>
                    <option value="ending">Ending Soon</option>
                  </select>
                </div>
              </div>

              {/* Sales Grid */}
              {filteredSales.length > 0 ? (
                <div className="sales-grid">
                  {filteredSales.map((sale) => (
                    <SaleCard key={sale._id || sale.id} sale={sale} />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <span className="no-results-icon">🔍</span>
                  <h3>No sales found</h3>
                  <p>Try adjusting your filters or search query</p>
                  <button className="btn btn-primary" onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              )}
            </main>
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

        .sales-page {
          padding: 2rem 0 4rem;
        }

        .sales-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
        }

        .filters-sidebar {
          background: white;
          padding: 1.5rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .filter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .filter-header h3 {
          margin: 0;
          font-size: 1.1rem;
        }

        .clear-btn {
          background: none;
          border: none;
          color: var(--primary-purple);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
        }

        .clear-btn:hover {
          text-decoration: underline;
        }

        .filter-group {
          margin-bottom: 1.5rem;
        }

        .filter-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }

        .filter-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          transition: all var(--transition-fast);
        }

        .filter-input:focus {
          outline: none;
          border-color: var(--primary-purple);
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-option {
          padding: 0.625rem 1rem;
          background: var(--bg-light);
          border: 2px solid transparent;
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .filter-option:hover {
          background: rgba(139, 92, 246, 0.1);
        }

        .filter-option.active {
          background: rgba(139, 92, 246, 0.15);
          border-color: var(--primary-purple);
          color: var(--primary-purple);
          font-weight: 500;
        }

        .filter-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          background: white;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--primary-purple);
        }

        .discount-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .discount-btn {
          padding: 0.5rem 1rem;
          background: var(--bg-light);
          border: 2px solid transparent;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .discount-btn:hover {
          background: rgba(139, 92, 246, 0.1);
        }

        .discount-btn.active {
          background: var(--primary-gradient);
          color: white;
        }

        .sales-content {
          min-width: 0;
        }

        .results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .results-count {
          color: var(--text-secondary);
        }

        .sort-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sort-controls label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .sort-select {
          padding: 0.5rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          background: white;
          cursor: pointer;
        }

        .sales-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
        }

        .no-results-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .no-results h3 {
          margin-bottom: 0.5rem;
        }

        .no-results p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        @media (max-width: 1200px) {
          .sales-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .mobile-filter-btn {
          display: none;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: var(--primary-gradient);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 1rem;
          width: 100%;
          justify-content: center;
        }

        .filter-count {
          color: #fbbf24;
          margin-left: 0.25rem;
        }

        @media (max-width: 1024px) {
          .mobile-filter-btn {
            display: flex;
          }

          .sales-layout {
            grid-template-columns: 1fr;
          }

          .filters-sidebar {
            display: none;
            position: static;
          }

          .filters-sidebar.open {
            display: block;
          }
        }

        @media (max-width: 640px) {
          .sales-grid {
            grid-template-columns: 1fr;
          }

          .results-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}
