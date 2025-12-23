"use client";

import { useState, useEffect } from "react";

interface Subscriber {
  _id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Promotional email state
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoSubject, setPromoSubject] = useState("");
  const [promoContent, setPromoContent] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<any>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/subscribers");
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.data);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchSubscribers();
      } else {
        alert(data.error || "Failed to delete subscriber");
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      alert("Failed to delete subscriber");
    }
  };

  const handleToggleStatus = async (subscriber: Subscriber) => {
    try {
      const res = await fetch(`/api/subscribers/${subscriber._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !subscriber.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        fetchSubscribers();
      } else {
        alert(data.error || "Failed to update subscriber");
      }
    } catch (error) {
      console.error("Error updating subscriber:", error);
      alert("Failed to update subscriber");
    }
  };

  // Send promotional email
  const handleSendPromo = async (isTest: boolean = false) => {
    if (!promoSubject || !promoContent) {
      alert("Please enter subject and content");
      return;
    }

    if (
      !isTest &&
      !confirm(
        `Send promotional email to ${
          subscribers.filter((s) => s.isActive).length
        } active subscribers?`
      )
    ) {
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      const res = await fetch("/api/notifications/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: promoSubject,
          content: promoContent,
          testEmail: isTest ? testEmail : undefined,
        }),
      });

      const data = await res.json();
      setSendResult(data);

      if (data.success && !isTest) {
        setPromoSubject("");
        setPromoContent("");
      }
    } catch (error) {
      console.error("Error sending promo:", error);
      setSendResult({ success: false, error: "Failed to send emails" });
    } finally {
      setSending(false);
    }
  };

  // Filter subscribers
  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch = subscriber.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && subscriber.isActive) ||
      (filterStatus === "inactive" && !subscriber.isActive);
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading subscribers...</div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Subscribers</h1>
            <p>Manage your newsletter subscribers</p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowPromoModal(true)}
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
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              Send Promotional Email
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="header-stats">
          <div className="stat">
            <span className="stat-value">{subscribers.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {subscribers.filter((s) => s.isActive).length}
            </span>
            <span className="stat-label">Active</span>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="results-count">
          Showing <strong>{filteredSubscribers.length}</strong> of{" "}
          <strong>{subscribers.length}</strong> subscribers
        </div>

        {/* Subscribers Table */}
        <div className="table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Subscribed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber._id}>
                  <td>
                    <div className="email-cell">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span>{subscriber.email}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        subscriber.isActive ? "active" : "inactive"
                      }`}
                    >
                      {subscriber.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{formatDate(subscriber.subscribedAt)}</td>
                  <td>
                    <div className="actions">
                      <button
                        className={`action-btn ${
                          subscriber.isActive ? "deactivate" : "activate"
                        }`}
                        title={subscriber.isActive ? "Deactivate" : "Activate"}
                        onClick={() => handleToggleStatus(subscriber)}
                      >
                        {subscriber.isActive ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                      <button
                        className="action-btn delete"
                        title="Delete"
                        onClick={() => handleDelete(subscriber._id)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubscribers.length === 0 && (
          <div className="no-results">
            <span className="no-results-icon">📧</span>
            <h3>No subscribers found</h3>
            <p>
              {subscribers.length === 0
                ? "No one has subscribed to your newsletter yet."
                : "Try adjusting your search or filters."}
            </p>
          </div>
        )}
      </div>

      {/* Promotional Email Modal */}
      {showPromoModal && (
        <div className="modal-overlay" onClick={() => setShowPromoModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📧 Send Promotional Email</h2>
              <button
                className="modal-close"
                onClick={() => setShowPromoModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="promo-info">
                <p>
                  This will send an email to{" "}
                  <strong>
                    {subscribers.filter((s) => s.isActive).length}
                  </strong>{" "}
                  active subscribers.
                </p>
              </div>

              {sendResult && (
                <div
                  className={`result-message ${
                    sendResult.success ? "success" : "error"
                  }`}
                >
                  {sendResult.success ? (
                    <>
                      <strong>✓ Sent successfully!</strong>
                      <span>
                        Sent: {sendResult.results?.sent} | Failed:{" "}
                        {sendResult.results?.failed}
                      </span>
                    </>
                  ) : (
                    <strong>✗ {sendResult.error}</strong>
                  )}
                </div>
              )}

              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  value={promoSubject}
                  onChange={(e) => setPromoSubject(e.target.value)}
                  placeholder="e.g., 🔥 New Sales Alert - Up to 70% Off!"
                />
              </div>

              <div className="form-group">
                <label>Email Content (HTML supported) *</label>
                <textarea
                  value={promoContent}
                  onChange={(e) => setPromoContent(e.target.value)}
                  placeholder="<h2>Big Sale Alert!</h2><p>Check out the latest deals...</p>"
                  rows={8}
                />
              </div>

              <div className="form-group">
                <label>Test Email (optional)</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="your@email.com (for testing)"
                />
              </div>

              <div className="modal-actions">
                {testEmail && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleSendPromo(true)}
                    disabled={sending}
                  >
                    {sending ? "Sending..." : "Send Test"}
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSendPromo(false)}
                  disabled={sending}
                >
                  {sending
                    ? "Sending..."
                    : `Send to All (${
                        subscribers.filter((s) => s.isActive).length
                      })`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-page {
          max-width: 1200px;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .loading {
          text-align: center;
          padding: 4rem;
          color: var(--text-secondary);
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

        .header-stats {
          display: flex;
          gap: 1.5rem;
        }

        .stat {
          text-align: center;
          background: white;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .stat-value {
          display: block;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--primary-purple);
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
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

        .email-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .email-cell svg {
          color: var(--text-muted);
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

        .action-btn.activate {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .action-btn.activate:hover {
          background: #10b981;
          color: white;
        }

        .action-btn.deactivate {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        .action-btn.deactivate:hover {
          background: #f59e0b;
          color: white;
        }

        .action-btn.delete {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .action-btn.delete:hover {
          background: #ef4444;
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
            min-width: 600px;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
          }

          .header-stats {
            width: 100%;
          }

          .stat {
            flex: 1;
          }

          .filters-bar {
            flex-direction: column;
          }

          .search-box {
            max-width: none;
          }
        }

        @media (max-width: 480px) {
          .filter-select {
            width: 100%;
          }

          .stat-value {
            font-size: 1.5rem;
          }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal {
          background: white;
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-header h2 {
          font-size: 1.25rem;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-muted);
        }

        .modal-body {
          padding: 1.5rem;
        }

        .promo-info {
          background: rgba(139, 92, 246, 0.1);
          padding: 1rem;
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }

        .promo-info p {
          margin: 0;
          color: var(--primary-purple);
        }

        .result-message {
          padding: 1rem;
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .result-message.success {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .result-message.error {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-purple);
        }

        .form-group textarea {
          font-family: monospace;
          resize: vertical;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .btn-secondary {
          background: var(--bg-light);
          color: var(--text-primary);
          border: 2px solid var(--border-color);
        }

        .btn-secondary:hover {
          background: var(--border-color);
        }
      `}</style>
    </>
  );
}
