'use client';

import { useState, useEffect } from 'react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'unread') return !contact.isRead;
    if (filter === 'read') return contact.isRead;
    return true;
  });

  const unreadCount = contacts.filter(c => !c.isRead).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSubjectLabel = (subject: string) => {
    const labels: Record<string, string> = {
      general: 'General Inquiry',
      brand: 'Add My Brand',
      partnership: 'Partnership',
      feedback: 'Feedback',
      bug: 'Bug Report',
    };
    return labels[subject] || subject;
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading messages...</div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Messages</h1>
            <p>Contact form submissions from visitors</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-value">{contacts.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className={`stat ${unreadCount > 0 ? 'highlight' : ''}`}>
              <span className="stat-value">{unreadCount}</span>
              <span className="stat-label">Unread</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({contacts.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button 
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({contacts.length - unreadCount})
          </button>
        </div>

        {/* Messages List */}
        <div className="messages-container">
          <div className="messages-list">
            {filteredContacts.length === 0 ? (
              <div className="no-messages">
                <span className="no-messages-icon">📭</span>
                <h3>No messages</h3>
                <p>No messages to display</p>
              </div>
            ) : (
              filteredContacts.map(contact => (
                <div 
                  key={contact._id} 
                  className={`message-item ${!contact.isRead ? 'unread' : ''} ${selectedContact?._id === contact._id ? 'selected' : ''}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="message-header">
                    <span className="message-name">{contact.name}</span>
                    <span className="message-date">{formatDate(contact.createdAt)}</span>
                  </div>
                  <div className="message-subject">{getSubjectLabel(contact.subject)}</div>
                  <div className="message-preview">{contact.message.substring(0, 60)}...</div>
                </div>
              ))
            )}
          </div>

          {/* Message Detail */}
          {selectedContact && (
            <div className="message-detail">
              <div className="detail-header">
                <div>
                  <h2>{selectedContact.name}</h2>
                  <a href={`mailto:${selectedContact.email}`} className="detail-email">
                    {selectedContact.email}
                  </a>
                </div>
                <span className="detail-date">{formatDate(selectedContact.createdAt)}</span>
              </div>
              <div className="detail-subject">
                <span className="subject-label">{getSubjectLabel(selectedContact.subject)}</span>
              </div>
              <div className="detail-message">
                {selectedContact.message}
              </div>
              <div className="detail-actions">
                <a 
                  href={`mailto:${selectedContact.email}?subject=Re: ${getSubjectLabel(selectedContact.subject)}`}
                  className="btn btn-primary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Reply via Email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-page {
          max-width: 1400px;
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
          gap: 1rem;
        }

        .stat {
          text-align: center;
          background: white;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .stat.highlight {
          background: rgba(239, 68, 68, 0.1);
        }

        .stat.highlight .stat-value {
          color: #DC2626;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-purple);
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .filters-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          background: white;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .filter-btn.active {
          background: var(--primary-purple);
          border-color: var(--primary-purple);
          color: white;
        }

        .messages-container {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 1.5rem;
          min-height: 500px;
        }

        .messages-list {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .message-item {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .message-item:hover {
          background: var(--bg-light);
        }

        .message-item.selected {
          background: rgba(139, 92, 246, 0.1);
          border-left: 3px solid var(--primary-purple);
        }

        .message-item.unread {
          background: rgba(139, 92, 246, 0.05);
        }

        .message-item.unread .message-name {
          font-weight: 700;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .message-name {
          font-weight: 500;
        }

        .message-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .message-subject {
          font-size: 0.875rem;
          color: var(--primary-purple);
          margin-bottom: 0.25rem;
        }

        .message-preview {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .message-detail {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          padding: 1.5rem;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .detail-header h2 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }

        .detail-email {
          color: var(--primary-purple);
          text-decoration: none;
          font-size: 0.875rem;
        }

        .detail-email:hover {
          text-decoration: underline;
        }

        .detail-date {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .detail-subject {
          margin-bottom: 1.5rem;
        }

        .subject-label {
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary-purple);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .detail-message {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-primary);
          margin-bottom: 2rem;
          white-space: pre-wrap;
        }

        .detail-actions .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .no-messages {
          text-align: center;
          padding: 4rem 2rem;
        }

        .no-messages-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        .no-messages h3 {
          margin-bottom: 0.5rem;
        }

        .no-messages p {
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .messages-container {
            grid-template-columns: 1fr;
          }

          .message-detail {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 100;
            border-radius: 0;
            overflow-y: auto;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
          }

          .filters-bar {
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}
