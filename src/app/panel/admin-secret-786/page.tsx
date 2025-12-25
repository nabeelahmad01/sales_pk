"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sale, Brand } from "@/types";

export default function AdminDashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [salesRes, brandsRes] = await Promise.all([
          fetch("/api/sales"),
          fetch("/api/brands"),
        ]);

        const [salesData, brandsData] = await Promise.all([
          salesRes.json(),
          brandsRes.json(),
        ]);

        if (salesData.success) setSales(salesData.data);
        if (brandsData.success) setBrands(brandsData.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeSales = sales.filter((s) => s.isActive).length;
  const featuredSales = sales.filter((s) => s.isFeatured).length;
  const recentSales = sales.slice(0, 5);

  if (loading) {
    return (
      <>
        <div className="dashboard">
          <div className="dashboard-header">
            <div>
              <h1>Dashboard</h1>
              <p>Loading...</p>
            </div>
          </div>
          <div className="stats-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card skeleton"></div>
            ))}
          </div>
        </div>
        <style jsx>{`
          .dashboard-header {
            margin-bottom: 2rem;
          }
          .dashboard-header h1 {
            margin-bottom: 0.25rem;
          }
          .dashboard-header p {
            color: var(--text-secondary);
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
          .stat-card.skeleton {
            height: 100px;
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: var(--radius-xl);
          }
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
          @media (max-width: 1200px) {
            .stats-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 768px) {
            .stats-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening with ShowSales.</p>
          </div>
          <Link
            href="/panel/admin-secret-786/sales"
            className="btn btn-primary"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Sale
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{sales.length}</span>
              <span className="stat-label">Total Sales</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{activeSales}</span>
              <span className="stat-label">Active Sales</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{featuredSales}</span>
              <span className="stat-label">Featured</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pink">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{brands.length}</span>
              <span className="stat-label">Brands</span>
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="recent-section">
          <div className="section-header">
            <h2>Recent Sales</h2>
            <Link href="/panel/admin-secret-786/sales" className="link">
              View All →
            </Link>
          </div>
          <div className="table-card">
            {recentSales.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Sale</th>
                    <th>Brand</th>
                    <th>Discount</th>
                    <th>Status</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale) => (
                    <tr key={sale._id || sale.id}>
                      <td>
                        <div className="sale-info">
                          <img
                            src={sale.image}
                            alt={sale.title}
                            className="sale-thumb"
                          />
                          <span>{sale.title}</span>
                        </div>
                      </td>
                      <td>{sale.brandName}</td>
                      <td>
                        <span className="discount-badge">
                          {sale.discountPercentage}%
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            sale.isActive ? "active" : "inactive"
                          }`}
                        >
                          {sale.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{new Date(sale.endDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-table">
                <p>No sales yet. Add your first sale!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link href="/panel/admin-secret-786/sales" className="action-card">
              <span className="action-icon">🏷️</span>
              <span className="action-text">Manage Sales</span>
            </Link>
            <Link href="/panel/admin-secret-786/brands" className="action-card">
              <span className="action-icon">🏢</span>
              <span className="action-text">Manage Brands</span>
            </Link>
            <Link
              href="/panel/admin-secret-786/subscribers"
              className="action-card"
            >
              <span className="action-icon">📧</span>
              <span className="action-text">View Subscribers</span>
            </Link>
            <Link href="/" className="action-card">
              <span className="action-icon">🌐</span>
              <span className="action-text">View Website</span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        a.nav-item {
          display: flex;
          gap: 13px;
          align-items: center;
          margin-bottom: 10px;
        }
        .dashboard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          margin-bottom: 0.25rem;
        }

        .dashboard-header p {
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
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon.purple {
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
        }
        .stat-icon.green {
          background: linear-gradient(135deg, #10b981, #34d399);
        }
        .stat-icon.orange {
          background: linear-gradient(135deg, #f97316, #fbbf24);
        }
        .stat-icon.pink {
          background: linear-gradient(135deg, #ec4899, #f472b6);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .recent-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }

        .link {
          color: var(--primary-purple);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .link:hover {
          text-decoration: underline;
        }

        .table-card {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .empty-table {
          padding: 3rem;
          text-align: center;
          color: var(--text-secondary);
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 1rem 1.25rem;
          text-align: left;
        }

        .table th {
          background: var(--bg-light);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }

        .table tr:not(:last-child) td {
          border-bottom: 1px solid var(--border-color);
        }

        .sale-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sale-thumb {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .discount-badge {
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .status-badge.inactive {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .quick-actions h2 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .action-card {
          background: white;
          padding: 1.5rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          text-decoration: none;
          text-align: center;
          transition: all var(--transition-fast);
        }

        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .action-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .action-text {
          font-weight: 500;
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .table-card {
            overflow-x: auto;
          }
        }
      `}</style>
    </>
  );
}
