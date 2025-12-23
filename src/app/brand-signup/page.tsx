"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BrandSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactPerson: "",
    contactPhone: "",
    website: "",
    category: "",
    description: "",
  });

  const categories = [
    "Fashion",
    "Electronics",
    "Beauty",
    "Food & Beverages",
    "Home & Living",
    "Sports & Fitness",
    "Health",
    "Jewelry & Watches",
    "Books & Stationery",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/brands/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contactPerson: formData.contactPerson,
          contactPhone: formData.contactPhone,
          website: formData.website,
          category: formData.category,
          description: formData.description,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <div className="signup-page">
          <div className="signup-card success">
            <div className="success-icon">✓</div>
            <h1>Registration Submitted!</h1>
            <p>Thank you for registering your brand with ShowSales.pk!</p>
            <p>
              Your application is now <strong>pending approval</strong>. Our
              team will review your details and you'll receive an email once
              your brand is approved.
            </p>
            <div className="actions">
              <Link href="/" className="btn btn-primary">
                Back to Home
              </Link>
              <Link href="/panel/brand/login" className="btn btn-secondary">
                Brand Login
              </Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          .signup-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            background: var(--bg-light);
          }

          .signup-card.success {
            background: white;
            padding: 3rem;
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-lg);
            text-align: center;
            max-width: 500px;
          }

          .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            color: white;
            margin: 0 auto 1.5rem;
          }

          h1 {
            color: #059669;
            margin-bottom: 1rem;
          }

          p {
            color: var(--text-secondary);
            margin-bottom: 1rem;
          }

          .actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-header">
            <Link href="/" className="logo">
              🏷️ <span>ShowSales</span>
            </Link>
            <h1>Register Your Brand</h1>
            <p>Join ShowSales.pk and reach millions of Pakistani shoppers</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-section">
              <h3>📦 Brand Information</h3>

              <div className="form-group">
                <label>Brand Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Khaadi, Gul Ahmed"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="https://yourbrand.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Brand Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Tell us about your brand..."
                  rows={3}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>👤 Contact Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Person *</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactPerson: e.target.value,
                      })
                    }
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                    placeholder="03XX-XXXXXXX"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>🔐 Login Credentials</h3>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="brand@email.com"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Registration"}
            </button>

            <p className="login-link">
              Already have an account?{" "}
              <Link href="/panel/brand/login">Login here</Link>
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        .signup-page {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 100%);
        }

        .signup-container {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }

        .signup-header {
          background: var(--primary-gradient);
          padding: 2rem;
          text-align: center;
          color: white;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          text-decoration: none;
          margin-bottom: 1rem;
        }

        .signup-header h1 {
          margin: 0 0 0.5rem;
          font-size: 1.75rem;
        }

        .signup-header p {
          margin: 0;
          opacity: 0.9;
        }

        .signup-form {
          padding: 2rem;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          padding: 1rem;
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
        }

        .form-section:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }

        .form-section h3 {
          margin: 0 0 1.25rem;
          font-size: 1.125rem;
          color: var(--text-primary);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          font-size: 1rem;
          transition: all var(--transition-fast);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-purple);
        }

        .form-group textarea {
          resize: vertical;
        }

        .btn-lg {
          width: 100%;
          padding: 1rem;
          font-size: 1.125rem;
          margin-top: 1rem;
        }

        .login-link {
          text-align: center;
          margin-top: 1.5rem;
          color: var(--text-secondary);
        }

        .login-link a {
          color: var(--primary-purple);
          text-decoration: none;
          font-weight: 500;
        }

        .login-link a:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .signup-form {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
