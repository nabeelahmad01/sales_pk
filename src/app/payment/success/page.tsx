"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const txn = searchParams.get("txn");

  return (
    <>
      <div className="payment-result">
        <div className="result-card success">
          <div className="icon">✓</div>
          <h1>Payment Successful!</h1>
          <p>Your payment has been processed successfully.</p>

          {orderId && (
            <div className="details">
              <p>
                <strong>Order ID:</strong> {orderId}
              </p>
              {txn && (
                <p>
                  <strong>Transaction ID:</strong> {txn}
                </p>
              )}
            </div>
          )}

          <div className="actions">
            <Link href="/" className="btn btn-primary">
              Continue Shopping
            </Link>
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

        .success .icon {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        h1 {
          color: #059669;
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
        }

        .btn {
          display: inline-block;
          padding: 0.75rem 2rem;
          border-radius: var(--radius-lg);
          text-decoration: none;
          font-weight: 600;
        }

        .btn-primary {
          background: var(--primary-gradient);
          color: white;
        }
      `}</style>
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
