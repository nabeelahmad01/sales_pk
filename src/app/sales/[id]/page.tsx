'use client';

import { use, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import SaleCard from '@/components/ui/SaleCard';
import { useFavorites } from '@/hooks/useFavorites';
import { sales, brands } from '@/data/mockData';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SalePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const { isFavorite, toggleFavorite, loading: favLoading } = useFavorites();
  const [showToast, setShowToast] = useState('');
  
  const sale = sales.find(s => s.id === id);
  
  if (!sale) {
    notFound();
  }

  const brand = brands.find(b => b.id === sale.brandId);
  const relatedSales = sales
    .filter(s => s.id !== sale.id && (s.brandId === sale.brandId || s.category === sale.category))
    .slice(0, 3);

  const daysLeft = Math.ceil(
    (new Date(sale.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleFavorite = async () => {
    if (!session) {
      router.push('/login?callbackUrl=' + encodeURIComponent(`/sales/${id}`));
      return;
    }
    
    const result = await toggleFavorite(id);
    if (result.success) {
      setShowToast(isFavorite(id) ? 'Removed from favorites' : 'Added to favorites!');
      setTimeout(() => setShowToast(''), 3000);
    }
  };

  const isSaved = isFavorite(id);

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="toast">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
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
                <span className="discount-badge">-{sale.discountPercentage}%</span>
                {sale.isFeatured && <span className="featured-badge">🔥 HOT DEAL</span>}
              </div>
            </div>

            {/* Details */}
            <div className="sale-details">
              {/* Brand */}
              {brand && (
                <Link href={`/brands/${brand.slug}`} className="brand-link">
                  <img src={brand.logo} alt={brand.name} className="brand-logo" />
                  <span>{brand.name}</span>
                </Link>
              )}

              <h1>{sale.title}</h1>
              
              <p className="sale-description">{sale.description}</p>

              {/* Pricing */}
              <div className="pricing">
                {sale.originalPrice && (
                  <span className="original-price">Rs. {sale.originalPrice.toLocaleString()}</span>
                )}
                {sale.salePrice && (
                  <span className="sale-price">Rs. {sale.salePrice.toLocaleString()}</span>
                )}
                <span className="savings">
                  Save Rs. {((sale.originalPrice || 0) - (sale.salePrice || 0)).toLocaleString()}
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
                  <span className={`meta-value ${daysLeft <= 3 ? 'urgent' : ''}`}>
                    {daysLeft > 0 ? `${daysLeft} days` : 'Ending today!'}
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="cta-buttons">
                <a href={sale.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Shop Now
                </a>
                <button 
                  className={`btn btn-lg favorite-btn ${isSaved ? 'saved' : 'btn-outline'}`}
                  onClick={handleFavorite}
                  disabled={favLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>

              {/* Share */}
              <div className="share-section">
                <span>Share this deal:</span>
                <div className="share-buttons">
                  <button className="share-btn whatsapp" title="Share on WhatsApp">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </button>
                  <button className="share-btn facebook" title="Share on Facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="share-btn copy" title="Copy Link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                  </button>
                </div>
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
              <Link href="/sales" className="view-all">View All Sales →</Link>
            </div>
            <div className="sales-grid">
              {relatedSales.map(s => (
                <SaleCard key={s.id} sale={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back Link */}
      <section className="back-section">
        <div className="container">
          <Link href="/sales" className="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
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
          background: linear-gradient(135deg, #EF4444, #F97316);
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
          background: linear-gradient(135deg, #F97316, #FBBF24);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.875rem;
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
          color: #EF4444;
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
          border-color: #EF4444;
          color: #EF4444;
        }

        .favorite-btn.saved {
          background: #EF4444;
          border-color: #EF4444;
          color: white;
        }

        .favorite-btn.saved:hover {
          background: #DC2626;
        }

        .toast {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: #1F2937;
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
          color: #EF4444;
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
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .share-section span {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .share-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .share-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .share-btn.whatsapp {
          background: #25D366;
          color: white;
        }

        .share-btn.facebook {
          background: #1877F2;
          color: white;
        }

        .share-btn.copy {
          background: var(--bg-light);
          color: var(--text-secondary);
        }

        .share-btn:hover {
          transform: scale(1.1);
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

          .share-section {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}
