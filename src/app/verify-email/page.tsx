'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (data.success) {
          setStatus('success');
          setMessage('Your email has been verified!');
          setTimeout(() => router.push('/login'), 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch {
        setStatus('error');
        setMessage('Something went wrong');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="verify-content">
      {status === 'loading' && (
        <>
          <div className="spinner"></div>
          <h2>Verifying your email...</h2>
          <p>Please wait a moment</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="success-icon">✅</div>
          <h2>Email Verified!</h2>
          <p>{message}</p>
          <p className="redirect">Redirecting to login...</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="error-icon">❌</div>
          <h2>Verification Failed</h2>
          <p>{message}</p>
          <Link href="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <>
      <div className="verify-page">
        <div className="verify-container">
          <div className="verify-card">
            <Link href="/" className="logo">
              <span className="logo-icon">🏷️</span>
              <span className="logo-text">ShowSales</span>
            </Link>
            
            <Suspense fallback={<div>Loading...</div>}>
              <VerifyEmailContent />
            </Suspense>
          </div>
        </div>
      </div>

      <style jsx>{`
        .verify-page {
          min-height: calc(100vh - 160px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
        }

        .verify-container {
          width: 100%;
          max-width: 440px;
        }

        .verify-card {
          background: white;
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-xl);
          padding: 3rem;
          text-align: center;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          margin-bottom: 2rem;
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

        .success-icon, .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--border-color);
          border-top-color: var(--primary-purple);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .redirect {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-top: 1rem;
        }
      `}</style>
    </>
  );
}
