"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ServiceData {
  id?: string;
  name: string;
  desc: string;
  image: string;
  category: string;
  badge: string;
  order: number;
  isActive: boolean;
}

export default function ServiceForm({
  initialData,
}: {
  initialData?: ServiceData;
}) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialData?.name || "");
  const [desc, setDesc] = useState(initialData?.desc || "");
  const [image, setImage] = useState(initialData?.image || "/assets/product-grocery.svg");
  const [category, setCategory] = useState(initialData?.category || "commodities");
  const [badge, setBadge] = useState(initialData?.badge || "Bulk Commodities");
  const [order, setOrder] = useState<number>(initialData?.order ?? 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    if (val === "commodities") setBadge("Bulk Commodities");
    if (val === "steel") setBadge("Steel & Metals");
    if (val === "agro") setBadge("Agriculture");
  };

  const handleFileUpload = async (file: File) => {
    setUploadError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setImage(data.url);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = "/api/services";
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        id: initialData?.id,
        name,
        desc,
        image,
        category,
        badge,
        order: Number(order),
        isActive,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save commodity");
      }

      router.push("/dashboard/services");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="add-form-container">
      {/* 1. Header Banner Card */}
      <div className="add-service-banner-card">
        <div className="add-service-banner-left">
          <div className="services-banner-tag">SERVICES &amp; PRODUCTS</div>
          <h1 className="services-banner-title">
            {isEditing ? "Edit Commodity / Service" : "Add New Commodity / Service"}
          </h1>
          <p className="services-banner-sub">
            Configure commodity title, category, description, publishing options, and preview image.
          </p>
        </div>

        <Link href="/dashboard/services" className="btn-back-services">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Services</span>
        </Link>

        {/* Decorative Isometric Layers */}
        <div className="services-banner-decor" aria-hidden="true">
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 18L140 48L80 78L20 48L80 18Z" fill="#FDA4AF" fillOpacity="0.45" />
            <path d="M80 50L140 80L80 110L20 80L80 50Z" fill="#FB7185" fillOpacity="0.55" />
            <path d="M80 82L140 112L80 142L20 112L80 82Z" fill="#E11D48" fillOpacity="0.65" />
          </svg>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            padding: "12px 18px",
            borderRadius: "10px",
            fontSize: "13.5px",
            fontWeight: 600,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 2. Top Row: 2 Cards (Basic Info & Visual/Media) */}
        <div className="add-form-two-col">
          {/* Card A: Basic Information */}
          <div className="form-section-card">
            <div className="form-card-header">
              <div className="form-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="form-card-title-group">
                <h3>Basic Information</h3>
                <p>Provide the key details about this commodity or service.</p>
              </div>
            </div>

            <div className="form-fields-stack">
              {/* Commodity / Service Name */}
              <div className="form-field-group">
                <label className="form-field-label">
                  <span>Commodity / Service Name</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  className="form-text-input"
                  placeholder="e.g. Premium Basmati Rice"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Target Division / Category */}
              <div className="form-field-group">
                <label className="form-field-label">
                  <span>Target Division / Category</span>
                  <span className="required-star">*</span>
                </label>
                <div className="form-select-wrapper">
                  <select
                    className="form-select-input"
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="commodities">Bulk Commodities</option>
                    <option value="steel">Steel &amp; Metals</option>
                    <option value="agro">Agriculture</option>
                  </select>
                  <span className="form-select-caret">▼</span>
                </div>
              </div>

              {/* Card Badge Text */}
              <div className="form-field-group">
                <label className="form-field-label">
                  <span>Card Badge Text</span>
                </label>
                <input
                  type="text"
                  className="form-text-input"
                  placeholder="e.g. Bulk Commodities"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="form-field-group">
                <label className="form-field-label">
                  <span>Description (Shown on Homepage Card)</span>
                  <span className="required-star">*</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  maxLength={500}
                  placeholder="High-quality essentials delivered with reliability, durability, and strong brand value."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                />
                <div className="textarea-footer">
                  <span>{desc.length}/500</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Visual / Media */}
          <div className="form-section-card">
            <div className="form-card-header">
              <div className="form-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className="form-card-title-group">
                <h3>Visual / Media</h3>
                <p>Upload an attractive image to represent this commodity or service.</p>
              </div>
            </div>

            <div className="media-card-grid">
              {/* Drag and Drop Box */}
              <div
                className={`dropzone-box ${isDragOver ? "dragover" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileInputChange}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
                  style={{ display: "none" }}
                />

                <div className="dropzone-cloud-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                    <polyline points="12 12 12 17" />
                    <polyline points="9 15 12 12 15 15" />
                  </svg>
                </div>

                <h4 className="dropzone-title">Drag &amp; drop your image here</h4>
                <span className="dropzone-sub">or</span>

                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-choose-file"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{uploading ? "Uploading..." : "Choose File from Local Computer"}</span>
                </button>

                <p className="dropzone-hint">
                  or drag and drop your image file here (PNG, JPG, WebP, SVG, AVIF up to 15MB)
                </p>

                {uploadError && (
                  <div style={{ color: "#DC2626", fontSize: "11.5px", fontWeight: 600, marginTop: "8px" }}>
                    ⚠️ {uploadError}
                  </div>
                )}
              </div>

              {/* Active Preview Box */}
              <div className="media-preview-box">
                <div className="media-preview-header">
                  <span className="status-active-pill" style={{ cursor: "default" }}>
                    <span className="status-dot-active"></span>
                    <span>Active Preview</span>
                  </span>
                </div>

                <div className="media-preview-img-wrapper">
                  <img
                    src={image}
                    alt="Active Preview"
                    className="media-preview-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/assets/product-grocery.svg";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Row: Publishing & Ordering Card */}
        <div className="form-section-card" style={{ marginTop: "24px" }}>
          <div className="form-card-header">
            <div className="form-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <div className="form-card-title-group">
              <h3>Publishing &amp; Ordering</h3>
              <p>Configure publishing status and display order for this commodity or service.</p>
            </div>
          </div>

          <div className="publishing-card-grid">
            {/* Display Order */}
            <div className="form-field-group">
              <label className="form-field-label">
                <span>Display Order (Sorting)</span>
                <span style={{ color: "#3B82F6", cursor: "help" }} title="Lower numbers appear first">
                  ⓘ
                </span>
              </label>
              <input
                type="number"
                className="form-text-input"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                min={0}
                max={999}
              />
            </div>

            {/* Publish Active Toggle Switch */}
            <div className="toggle-switch-container">
              <label className="ios-toggle">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span className="ios-toggle-slider"></span>
              </label>

              <div className="toggle-label-group">
                <h4>Publish active on public website</h4>
                <p>When enabled, this commodity/service will be visible on the public website.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Form Actions */}
        <div className="form-actions-row">
          <Link href="/dashboard/services" className="btn-form-cancel">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading || uploading}
            className="btn-form-submit"
          >
            {loading ? (
              <span>Saving...</span>
            ) : (
              <span>{isEditing ? "Save Changes" : "Create Commodity"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
