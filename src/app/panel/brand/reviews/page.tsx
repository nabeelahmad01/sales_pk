"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: string;
}

export default function BrandReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const brandId = (session?.user as any)?.brandId;

  useEffect(() => {
    if (brandId) {
      fetchReviews();
    }
  }, [brandId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?brandId=${brandId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviewsData: Review[]) => {
    const total = reviewsData.length;
    const average =
      total > 0 ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / total : 0;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach((r) => {
      distribution[r.rating as keyof typeof distribution]++;
    });

    setStats({ total, average, distribution });
  };

  const filteredReviews = reviews.filter((review) => {
    if (filterRating === "all") return true;
    return review.rating === parseInt(filterRating);
  });

  const renderStars = (rating: number) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "filled" : ""}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading reviews...</div>;
  }

  return (
    <>
      <div className="reviews-page">
        <div className="page-header">
          <div>
            <h1>Reviews</h1>
            <p>See what customers are saying about your brand</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-card">
          <div className="overall-rating">
            <span className="rating-number">{stats.average.toFixed(1)}</span>
            {renderStars(Math.round(stats.average))}
            <span className="total-reviews">{stats.total} reviews</span>
          </div>
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="rating-bar">
                <span className="rating-label">{rating} ★</span>
                <div className="bar-bg">
                  <div
                    className="bar-fill"
                    style={{
                      width:
                        stats.total > 0
                          ? `${
                              (stats.distribution[
                                rating as keyof typeof stats.distribution
                              ] /
                                stats.total) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>
                <span className="rating-count">
                  {
                    stats.distribution[
                      rating as keyof typeof stats.distribution
                    ]
                  }
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="filter-bar">
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Reviews List */}
        {filteredReviews.length > 0 ? (
          <div className="reviews-list">
            {filteredReviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="avatar">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="reviewer-name">{review.userName}</span>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <h3 className="review-title">{review.title}</h3>
                <p className="review-content">{review.content}</p>
                <div className="review-footer">
                  <span className="helpful">
                    👍 {review.helpful} found this helpful
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <span className="icon">⭐</span>
            <h3>No reviews yet</h3>
            <p>Reviews from customers will appear here</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .reviews-page {
          max-width: 900px;
        }

        .loading {
          text-align: center;
          padding: 4rem;
          color: var(--text-secondary);
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          margin-bottom: 0.25rem;
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .stats-card {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          padding: 2rem;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .overall-rating {
          text-align: center;
          padding-right: 3rem;
          border-right: 1px solid var(--border-color);
        }

        .rating-number {
          font-size: 4rem;
          font-weight: 700;
          display: block;
          line-height: 1;
        }

        .stars {
          font-size: 1.5rem;
          color: #d1d5db;
          margin: 0.5rem 0;
        }

        .stars .filled {
          color: #f59e0b;
        }

        .total-reviews {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .rating-distribution {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          justify-content: center;
        }

        .rating-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .rating-label {
          width: 40px;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .bar-bg {
          flex: 1;
          height: 8px;
          background: var(--bg-light);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: var(--primary-gradient);
          border-radius: var(--radius-full);
          transition: width 0.3s ease;
        }

        .rating-count {
          width: 30px;
          text-align: right;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .filter-bar {
          margin-bottom: 1.5rem;
        }

        .filter-bar select {
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          background: white;
          font-size: 0.875rem;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .review-card {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
          padding: 1.5rem;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: var(--primary-gradient);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
        }

        .reviewer-name {
          display: block;
          font-weight: 500;
        }

        .review-date {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .review-card .stars {
          font-size: 1rem;
          margin: 0;
        }

        .review-title {
          font-size: 1rem;
          margin: 0 0 0.5rem;
        }

        .review-content {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0;
        }

        .review-footer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .helpful {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .no-reviews {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
        }

        .no-reviews .icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .no-reviews h3 {
          margin-bottom: 0.5rem;
        }

        .no-reviews p {
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .stats-card {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .overall-rating {
            padding-right: 0;
            border-right: none;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--border-color);
          }
        }
      `}</style>
    </>
  );
}
