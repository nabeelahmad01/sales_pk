"use client";

import React, { useState, useEffect, useRef } from "react";

interface Sale {
  _id: string;
  title: string;
  description: string;
  brandId: string;
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
  affiliateUrl?: string;
  views: number;
  savesCount: number;
  createdAt: string;
}

interface Brand {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

const CATEGORIES = [
  "Fashion",
  "Electronics",
  "Food & Dining",
  "Beauty & Health",
  "Home & Living",
  "Sports & Fitness",
  "Travel",
  "Entertainment",
  "Education",
  "Other",
];

export default function AdminSalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    brandId: "",
    brandName: "",
    category: "",
    discountPercentage: 0,
    originalPrice: 0,
    salePrice: 0,
    image: "",
    startDate: "",
    endDate: "",
    isActive: true,
    isFeatured: false,
    link: "",
    affiliateUrl: "",
  });

  // Fetch sales and brands
  useEffect(() => {
    fetchSales();
    fetchBrands();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch("/api/sales");
      const data = await res.json();
      if (data.success) {
        setSales(data.data);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/brands?all=true");
      const data = await res.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // Filter sales
  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.brandName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = filterBrand === "all" || sale.brandId === filterBrand;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && sale.isActive) ||
      (filterStatus === "inactive" && !sale.isActive) ||
      (filterStatus === "featured" && sale.isFeatured);
    return matchesSearch && matchesBrand && matchesStatus;
  });

  const handleBrandChange = (brandId: string) => {
    const selectedBrand = brands.find((b) => b._id === brandId);
    if (selectedBrand) {
      setFormData({
        ...formData,
        brandId: brandId,
        brandName: selectedBrand.name,
        category: selectedBrand.category || formData.category,
      });
    } else {
      setFormData({ ...formData, brandId: "", brandName: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingSale ? `/api/sales/${editingSale._id}` : "/api/sales";
      const method = editingSale ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          discountPercentage: Number(formData.discountPercentage),
          originalPrice: formData.originalPrice
            ? Number(formData.originalPrice)
            : undefined,
          salePrice: formData.salePrice
            ? Number(formData.salePrice)
            : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchSales();
        closeModal();
      } else {
        alert(data.error || "Failed to save sale");
      }
    } catch (error) {
      console.error("Error saving sale:", error);
      alert("Failed to save sale");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;

    try {
      const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchSales();
      } else {
        alert(data.error || "Failed to delete sale");
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      alert("Failed to delete sale");
    }
  };

  const toggleFeatured = async (sale: Sale) => {
    try {
      const res = await fetch(`/api/sales/${sale._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !sale.isFeatured }),
      });
      const data = await res.json();
      if (data.success) {
        fetchSales();
      }
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };

  const toggleActive = async (sale: Sale) => {
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
      console.error("Error updating sale:", error);
    }
  };

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

  const openAddModal = () => {
    setEditingSale(null);
    const today = new Date().toISOString().split("T")[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    setFormData({
      title: "",
      description: "",
      brandId: "",
      brandName: "",
      category: "",
      discountPercentage: 0,
      originalPrice: 0,
      salePrice: 0,
      image: "",
      startDate: today,
      endDate: nextWeek,
      isActive: true,
      isFeatured: false,
      link: "",
      affiliateUrl: "",
    });
    setShowModal(true);
  };

  const openEditModal = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      title: sale.title,
      description: sale.description,
      brandId: sale.brandId,
      brandName: sale.brandName,
      category: sale.category,
      discountPercentage: sale.discountPercentage,
      originalPrice: sale.originalPrice || 0,
      salePrice: sale.salePrice || 0,
      image: sale.image,
      startDate: new Date(sale.startDate).toISOString().split("T")[0],
      endDate: new Date(sale.endDate).toISOString().split("T")[0],
      isActive: sale.isActive,
      isFeatured: sale.isFeatured,
      link: sale.link,
      affiliateUrl: sale.affiliateUrl || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSale(null);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading sales...</div>
        <style jsx>{`
          .admin-page {
            max-width: 1400px;
          }
          .loading {
            text-align: center;
            padding: 4rem;
            color: var(--text-secondary);
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Manage Sales</h1>
            <p>Add, edit, or remove sales from your platform</p>
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

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-value">{sales.length}</span>
            <span className="stat-label">Total Sales</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {sales.filter((s) => s.isActive).length}
            </span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {sales.filter((s) => s.isFeatured).length}
            </span>
            <span className="stat-label">Featured</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {sales.reduce((acc, s) => acc + (s.views || 0), 0)}
            </span>
            <span className="stat-label">Total Views</span>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search sales..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Brands</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="featured">Featured</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="results-count">
          Showing <strong>{filteredSales.length}</strong> of{" "}
          <strong>{sales.length}</strong> sales
        </div>

        {/* Sales Table */}
        <div className="table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Sale</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Discount</th>
                <th>Status</th>
                <th>End Date</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale._id}>
                  <td>
                    <div className="sale-info">
                      <img
                        src={sale.image}
                        alt={sale.title}
                        className="sale-thumb"
                      />
                      <div className="sale-details">
                        <span className="sale-title">{sale.title}</span>
                        {sale.isFeatured && (
                          <span className="featured-tag">🔥 Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{sale.brandName}</td>
                  <td>
                    <span className="category-tag">{sale.category}</span>
                  </td>
                  <td>
                    <span className="discount-badge">
                      {sale.discountPercentage}%
                    </span>
                  </td>
                  <td>
                    <button
                      className={`status-badge ${
                        sale.isActive ? "active" : "inactive"
                      }`}
                      onClick={() => toggleActive(sale)}
                      title="Click to toggle"
                    >
                      {sale.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>{new Date(sale.endDate).toLocaleDateString()}</td>
                  <td>{sale.views || 0}</td>
                  <td>
                    <div className="actions">
                      <button
                        className={`action-btn star ${
                          sale.isFeatured ? "featured" : ""
                        }`}
                        title={
                          sale.isFeatured
                            ? "Remove from featured"
                            : "Add to featured"
                        }
                        onClick={() => toggleFeatured(sale)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={sale.isFeatured ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                      <button
                        className="action-btn edit"
                        title="Edit"
                        onClick={() => openEditModal(sale)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className="action-btn view"
                        title="View"
                        onClick={() =>
                          window.open(`/sales/${sale._id}`, "_blank")
                        }
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button
                        className="action-btn delete"
                        title="Delete"
                        onClick={() => handleDelete(sale._id)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <h3>No sales found</h3>
            <p>Try adjusting your filters or add a new sale</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSale ? "Edit Sale" : "Add New Sale"}</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Sale Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="e.g., Flat 50% Off Winter Collection"
                  />
                </div>
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Brand *</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    required
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
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
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row three-col">
                <div className="form-group">
                  <label>Discount % *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPercentage: Number(e.target.value),
                      })
                    }
                    required
                    placeholder="50"
                  />
                </div>
                <div className="form-group">
                  <label>Original Price (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.originalPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    placeholder="5000"
                  />
                </div>
                <div className="form-group">
                  <label>Sale Price (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.salePrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salePrice: Number(e.target.value),
                      })
                    }
                    placeholder="2500"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  placeholder="Describe the sale offer..."
                  rows={3}
                />
              </div>

              <div className="form-group">
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

              <div className="form-row two-col">
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
              </div>

              <div className="form-group">
                <label>Sale Link *</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  required
                  placeholder="https://brand.com/sale"
                />
              </div>

              <div className="form-group">
                <label>Affiliate URL (Optional)</label>
                <input
                  type="url"
                  value={formData.affiliateUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, affiliateUrl: e.target.value })
                  }
                  placeholder="https://affiliate-link.com/..."
                />
              </div>

              <div className="form-row two-col">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                    />
                    Sale is Active
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFeatured: e.target.checked,
                        })
                      }
                    />
                    🔥 Featured Sale
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingSale
                    ? "Update Sale"
                    : "Add Sale"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-page {
          max-width: 1400px;
        }

        .loading {
          text-align: center;
          padding: 4rem;
          color: var(--text-secondary);
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          margin-bottom: 0.25rem;
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .filters-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-lg);
          border: 2px solid var(--border-color);
          flex: 1;
          max-width: 400px;
        }

        .search-box svg {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .search-box input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.875rem;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          background: white;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .results-count {
          margin-bottom: 1rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .table-card {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 1rem 1.25rem;
          text-align: left;
        }

        .table th {
          background: var(--bg-light);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }

        .table tr:not(:last-child) td {
          border-bottom: 1px solid var(--border-color);
        }

        .table tr:hover td {
          background: rgba(139, 92, 246, 0.02);
        }

        .sale-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sale-thumb {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .sale-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sale-title {
          font-weight: 500;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .featured-tag {
          font-size: 0.625rem;
          color: var(--accent-orange);
          font-weight: 600;
        }

        .category-tag {
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary-purple);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .discount-badge {
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .status-badge.active {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .status-badge.active:hover {
          background: rgba(16, 185, 129, 0.2);
        }

        .status-badge.inactive {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .status-badge.inactive:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .action-btn.star {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        .action-btn.star:hover,
        .action-btn.star.featured {
          background: #f59e0b;
          color: white;
        }

        .action-btn.edit {
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary-purple);
        }

        .action-btn.edit:hover {
          background: var(--primary-purple);
          color: white;
        }

        .action-btn.view {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .action-btn.view:hover {
          background: #10b981;
          color: white;
        }

        .action-btn.delete {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .action-btn.delete:hover {
          background: #ef4444;
          color: white;
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: var(--radius-xl);
          margin-top: 1rem;
        }

        .no-results-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        .no-results h3 {
          margin-bottom: 0.5rem;
        }

        .no-results p {
          color: var(--text-secondary);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
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
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          background: white;
          z-index: 1;
        }

        .modal-header h2 {
          font-size: 1.25rem;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-muted);
          padding: 0;
          line-height: 1;
        }

        .modal-close:hover {
          color: var(--text-primary);
        }

        .modal form {
          padding: 1.5rem;
        }

        .form-row {
          margin-bottom: 1rem;
        }

        .form-row.two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-row.three-col {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .form-group input[type="text"],
        .form-group input[type="url"],
        .form-group input[type="number"],
        .form-group input[type="date"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          transition: border-color var(--transition-fast);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-purple);
        }

        .image-preview {
          margin-top: 0.5rem;
          border-radius: var(--radius-md);
          overflow: hidden;
          max-width: 200px;
        }

        .image-preview img {
          width: 100%;
          height: auto;
          display: block;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .btn-secondary {
          background: var(--bg-light);
          color: var(--text-primary);
          border: 2px solid var(--border-color);
        }

        .btn-secondary:hover {
          background: var(--border-color);
        }

        @media (max-width: 1024px) {
          .table-card {
            overflow-x: auto;
          }

          .table {
            min-width: 900px;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
          }

          .page-header .btn {
            width: 100%;
            justify-content: center;
          }

          .filters-bar {
            flex-direction: column;
          }

          .search-box {
            max-width: none;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .form-row.two-col,
          .form-row.three-col {
            grid-template-columns: 1fr;
          }

          .modal {
            margin: 0.5rem;
            max-height: calc(100vh - 1rem);
          }

          .modal form {
            padding: 1rem;
          }

          .modal-header {
            padding: 1rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .filter-select {
            width: 100%;
          }

          .stats-row {
            grid-template-columns: 1fr 1fr;
          }

          .stat-card {
            padding: 1rem;
          }

          .stat-value {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}
