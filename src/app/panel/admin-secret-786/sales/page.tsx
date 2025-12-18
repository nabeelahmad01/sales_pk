'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sales, brands } from '@/data/mockData';

export default function AdminSalesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sale.brandName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = filterBrand === 'all' || sale.brandId === filterBrand;
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && sale.isActive) ||
                          (filterStatus === 'inactive' && !sale.isActive);
    return matchesSearch && matchesBrand && matchesStatus;
  });

  return (
    <>
      <div className="admin-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Manage Sales</h1>
            <p>Add, edit, or remove sales from your platform</p>
          </div>
          <Link href="/admin/sales/new" className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add New Sale
          </Link>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search sales..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            value={filterBrand} 
            onChange={e => setFilterBrand(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Brands</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="results-count">
          Showing <strong>{filteredSales.length}</strong> of <strong>{sales.length}</strong> sales
        </div>

        {/* Sales Table */}
        <div className="table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Sale</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Discount</th>
                <th>Status</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(sale => (
                <tr key={sale.id}>
                  <td>
                    <div className="sale-info">
                      <img src={sale.image} alt={sale.title} className="sale-thumb" />
                      <div className="sale-details">
                        <span className="sale-title">{sale.title}</span>
                        {sale.isFeatured && <span className="featured-tag">🔥 Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td>{sale.brandName}</td>
                  <td>{sale.category}</td>
                  <td><span className="discount-badge">{sale.discountPercentage}%</span></td>
                  <td>
                    <span className={`status-badge ${sale.isActive ? 'active' : 'inactive'}`}>
                      {sale.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(sale.endDate).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button className="action-btn edit" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="action-btn view" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button className="action-btn delete" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <h3>No sales found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-page {
          max-width: 1400px;
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          margin-bottom: 0.25rem;
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .filters-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-lg);
          border: 2px solid var(--border-color);
          flex: 1;
          max-width: 400px;
        }

        .search-box svg {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .search-box input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.875rem;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          background: white;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .results-count {
          margin-bottom: 1rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .table-card {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
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

        .table tr:hover td {
          background: rgba(139, 92, 246, 0.02);
        }

        .sale-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sale-thumb {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .sale-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sale-title {
          font-weight: 500;
        }

        .featured-tag {
          font-size: 0.625rem;
          color: var(--accent-orange);
          font-weight: 600;
        }

        .discount-badge {
          background: linear-gradient(135deg, #EF4444, #F97316);
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
          color: #DC2626;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .action-btn.edit {
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary-purple);
        }

        .action-btn.edit:hover {
          background: var(--primary-purple);
          color: white;
        }

        .action-btn.view {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .action-btn.view:hover {
          background: #10B981;
          color: white;
        }

        .action-btn.delete {
          background: rgba(239, 68, 68, 0.1);
          color: #DC2626;
        }

        .action-btn.delete:hover {
          background: #EF4444;
          color: white;
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: var(--radius-xl);
          margin-top: 1rem;
        }

        .no-results-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        .no-results h3 {
          margin-bottom: 0.5rem;
        }

        .no-results p {
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .table-card {
            overflow-x: auto;
          }

          .table {
            min-width: 800px;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
          }

          .filters-bar {
            flex-direction: column;
          }

          .search-box {
            max-width: none;
          }

          .page-header h1 {
            font-size: 1.5rem;
          }

          .page-header .btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .filter-select {
            width: 100%;
          }

          .results-count {
            font-size: 0.75rem;
          }

          .no-results {
            padding: 2rem 1rem;
          }

          .no-results-icon {
            font-size: 2.5rem;
          }

          .no-results h3 {
            font-size: 1rem;
          }

          .no-results p {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </>
  );
}
