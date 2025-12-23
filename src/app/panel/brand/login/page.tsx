"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function BrandLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        isBrand: "true",
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/panel/brand");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <Link href="/" className="logo">
              🏷️ <span>ShowSales</span>
            </Link>
            <h1>Brand Login</h1>
            <p>Access your brand dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="brand@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>

            <div className="links">
              <Link href="/brand-signup" className="signup-link">
                Don't have an account? <strong>Register your brand</strong>
              </Link>
            </div>
          </form>

          <div className="footer-links">
            <Link href="/">← Back to ShowSales.pk</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 100%);
        }

        .login-container {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }

        .login-header {
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

        .login-header h1 {
          margin: 0 0 0.5rem;
          font-size: 1.5rem;
        }

        .login-header p {
          margin: 0;
          opacity: 0.9;
        }

        .login-form {
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

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          font-size: 1rem;
          transition: all var(--transition-fast);
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary-purple);
        }

        .btn-lg {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        .links {
          margin-top: 1.5rem;
          text-align: center;
        }

        .signup-link {
          color: var(--text-secondary);
          text-decoration: none;
        }

        .signup-link strong {
          color: var(--primary-purple);
        }

        .footer-links {
          padding: 1.5rem;
          text-align: center;
          border-top: 1px solid var(--border-color);
        }

        .footer-links a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.875rem;
        }

        .footer-links a:hover {
          color: var(--primary-purple);
        }
      `}</style>
    </>
  );
}
