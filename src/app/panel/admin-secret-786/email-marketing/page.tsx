"use client";

import { useState, useEffect, useRef } from "react";

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

export default function EmailMarketingPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  // Email compose state
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<any>(null);

  // Imported emails from Excel/CSV
  const [importedEmails, setImportedEmails] = useState<string[]>([]);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview tab
  const [activeTab, setActiveTab] = useState<"compose" | "preview">("compose");

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

  // Handle Excel/CSV file import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError("");
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/);
        const emails: string[] = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        lines.forEach((line) => {
          // Handle CSV - split by comma, semicolon, or tab
          const values = line.split(/[,;\t]/);
          values.forEach((value) => {
            const trimmed = value.trim().replace(/"/g, "");
            if (emailRegex.test(trimmed)) {
              emails.push(trimmed.toLowerCase());
            }
          });
        });

        // Remove duplicates
        const uniqueEmails = [...new Set(emails)];

        if (uniqueEmails.length === 0) {
          setImportError("No valid emails found in file");
        } else {
          setImportedEmails((prev) => [...new Set([...prev, ...uniqueEmails])]);
        }
      } catch (error) {
        setImportError(
          "Error parsing file. Make sure it's a valid CSV/Excel file."
        );
      }
    };

    reader.onerror = () => {
      setImportError("Error reading file");
    };

    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Clear imported emails
  const clearImportedEmails = () => {
    setImportedEmails([]);
    setImportError("");
  };

  // Get ALL unique emails (users + subscribers + imported)
  const getAllEmails = (): string[] => {
    const userEmails = users.map((u) => u.email.toLowerCase());
    const subscriberEmails = subscribers
      .filter((s) => s.isActive)
      .map((s) => s.email.toLowerCase());
    const imported = importedEmails.map((e) => e.toLowerCase());

    // Combine all and remove duplicates
    return [...new Set([...userEmails, ...subscriberEmails, ...imported])];
  };

  const getTotalEmailCount = (): number => {
    return getAllEmails().length;
  };

  const handleSendEmail = async (isTest: boolean = false) => {
    if (!subject || !content) {
      alert("Please enter subject and content");
      return;
    }

    const allEmails = getAllEmails();

    if (!isTest && !confirm(`Send email to ${allEmails.length} recipients?`)) {
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
          emailList: isTest ? undefined : allEmails, // Send all emails list
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
          {/* Sidebar - All Email Sources */}
          <div className="recipients-panel">
            <h3>📋 Email List</h3>
            <p className="panel-desc">
              All emails will receive your promotional message
            </p>

            {/* Email Sources Summary */}
            <div className="email-sources">
              <div className="source-item">
                <span className="source-icon">👤</span>
                <span className="source-label">Registered Users</span>
                <span className="source-count">{users.length}</span>
              </div>
              <div className="source-item">
                <span className="source-icon">📧</span>
                <span className="source-label">Subscribers</span>
                <span className="source-count">
                  {subscribers.filter((s) => s.isActive).length}
                </span>
              </div>
              <div className="source-item">
                <span className="source-icon">📁</span>
                <span className="source-label">Imported</span>
                <span className="source-count">{importedEmails.length}</span>
              </div>
              <div className="source-item total">
                <span className="source-icon">📊</span>
                <span className="source-label">Total Unique</span>
                <span className="source-count">{getTotalEmailCount()}</span>
              </div>
            </div>

            {/* Excel/CSV Import */}
            <div className="import-section">
              <h4>📥 Import Emails</h4>
              <p>Upload CSV or Excel file with email addresses</p>

              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,.xlsx,.xls,.txt"
                onChange={handleFileImport}
                style={{ display: "none" }}
              />

              <button
                className="import-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                Upload File
              </button>

              {importError && <div className="import-error">{importError}</div>}

              {importedEmails.length > 0 && (
                <div className="imported-info">
                  <span>✓ {importedEmails.length} emails imported</span>
                  <button onClick={clearImportedEmails} className="clear-btn">
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Recent Emails Preview */}
            <div className="recipients-list">
              <h4>Recent Emails</h4>

              {users.slice(0, 3).map((user) => (
                <div key={user._id} className="recipient-item user">
                  <span className="recipient-badge">👤</span>
                  <div className="recipient-info">
                    <span className="recipient-name">{user.name}</span>
                    <span className="recipient-email">{user.email}</span>
                  </div>
                </div>
              ))}

              {subscribers
                .filter((s) => s.isActive)
                .slice(0, 2)
                .map((sub) => (
                  <div key={sub._id} className="recipient-item subscriber">
                    <span className="recipient-badge">📧</span>
                    <div className="recipient-info">
                      <span className="recipient-email">{sub.email}</span>
                    </div>
                  </div>
                ))}

              {importedEmails.slice(0, 2).map((email, idx) => (
                <div
                  key={`imported-${idx}`}
                  className="recipient-item imported"
                >
                  <span className="recipient-badge">📁</span>
                  <div className="recipient-info">
                    <span className="recipient-email">{email}</span>
                  </div>
                </div>
              ))}

              {getTotalEmailCount() > 7 && (
                <div className="more-recipients">
                  + {getTotalEmailCount() - 7} more recipients
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
                      📨 Will be sent to <strong>{getTotalEmailCount()}</strong>{" "}
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
                      : `📧 Send to All ${getTotalEmailCount()} Recipients`}
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
          margin: 0 0 0.5rem;
          font-size: 1.125rem;
        }

        .panel-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0 0 1rem;
        }

        .email-sources {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .source-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: var(--bg-light);
          border-radius: var(--radius-md);
        }

        .source-item.total {
          background: rgba(139, 92, 246, 0.1);
          border: 2px solid var(--primary-purple);
        }

        .source-icon {
          font-size: 1rem;
        }

        .source-label {
          flex: 1;
          font-size: 0.875rem;
        }

        .source-count {
          font-weight: 700;
          color: var(--primary-purple);
        }

        .import-section {
          padding: 1rem;
          background: var(--bg-light);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }

        .import-section h4 {
          margin: 0 0 0.5rem;
          font-size: 0.875rem;
        }

        .import-section p {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0 0 1rem;
        }

        .import-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: white;
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .import-btn:hover {
          border-color: var(--primary-purple);
          color: var(--primary-purple);
        }

        .import-error {
          margin-top: 0.75rem;
          padding: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
        }

        .imported-info {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem;
          background: rgba(16, 185, 129, 0.1);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: #059669;
        }

        .clear-btn {
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }

        .clear-btn:hover {
          text-decoration: underline;
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
