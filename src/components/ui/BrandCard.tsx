import Link from 'next/link';
import { Brand } from '@/types';
import styles from './BrandCard.module.css';

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link href={`/brands/${brand.slug}`} className={styles.brandCardLink}>
      <article className={styles.brandCard}>
        <div className={styles.brandLogo}>
          <img src={brand.logo} alt={brand.name} />
        </div>
        <div className={styles.brandInfo}>
          <div className={styles.brandNameRow}>
            <h3 className={styles.brandName}>{brand.name}</h3>
            {brand.isVerified && (
              <span className={styles.verifiedBadge} title="Verified Brand">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              </span>
            )}
          </div>
          <span className={styles.brandCategory}>{brand.category}</span>
          <div className={styles.brandStats}>
            <span className={styles.salesCount}>
              <span className={styles.count}>{brand.salesCount}</span> Active Sales
            </span>
          </div>
        </div>
        <div className={styles.brandArrow}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </article>
    </Link>
  );
}
