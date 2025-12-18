'use client';

import BrandCard from '@/components/ui/BrandCard';
import { brands, categories } from '@/data/mockData';

export default function BrandsPage() {
  // Group brands by category
  const brandsByCategory = categories.map(cat => ({
    category: cat,
    brands: brands.filter(brand => brand.category.toLowerCase() === cat.name.toLowerCase())
  })).filter(group => group.brands.length > 0);

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
              {brands.map(brand => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          </section>

          {/* Brands by Category */}
          {brandsByCategory.map(group => (
            <section key={group.category.id} className="category-section">
              <div className="category-header">
                <span className="category-icon">{group.category.icon}</span>
                <h2>{group.category.name}</h2>
              </div>
              <div className="brands-grid">
                {group.brands.map(brand => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

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

        @media (max-width: 768px) {
          .brands-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
