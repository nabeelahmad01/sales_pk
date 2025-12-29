'use client';

import { useState } from 'react';
import styles from './NewsletterSection.module.css';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage('🎉 Subscribed! Check your inbox for sale alerts.');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaCard}>
          <div className={styles.ctaContent}>
            <h2>Get Sale Alerts Directly!</h2>
            <p>
              Be the first to know when your favorite brands announce new
              sales. Join 10,000+ smart shoppers!
            </p>

            {status === 'success' && (
              <div className={styles.subscribeSuccess}>{message}</div>
            )}
            {status === 'error' && (
              <div className={styles.subscribeError}>{message}</div>
            )}

            <form className={styles.ctaForm} onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.ctaInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
              </button>
            </form>
            <span className={styles.ctaNote}>
              No spam, ever. Unsubscribe anytime.
            </span>
          </div>
          <div className={styles.ctaDecoration}>
            <span className={`${styles.emojiFloat} ${styles.emoji1}`}>🛍️</span>
            <span className={`${styles.emojiFloat} ${styles.emoji2}`}>💰</span>
            <span className={`${styles.emojiFloat} ${styles.emoji3}`}>🏷️</span>
            <span className={`${styles.emojiFloat} ${styles.emoji4}`}>✨</span>
          </div>
        </div>
      </div>
    </section>
  );
}
