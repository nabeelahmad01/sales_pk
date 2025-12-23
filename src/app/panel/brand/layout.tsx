"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated or not a brand
    if (status === "unauthenticated") {
      router.push("/panel/brand/login");
    } else if (
      status === "authenticated" &&
      (session?.user as any)?.role !== "brand"
    ) {
      router.push("/panel/brand/login");
    }
  }, [status, session, router]);

  // Don't render layout for login page
  if (pathname === "/panel/brand/login") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading dashboard...</p>
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
          }
          .loader {
            width: 50px;
            height: 50px;
            border: 4px solid var(--border-color);
            border-top-color: var(--primary-purple);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (
    status === "unauthenticated" ||
    (session?.user as any)?.role !== "brand"
  ) {
    return null;
  }

  const brandName = session?.user?.name || "Brand";

  return (
    <div className="brand-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <span className="mobile-brand">{brandName}</span>
        <span className="mobile-badge">Brand</span>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-info">
            <span className="brand-icon">🏪</span>
            <div>
              <span className="brand-name">{brandName}</span>
              <span className="brand-label">Brand Dashboard</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link
            href="/panel/brand"
            className={`nav-item ${
              pathname === "/panel/brand" ? "active" : ""
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/panel/brand/sales"
            className={`nav-item ${
              pathname === "/panel/brand/sales" ? "active" : ""
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            My Sales
          </Link>
          <Link
            href="/panel/brand/orders"
            className={`nav-item ${
              pathname === "/panel/brand/orders" ? "active" : ""
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Orders
          </Link>
          <Link
            href="/panel/brand/reviews"
            className={`nav-item ${
              pathname === "/panel/brand/reviews" ? "active" : ""
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Reviews
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link
            href="/"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            View Site
          </Link>
          <button
            className="nav-item logout-btn"
            onClick={() => signOut({ callbackUrl: "/panel/brand/login" })}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="brand-main">{children}</main>

      <style jsx>{`
        .brand-layout {
          display: flex;
          min-height: 100vh;
        }

        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: var(--secondary-navy);
          padding: 0 1rem;
          align-items: center;
          gap: 1rem;
          z-index: 99;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
        }

        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: white;
        }

        .mobile-brand {
          flex: 1;
          color: white;
          font-weight: 600;
        }

        .mobile-badge {
          background: var(--primary-gradient);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          color: white;
        }

        .overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99;
        }

        .close-btn {
          display: none;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          padding: 0.5rem;
          margin-left: auto;
        }

        .sidebar {
          width: 260px;
          background: var(--secondary-navy);
          color: white;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 100;
          transition: transform 0.3s ease;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 1.5rem;
        }

        .brand-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-icon {
          font-size: 2rem;
        }

        .brand-name {
          display: block;
          font-weight: 700;
          font-size: 1rem;
        }

        .brand-label {
          display: block;
          font-size: 0.625rem;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 0.5px;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
          font-weight: 500;
          border: none;
          background: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          font-size: 0.875rem;
        }

        .nav-item:hover,
        .nav-item.active {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-item.active {
          background: var(--primary-gradient);
        }

        .sidebar-footer {
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        .brand-main {
          flex: 1;
          margin-left: 260px;
          background: var(--bg-light);
          min-height: 100vh;
          padding: 2rem;
        }

        @media (max-width: 1024px) {
          .mobile-header {
            display: flex;
          }

          .overlay {
            display: block;
          }

          .close-btn {
            display: block;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .brand-main {
            margin-left: 0;
            padding-top: 80px;
          }
        }

        @media (max-width: 640px) {
          .brand-main {
            padding: 1rem;
            padding-top: 76px;
          }
        }
      `}</style>
    </div>
  );
}
