"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  brandId: string;
  brandName: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  customerNotes?: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const updatePaymentStatus = async (
    orderId: string,
    paymentStatus: string
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });

      const data = await res.json();
      if (data.success) {
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, paymentStatus });
        }
      }
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesPayment =
      filterPayment === "all" || order.paymentMethod === filterPayment;
    return matchesStatus && matchesPayment;
  });

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "#F59E0B",
      confirmed: "#3B82F6",
      processing: "#8B5CF6",
      shipped: "#06B6D4",
      delivered: "#10B981",
      cancelled: "#EF4444",
    };
    return colors[status] || "#6B7280";
  };

  const getPaymentBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "#F59E0B",
      paid: "#10B981",
      failed: "#EF4444",
    };
    return colors[status] || "#6B7280";
  };

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1>Orders Management</h1>
            <p>View and manage all customer orders</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-card pending">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card confirmed">
            <span className="stat-value">{stats.confirmed}</span>
            <span className="stat-label">Confirmed</span>
          </div>
          <div className="stat-card delivered">
            <span className="stat-value">{stats.delivered}</span>
            <span className="stat-label">Delivered</span>
          </div>
          <div className="stat-card revenue">
            <span className="stat-value">
              Rs. {stats.revenue.toLocaleString()}
            </span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="cod">Cash on Delivery</option>
            <option value="jazzcash">JazzCash</option>
            <option value="easypaisa">Easypaisa</option>
            <option value="card">Card</option>
          </select>
        </div>

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="order-id">{order.orderId}</td>
                    <td>
                      <div className="customer-info">
                        <span className="name">{order.customerName}</span>
                        <span className="phone">{order.customerPhone}</span>
                      </div>
                    </td>
                    <td>
                      <div className="product-info">
                        <span>{order.productName}</span>
                        <span className="qty">x{order.quantity}</span>
                      </div>
                    </td>
                    <td>{order.brandName}</td>
                    <td className="amount">
                      Rs. {order.totalAmount.toLocaleString()}
                    </td>
                    <td>
                      <div className="payment-info">
                        <span className="method">
                          {order.paymentMethod.toUpperCase()}
                        </span>
                        <span
                          className="payment-badge"
                          style={{
                            background: getPaymentBadge(order.paymentStatus),
                          }}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ background: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <span className="icon">📦</span>
            <h3>No orders yet</h3>
            <p>Orders from customers will appear here</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order #{selectedOrder.orderId}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-section">
                  <h3>Customer Information</h3>
                  <p>
                    <strong>Name:</strong> {selectedOrder.customerName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.customerEmail}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.customerPhone}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedOrder.customerAddress}
                  </p>
                  <p>
                    <strong>City:</strong> {selectedOrder.customerCity}
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Order Details</h3>
                  <p>
                    <strong>Product:</strong> {selectedOrder.productName}
                  </p>
                  <p>
                    <strong>Brand:</strong> {selectedOrder.brandName}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {selectedOrder.quantity}
                  </p>
                  <p>
                    <strong>Unit Price:</strong> Rs.{" "}
                    {selectedOrder.unitPrice.toLocaleString()}
                  </p>
                  <p>
                    <strong>Total:</strong> Rs.{" "}
                    {selectedOrder.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="detail-section">
                <h3>Payment Information</h3>
                <p>
                  <strong>Method:</strong>{" "}
                  {selectedOrder.paymentMethod.toUpperCase()}
                </p>
                <p>
                  <strong>Status:</strong>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) =>
                      updatePaymentStatus(selectedOrder._id, e.target.value)
                    }
                    className="inline-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </p>
              </div>

              {selectedOrder.customerNotes && (
                <div className="detail-section">
                  <h3>Customer Notes</h3>
                  <p>{selectedOrder.customerNotes}</p>
                </div>
              )}

              <div className="detail-section">
                <h3>Update Order Status</h3>
                <div className="status-buttons">
                  {[
                    "pending",
                    "confirmed",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      className={`status-btn ${
                        selectedOrder.status === status ? "active" : ""
                      }`}
                      style={{
                        borderColor: getStatusColor(status),
                        color:
                          selectedOrder.status === status
                            ? "white"
                            : getStatusColor(status),
                        background:
                          selectedOrder.status === status
                            ? getStatusColor(status)
                            : "transparent",
                      }}
                      onClick={() =>
                        updateOrderStatus(selectedOrder._id, status)
                      }
                      disabled={selectedOrder.status === status}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-page {
          padding: 2rem;
        }

        .loading {
          text-align: center;
          padding: 4rem;
          color: var(--text-secondary);
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
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: white;
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          text-align: center;
        }

        .stat-card.pending {
          border-left: 4px solid #f59e0b;
        }
        .stat-card.confirmed {
          border-left: 4px solid #3b82f6;
        }
        .stat-card.delivered {
          border-left: 4px solid #10b981;
        }
        .stat-card.revenue {
          border-left: 4px solid #8b5cf6;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .filters-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .filters-bar select {
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          background: white;
        }

        .table-wrapper {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .data-table th {
          background: var(--bg-light);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .order-id {
          font-weight: 600;
          color: var(--primary-purple);
        }

        .customer-info,
        .product-info,
        .payment-info {
          display: flex;
          flex-direction: column;
        }

        .customer-info .name,
        .product-info span:first-child {
          font-weight: 500;
        }

        .customer-info .phone,
        .product-info .qty,
        .payment-info .method {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .amount {
          font-weight: 600;
          color: #10b981;
        }

        .payment-badge,
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.625rem;
          font-weight: 600;
          color: white;
          text-transform: capitalize;
        }

        .date {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
        }

        .no-data {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
        }

        .no-data .icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .no-data h3 {
          margin-bottom: 0.5rem;
        }

        .no-data p {
          color: var(--text-secondary);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal {
          background: white;
          border-radius: var(--radius-xl);
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-header h2 {
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-muted);
        }

        .modal-body {
          padding: 1.5rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .detail-section {
          margin-bottom: 1.5rem;
        }

        .detail-section h3 {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .detail-section p {
          margin: 0.5rem 0;
          font-size: 0.875rem;
        }

        .inline-select {
          margin-left: 0.5rem;
          padding: 0.25rem 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }

        .status-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .status-btn {
          padding: 0.5rem 1rem;
          border: 2px solid;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
          transition: all var(--transition-fast);
        }

        .status-btn:disabled {
          cursor: not-allowed;
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .table-wrapper {
            overflow-x: auto;
          }

          .data-table {
            min-width: 900px;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
