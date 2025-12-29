'use client';

import Link from 'next/link';
import BrandCard from '@/components/ui/BrandCard';
import { Brand } from '@/types';
import styles from './TopBrandsSection.module.css';

interface TopBrandsSectionProps {
  brands: Brand[];
}

export default function TopBrandsSection({ brands }: TopBrandsSectionProps) {
  return (
    <section className={styles.brandsSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div>
            <h2>Top Brands</h2>
            <p>Shop sales from Pakistan's most loved brands</p>
          </div>
          <Link href="/brands" className="btn btn-outline">
            View All Brands
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className={styles.brandsGrid}>
          {brands.map((brand) => (
            <BrandCard key={brand._id || brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
