"use client";

import { useState } from "react";
import Link from "next/link";
import SaleCard from "@/components/ui/SaleCard";
import BrandCard from "@/components/ui/BrandCard";
import { sales, brands, categories } from "@/data/mockData";

export default function HomePage() {
  const featuredSales = sales.filter((sale) => sale.isFeatured);
  const topBrands = brands.slice(0, 4);

  // Subscribe form state
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;

    setSubscribeStatus("loading");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscribeEmail }),
      });
      const data = await res.json();

      if (data.success) {
        setSubscribeStatus("success");
        setSubscribeMessage("🎉 Subscribed! Check your inbox for sale alerts.");
        setSubscribeEmail("");
        setTimeout(() => setSubscribeStatus("idle"), 5000);
      } else {
        setSubscribeStatus("error");
        setSubscribeMessage(data.error || "Failed to subscribe");
        setTimeout(() => setSubscribeStatus("idle"), 3000);
      }
    } catch (error) {
      setSubscribeStatus("error");
      setSubscribeMessage("Something went wrong. Please try again.");
      setTimeout(() => setSubscribeStatus("idle"), 3000);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">🔥 Live Sales Happening Now!</span>
            <h1 className="hero-title">
              Never Miss a <span className="gradient-text">Sale</span> Again!
            </h1>
            <p className="hero-subtitle">
              Discover the best discounts from all your favorite Pakistani
              clothing and shoes brands. Khaadi, Gul Ahmed, Sapphire, Servis &
              more - all in one place!
            </p>
            <div className="hero-actions">
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
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">{sales.length}+</span>
                <span className="stat-label">Active Sales</span>
              </div>
              <div className="stat">
                <span className="stat-value">{brands.length}+</span>
                <span className="stat-label">Top Brands</span>
              </div>
              <div className="stat">
                <span className="stat-value">70%</span>
                <span className="stat-label">Max Discount</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .hero {
            position: relative;
            padding: 5rem 0 6rem;
            overflow: hidden;
          }

          .hero-bg {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              135deg,
              rgba(139, 92, 246, 0.08) 0%,
              rgba(236, 72, 153, 0.08) 100%
            );
            z-index: -1;
          }

          .hero-bg::before {
            content: "";
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(
              circle,
              rgba(139, 92, 246, 0.15) 0%,
              transparent 70%
            );
            top: -200px;
            right: -100px;
            animation: float 20s ease-in-out infinite;
          }

          .hero-bg::after {
            content: "";
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(
              circle,
              rgba(236, 72, 153, 0.12) 0%,
              transparent 70%
            );
            bottom: -200px;
            left: -100px;
            animation: float 25s ease-in-out infinite reverse;
          }

          @keyframes float {
            0%,
            100% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(30px, 30px);
            }
          }

          .hero-content {
            max-width: 800px;
            text-align: center;
            margin: 0 auto;
          }

          .hero-badge {
            display: inline-block;
            padding: 0.5rem 1.25rem;
            background: linear-gradient(
              135deg,
              rgba(249, 115, 22, 0.15),
              rgba(251, 191, 36, 0.15)
            );
            border: 1px solid rgba(249, 115, 22, 0.3);
            border-radius: var(--radius-full);
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--accent-orange);
            margin-bottom: 1.5rem;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }

          .hero-title {
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            color: var(--secondary-navy);
          }

          .hero-subtitle {
            font-size: 1.25rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
            line-height: 1.7;
          }

          .hero-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 3rem;
          }

          .hero-stats {
            display: flex;
            gap: 3rem;
            justify-content: center;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
          }

          .stat {
            text-align: center;
          }

          .stat-value {
            display: block;
            font-size: 2rem;
            font-weight: 800;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .stat-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
          }

          @media (max-width: 768px) {
            .hero {
              padding: 3rem 0 4rem;
            }

            .hero-title {
              font-size: 2.25rem;
            }

            .hero-subtitle {
              font-size: 1rem;
            }

            .hero-stats {
              gap: 1.5rem;
            }

            .stat-value {
              font-size: 1.5rem;
            }
          }
        `}</style>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Browse by Category</h2>
            <p>Find sales in your favorite categories</p>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link
                href={`/sales?category=${category.slug}`}
                key={category.id}
                className="category-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="category-icon">{category.icon}</span>
                <h3 className="category-name">{category.name}</h3>
                <span className="category-count">
                  {category.salesCount} sales
                </span>
              </Link>
            ))}
          </div>
        </div>

        <style jsx>{`
          .categories-section {
            padding: 4rem 0;
          }

          .section-header {
            text-align: center;
            margin-bottom: 2.5rem;
          }

          .section-header h2 {
            margin-bottom: 0.5rem;
          }

          .section-header p {
            color: var(--text-secondary);
          }

          .categories-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 1rem;
          }

          .category-card {
            background: white;
            padding: 1.5rem;
            border-radius: var(--radius-xl);
            text-align: center;
            text-decoration: none;
            box-shadow: var(--shadow-md);
            transition: all var(--transition-normal);
            animation: fadeIn 0.5s ease forwards;
            opacity: 0;
          }

          .category-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-lg);
          }

          .category-icon {
            font-size: 2.5rem;
            display: block;
            margin-bottom: 0.75rem;
          }

          .category-name {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0 0 0.25rem 0;
          }

          .category-count {
            font-size: 0.75rem;
            color: var(--text-muted);
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 1024px) {
            .categories-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          @media (max-width: 640px) {
            .categories-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </section>

      {/* Featured Sales Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
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
          <div className="sales-grid">
            {featuredSales.map((sale) => (
              <SaleCard key={sale.id} sale={sale} />
            ))}
          </div>
        </div>

        <style jsx>{`
          .featured-section {
            padding: 4rem 0;
            background: linear-gradient(
              180deg,
              rgba(139, 92, 246, 0.03) 0%,
              transparent 100%
            );
          }

          .section-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 2rem;
            margin-bottom: 2.5rem;
            flex-wrap: wrap;
          }

          .section-header h2 {
            margin-bottom: 0.5rem;
          }

          .section-header p {
            color: var(--text-secondary);
          }

          .sales-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }

          @media (max-width: 1200px) {
            .sales-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          @media (max-width: 900px) {
            .sales-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 640px) {
            .sales-grid {
              grid-template-columns: 1fr;
            }

            .section-header {
              text-align: center;
              justify-content: center;
            }
          }
        `}</style>
      </section>

      {/* Top Brands Section */}
      <section className="brands-section">
        <div className="container">
          <div className="section-header">
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
          <div className="brands-grid">
            {topBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>

        <style jsx>{`
          .brands-section {
            padding: 4rem 0;
          }

          .section-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 2rem;
            margin-bottom: 2.5rem;
            flex-wrap: wrap;
          }

          .section-header h2 {
            margin-bottom: 0.5rem;
          }

          .section-header p {
            color: var(--text-secondary);
          }

          .brands-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }

          @media (max-width: 768px) {
            .brands-grid {
              grid-template-columns: 1fr;
            }

            .section-header {
              text-align: center;
              justify-content: center;
            }
          }
        `}</style>
      </section>

      {/* Ending Soon Section */}
      <section className="ending-section">
        <div className="container">
          <div className="section-header">
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
          <div className="ending-grid">
            {sales.slice(0, 4).map((sale) => {
              const daysLeft = Math.ceil(
                (new Date(sale.endDate).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              );
              return (
                <Link
                  href={`/sales/${sale.id}`}
                  key={sale.id}
                  className="ending-card"
                >
                  <div className="ending-timer">
                    <span className="timer-value">{daysLeft}</span>
                    <span className="timer-label">days left</span>
                  </div>
                  <div className="ending-info">
                    <span className="ending-brand">{sale.brandName}</span>
                    <h4 className="ending-title">{sale.title}</h4>
                    <span className="ending-discount">
                      {sale.discountPercentage}% OFF
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <style jsx>{`
          .ending-section {
            padding: 4rem 0;
            background: linear-gradient(
              180deg,
              transparent 0%,
              rgba(239, 68, 68, 0.03) 100%
            );
          }

          .section-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 2rem;
            margin-bottom: 2.5rem;
            flex-wrap: wrap;
          }

          .section-header h2 {
            margin-bottom: 0.5rem;
          }

          .section-header p {
            color: var(--text-secondary);
          }

          .ending-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }

          .ending-card {
            background: white;
            border-radius: var(--radius-xl);
            padding: 1.5rem;
            text-decoration: none;
            box-shadow: var(--shadow-md);
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: all var(--transition-normal);
            border-left: 4px solid #ef4444;
          }

          .ending-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
          }

          .ending-timer {
            background: linear-gradient(135deg, #ef4444, #f97316);
            color: white;
            padding: 1rem;
            border-radius: var(--radius-lg);
            text-align: center;
            min-width: 70px;
          }

          .timer-value {
            display: block;
            font-size: 1.5rem;
            font-weight: 800;
          }

          .timer-label {
            font-size: 0.625rem;
            text-transform: uppercase;
            opacity: 0.9;
          }

          .ending-brand {
            font-size: 0.75rem;
            color: var(--primary-purple);
            font-weight: 600;
            text-transform: uppercase;
          }

          .ending-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0.25rem 0;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .ending-discount {
            font-size: 0.875rem;
            font-weight: 700;
            color: #ef4444;
          }

          @media (max-width: 1024px) {
            .ending-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 640px) {
            .ending-grid {
              grid-template-columns: 1fr;
            }

            .section-header {
              text-align: center;
              justify-content: center;
            }
          }
        `}</style>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Get Sale Alerts Directly!</h2>
              <p>
                Be the first to know when your favorite brands announce new
                sales. Join 10,000+ smart shoppers!
              </p>

              {subscribeStatus === "success" && (
                <div className="subscribe-success">{subscribeMessage}</div>
              )}
              {subscribeStatus === "error" && (
                <div className="subscribe-error">{subscribeMessage}</div>
              )}

              <form className="cta-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="cta-input"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={subscribeStatus === "loading"}
                >
                  {subscribeStatus === "loading"
                    ? "Subscribing..."
                    : "Subscribe Free"}
                </button>
              </form>
              <span className="cta-note">
                No spam, ever. Unsubscribe anytime.
              </span>
            </div>
            <div className="cta-decoration">
              <span className="emoji-float emoji-1">🛍️</span>
              <span className="emoji-float emoji-2">💰</span>
              <span className="emoji-float emoji-3">🏷️</span>
              <span className="emoji-float emoji-4">✨</span>
            </div>
          </div>
        </div>

        <style jsx>{`
          .cta-section {
            padding: 4rem 0 6rem;
          }

          .cta-card {
            position: relative;
            background: var(--primary-gradient);
            border-radius: var(--radius-2xl);
            padding: 4rem;
            text-align: center;
            color: white;
            overflow: hidden;
          }

          .cta-content {
            position: relative;
            z-index: 2;
            max-width: 600px;
            margin: 0 auto;
          }

          .cta-card h2 {
            color: white;
            font-size: 2.25rem;
            margin-bottom: 1rem;
          }

          .cta-card p {
            opacity: 0.9;
            margin-bottom: 2rem;
            font-size: 1.1rem;
          }

          .cta-form {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-bottom: 1rem;
          }

          .cta-input {
            padding: 1rem 1.5rem;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: var(--radius-full);
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
            width: 300px;
          }

          .cta-input::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }

          .cta-input:focus {
            outline: none;
            border-color: white;
            background: rgba(255, 255, 255, 0.2);
          }

          .cta-form .btn {
            background: white;
            color: var(--primary-purple);
          }

          .cta-form .btn:hover {
            background: var(--secondary-navy);
            color: white;
          }

          .cta-note {
            font-size: 0.875rem;
            opacity: 0.8;
          }

          .subscribe-success,
          .subscribe-error {
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            margin-bottom: 1rem;
            font-weight: 500;
          }

          .subscribe-success {
            background: rgba(16, 185, 129, 0.2);
            border: 1px solid rgba(16, 185, 129, 0.5);
          }

          .subscribe-error {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.5);
          }

          .cta-form .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .cta-decoration {
            position: absolute;
            inset: 0;
            z-index: 1;
            pointer-events: none;
          }

          .emoji-float {
            position: absolute;
            font-size: 3rem;
            animation: floatEmoji 6s ease-in-out infinite;
          }

          .emoji-1 {
            top: 10%;
            left: 10%;
            animation-delay: 0s;
          }
          .emoji-2 {
            top: 20%;
            right: 15%;
            animation-delay: 1s;
          }
          .emoji-3 {
            bottom: 15%;
            left: 15%;
            animation-delay: 2s;
          }
          .emoji-4 {
            bottom: 10%;
            right: 10%;
            animation-delay: 3s;
          }

          @keyframes floatEmoji {
            0%,
            100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(10deg);
            }
          }

          @media (max-width: 768px) {
            .cta-card {
              padding: 3rem 1.5rem;
            }

            .cta-card h2 {
              font-size: 1.75rem;
            }

            .cta-form {
              flex-direction: column;
            }

            .cta-input {
              width: 100%;
            }

            .emoji-float {
              font-size: 2rem;
              opacity: 0.5;
            }
          }
        `}</style>
      </section>
    </>
  );
}
