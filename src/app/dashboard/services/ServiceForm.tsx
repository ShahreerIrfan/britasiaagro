"use client";

import { useState } from "react";
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

  const [name, setName] = useState(initialData?.name || "");
  const [desc, setDesc] = useState(initialData?.desc || "");
  const [image, setImage] = useState(initialData?.image || "/assets/product-grocery.svg");
  const [category, setCategory] = useState(initialData?.category || "commodities");
  const [badge, setBadge] = useState(initialData?.badge || "Bulk Commodities");
  const [order, setOrder] = useState(initialData?.order || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    if (val === "commodities") setBadge("Bulk Commodities");
    if (val === "steel") setBadge("Steel & Metals");
    if (val === "agro") setBadge("Agriculture");
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
        setError(data.error || "Failed to save service.");
        setLoading(false);
        return;
      }

      router.push("/dashboard/services");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">
            {isEditing ? `Edit "${initialData?.name}"` : "Add New Commodity / Service"}
          </h1>
          <p className="page-sub-title">
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

            <div className="dash-form-group">
              <label className="dash-label">Image Asset Path / URL</label>
              <input
                type="text"
                className="dash-input"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/assets/product-grocery.svg"
              />
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                Defaults to converted SVGs in /assets/ (e.g. /assets/product-steel.svg)
              </span>
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
