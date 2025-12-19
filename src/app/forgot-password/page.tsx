'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <Link href="/" className="logo">
                <span className="logo-icon">🏷️</span>
                <span className="logo-text">ShowSales</span>
              </Link>
              <h1>Forgot Password</h1>
              {!isSubmitted && (
                <p>Enter your email and we'll send you a reset link</p>
              )}
            </div>

            {isSubmitted ? (
              <div className="success-message">
                <div className="success-icon">✉️</div>
                <h2>Check Your Email</h2>
                <p>
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Please check your inbox and follow the instructions.
                </p>
                <Link href="/login" className="btn btn-primary">
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className="auth-footer">
                  <Link href="/login">← Back to Login</Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: calc(100vh - 160px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
        }

        .auth-container {
          width: 100%;
          max-width: 440px;
        }

        .auth-card {
          background: white;
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-xl);
          padding: 2.5rem;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          margin-bottom: 1.5rem;
        }

        .logo-icon {
          font-size: 2rem;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .auth-header h1 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #DC2626;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .success-message {
          text-align: center;
          padding: 1rem 0;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .success-message h2 {
          margin-bottom: 0.75rem;
        }

        .success-message p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
        }

        .auth-footer a {
          color: var(--primary-purple);
          text-decoration: none;
          font-size: 0.875rem;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}
