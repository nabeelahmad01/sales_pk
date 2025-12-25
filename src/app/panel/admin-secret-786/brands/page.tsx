"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  website: string;
  category: string;
  isActive: boolean;
  status?: "pending" | "approved" | "rejected";
  email?: string;
  contactPhone?: string;
  contactPerson?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
    website: "",
    category: "",
    isActive: true,
  });

  // Excel Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [importError, setImportError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Fetch brands
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/brands?all=true");
      const data = await res.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle CSV/Excel file import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError("");
    setImportResult(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter((line) => line.trim());

        if (lines.length < 2) {
          setImportError("File must have header row and at least one data row");
          return;
        }

        // Parse header
        const headerLine = lines[0];
        const headers = headerLine
          .split(/[,;\t]/)
          .map((h) => h.trim().toLowerCase().replace(/"/g, ""));

        // Map common header variations
        const headerMap: { [key: string]: string } = {};
        headers.forEach((h, idx) => {
          if (h.includes("name") || h === "brand")
            headerMap["name"] = headers[idx];
          else if (h.includes("logo") || h.includes("image"))
            headerMap["logo"] = headers[idx];
          else if (h.includes("desc")) headerMap["description"] = headers[idx];
          else if (h.includes("web") || h.includes("url") || h.includes("site"))
            headerMap["website"] = headers[idx];
          else if (h.includes("cat") || h.includes("type"))
            headerMap["category"] = headers[idx];
          else if (h.includes("active") || h.includes("status"))
            headerMap["isActive"] = headers[idx];
          else if (h.includes("slug")) headerMap["slug"] = headers[idx];
        });

        // Check required headers
        if (
          !headers.includes("name") &&
          !headers.some((h) => h.includes("name"))
        ) {
          setImportError('CSV must have a "name" column');
          return;
        }

        // Parse data rows
        const parsedData: any[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i]
            .split(/[,;\t]/)
            .map((v) => v.trim().replace(/"/g, ""));
          const row: any = {};

          headers.forEach((header, idx) => {
            row[header] = values[idx] || "";
          });

          // Map to brand fields
          const brand: any = {
            name: row[headerMap["name"] || "name"] || row["brand"] || "",
            logo: row[headerMap["logo"] || "logo"] || row["image"] || "",
            description:
              row[headerMap["description"] || "description"] ||
              row["desc"] ||
              "",
            website:
              row[headerMap["website"] || "website"] ||
              row["url"] ||
              row["site"] ||
              "",
            category:
              row[headerMap["category"] || "category"] ||
              row["type"] ||
              "Other",
            slug: row[headerMap["slug"] || "slug"] || "",
            isActive:
              row[headerMap["isActive"] || "isactive"] !== "false" &&
              row[headerMap["isActive"] || "isactive"] !== "0",
          };

          if (brand.name) {
            parsedData.push(brand);
          }
        }

        if (parsedData.length === 0) {
          setImportError("No valid brand data found in file");
          return;
        }

        setImportData(parsedData);
        setShowImportModal(true);
      } catch (error) {
        setImportError("Error parsing file. Make sure it's a valid CSV file.");
      }
    };

    reader.onerror = () => {
      setImportError("Error reading file");
    };

    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit import to API
  const handleImportSubmit = async () => {
    if (importData.length === 0) return;

    setImporting(true);
    setImportResult(null);

    try {
      const res = await fetch("/api/brands/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brands: importData }),
      });

      const data = await res.json();
      setImportResult(data);

      if (data.success) {
        fetchBrands(); // Refresh brands list
      }
    } catch (error) {
      setImportResult({ success: false, error: "Failed to import brands" });
    } finally {
      setImporting(false);
    }
  };

  // Close import modal
  const closeImportModal = () => {
    setShowImportModal(false);
    setImportData([]);
    setImportError("");
    setImportResult(null);
  };

  // Get unique categories
  const categories = [...new Set(brands.map((brand) => brand.category))];

  // Filter brands
  const filteredBrands = brands.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || brand.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && brand.isActive) ||
      (filterStatus === "inactive" && !brand.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBrand
        ? `/api/brands/${editingBrand._id}`
        : "/api/brands";
      const method = editingBrand ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        fetchBrands();
        closeModal();
      } else {
        alert(data.error || "Failed to save brand");
      }
    } catch (error) {
      console.error("Error saving brand:", error);
      alert("Failed to save brand");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchBrands();
      } else {
        alert(data.error || "Failed to delete brand");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Failed to delete brand");
    }
  };

  // Approve pending brand
  const approveBrand = async (id: string) => {
    try {
      const res = await fetch(`/api/brands/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved", isActive: true }),
      });
      const data = await res.json();
      if (data.success) {
        fetchBrands();
      } else {
        alert(data.error || "Failed to approve brand");
      }
    } catch (error) {
      console.error("Error approving brand:", error);
      alert("Failed to approve brand");
    }
  };

  // Reject pending brand
  const rejectBrand = async (id: string) => {
    const reason = prompt("Reason for rejection (optional):");
    try {
      const res = await fetch(`/api/brands/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", rejectedReason: reason }),
      });
      const data = await res.json();
      if (data.success) {
        fetchBrands();
      } else {
        alert(data.error || "Failed to reject brand");
      }
    } catch (error) {
      console.error("Error rejecting brand:", error);
      alert("Failed to reject brand");
    }
  };

  // Handle logo file upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("type", "brands");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, logo: data.data.url });
      } else {
        alert(data.error || "Failed to upload logo");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  // Get pending brands count
  const pendingBrands = brands.filter((b) => b.status === "pending");

  const openAddModal = () => {
    setEditingBrand(null);
    setFormData({
      name: "",
      logo: "",
      description: "",
      website: "",
      category: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      logo: brand.logo,
      description: brand.description || "",
      website: brand.website || "",
      category: brand.category,
      isActive: brand.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBrand(null);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading brands...</div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Manage Brands</h1>
            <p>Add, edit, or remove brands from your platform</p>
          </div>
          <div className="header-actions">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,.txt"
              onChange={handleFileImport}
              style={{ display: "none" }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              Import CSV
            </button>
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
              Add Brand
            </button>
          </div>
        </div>

        {/* Import Error */}
        {importError && (
          <div className="import-error-banner">
            <span>⚠️ {importError}</span>
            <button onClick={() => setImportError("")}>✕</button>
          </div>
        )}

        {/* Pending Brands Section */}
        {pendingBrands.length > 0 && (
          <div className="pending-brands-section">
            <div className="pending-header">
              <h2>⏳ Pending Brand Registrations ({pendingBrands.length})</h2>
            </div>
            <div className="pending-list">
              {pendingBrands.map((brand) => (
                <div key={brand._id} className="pending-card">
                  <div className="pending-logo">
                    <img
                      src={brand.logo || "/images/placeholder-logo.png"}
                      alt={brand.name}
                    />
                  </div>
                  <div className="pending-info">
                    <h3>{brand.name}</h3>
                    <p className="pending-category">{brand.category}</p>
                    {brand.email && (
                      <p className="pending-email">📧 {brand.email}</p>
                    )}
                    {brand.contactPerson && (
                      <p className="pending-contact">
                        👤 {brand.contactPerson}{" "}
                        {brand.contactPhone && `• ${brand.contactPhone}`}
                      </p>
                    )}
                    {brand.website && (
                      <p className="pending-website">
                        🔗{" "}
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {brand.website}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="pending-actions">
                    <button
                      onClick={() => approveBrand(brand._id)}
                      className="btn btn-success"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => rejectBrand(brand._id)}
                      className="btn btn-danger"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
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
          </select>
        </div>

        {/* Results Count */}
        <div className="results-count">
          Showing <strong>{filteredBrands.length}</strong> of{" "}
          <strong>{brands.length}</strong> brands
        </div>

        {/* Brands Table */}
        <div className="table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Category</th>
                <th>Website</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((brand) => (
                <tr key={brand._id}>
                  <td>
                    <div className="brand-info">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="brand-logo"
                      />
                      <div className="brand-details">
                        <span className="brand-name">{brand.name}</span>
                        <span className="brand-slug">/{brand.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-tag">{brand.category}</span>
                  </td>
                  <td>
                    {brand.website ? (
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        {brand.website.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    ) : (
                      <span className="no-website">—</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        brand.isActive ? "active" : "inactive"
                      }`}
                    >
                      {brand.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="action-btn edit"
                        title="Edit"
                        onClick={() => openEditModal(brand)}
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
                          window.open(`/brands/${brand.slug}`, "_blank")
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
                        onClick={() => handleDelete(brand._id)}
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

        {filteredBrands.length === 0 && (
          <div className="no-results">
            <span className="no-results-icon">🏪</span>
            <h3>No brands found</h3>
            <p>Try adjusting your filters or add a new brand</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBrand ? "Edit Brand" : "Add New Brand"}</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Brand Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="e.g., Khaadi"
                />
              </div>
              <div className="form-group">
                <label>Logo *</label>
                <div className="logo-upload-area">
                  {formData.logo && (
                    <div className="logo-preview">
                      <img src={formData.logo} alt="Logo preview" />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleLogoUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary upload-btn"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                  >
                    {uploadingLogo
                      ? "Uploading..."
                      : formData.logo
                      ? "Change Logo"
                      : "Upload Logo"}
                  </button>
                  {formData.logo && (
                    <span className="logo-url-hint">{formData.logo}</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                  placeholder="e.g., Fashion, Electronics, Food"
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description about the brand..."
                  rows={3}
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
                  Brand is Active
                </label>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBrand ? "Update Brand" : "Add Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Preview Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={closeImportModal}>
          <div
            className="modal import-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>📥 Import Brands Preview</h2>
              <button className="modal-close" onClick={closeImportModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {importResult ? (
                <div
                  className={`import-result ${
                    importResult.success ? "success" : "error"
                  }`}
                >
                  <h3>
                    {importResult.success
                      ? "✓ Import Complete!"
                      : "✗ Import Failed"}
                  </h3>
                  <p>{importResult.message || importResult.error}</p>
                  {importResult.results && (
                    <div className="result-stats">
                      <span className="stat success">
                        ✓ {importResult.results.success} imported
                      </span>
                      <span className="stat failed">
                        ✗ {importResult.results.failed} failed
                      </span>
                    </div>
                  )}
                  {importResult.results?.errors?.length > 0 && (
                    <div className="error-list">
                      <h4>Errors:</h4>
                      <ul>
                        {importResult.results.errors
                          .slice(0, 5)
                          .map((err: string, idx: number) => (
                            <li key={idx}>{err}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                  <button
                    className="btn btn-primary"
                    onClick={closeImportModal}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="import-info">
                    <p>
                      Found <strong>{importData.length}</strong> brands to
                      import:
                    </p>
                  </div>

                  <div className="import-preview-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Logo</th>
                          <th>Website</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importData.slice(0, 10).map((brand, idx) => (
                          <tr key={idx}>
                            <td>{brand.name}</td>
                            <td>{brand.category}</td>
                            <td className="logo-cell">
                              {brand.logo ? (
                                <img
                                  src={brand.logo}
                                  alt={brand.name}
                                  onError={(e) =>
                                    ((
                                      e.target as HTMLImageElement
                                    ).style.display = "none")
                                  }
                                />
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="url-cell">{brand.website || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importData.length > 10 && (
                      <p className="more-rows">
                        ...and {importData.length - 10} more brands
                      </p>
                    )}
                  </div>

                  <div className="import-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={closeImportModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleImportSubmit}
                      disabled={importing}
                    >
                      {importing
                        ? "Importing..."
                        : `Import ${importData.length} Brands`}
                    </button>
                  </div>
                </>
              )}
            </div>
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

        .brand-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-logo {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          object-fit: contain;
          background: #f8f9fa;
          padding: 4px;
        }

        .brand-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .brand-name {
          font-weight: 600;
        }

        .brand-slug {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .category-tag {
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary-purple);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .website-link {
          color: var(--primary-purple);
          text-decoration: none;
          font-size: 0.875rem;
        }

        .website-link:hover {
          text-decoration: underline;
        }

        .no-website {
          color: var(--text-muted);
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .status-badge.inactive {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
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
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
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

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .form-group input[type="text"],
        .form-group input[type="url"],
        .form-group textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          transition: border-color var(--transition-fast);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-purple);
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
            min-width: 700px;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
          }

          .filters-bar {
            flex-direction: column;
          }

          .search-box {
            max-width: none;
          }

          .page-header h1 {
            font-size: 1.5rem;
          }

          .modal {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
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

          .no-results {
            padding: 2rem 1rem;
          }

          .no-results-icon {
            font-size: 2.5rem;
          }

          .results-count {
            font-size: 0.75rem;
          }
        }

        /* Import specific styles */
        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .import-error-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-lg);
          color: #dc2626;
          margin-bottom: 1rem;
        }

        .import-error-banner button {
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          font-size: 1.25rem;
        }

        .import-modal {
          max-width: 800px;
        }

        .import-info {
          padding: 1rem;
          background: rgba(139, 92, 246, 0.1);
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
        }

        .import-info p {
          margin: 0;
        }

        .import-preview-table {
          max-height: 400px;
          overflow-y: auto;
          margin-bottom: 1rem;
        }

        .import-preview-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .import-preview-table th,
        .import-preview-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .import-preview-table th {
          background: var(--bg-light);
          font-weight: 600;
          position: sticky;
          top: 0;
        }

        .import-preview-table .logo-cell img {
          width: 40px;
          height: 40px;
          object-fit: contain;
          border-radius: var(--radius-sm);
        }

        .import-preview-table .url-cell {
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .more-rows {
          text-align: center;
          color: var(--text-muted);
          padding: 1rem;
        }

        .import-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .import-result {
          text-align: center;
          padding: 2rem;
        }

        .import-result h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .import-result.success h3 {
          color: #059669;
        }

        .import-result.error h3 {
          color: #dc2626;
        }

        .result-stats {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin: 1.5rem 0;
        }

        .result-stats .stat {
          font-weight: 600;
        }

        .result-stats .stat.success {
          color: #059669;
        }

        .result-stats .stat.failed {
          color: #dc2626;
        }

        .error-list {
          text-align: left;
          background: rgba(239, 68, 68, 0.1);
          padding: 1rem;
          border-radius: var(--radius-lg);
          margin: 1rem 0;
        }

        .error-list h4 {
          margin: 0 0 0.5rem;
          color: #dc2626;
        }

        .error-list ul {
          margin: 0;
          padding-left: 1.25rem;
          font-size: 0.875rem;
        }

        /* Pending Brands Styles */
        .pending-brands-section {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 2px solid #f59e0b;
        }

        .pending-header h2 {
          margin: 0 0 1rem;
          font-size: 1.125rem;
        }

        .pending-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .pending-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem;
          background: #fffbeb;
          border-radius: var(--radius-lg);
          border: 1px solid #fde68a;
        }

        .pending-logo {
          width: 60px;
          height: 60px;
          flex-shrink: 0;
        }

        .pending-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: var(--radius-md);
        }

        .pending-info {
          flex: 1;
        }

        .pending-info h3 {
          margin: 0 0 0.25rem;
          font-size: 1rem;
        }

        .pending-info p {
          margin: 0.25rem 0;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .pending-info a {
          color: var(--primary-purple);
        }

        .pending-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-success {
          background: #059669;
          color: white;
        }

        .btn-success:hover {
          background: #047857;
        }

        .btn-danger {
          background: #dc2626;
          color: white;
        }

        .btn-danger:hover {
          background: #b91c1c;
        }
      `}</style>
    </>
  );
}
