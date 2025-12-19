'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SaleCard from '@/components/ui/SaleCard';
import { categories, sales } from '@/data/mockData';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = use(params);
  const category = categories.find(c => c.slug === slug);
  
  if (!category) {
    notFound();
  }

  const categorySales = sales.filter(
    sale => sale.category.toLowerCase() === category.name.toLowerCase() && sale.isActive
  );

  return (
    <>
      {/* Category Header */}
      <section className="category-hero">
        <div className="container">
          <Link href="/categories" className="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            All Categories
          </Link>
          <div className="category-header">
            <span className="category-icon">{category.icon}</span>
            <div className="category-info">
              <h1>{category.name}</h1>
              <p>{category.description}</p>
              <span className="sales-count">{categorySales.length} active sales</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sales Grid */}
      <section className="sales-section">
        <div className="container">
          {categorySales.length > 0 ? (
            <div className="sales-grid">
              {categorySales.map(sale => (
                <SaleCard key={sale.id} sale={sale} />
              ))}
            </div>
          ) : (
            <div className="no-sales">
              <span className="no-sales-icon">🏷️</span>
              <h3>No Active Sales</h3>
              <p>There are no active sales in {category.name} right now.</p>
              <Link href="/sales" className="btn btn-primary">
                Browse All Sales
              </Link>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .category-hero {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%);
          padding: 2rem 0 3rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          transition: color var(--transition-fast);
        }

        .back-link:hover {
          color: var(--primary-purple);
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .category-icon {
          font-size: 4rem;
          background: white;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-lg);
        }

        .category-info h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .category-info p {
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }

        .sales-count {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--primary-purple);
          background: rgba(139, 92, 246, 0.1);
          padding: 0.375rem 1rem;
          border-radius: var(--radius-full);
        }

        .sales-section {
          padding: 3rem 0 4rem;
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
        }

        .no-sales p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        @media (max-width: 1024px) {
          .sales-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .category-header {
            flex-direction: column;
            text-align: center;
          }

          .category-icon {
            width: 80px;
            height: 80px;
            font-size: 3rem;
          }

          .category-info h1 {
            font-size: 1.5rem;
          }

          .sales-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
