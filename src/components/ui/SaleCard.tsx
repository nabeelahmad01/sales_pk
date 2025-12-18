import Link from 'next/link';
import { Sale } from '@/types';

interface SaleCardProps {
  sale: Sale;
}

export default function SaleCard({ sale }: SaleCardProps) {
  const daysLeft = Math.ceil(
    (new Date(sale.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/sales/${sale.id}`} className="sale-card-link">
      <article className="sale-card">
        <div className="sale-card-image">
          <img src={sale.image} alt={sale.title} />
          <span className="sale-card-discount">-{sale.discountPercentage}%</span>
          {sale.isFeatured && <span className="featured-badge">🔥 HOT</span>}
        </div>
        <div className="sale-card-content">
          <span className="sale-card-brand">{sale.brandName}</span>
          <h3 className="sale-card-title">{sale.title}</h3>
          <p className="sale-card-desc">{sale.description}</p>
          
          <div className="sale-card-prices">
            {sale.originalPrice && (
              <span className="original-price">Rs. {sale.originalPrice.toLocaleString()}</span>
            )}
            {sale.salePrice && (
              <span className="sale-price">Rs. {sale.salePrice.toLocaleString()}</span>
            )}
          </div>

          <div className="sale-card-meta">
            <span className="category-tag">{sale.category}</span>
            <span className={`days-left ${daysLeft <= 3 ? 'urgent' : ''}`}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Ending soon!'}
            </span>
          </div>
        </div>
      </article>

      <style jsx>{`
        .sale-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .sale-card {
          position: relative;
          background: white;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: all var(--transition-normal);
          height: 100%;
        }

        .sale-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }

        .sale-card-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .sale-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .sale-card:hover .sale-card-image img {
          transform: scale(1.1);
        }

        .sale-card-discount {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #EF4444, #F97316);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.875rem;
          box-shadow: var(--shadow-md);
        }

        .featured-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(135deg, #F97316, #FBBF24);
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.75rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }

        .sale-card-content {
          padding: 1.25rem;
        }

        .sale-card-brand {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--primary-purple);
          font-weight: 600;
          display: block;
          margin-bottom: 0.5rem;
        }

        .sale-card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sale-card-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0 0 1rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sale-card-prices {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .original-price {
          font-size: 0.875rem;
          color: var(--text-muted);
          text-decoration: line-through;
        }

        .sale-price {
          font-size: 1.25rem;
          font-weight: 700;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sale-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .category-tag {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          background: var(--bg-light);
          color: var(--text-secondary);
          border-radius: var(--radius-full);
        }

        .days-left {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .days-left.urgent {
          color: #EF4444;
        }

        @media (max-width: 480px) {
          .sale-card-image {
            height: 160px;
          }

          .sale-card-content {
            padding: 1rem;
          }

          .sale-card-title {
            font-size: 1rem;
          }

          .sale-card-desc {
            font-size: 0.8125rem;
            margin-bottom: 0.75rem;
          }

          .sale-card-prices {
            margin-bottom: 0.75rem;
          }

          .sale-price {
            font-size: 1.125rem;
          }

          .sale-card-discount {
            padding: 0.375rem 0.75rem;
            font-size: 0.75rem;
          }

          .featured-badge {
            padding: 0.25rem 0.5rem;
            font-size: 0.625rem;
          }

          .sale-card-meta {
            padding-top: 0.75rem;
          }
        }
      `}</style>
    </Link>
  );
}
