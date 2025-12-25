"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface Sale {
  _id: string;
  title: string;
  brandName: string;
  category: string;
  discountPercentage: number;
  originalPrice?: number;
  salePrice?: number;
  image: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isFeatured: boolean;
  link: string;
  views: number;
}

export default function BrandSalesPage() {
  const { data: session } = useSession();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    discountPercentage: "",
    originalPrice: "",
    salePrice: "",
    image: "",
    startDate: "",
    endDate: "",
    link: "",
    isActive: true,
    isFeatured: false,
  });

  const brandId = (session?.user as any)?.brandId;
  const brandName = session?.user?.name || "";

  const categories = [
    "Fashion",
    "Electronics",
    "Beauty",
    "Food & Beverages",
    "Home & Living",
    "Sports & Fitness",
    "Health",
    "Jewelry & Watches",
  ];

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Handle image file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("type", "sales");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, image: data.data.url });
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    if (brandId) {
      fetchSales();
    }
  }, [brandId]);

  const fetchSales = async () => {
    try {
      const res = await fetch(`/api/sales?brandId=${brandId}`);
      const data = await res.json();
      if (data.success) {
        setSales(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingSale(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      discountPercentage: "",
      originalPrice: "",
      salePrice: "",
      image: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      link: "",
      isActive: true,
      isFeatured: false,
    });
    setShowModal(true);
  };

  const openEditModal = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      title: sale.title,
      description: "",
      category: sale.category,
      discountPercentage: sale.discountPercentage.toString(),
      originalPrice: sale.originalPrice?.toString() || "",
      salePrice: sale.salePrice?.toString() || "",
      image: sale.image,
      startDate: new Date(sale.startDate).toISOString().split("T")[0],
      endDate: new Date(sale.endDate).toISOString().split("T")[0],
      link: sale.link,
      isActive: sale.isActive,
      isFeatured: sale.isFeatured,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingSale ? `/api/sales/${editingSale._id}` : "/api/sales";
      const method = editingSale ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          brandId,
          brandName,
          discountPercentage: parseInt(formData.discountPercentage),
          originalPrice: formData.originalPrice
            ? parseFloat(formData.originalPrice)
            : undefined,
          salePrice: formData.salePrice
            ? parseFloat(formData.salePrice)
            : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchSales();
        setShowModal(false);
      } else {
        alert(data.error || "Failed to save sale");
      }
    } catch (error) {
      console.error("Error saving sale:", error);
      alert("Failed to save sale");
    }
  };

  const toggleSaleStatus = async (sale: Sale) => {
    try {
      const res = await fetch(`/api/sales/${sale._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !sale.isActive }),
      });

      const data = await res.json();
      if (data.success) {
        fetchSales();
      }
    } catch (error) {
      console.error("Error toggling sale:", error);
    }
  };

  const deleteSale = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;

    try {
      const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchSales();
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading sales...</div>;
  }

  return (
    <>
      <div className="sales-page">
        <div className="page-header">
          <div>
            <h1>My Sales</h1>
            <p>Manage your brand's sales and promotional offers</p>
          </div>
          <button onClick={openAddModal} className="btn btn-primary">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Sale
          </button>
        </div>

        {/* Sales Grid */}
        {sales.length > 0 ? (
          <div className="sales-grid">
            {sales.map((sale) => (
              <div
                key={sale._id}
                className={`sale-card ${!sale.isActive ? "inactive" : ""}`}
              >
                <div className="sale-image">
                  <img src={sale.image} alt={sale.title} />
                  <span className="discount-badge">
                    -{sale.discountPercentage}%
                  </span>
                  {!sale.isActive && (
                    <span className="status-badge inactive">Inactive</span>
                  )}
                  {sale.isFeatured && (
                    <span className="status-badge featured">Featured</span>
                  )}
                </div>
                <div className="sale-content">
                  <h3>{sale.title}</h3>
                  <span className="category">{sale.category}</span>
                  <div className="prices">
                    {sale.originalPrice && (
                      <span className="original">
                        Rs. {sale.originalPrice.toLocaleString()}
                      </span>
                    )}
                    {sale.salePrice && (
                      <span className="sale">
                        Rs. {sale.salePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="sale-stats">
                    <span>👁️ {sale.views} views</span>
                    <span>
                      📅 Ends: {new Date(sale.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="sale-actions">
                  <button
                    onClick={() => toggleSaleStatus(sale)}
                    className="btn btn-sm"
                  >
                    {sale.isActive ? "⏸️ Pause" : "▶️ Activate"}
                  </button>
                  <button
                    onClick={() => openEditModal(sale)}
                    className="btn btn-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteSale(sale._id)}
                    className="btn btn-sm btn-danger"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-sales">
            <span className="icon">🏷️</span>
            <h3>No sales yet</h3>
            <p>Create your first sale to attract more customers!</p>
            <button onClick={openAddModal} className="btn btn-primary">
              Add New Sale
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSale ? "Edit Sale" : "Add New Sale"}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Sale Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Summer Sale - Up to 50% Off"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Discount Percentage *</label>
                  <input
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPercentage: e.target.value,
                      })
                    }
                    placeholder="e.g., 50"
                    min="1"
                    max="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Original Price</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value,
                      })
                    }
                    placeholder="e.g., 5000"
                  />
                </div>

                <div className="form-group">
                  <label>Sale Price</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, salePrice: e.target.value })
                    }
                    placeholder="e.g., 2500"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Sale Image *</label>
                  <div className="image-upload-area">
                    {formData.image && (
                      <div className="image-preview">
                        <img src={formData.image} alt="Preview" />
                      </div>
                    )}
                    <input
                      type="file"
                      ref={imageInputRef}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary upload-btn"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage
                        ? "Uploading..."
                        : formData.image
                        ? "Change Image"
                        : "Upload Image"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Sale Link *</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    placeholder="https://yourbrand.com/sale"
                    required
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSale ? "Update Sale" : "Create Sale"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .sales-page {
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
          margin-bottom: 2rem;
        }

        .page-header h1 {
          margin-bottom: 0.25rem;
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .sales-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .sale-card {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          transition: transform var(--transition-fast);
        }

        .sale-card:hover {
          transform: translateY(-4px);
        }

        .sale-card.inactive {
          opacity: 0.7;
        }

        .sale-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .sale-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .discount-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: var(--primary-gradient);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 700;
        }

        .status-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.inactive {
          background: rgba(0, 0, 0, 0.7);
          color: white;
        }

        .status-badge.featured {
          background: #f59e0b;
          color: white;
          top: auto;
          bottom: 1rem;
        }

        .sale-content {
          padding: 1.25rem;
        }

        .sale-content h3 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
        }

        .category {
          display: inline-block;
          background: var(--bg-light);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }

        .prices {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .prices .original {
          text-decoration: line-through;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .prices .sale {
          color: #10b981;
          font-weight: 700;
        }

        .sale-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .sale-actions {
          display: flex;
          gap: 0.5rem;
          padding: 0 1.25rem 1.25rem;
        }

        .btn-sm {
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
        }

        .btn-danger {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .no-sales {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
        }

        .no-sales .icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .no-sales h3 {
          margin-bottom: 0.5rem;
        }

        .no-sales p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
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
          max-width: 600px;
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

        form {
          padding: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--primary-purple);
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-group input {
          width: auto;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
        }

        @media (max-width: 640px) {
          .page-header {
            flex-direction: column;
            gap: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full-width {
            grid-column: auto;
          }
        }
      `}</style>
    </>
  );
}
