"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Stats {
  totalSales: number;
  activeSales: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  avgRating: number;
  totalReviews: number;
}

interface RecentOrder {
  _id: string;
  orderId: string;
  customerName: string;
  productName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface RecentReview {
  _id: string;
  userName: string;
  rating: number;
  title: string;
  createdAt: string;
}

export default function BrandDashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalSales: 0,
    activeSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    avgRating: 0,
    totalReviews: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);

  const brandId = (session?.user as any)?.brandId;

  useEffect(() => {
    if (brandId) {
      fetchDashboardData();
    }
  }, [brandId]);

  const fetchDashboardData = async () => {
    try {
      // Fetch sales stats
      const salesRes = await fetch(`/api/sales?brandId=${brandId}`);
      const salesData = await salesRes.json();

      // Fetch orders
      const ordersRes = await fetch(`/api/orders?brandId=${brandId}`);
      const ordersData = await ordersRes.json();

      // Fetch reviews
      const reviewsRes = await fetch(`/api/reviews?brandId=${brandId}&limit=5`);
      const reviewsData = await reviewsRes.json();

      const sales = salesData.success ? salesData.data : [];
      const orders = ordersData.success ? ordersData.data : [];
      const reviews = reviewsData.success ? reviewsData.data : [];

      // Calculate stats
      const activeSales = sales.filter((s: any) => s.isActive).length;
      const pendingOrders = orders.filter(
        (o: any) => o.status === "pending"
      ).length;
      const totalRevenue = orders
        .filter((o: any) => o.paymentStatus === "paid")
        .reduce((sum: number, o: any) => sum + o.totalAmount, 0);
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
            reviews.length
          : 0;

      setStats({
        totalSales: sales.length,
        activeSales,
        totalOrders: orders.length,
        pendingOrders,
        totalRevenue,
        avgRating,
        totalReviews: reviews.length,
      });

      setRecentOrders(orders.slice(0, 5));
      setRecentReviews(reviews.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "#F59E0B",
      confirmed: "#3B82F6",
      processing: "#8B5CF6",
      shipped: "#06B6D4",
      delivered: "#10B981",
      cancelled: "#EF4444",
    };
    return colors[status] || "#6B7280";
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <>
      <div className="dashboard">
        <div className="page-header">
          <h1>Welcome back, {session?.user?.name}! 👋</h1>
          <p>Here's an overview of your brand's performance</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon sales">🏷️</div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalSales}</span>
              <span className="stat-label">Total Sales</span>
            </div>
            <span className="stat-badge">{stats.activeSales} active</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders">📦</div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            {stats.pendingOrders > 0 && (
              <span className="stat-badge pending">
                {stats.pendingOrders} pending
              </span>
            )}
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">💰</div>
            <div className="stat-info">
              <span className="stat-value">
                {formatCurrency(stats.totalRevenue)}
              </span>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon rating">⭐</div>
            <div className="stat-info">
              <span className="stat-value">{stats.avgRating.toFixed(1)}</span>
              <span className="stat-label">Average Rating</span>
            </div>
            <span className="stat-badge">{stats.totalReviews} reviews</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link href="/panel/brand/sales" className="action-card">
              <span className="action-icon">➕</span>
              <span>Add New Sale</span>
            </Link>
            <Link href="/panel/brand/orders" className="action-card">
              <span className="action-icon">📋</span>
              <span>View Orders</span>
            </Link>
            <Link href="/panel/brand/reviews" className="action-card">
              <span className="action-icon">⭐</span>
              <span>View Reviews</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-grid">
          {/* Recent Orders */}
          <div className="activity-card">
            <div className="activity-header">
              <h3>Recent Orders</h3>
              <Link href="/panel/brand/orders">View All →</Link>
            </div>
            {recentOrders.length > 0 ? (
              <div className="activity-list">
                {recentOrders.map((order) => (
                  <div key={order._id} className="activity-item">
                    <div className="activity-info">
                      <span className="activity-title">{order.orderId}</span>
                      <span className="activity-subtitle">
                        {order.customerName} - {order.productName}
                      </span>
                    </div>
                    <div className="activity-meta">
                      <span className="activity-amount">
                        {formatCurrency(order.totalAmount)}
                      </span>
                      <span
                        className="status-badge"
                        style={{ background: getStatusBadge(order.status) }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No orders yet</div>
            )}
          </div>

          {/* Recent Reviews */}
          <div className="activity-card">
            <div className="activity-header">
              <h3>Recent Reviews</h3>
              <Link href="/panel/brand/reviews">View All →</Link>
            </div>
            {recentReviews.length > 0 ? (
              <div className="activity-list">
                {recentReviews.map((review) => (
                  <div key={review._id} className="activity-item">
                    <div className="activity-info">
                      <span className="activity-title">{review.title}</span>
                      <span className="activity-subtitle">
                        by {review.userName}
                      </span>
                    </div>
                    <div className="rating-stars">
                      {"⭐".repeat(review.rating)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No reviews yet</div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1200px;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-icon.sales {
          background: rgba(139, 92, 246, 0.1);
        }
        .stat-icon.orders {
          background: rgba(59, 130, 246, 0.1);
        }
        .stat-icon.revenue {
          background: rgba(16, 185, 129, 0.1);
        }
        .stat-icon.rating {
          background: rgba(245, 158, 11, 0.1);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .stat-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.625rem;
          padding: 0.25rem 0.5rem;
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary-purple);
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .stat-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        .quick-actions {
          margin-bottom: 2rem;
        }

        .quick-actions h2 {
          margin-bottom: 1rem;
          font-size: 1.125rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .action-card {
          background: white;
          padding: 1.5rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
          color: var(--text-primary);
          transition: all var(--transition-fast);
          border: 2px solid transparent;
        }

        .action-card:hover {
          border-color: var(--primary-purple);
          transform: translateY(-2px);
        }

        .action-icon {
          font-size: 1.5rem;
        }

        .activity-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .activity-card {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .activity-header h3 {
          margin: 0;
          font-size: 1rem;
        }

        .activity-header a {
          color: var(--primary-purple);
          text-decoration: none;
          font-size: 0.875rem;
        }

        .activity-list {
          padding: 0.5rem;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-radius: var(--radius-lg);
          transition: background var(--transition-fast);
        }

        .activity-item:hover {
          background: var(--bg-light);
        }

        .activity-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .activity-title {
          font-weight: 500;
        }

        .activity-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .activity-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .activity-amount {
          font-weight: 600;
          color: #10b981;
        }

        .status-badge {
          font-size: 0.625rem;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-full);
          color: white;
          text-transform: capitalize;
        }

        .rating-stars {
          font-size: 0.875rem;
        }

        .no-data {
          text-align: center;
          padding: 2rem;
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .activity-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
