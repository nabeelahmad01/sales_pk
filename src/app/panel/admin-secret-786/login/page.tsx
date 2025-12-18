'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        isAdmin: 'true',
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid admin credentials');
      } else {
        router.push('/panel/admin-secret-786');
        router.refresh();
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-login">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="admin-badge">🔐 Admin Access</div>
              <h1>Secure Login</h1>
              <p>Authorized personnel only</p>
            </div>

            {error && (
              <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Admin Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@showsales.pk"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="btn-admin" disabled={loading}>
                {loading ? 'Authenticating...' : 'Access Admin Panel'}
              </button>
            </form>

            <div className="login-footer">
              <Link href="/">← Back to Website</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-login {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--secondary-navy);
        }

        .login-container {
          width: 100%;
          max-width: 400px;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-2xl);
          padding: 2.5rem;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
          color: white;
        }

        .admin-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: var(--primary-gradient);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .login-header h1 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          color: white;
        }

        .login-header p {
          color: rgba(255, 255, 255, 0.6);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1rem;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-lg);
          color: #FCA5A5;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .form-group input {
          padding: 0.875rem 1rem;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          transition: all var(--transition-fast);
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary-purple);
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-admin {
          width: 100%;
          padding: 1rem;
          background: var(--primary-gradient);
          border: none;
          border-radius: var(--radius-lg);
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-admin:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
        }

        .btn-admin:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .login-footer {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .login-footer a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 0.875rem;
        }

        .login-footer a:hover {
          color: white;
        }
      `}</style>
    </>
  );
}
