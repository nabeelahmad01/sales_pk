'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          {/* Logo */}
          <Link href="/" className="logo">
            <span className="logo-icon">🏷️</span>
            <span className="logo-text">ShowSales</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/sales" className="nav-link">All Sales</Link>
            <Link href="/brands" className="nav-link">Brands</Link>
            <Link href="/categories" className="nav-link">Categories</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className={`search-container ${isSearchOpen ? 'open' : ''}`}>
            <input 
              type="text" 
              placeholder="Search sales..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </form>

          {/* Actions */}
          <div className="nav-actions">
            <button 
              className="icon-btn mobile-search-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            {status === 'loading' ? (
              <div className="auth-loading">...</div>
            ) : session ? (
              <>
                <Link href="/profile" className="icon-btn" title="My Profile">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link href="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}

            <button 
              className="hamburger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <Link href="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/sales" className="mobile-link" onClick={() => setIsMenuOpen(false)}>All Sales</Link>
          <Link href="/brands" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Brands</Link>
          <Link href="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link href="/contact" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <hr className="mobile-divider" />
          {session ? (
            <>
              <Link href="/profile" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <button onClick={() => { signOut({ callbackUrl: '/' }); setIsMenuOpen(false); }} className="mobile-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link href="/signup" className="mobile-link signup-link" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .header {
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding: 1rem 0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .logo-icon {
          font-size: 1.75rem;
        }

        .logo-text {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          transition: color var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--primary-purple);
        }

        .search-container {
          display: flex;
          align-items: center;
          background: var(--bg-light);
          border-radius: var(--radius-full);
          padding: 0.5rem 1rem;
          gap: 0.5rem;
        }

        .search-input {
          border: none;
          background: transparent;
          outline: none;
          width: 200px;
          font-size: 0.875rem;
        }

        .search-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          display: flex;
          align-items: center;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: var(--bg-light);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          text-decoration: none;
        }

        .icon-btn:hover {
          background: var(--primary-purple);
          color: white;
        }

        .mobile-search-btn {
          display: none;
        }

        .auth-loading {
          color: var(--text-muted);
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
        }

        .hamburger span {
          display: block;
          width: 25px;
          height: 2px;
          background: var(--text-primary);
          transition: all var(--transition-fast);
        }

        .mobile-menu {
          display: none;
          flex-direction: column;
          padding: 1rem 0;
        }

        .mobile-menu.open {
          display: flex;
        }

        .mobile-link {
          padding: 0.75rem 0;
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          font-size: 1rem;
        }

        .mobile-link:hover {
          color: var(--primary-purple);
        }

        .mobile-divider {
          border: none;
          border-top: 1px solid var(--border-color);
          margin: 0.5rem 0;
        }

        .logout-btn {
          color: #EF4444;
        }

        .signup-link {
          color: var(--primary-purple);
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .nav-links {
            display: none;
          }

          .search-container {
            display: none;
          }

          .search-container.open {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            border-radius: 0;
            box-shadow: var(--shadow-md);
          }

          .search-container.open .search-input {
            width: 100%;
          }

          .mobile-search-btn {
            display: flex;
          }

          .hamburger {
            display: flex;
          }
        }

        @media (max-width: 640px) {
          .btn-sm {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </header>
  );
}
