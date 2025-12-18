'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          {/* Logo */}
          <Link href="/" className="logo">
            <span className="logo-icon">🏷️</span>
            <span className="logo-text">
              Show<span className="logo-highlight">Sales</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/sales" className="nav-link">All Sales</Link>
            <Link href="/brands" className="nav-link">Brands</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>

          {/* Search Bar */}
          <div className={`search-container ${isSearchOpen ? 'open' : ''}`}>
            <input
              type="text"
              placeholder="Search sales..."
              className="search-input"
            />
            <button className="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>

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
            <Link href="/favorites" className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </Link>
            <Link href="/admin" className="btn btn-primary btn-sm">
              Admin
            </Link>
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
          <Link href="/admin" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
        </div>
      </div>

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border-color);
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          gap: 2rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .logo-icon {
          font-size: 1.75rem;
        }

        .logo-text {
          color: var(--secondary-navy);
        }

        .logo-highlight {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-link {
          padding: 0.5rem 1rem;
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--primary-purple);
          background: rgba(139, 92, 246, 0.1);
        }

        .search-container {
          flex: 1;
          max-width: 400px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 0.625rem 1rem;
          padding-right: 2.5rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          transition: all var(--transition-fast);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-purple);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .search-btn {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: var(--bg-light);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          text-decoration: none;
        }

        .icon-btn:hover {
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary-purple);
        }

        .mobile-search-btn {
          display: none;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .hamburger span {
          width: 24px;
          height: 2px;
          background: var(--text-primary);
          transition: all var(--transition-fast);
        }

        .mobile-menu {
          display: none;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem 0;
          border-top: 1px solid var(--border-color);
        }

        .mobile-menu.open {
          display: flex;
        }

        .mobile-link {
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 500;
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
        }

        .mobile-link:hover {
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary-purple);
        }

        @media (max-width: 1024px) {
          .nav-links {
            display: none;
          }

          .search-container {
            display: none;
          }

          .search-container.open {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            padding: 1rem;
            background: white;
            border-bottom: 1px solid var(--border-color);
            max-width: none;
          }

          .mobile-search-btn {
            display: flex;
          }

          .hamburger {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
