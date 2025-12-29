'use client';

import Link from 'next/link';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  salesCount: number;
  brandsCount: number;
}

export default function HeroSection({ salesCount, brandsCount }: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg}></div>
      <div className="container">
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>🔥 Live Sales Happening Now!</span>
          <h1 className={styles.heroTitle}>
            Never Miss a <span className="gradient-text">Sale</span> Again!
          </h1>
          <p className={styles.heroSubtitle}>
            Discover the best discounts from all your favorite Pakistani
            clothing and shoes brands. Khaadi, Gul Ahmed, Sapphire, Servis &
            more - all in one place!
          </p>
          <div className={styles.heroActions}>
            <Link href="/sales" className="btn btn-primary btn-lg">
              Browse All Sales
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/brands" className="btn btn-outline btn-lg">
              View Brands
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{salesCount}+</span>
              <span className={styles.statLabel}>Active Sales</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{brandsCount}+</span>
              <span className={styles.statLabel}>Top Brands</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>70%</span>
              <span className={styles.statLabel}>Max Discount</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
