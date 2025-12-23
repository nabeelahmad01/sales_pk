"use client";

import { useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
}

interface Subscriber {
  _id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
}

type RecipientType = "all" | "users" | "subscribers";

export default function EmailMarketingPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  // Email compose state
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipientType, setRecipientType] = useState<RecipientType>("all");
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<any>(null);

  // Preview tab
  const [activeTab, setActiveTab] = useState<"compose" | "preview" | "history">(
    "compose"
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, subscribersRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/subscribers"),
      ]);

      const usersData = await usersRes.json();
      const subscribersData = await subscribersRes.json();

      if (usersData.success) setUsers(usersData.data);
      if (subscribersData.success) setSubscribers(subscribersData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get all unique emails based on recipient type
  const getRecipientEmails = (): string[] => {
    const userEmails = users.map((u) => u.email);
    const subscriberEmails = subscribers
      .filter((s) => s.isActive)
      .map((s) => s.email);

    if (recipientType === "users") return userEmails;
    if (recipientType === "subscribers") return subscriberEmails;

    // All unique emails
    return [...new Set([...userEmails, ...subscriberEmails])];
  };

  const getRecipientCount = (): number => {
    return getRecipientEmails().length;
  };

  const handleSendEmail = async (isTest: boolean = false) => {
    if (!subject || !content) {
      alert("Please enter subject and content");
      return;
    }

    if (
      !isTest &&
      !confirm(`Send email to ${getRecipientCount()} recipients?`)
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
          subject,
          content,
          testEmail: isTest ? testEmail : undefined,
          recipientType: isTest ? "all" : recipientType, // Pass selected recipient type
        }),
      });

      const data = await res.json();
      setSendResult(data);

      if (data.success && !isTest) {
        setSubject("");
        setContent("");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setSendResult({ success: false, error: "Failed to send emails" });
    } finally {
      setSending(false);
    }
  };

  // Email templates
  const templates = [
    {
      name: "🔥 New Sale Alert",
      subject: "🔥 New Sales Alert - Up to 70% Off!",
      content: `<h2 style="color: #8B5CF6; margin-bottom: 15px;">New Sales Just Dropped! 🛍️</h2>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">
  Don't miss out on these amazing deals from your favorite Pakistani brands!
</p>
<div style="background: #F3E8FF; padding: 20px; border-radius: 12px; margin: 20px 0;">
  <h3 style="margin: 0 0 10px; color: #7C3AED;">Featured Sales:</h3>
  <ul style="margin: 0; padding-left: 20px; color: #374151;">
    <li>Khaadi - Up to 50% OFF</li>
    <li>Gul Ahmed - Flat 40% OFF</li>
    <li>Sapphire - Buy 2 Get 1 Free</li>
  </ul>
</div>
<a href="https://showsales.pk/sales" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 600;">
  View All Sales →
</a>`,
    },
    {
      name: "⏰ Ending Soon",
      subject: "⏰ Last Chance! These Sales End Today",
      content: `<h2 style="color: #EF4444; margin-bottom: 15px;">Hurry! Sales Ending Soon ⏰</h2>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">
  These deals are about to expire. Don't let them slip away!
</p>
<div style="background: #FEF2F2; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #EF4444;">
  <p style="margin: 0; color: #991B1B; font-weight: 600;">
    ⚠️ Less than 24 hours remaining on these amazing offers!
  </p>
</div>
<a href="https://showsales.pk/sales?sort=ending" style="display: inline-block; background: linear-gradient(135deg, #EF4444, #F97316); color: white; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 600;">
  Shop Before It's Gone →
</a>`,
    },
    {
      name: "📢 Weekly Digest",
      subject: "📢 Your Weekly Sale Roundup from ShowSales.pk",
      content: `<h2 style="color: #8B5CF6; margin-bottom: 15px;">This Week's Best Deals 📢</h2>
<p style="font-size: 16px; line-height: 1.6; color: #374151;">
  Here's a summary of the hottest sales happening this week across Pakistan's top brands.
</p>
<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <tr style="background: #F3E8FF;">
    <td style="padding: 12px; font-weight: 600;">Brand</td>
    <td style="padding: 12px; font-weight: 600;">Discount</td>
    <td style="padding: 12px; font-weight: 600;">Ends</td>
  </tr>
  <tr style="border-bottom: 1px solid #E5E7EB;">
    <td style="padding: 12px;">Khaadi</td>
    <td style="padding: 12px; color: #10B981; font-weight: 600;">50% OFF</td>
    <td style="padding: 12px;">Dec 31</td>
  </tr>
  <tr style="border-bottom: 1px solid #E5E7EB;">
    <td style="padding: 12px;">Gul Ahmed</td>
    <td style="padding: 12px; color: #10B981; font-weight: 600;">40% OFF</td>
    <td style="padding: 12px;">Dec 28</td>
  </tr>
</table>
<a href="https://showsales.pk" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 600;">
  Explore All Deals →
</a>`,
    },
  ];

  const applyTemplate = (template: (typeof templates)[0]) => {
    setSubject(template.subject);
    setContent(template.content);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading email marketing dashboard...</div>
        <style jsx>{`
          .admin-page {
            max-width: 1400px;
          }
          .loading {
            text-align: center;
            padding: 4rem;
            color: var(--text-secondary);
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>📧 Email Marketing</h1>
            <p>Send promotional emails to users and subscribers</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">👥</div>
            <div className="stat-info">
              <span className="stat-value">{users.length}</span>
              <span className="stat-label">Registered Users</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon subscribers">📬</div>
            <div className="stat-info">
              <span className="stat-value">
                {subscribers.filter((s) => s.isActive).length}
              </span>
              <span className="stat-label">Active Subscribers</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon total">📊</div>
            <div className="stat-info">
              <span className="stat-value">
                {
                  new Set([
                    ...users.map((u) => u.email),
                    ...subscribers
                      .filter((s) => s.isActive)
                      .map((s) => s.email),
                  ]).size
                }
              </span>
              <span className="stat-label">Total Unique Emails</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="email-dashboard">
          {/* Sidebar - Recipients List */}
          <div className="recipients-panel">
            <h3>📋 Recipients</h3>

            <div className="recipient-type-selector">
              <button
                className={`type-btn ${
                  recipientType === "all" ? "active" : ""
                }`}
                onClick={() => setRecipientType("all")}
              >
                All (
                {
                  new Set([
                    ...users.map((u) => u.email),
                    ...subscribers
                      .filter((s) => s.isActive)
                      .map((s) => s.email),
                  ]).size
                }
                )
              </button>
              <button
                className={`type-btn ${
                  recipientType === "users" ? "active" : ""
                }`}
                onClick={() => setRecipientType("users")}
              >
                Users ({users.length})
              </button>
              <button
                className={`type-btn ${
                  recipientType === "subscribers" ? "active" : ""
                }`}
                onClick={() => setRecipientType("subscribers")}
              >
                Subscribers ({subscribers.filter((s) => s.isActive).length})
              </button>
            </div>

            <div className="recipients-list">
              <h4>
                Recent{" "}
                {recipientType === "all"
                  ? "Users & Subscribers"
                  : recipientType === "users"
                  ? "Users"
                  : "Subscribers"}
              </h4>

              {recipientType !== "subscribers" &&
                users.slice(0, 5).map((user) => (
                  <div key={user._id} className="recipient-item user">
                    <span className="recipient-badge">👤</span>
                    <div className="recipient-info">
                      <span className="recipient-name">{user.name}</span>
                      <span className="recipient-email">{user.email}</span>
                    </div>
                  </div>
                ))}

              {recipientType !== "users" &&
                subscribers
                  .filter((s) => s.isActive)
                  .slice(0, 5)
                  .map((sub) => (
                    <div key={sub._id} className="recipient-item subscriber">
                      <span className="recipient-badge">📧</span>
                      <div className="recipient-info">
                        <span className="recipient-email">{sub.email}</span>
                      </div>
                    </div>
                  ))}

              {getRecipientCount() > 10 && (
                <div className="more-recipients">
                  + {getRecipientCount() - 10} more recipients
                </div>
              )}
            </div>
          </div>

          {/* Main - Compose Email */}
          <div className="compose-panel">
            <div className="compose-tabs">
              <button
                className={`tab ${activeTab === "compose" ? "active" : ""}`}
                onClick={() => setActiveTab("compose")}
              >
                ✏️ Compose
              </button>
              <button
                className={`tab ${activeTab === "preview" ? "active" : ""}`}
                onClick={() => setActiveTab("preview")}
              >
                👁️ Preview
              </button>
            </div>

            {activeTab === "compose" && (
              <div className="compose-form">
                {/* Templates */}
                <div className="templates-section">
                  <h4>Quick Templates</h4>
                  <div className="templates-grid">
                    {templates.map((template, index) => (
                      <button
                        key={index}
                        className="template-btn"
                        onClick={() => applyTemplate(template)}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result Message */}
                {sendResult && (
                  <div
                    className={`result-message ${
                      sendResult.success ? "success" : "error"
                    }`}
                  >
                    {sendResult.success ? (
                      <>
                        <strong>✓ Emails sent successfully!</strong>
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

                {/* Subject */}
                <div className="form-group">
                  <label>Subject Line *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="🔥 Amazing Sale Alert - Don't Miss Out!"
                  />
                </div>

                {/* Content */}
                <div className="form-group">
                  <label>Email Content (HTML) *</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="<h2>Your Email Content Here</h2><p>Write your promotional message...</p>"
                    rows={12}
                  />
                </div>

                {/* Test Email */}
                <div className="form-group test-email">
                  <label>Test Email (optional)</label>
                  <div className="test-email-row">
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleSendEmail(true)}
                      disabled={sending || !testEmail}
                    >
                      Send Test
                    </button>
                  </div>
                </div>

                {/* Send Button */}
                <div className="send-section">
                  <div className="send-info">
                    <span className="send-count">
                      📨 Will be sent to <strong>{getRecipientCount()}</strong>{" "}
                      recipients
                    </span>
                  </div>
                  <button
                    className="btn btn-primary btn-lg send-btn"
                    onClick={() => handleSendEmail(false)}
                    disabled={sending || !subject || !content}
                  >
                    {sending
                      ? "📤 Sending..."
                      : `📧 Send to All ${getRecipientCount()} Recipients`}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "preview" && (
              <div className="preview-panel">
                <div className="preview-header">
                  <strong>Subject:</strong> {subject || "(No subject)"}
                </div>
                <div className="preview-body">
                  {content ? (
                    <div
                      className="preview-content"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : (
                    <p className="preview-empty">
                      No content to preview. Go back to Compose tab.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-page {
          max-width: 1400px;
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
          grid-template-columns: repeat(3, 1fr);
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
          width: 60px;
          height: 60px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
        }

        .stat-icon.users {
          background: rgba(139, 92, 246, 0.1);
        }
        .stat-icon.subscribers {
          background: rgba(16, 185, 129, 0.1);
        }
        .stat-icon.total {
          background: rgba(236, 72, 153, 0.1);
        }

        .stat-info {
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

        .email-dashboard {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.5rem;
        }

        .recipients-panel {
          background: white;
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          height: fit-content;
        }

        .recipients-panel h3 {
          margin: 0 0 1rem;
          font-size: 1.125rem;
        }

        .recipient-type-selector {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .type-btn {
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          background: white;
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .type-btn.active {
          background: var(--primary-purple);
          border-color: var(--primary-purple);
          color: white;
        }

        .recipients-list h4 {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0 0 1rem;
        }

        .recipient-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          margin-bottom: 0.5rem;
          background: var(--bg-light);
        }

        .recipient-badge {
          font-size: 1.25rem;
        }

        .recipient-info {
          display: flex;
          flex-direction: column;
        }

        .recipient-name {
          font-weight: 500;
          font-size: 0.875rem;
        }

        .recipient-email {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .more-recipients {
          text-align: center;
          padding: 0.75rem;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .compose-panel {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .compose-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
        }

        .tab {
          flex: 1;
          padding: 1rem;
          border: none;
          background: none;
          cursor: pointer;
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .tab.active {
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary-purple);
          border-bottom: 2px solid var(--primary-purple);
        }

        .compose-form {
          padding: 1.5rem;
        }

        .templates-section {
          margin-bottom: 1.5rem;
        }

        .templates-section h4 {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0 0 0.75rem;
        }

        .templates-grid {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .template-btn {
          padding: 0.5rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-full);
          background: white;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all var(--transition-fast);
        }

        .template-btn:hover {
          border-color: var(--primary-purple);
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
          padding: 0.875rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          font-size: 1rem;
          transition: all var(--transition-fast);
        }

        .form-group textarea {
          font-family: "Courier New", monospace;
          resize: vertical;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-purple);
        }

        .test-email-row {
          display: flex;
          gap: 0.75rem;
        }

        .test-email-row input {
          flex: 1;
        }

        .send-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
          margin-top: 1rem;
        }

        .send-info {
          color: var(--text-secondary);
        }

        .send-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .preview-panel {
          padding: 1.5rem;
        }

        .preview-header {
          padding: 1rem;
          background: var(--bg-light);
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
        }

        .preview-body {
          padding: 1.5rem;
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-lg);
          min-height: 300px;
        }

        .preview-content {
          line-height: 1.6;
        }

        .preview-empty {
          text-align: center;
          color: var(--text-muted);
        }

        .btn-secondary {
          background: var(--bg-light);
          color: var(--text-primary);
          border: 2px solid var(--border-color);
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: 500;
        }

        .btn-secondary:hover {
          background: var(--border-color);
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 1024px) {
          .email-dashboard {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
