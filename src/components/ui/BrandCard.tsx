import Link from 'next/link';
import { Brand } from '@/types';

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link href={`/brands/${brand.slug}`} className="brand-card-link">
      <article className="brand-card">
        <div className="brand-logo">
          <img src={brand.logo} alt={brand.name} />
        </div>
        <div className="brand-info">
          <h3 className="brand-name">{brand.name}</h3>
          <span className="brand-category">{brand.category}</span>
          <div className="brand-stats">
            <span className="sales-count">
              <span className="count">{brand.salesCount}</span> Active Sales
            </span>
          </div>
        </div>
        <div className="brand-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </article>

      <style jsx>{`
        .brand-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .brand-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: white;
          padding: 1.25rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          transition: all var(--transition-normal);
        }

        .brand-card:hover {
          transform: translateX(8px);
          box-shadow: var(--shadow-lg);
        }

        .brand-logo {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          flex-shrink: 0;
          background: var(--bg-light);
        }

        .brand-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .brand-info {
          flex: 1;
        }

        .brand-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.25rem 0;
        }

        .brand-category {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .brand-stats {
          margin-top: 0.5rem;
        }

        .sales-count {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .sales-count .count {
          font-weight: 700;
          color: var(--primary-purple);
        }

        .brand-arrow {
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .brand-card:hover .brand-arrow {
          color: var(--primary-purple);
          transform: translateX(4px);
        }

        @media (max-width: 480px) {
          .brand-card {
            padding: 1rem;
            gap: 0.75rem;
          }

          .brand-logo {
            width: 52px;
            height: 52px;
          }

          .brand-name {
            font-size: 1rem;
          }

          .brand-category {
            font-size: 0.6875rem;
          }

          .sales-count {
            font-size: 0.8125rem;
          }

          .brand-arrow {
            display: none;
          }
        }
      `}</style>
    </Link>
  );
}
