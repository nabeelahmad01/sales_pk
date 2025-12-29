'use client';

import Link from 'next/link';
import { Sale } from '@/types';
import styles from './EndingSoonSection.module.css';

interface EndingSoonSectionProps {
  sales: Sale[];
}

export default function EndingSoonSection({ sales }: EndingSoonSectionProps) {
  return (
    <section className={styles.endingSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div>
            <h2>⏰ Ending Soon!</h2>
            <p>Grab these deals before they expire</p>
          </div>
          <Link href="/sales?sort=ending" className="btn btn-outline">
            View All
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
        <div className={styles.endingGrid}>
          {sales.slice(0, 4).map((sale) => {
            const daysLeft = Math.ceil(
              (new Date(sale.endDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            );
            return (
              <Link
                href={`/sales/${sale._id || sale.id}`}
                key={sale._id || sale.id}
                className={styles.endingCard}
              >
                <div className={styles.endingTimer}>
                  <span className={styles.timerValue}>
                    {daysLeft > 0 ? daysLeft : 0}
                  </span>
                  <span className={styles.timerLabel}>days left</span>
                </div>
                <div className={styles.endingInfo}>
                  <span className={styles.endingBrand}>{sale.brandName}</span>
                  <h4 className={styles.endingTitle}>{sale.title}</h4>
                  <span className={styles.endingDiscount}>
                    {sale.discountPercentage}% OFF
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
