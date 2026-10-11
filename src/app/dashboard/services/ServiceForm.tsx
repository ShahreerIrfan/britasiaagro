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
  const [order, setOrder] = useState(initialData?.order || 0);
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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {isEditing ? "Edit Commodity / Service" : "Add New Commodity / Service"}
          </h1>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>
            Configure commodity title, category division, description, and preview image
          </p>
        </div>

        <Link href="/dashboard/services" className="dash-btn-secondary">
          ← Back to Services
        </Link>
      </div>

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "13.5px",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      <div className="dash-panel-card">
        <form onSubmit={handleSubmit}>
          <div className="dash-form-grid">
            <div className="dash-form-group full-width">
              <label className="dash-label">Commodity / Service Name *</label>
              <input
                type="text"
                className="dash-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Basmati Rice or Deformed Rebar Steel"
                required
              />
            </div>

            <div className="dash-form-group">
              <label className="dash-label">Target Division / Category *</label>
              <select
                className="dash-select"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="commodities">Bulk Commodities</option>
                <option value="steel">Steel &amp; Metals</option>
                <option value="agro">Agriculture</option>
              </select>
            </div>

            <div className="dash-form-group">
              <label className="dash-label">Card Badge Text</label>
              <input
                type="text"
                className="dash-input"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Bulk Commodities, Steel & Metals"
              />
            </div>

            <div className="dash-form-group full-width">
              <label className="dash-label">Description (Shown on Homepage Card) *</label>
              <textarea
                className="dash-textarea"
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="High-quality metals built for durability and strength..."
                required
              />
            </div>

            {/* DIRECT IMAGE FILE UPLOAD SECTION */}
            <div className="dash-form-group full-width">
              <label className="dash-label">
                Commodity Visual / Image *
              </label>

              {/* Drag & Drop Upload Container */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${isDragOver ? "#0f766e" : "#cbd5e1"}`,
                  borderRadius: "14px",
                  padding: "24px 20px",
                  background: isDragOver ? "#f0fdf4" : "#f8fafc",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileInputChange}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
                  style={{ display: "none" }}
                />

                {/* Preview Thumbnail */}
                {image && (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "260px",
                      height: "140px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      background: "#ffffff",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.06)",
                    }}
                  >
                    <img
                      src={image}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/assets/product-grocery.svg";
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "6px",
                        left: "6px",
                        background: "rgba(15,23,42,0.75)",
                        color: "#ffffff",
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontWeight: 600,
                      }}
                    >
                      Active Preview
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: "10px 20px",
                      background: "#0f766e",
                      color: "#ffffff",
                      borderRadius: "8px",
                      border: "none",
                      fontWeight: 700,
                      fontSize: "13.5px",
                      cursor: uploading ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 2px 4px rgba(15,118,110,0.2)",
                    }}
                  >
                    <span>📁</span>
                    <span>{uploading ? "Uploading Image..." : "Choose File from Local Computer"}</span>
                  </button>
                  <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                    or drag and drop your image file here (PNG, JPG, WebP, SVG, AVIF up to 15MB)
                  </p>
                </div>

                {uploadError && (
                  <div style={{ color: "#dc2626", fontSize: "12px", fontWeight: 600 }}>
                    ⚠️ {uploadError}
                  </div>
                )}
              </div>

              {/* Exact Saved Path / Custom URL Override */}
              <div style={{ marginTop: "12px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>
                  Saved Image URL in Database:
                </span>
                <input
                  type="text"
                  className="dash-input"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/assets/product-grocery.svg or /uploads/..."
                  style={{ marginTop: "4px", fontSize: "13px" }}
                />
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  Uploaded files are stored at <code style={{ background: "#f1f5f9", padding: "1px 4px", borderRadius: "4px" }}>/uploads/...</code> and will persist in your Dokploy volume.
                </span>
              </div>
            </div>

            <div className="dash-form-group">
              <label className="dash-label">Display Order (Sorting)</label>
              <input
                type="number"
                className="dash-input"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <div className="dash-form-group full-width">
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ width: "18px", height: "18px" }}
                />
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                  Publish active on public website
                </span>
              </label>
            </div>
          </div>

          <div style={{ marginTop: "28px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <Link href="/dashboard/services" className="dash-btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="dash-btn-primary">
              {loading ? "Saving..." : isEditing ? "Update Commodity" : "Create Commodity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
