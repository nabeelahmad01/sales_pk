"use client";

import { useState, useEffect } from "react";
import {
  HeroSection,
  CategoriesSection,
  FeaturedSalesSection,
  TopBrandsSection,
  EndingSoonSection,
  NewsletterSection,
} from "@/components/home";
import { Sale, Brand, Category } from "@/types";

// Loading skeleton component
function HomePageSkeleton() {
  return (
    <section className="hero-skeleton">
      <div className="container">
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div className="skeleton" style={{ height: '40px', width: '250px', margin: '0 auto 1.5rem', borderRadius: '20px' }}></div>
          <div className="skeleton" style={{ height: '60px', width: '100%', maxWidth: '600px', margin: '0 auto 1rem', borderRadius: '8px' }}></div>
          <div className="skeleton" style={{ height: '24px', width: '80%', maxWidth: '500px', margin: '0 auto', borderRadius: '8px' }}></div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [salesRes, brandsRes, categoriesRes] = await Promise.all([
          fetch("/api/sales?active=true"),
          fetch("/api/brands"),
          fetch("/api/categories"),
        ]);

        const [salesData, brandsData, categoriesData] = await Promise.all([
          salesRes.json(),
          brandsRes.json(),
          categoriesRes.json(),
        ]);

        if (salesData.success) setSales(salesData.data);
        if (brandsData.success) setBrands(brandsData.data);
        if (categoriesData.success) setCategories(categoriesData.data);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const featuredSales = sales.filter((sale) => sale.isFeatured);
  const topBrands = brands.slice(0, 4);

  if (loading) {
    return <HomePageSkeleton />;
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Error Loading Content</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <HeroSection salesCount={sales.length} brandsCount={brands.length} />
      <CategoriesSection categories={categories} />
      <FeaturedSalesSection sales={featuredSales} />
      <TopBrandsSection brands={topBrands} />
      <EndingSoonSection sales={sales} />
      <NewsletterSection />
    </>
  );
}
