'use client';

import Link from 'next/link';
import { Category } from '@/types';
import styles from './CategoriesSection.module.css';

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className={styles.categoriesSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>Browse by Category</h2>
          <p>Find sales in your favorite categories</p>
        </div>
        <div className={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <Link
              href={`/sales?category=${category.slug}`}
              key={category._id || category.id}
              className={styles.categoryCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <h3 className={styles.categoryName}>{category.name}</h3>
              <span className={styles.categoryCount}>
                {category.salesCount} sales
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
