"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function FailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const error = searchParams.get("error");

  return (
    <>
      <div className="payment-result">
        <div className="result-card failed">
          <div className="icon">✕</div>
          <h1>Payment Failed</h1>
          <p>{error || "Your payment could not be processed."}</p>

          {orderId && (
            <div className="details">
              <p>
                <strong>Order ID:</strong> {orderId}
              </p>
              <p>
                Your order has been saved. You can try again or choose another
                payment method.
              </p>
            </div>
          )}

          <div className="actions">
            <Link href="/" className="btn btn-secondary">
              Back to Home
            </Link>
            {orderId && (
              <button
                className="btn btn-primary"
                onClick={() => window.history.back()}
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .payment-result {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--bg-light);
        }

        .result-card {
          background: white;
          padding: 3rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: white;
          margin: 0 auto 1.5rem;
        }

        .failed .icon {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        h1 {
          color: #dc2626;
          margin-bottom: 0.5rem;
        }

        .details {
          background: var(--bg-light);
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          margin: 2rem 0;
          text-align: left;
        }

        .details p {
          margin: 0.5rem 0;
        }

        .actions {
          margin-top: 1.5rem;
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-block;
          padding: 0.75rem 2rem;
          border-radius: var(--radius-lg);
          text-decoration: none;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background: var(--primary-gradient);
          color: white;
        }

        .btn-secondary {
          background: var(--bg-light);
          color: var(--text-primary);
          border: 2px solid var(--border-color);
        }
      `}</style>
    </>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailedContent />
    </Suspense>
  );
}
