"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sales, brands } from "@/data/mockData";

interface PageProps {
  params: Promise<{ saleId: string }>;
}

export default function CheckoutPage({ params }: PageProps) {
  const { saleId } = use(params);
  const router = useRouter();

  // Find sale from mock data
  const sale = sales.find((s) => s.id === saleId);
  const brand = sale ? brands.find((b) => b.id === sale.brandId) : null;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "card" | "jazzcash" | "easypaisa"
  >("cod");
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    customerCity: "",
    customerNotes: "",
  });

  const cities = [
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Sialkot",
    "Gujranwala",
  ];

  // If sale not found, show error
  if (!sale) {
    return (
      <div className="checkout-error">
        <h1>Error</h1>
        <p>Sale not found</p>
        <Link href="/">Go Back Home</Link>
        <style jsx>{`
          .checkout-error {
            min-height: 50vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 1rem;
          }
          .checkout-error a {
            color: var(--primary-purple);
          }
        `}</style>
      </div>
    );
  }

  const unitPrice = sale.salePrice || sale.originalPrice || 0;
  const totalAmount = unitPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sale) return;

    setSubmitting(true);
    setError("");

    try {
      // First create the order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          saleId: sale.id,
          brandId: sale.brandId,
          brandName: brand?.name || sale.brandName,
          productName: sale.title,
          productImage: sale.image,
          quantity,
          unitPrice,
          totalAmount,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const orderId = data.data.orderId;

        // If JazzCash payment method, redirect to JazzCash
        if (paymentMethod === "jazzcash") {
          const jazzRes = await fetch("/api/payments/jazzcash", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: totalAmount,
              orderId: orderId,
              customerEmail: formData.customerEmail,
              customerPhone: formData.customerPhone,
              productName: sale.title,
            }),
          });

          const jazzData = await jazzRes.json();

          if (jazzData.success) {
            // Create and submit form to JazzCash
            const form = document.createElement("form");
            form.method = "POST";
            form.action = jazzData.data.paymentUrl;

            Object.entries(jazzData.data.postData).forEach(([key, value]) => {
              const input = document.createElement("input");
              input.type = "hidden";
              input.name = key;
              input.value = value as string;
              form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
            return;
          } else {
            setError(jazzData.error || "Failed to initiate JazzCash payment");
            setSubmitting(false);
            return;
          }
        }

        // For COD and other methods, send confirmation email
        await fetch("/api/notifications/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderId,
            customerEmail: formData.customerEmail,
            customerName: formData.customerName,
            productName: sale.title,
            totalAmount,
            paymentMethod,
          }),
        });

        setOrderSuccess(data.data);
      } else {
        setError(data.error || "Failed to place order");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="loader"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <>
        <div className="checkout-success">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h1>Order Placed Successfully!</h1>
            <p className="order-id">
              Order ID: <strong>{orderSuccess.orderId}</strong>
            </p>
            <p>
              Thank you for your order. You will receive a confirmation email
              shortly.
            </p>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <p>
                <strong>Product:</strong> {sale?.title}
              </p>
              <p>
                <strong>Quantity:</strong> {quantity}
              </p>
              <p>
                <strong>Total:</strong> Rs. {totalAmount.toLocaleString()}
              </p>
              <p>
                <strong>Payment:</strong>{" "}
                {paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : paymentMethod.toUpperCase()}
              </p>
            </div>

            <div className="actions">
              <Link href="/" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          .checkout-success {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            background: var(--bg-light);
          }

          .success-card {
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
            margin-bottom: 0.5rem;
          }

          .order-id {
            font-size: 1.125rem;
            margin-bottom: 1rem;
          }

          .order-summary {
            background: var(--bg-light);
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            margin: 2rem 0;
            text-align: left;
          }

          .order-summary h3 {
            margin: 0 0 1rem;
          }

          .order-summary p {
            margin: 0.5rem 0;
          }

          .actions {
            margin-top: 1.5rem;
          }
        `}</style>
      </>
    );
  }

  if (error && !sale) {
    return (
      <div className="checkout-error">
        <h1>Error</h1>
        <p>{error}</p>
        <Link href="/">Go Back Home</Link>
      </div>
    );
  }

  return (
    <>
      <div className="checkout-page">
        <div className="checkout-container">
          <Link href="/" className="back-link">
            ← Back to Shopping
          </Link>

          <h1>Checkout</h1>

          <div className="checkout-grid">
            {/* Order Summary */}
            <div className="order-card">
              <h2>Order Summary</h2>
              <div className="product-preview">
                <img src={sale?.image} alt={sale?.title} />
                <div className="product-info">
                  <h3>{sale?.title}</h3>
                  <span className="brand">{sale?.brandName}</span>
                  <span className="discount">
                    -{sale?.discountPercentage}% OFF
                  </span>
                </div>
              </div>

              <div className="quantity-row">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              <div className="price-breakdown">
                <div className="price-row">
                  <span>Unit Price</span>
                  <span>Rs. {unitPrice.toLocaleString()}</span>
                </div>
                <div className="price-row">
                  <span>Quantity</span>
                  <span>x {quantity}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="checkout-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-section">
                <h2>📦 Delivery Information</h2>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerEmail: e.target.value,
                        })
                      }
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerPhone: e.target.value,
                        })
                      }
                      placeholder="03XX-XXXXXXX"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Delivery Address *</label>
                  <textarea
                    value={formData.customerAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerAddress: e.target.value,
                      })
                    }
                    placeholder="Complete delivery address"
                    rows={2}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <select
                    value={formData.customerCity}
                    onChange={(e) =>
                      setFormData({ ...formData, customerCity: e.target.value })
                    }
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Order Notes (optional)</label>
                  <textarea
                    value={formData.customerNotes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerNotes: e.target.value,
                      })
                    }
                    placeholder="Any special instructions..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>💳 Payment Method</h2>

                <div className="payment-options">
                  <label
                    className={`payment-option ${
                      paymentMethod === "cod" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <span className="option-icon">💵</span>
                    <div className="option-info">
                      <span className="option-title">Cash on Delivery</span>
                      <span className="option-desc">Pay when you receive</span>
                    </div>
                  </label>

                  <label
                    className={`payment-option ${
                      paymentMethod === "jazzcash" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="jazzcash"
                      checked={paymentMethod === "jazzcash"}
                      onChange={() => setPaymentMethod("jazzcash")}
                    />
                    <span className="option-icon">📱</span>
                    <div className="option-info">
                      <span className="option-title">JazzCash</span>
                      <span className="option-desc">Mobile wallet payment</span>
                    </div>
                  </label>

                  <label
                    className={`payment-option ${
                      paymentMethod === "easypaisa" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="easypaisa"
                      checked={paymentMethod === "easypaisa"}
                      onChange={() => setPaymentMethod("easypaisa")}
                    />
                    <span className="option-icon" style={{ color: "#4CAF50" }}>
                      📲
                    </span>
                    <div className="option-info">
                      <span className="option-title">Easypaisa</span>
                      <span className="option-desc">Mobile wallet payment</span>
                    </div>
                  </label>

                  <label
                    className={`payment-option ${
                      paymentMethod === "card" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <span className="option-icon">💳</span>
                    <div className="option-info">
                      <span className="option-title">Credit/Debit Card</span>
                      <span className="option-desc">
                        Visa, Mastercard (via PayFast)
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
              >
                {submitting
                  ? "Placing Order..."
                  : `Place Order - Rs. ${totalAmount.toLocaleString()}`}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          padding: 2rem;
          background: var(--bg-light);
        }

        .checkout-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .loader {
          width: 50px;
          height: 50px;
          border: 4px solid var(--border-color);
          border-top-color: var(--primary-purple);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .checkout-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-block;
          color: var(--text-secondary);
          text-decoration: none;
          margin-bottom: 1rem;
        }

        .back-link:hover {
          color: var(--primary-purple);
        }

        h1 {
          margin-bottom: 2rem;
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 2rem;
        }

        .order-card,
        .checkout-form {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          padding: 1.5rem;
        }

        .order-card h2,
        .form-section h2 {
          font-size: 1.125rem;
          margin: 0 0 1.5rem;
        }

        .product-preview {
          display: flex;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1rem;
        }

        .product-preview img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: var(--radius-md);
        }

        .product-info h3 {
          font-size: 1rem;
          margin: 0 0 0.25rem;
        }

        .product-info .brand {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .discount {
          display: inline-block;
          background: var(--primary-gradient);
          color: white;
          padding: 0.125rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.625rem;
          font-weight: 700;
          margin-top: 0.5rem;
        }

        .quantity-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .quantity-controls button {
          width: 32px;
          height: 32px;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-md);
          background: white;
          cursor: pointer;
          font-weight: 700;
        }

        .quantity-controls button:hover {
          border-color: var(--primary-purple);
          color: var(--primary-purple);
        }

        .price-breakdown {
          border-top: 1px solid var(--border-color);
          padding-top: 1rem;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .price-row.total {
          font-size: 1.125rem;
          font-weight: 700;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-color);
          color: var(--primary-purple);
        }

        .checkout-form {
          height: fit-content;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          padding: 1rem;
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }

        .form-section {
          margin-bottom: 2rem;
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
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-purple);
        }

        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .payment-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .payment-option:hover,
        .payment-option.selected {
          border-color: var(--primary-purple);
        }

        .payment-option.selected {
          background: rgba(139, 92, 246, 0.05);
        }

        .payment-option input {
          display: none;
        }

        .option-icon {
          font-size: 1.5rem;
        }

        .option-info {
          display: flex;
          flex-direction: column;
        }

        .option-title {
          font-weight: 600;
        }

        .option-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .btn-lg {
          width: 100%;
          padding: 1rem;
          font-size: 1.125rem;
        }

        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
