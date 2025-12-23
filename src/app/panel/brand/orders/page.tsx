"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
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

export default function BrandOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const brandId = (session?.user as any)?.brandId;

  useEffect(() => {
    if (brandId) {
      fetchOrders();
    }
  }, [brandId]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?brandId=${brandId}`);
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

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
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

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <>
      <div className="orders-page">
        <div className="page-header">
          <div>
            <h1>Orders</h1>
            <p>View and manage orders from customers</p>
          </div>
          <div className="order-stats">
            <span className="stat">📦 {orders.length} Total</span>
            <span className="stat pending">
              ⏳ {orders.filter((o) => o.status === "pending").length} Pending
            </span>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-bar">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
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
                    <td className="amount">
                      Rs. {order.totalAmount.toLocaleString()}
                    </td>
                    <td>
                      <span
                        className="payment-badge"
                        style={{
                          background: getPaymentBadge(order.paymentStatus),
                        }}
                      >
                        {order.paymentStatus}
                      </span>
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
          <div className="no-orders">
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
              <div className="order-detail-grid">
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
                  <p>
                    <strong>Payment:</strong>{" "}
                    {selectedOrder.paymentMethod.toUpperCase()}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>
                    <span
                      className="payment-badge inline"
                      style={{
                        background: getPaymentBadge(
                          selectedOrder.paymentStatus
                        ),
                      }}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>

              {selectedOrder.customerNotes && (
                <div className="detail-section">
                  <h3>Customer Notes</h3>
                  <p>{selectedOrder.customerNotes}</p>
                </div>
              )}

              <div className="detail-section">
                <h3>Update Status</h3>
                <div className="status-buttons">
                  {[
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
        .orders-page {
          max-width: 1200px;
        }

        .loading {
          text-align: center;
          padding: 4rem;
          color: var(--text-secondary);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .page-header h1 {
          margin-bottom: 0.25rem;
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .order-stats {
          display: flex;
          gap: 1rem;
        }

        .stat {
          background: white;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-lg);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .stat.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        .filter-bar {
          margin-bottom: 1.5rem;
        }

        .filter-bar select {
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          background: white;
          font-size: 0.875rem;
        }

        .orders-table-wrapper {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table th,
        .orders-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .orders-table th {
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
        .product-info {
          display: flex;
          flex-direction: column;
        }

        .customer-info .name,
        .product-info span:first-child {
          font-weight: 500;
        }

        .customer-info .phone,
        .product-info .qty {
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

        .payment-badge.inline {
          margin-left: 0.5rem;
        }

        .date {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
        }

        .no-orders {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
        }

        .no-orders .icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .no-orders h3 {
          margin-bottom: 0.5rem;
        }

        .no-orders p {
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

        .order-detail-grid {
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

        .status-btn:hover:not(:disabled) {
          opacity: 0.8;
        }

        .status-btn:disabled {
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .orders-table-wrapper {
            overflow-x: auto;
          }

          .orders-table {
            min-width: 800px;
          }

          .order-detail-grid {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}
