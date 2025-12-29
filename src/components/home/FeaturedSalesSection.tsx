'use client';

import Link from 'next/link';
import SaleCard from '@/components/ui/SaleCard';
import { Sale } from '@/types';
import styles from './FeaturedSalesSection.module.css';

interface FeaturedSalesSectionProps {
  sales: Sale[];
}

export default function FeaturedSalesSection({ sales }: FeaturedSalesSectionProps) {
  return (
    <section className={styles.featuredSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div>
            <h2>🔥 Hot Sales Right Now</h2>
            <p>Don't miss these amazing deals - they're ending soon!</p>
          </div>
          <Link href="/sales" className="btn btn-outline">
            View All Sales
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
        <div className={styles.salesGrid}>
          {sales.length > 0 ? (
            sales.map((sale) => (
              <SaleCard key={sale._id || sale.id} sale={sale} />
            ))
          ) : (
            <p className={styles.noSales}>No featured sales at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
}
