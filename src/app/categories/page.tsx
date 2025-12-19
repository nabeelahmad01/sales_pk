'use client';

import Link from 'next/link';
import SaleCard from '@/components/ui/SaleCard';
import { categories, sales } from '@/data/mockData';

export default function CategoriesPage() {
  const categoriesWithSales = categories.map(cat => ({
    ...cat,
    sales: sales.filter(sale => sale.category.toLowerCase() === cat.name.toLowerCase() && sale.isActive)
  }));

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Categories</h1>
          <p>Browse sales by category</p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            {categories.map(category => (
              <Link href={`/categories/${category.slug}`} key={category.id} className="category-card">
                <span className="category-icon">{category.icon}</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="category-count">{category.salesCount} sales</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {categoriesWithSales.map(cat => (
        cat.sales.length > 0 && (
          <section key={cat.id} className="category-section">
            <div className="container">
              <div className="section-header">
                <div className="section-title">
                  <span className="section-icon">{cat.icon}</span>
                  <h2>{cat.name}</h2>
                </div>
                <Link href={`/categories/${cat.slug}`} className="view-all">
                  View All →
                </Link>
              </div>
              <div className="sales-grid">
                {cat.sales.slice(0, 3).map(sale => (
                  <SaleCard key={sale.id} sale={sale} />
                ))}
              </div>
            </div>
          </section>
        )
      ))}

      <style jsx>{`
        .page-header {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%);
          padding: 3rem 0;
          text-align: center;
        }

        .page-header h1 {
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .categories-section {
          padding: 3rem 0;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          text-decoration: none;
          color: inherit;
          transition: all var(--transition-normal);
        }

        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }

        .category-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .category-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .category-card p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .category-count {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary-purple);
          background: rgba(139, 92, 246, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
        }

        .category-section {
          padding: 3rem 0;
          background: var(--bg-light);
        }

        .category-section:nth-child(even) {
          background: white;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-icon {
          font-size: 1.75rem;
        }

        .section-title h2 {
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

        @media (max-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sales-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: 1fr;
          }

          .sales-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .page-header {
            padding: 2rem 0;
          }

          .categories-section,
          .category-section {
            padding: 2rem 0;
          }

          .category-card {
            padding: 1.5rem;
          }

          .category-icon {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </>
  );
}
