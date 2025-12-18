'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>About ShowSales.pk</h1>
          <p>Pakistan's first dedicated sale discovery platform</p>
        </div>
      </section>

      <div className="about-page">
        <div className="container">
          {/* Story Section */}
          <section className="story-section">
            <div className="story-content">
              <span className="section-tag">Our Story</span>
              <h2>Why We Built ShowSales</h2>
              <p>
                We've all been there – finding out about an amazing sale AFTER it ended. 
                Missing out on that 50% off deal at Khaadi because we didn't check their 
                Instagram at the right time. Scrolling through multiple brand websites 
                just to compare discounts.
              </p>
              <p>
                <strong>ShowSales.pk was born from this frustration.</strong>
              </p>
              <p>
                We believe every Pakistani shopper deserves to know about every sale, 
                from every brand, in one convenient place. No more FOMO. No more 
                endless scrolling. Just pure, organized sale information when you need it.
              </p>
            </div>
            <div className="story-visual">
              <div className="visual-card">
                <span className="big-emoji">🛍️</span>
                <span className="visual-text">All Sales</span>
              </div>
              <div className="visual-card">
                <span className="big-emoji">🏷️</span>
                <span className="visual-text">One Place</span>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="stat-card">
              <span className="stat-value">50+</span>
              <span className="stat-label">Brands Tracked</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">100+</span>
              <span className="stat-label">Active Sales</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">10K+</span>
              <span className="stat-label">Happy Shoppers</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">70%</span>
              <span className="stat-label">Max Savings</span>
            </div>
          </section>

          {/* How It Works */}
          <section className="how-section">
            <div className="section-header">
              <span className="section-tag">How It Works</span>
              <h2>Simple & Free</h2>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>We Track</h3>
                <p>Our team monitors 50+ Pakistani brands for new sales and discounts 24/7.</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>We Organize</h3>
                <p>All sales are categorized by brand, category, and discount percentage for easy browsing.</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>You Save</h3>
                <p>Find the best deals, click through to shop, and save money on your favorite brands!</p>
              </div>
            </div>
          </section>

          {/* Brands We Cover */}
          <section className="brands-section">
            <div className="section-header">
              <span className="section-tag">Brands We Track</span>
              <h2>From Your Favorites</h2>
            </div>
            <div className="brands-list">
              <span className="brand-tag">Khaadi</span>
              <span className="brand-tag">Gul Ahmed</span>
              <span className="brand-tag">Sapphire</span>
              <span className="brand-tag">Junaid Jamshed</span>
              <span className="brand-tag">Alkaram</span>
              <span className="brand-tag">Servis</span>
              <span className="brand-tag">Bata</span>
              <span className="brand-tag">Bonanza</span>
              <span className="brand-tag">Outfitters</span>
              <span className="brand-tag">Limelight</span>
              <span className="brand-tag">Maria B</span>
              <span className="brand-tag">Zellbury</span>
              <span className="brand-tag">+ Many More</span>
            </div>
          </section>

          {/* CTA */}
          <section className="cta-section">
            <div className="cta-card">
              <h2>Ready to Start Saving?</h2>
              <p>Browse current sales or subscribe for instant alerts!</p>
              <div className="cta-actions">
                <Link href="/sales" className="btn btn-primary btn-lg">
                  Browse All Sales
                </Link>
                <Link href="/contact" className="btn btn-outline btn-lg">
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
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

        .about-page {
          padding: 4rem 0;
        }

        .section-tag {
          display: inline-block;
          padding: 0.375rem 1rem;
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary-purple);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .story-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 4rem;
        }

        .story-content h2 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }

        .story-content p {
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 1.25rem;
        }

        .story-visual {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }

        .visual-card {
          background: white;
          padding: 2rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          text-align: center;
        }

        .big-emoji {
          font-size: 4rem;
          display: block;
          margin-bottom: 0.75rem;
        }

        .visual-text {
          font-weight: 600;
          color: var(--text-primary);
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .stat-card {
          background: var(--primary-gradient);
          color: white;
          padding: 2rem;
          border-radius: var(--radius-xl);
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          opacity: 0.9;
        }

        .how-section {
          margin-bottom: 4rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .section-header h2 {
          margin-top: 0.5rem;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .step-card {
          background: white;
          padding: 2rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          text-align: center;
        }

        .step-number {
          width: 48px;
          height: 48px;
          background: var(--primary-gradient);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 auto 1rem;
        }

        .step-card h3 {
          margin-bottom: 0.75rem;
        }

        .step-card p {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .brands-section {
          margin-bottom: 4rem;
        }

        .brands-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
        }

        .brand-tag {
          padding: 0.625rem 1.25rem;
          background: white;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-full);
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .brand-tag:hover {
          border-color: var(--primary-purple);
          background: rgba(139, 92, 246, 0.05);
        }

        .cta-section .cta-card {
          background: var(--secondary-navy);
          color: white;
          padding: 4rem;
          border-radius: var(--radius-2xl);
          text-align: center;
        }

        .cta-card h2 {
          color: white;
          margin-bottom: 1rem;
        }

        .cta-card p {
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .cta-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 1024px) {
          .story-section {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .stats-section {
            grid-template-columns: repeat(2, 1fr);
          }

          .steps-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .stats-section {
            grid-template-columns: 1fr;
          }

          .cta-card {
            padding: 2rem;
          }
        }
      `}</style>
    </>
  );
}
