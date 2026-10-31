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
  breed?: string;
  farmingMethod?: string;
  processingMethod?: string;
  packaging?: string;
  certifications?: string;
  logistics?: string;
  step1Image?: string;
  step2Image?: string;
  step3Image?: string;
  step4Image?: string;
  step5Image?: string;
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
  const [breed, setBreed] = useState(initialData?.breed || "");
  const [farmingMethod, setFarmingMethod] = useState(initialData?.farmingMethod || "");
  const [processingMethod, setProcessingMethod] = useState(initialData?.processingMethod || "");
  const [packaging, setPackaging] = useState(initialData?.packaging || "");
  const [certifications, setCertifications] = useState(initialData?.certifications || "");
  const [logistics, setLogistics] = useState(initialData?.logistics || "");
  const [step1Image, setStep1Image] = useState(initialData?.step1Image || "");
  const [step2Image, setStep2Image] = useState(initialData?.step2Image || "");
  const [step3Image, setStep3Image] = useState(initialData?.step3Image || "");
  const [step4Image, setStep4Image] = useState(initialData?.step4Image || "");
  const [step5Image, setStep5Image] = useState(initialData?.step5Image || "");
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

  const handleStepUpload = async (stepNum: 1 | 2 | 3 | 4 | 5, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (stepNum === 1) setStep1Image(data.url);
      if (stepNum === 2) setStep2Image(data.url);
      if (stepNum === 3) setStep3Image(data.url);
      if (stepNum === 4) setStep4Image(data.url);
      if (stepNum === 5) setStep5Image(data.url);
    } catch (err: any) {
      alert("Failed to upload step image: " + (err.message || "Unknown error"));
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
        breed,
        farmingMethod,
        processingMethod,
        packaging,
        certifications,
        logistics,
        step1Image,
        step2Image,
        step3Image,
        step4Image,
        step5Image,
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

        {/* 2.5 Middle Row: Corporate Agro & Service Specifications Card */}
        <div className="form-section-card" style={{ marginTop: "24px" }}>
          <div className="form-card-header">
            <div className="form-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className="form-card-title-group">
              <h3>Service Specifications &amp; Export Details (Corporate Agro)</h3>
              <p>Key attributes displayed on the single service details page according to Corporate Agro Profile.</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginTop: "16px" }}>
            {/* Breed / Species */}
            <div className="form-field-group">
              <label className="form-field-label">
                <span>Breed / Species / Variety</span>
              </label>
              <input
                type="text"
                className="form-text-input"
                placeholder="e.g. American Brahman Crosses, Black Bengal Goat"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
              />
            </div>

            {/* Farming & Rearing Method */}
            <div className="form-field-group">
              <label className="form-field-label">
                <span>Farming &amp; Husbandry Method</span>
              </label>
              <input
                type="text"
                className="form-text-input"
                placeholder="e.g. 90-120 Day TMR Feedlot, RFID Individual Tracking"
                value={farmingMethod}
                onChange={(e) => setFarmingMethod(e.target.value)}
              />
            </div>

            {/* Processing & Cold Chain */}
            <div className="form-field-group">
              <label className="form-field-label">
                <span>Processing &amp; Cold-Chain Tech</span>
              </label>
              <input
                type="text"
                className="form-text-input"
                placeholder="e.g. Certified Halal Abattoir, -40°C IQF Blast Freeze"
                value={processingMethod}
                onChange={(e) => setProcessingMethod(e.target.value)}
              />
            </div>

            {/* Cuts & Packaging */}
            <div className="form-field-group">
              <label className="form-field-label">
                <span>Cuts &amp; Packaging Formats</span>
              </label>
              <input
                type="text"
                className="form-text-input"
                placeholder="e.g. Prime Ribeye, Chops, Vacuum Skin & 5-Ply Box"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
              />
            </div>

            {/* Certifications & Food Safety */}
            <div className="form-field-group">
              <label className="form-field-label">
                <span>Certifications &amp; Standards</span>
              </label>
              <input
                type="text"
                className="form-text-input"
                placeholder="e.g. 100% Halal Certified, HACCP, ISO 22000, DLS Pass"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
              />
            </div>

            {/* Logistics & Shipping */}
            <div className="form-field-group">
              <label className="form-field-label">
                <span>Export Logistics &amp; Shipping</span>
              </label>
              <input
                type="text"
                className="form-text-input"
                placeholder="e.g. 40ft High-Cube Reefer (-20°C), Air Freight (0-2°C) to UK/GCC"
                value={logistics}
                onChange={(e) => setLogistics(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 2.6 Five-Step Lifecycle Images Card */}
        <div className="form-section-card" style={{ marginTop: "24px" }}>
          <div className="form-card-header">
            <div className="form-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="form-card-title-group">
              <h3>5-Step Commercial Lifecycle Images (Single Service Page Pipeline)</h3>
              <p>Upload or specify URLs for the 5 lifecycle step images displayed on the single service page (Step 1 to Step 5).</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "16px" }}>
            {/* Step 1 Image */}
            <div className="form-field-group">
              <label className="form-field-label">
                <span>Step 1: Farming / Production Image</span>
              </label>
              <input
                type="text"
                className="form-text-input"
                placeholder="e.g. /services/goat/step1.jpg"
                value={step1Image}
                onChange={(e) => setStep1Image(e.target.value)}
              />
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "6px" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleStepUpload(1, f);
                  }}
                  style={{ fontSize: "12px", maxWidth: "200px" }}
                />
                {step1Image && (
                  <img src={step1Image} alt="Step 1 Preview" style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                )}
              </div>
            </div>

            {/* Step 2 Image */}
            <div className="form-field-group">
              <label className="form-field-label">
                <span>Step 2: Processing / Abattoir Image</span>
              </label>
              <input
                type="text"
                className="form-text-input"
                placeholder="e.g. /services/goat/step2.jpg"
                value={step2Image}
                onChange={(e) => setStep2Image(e.target.value)}
              />
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "6px" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleStepUpload(2, f);
                  }}
                  style={{ fontSize: "12px", maxWidth: "200px" }}
                />
                {step2Image && (
                  <img src={step2Image} alt="Step 2 Preview" style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                )}
              </div>
            </div>

            {/* Step 3 Image */}
            <div className="form-field-group">
              <label className="form-field-label">
                <span>Step 3: Packaging / Export Pack Image</span>
              </label>
              <input
                type="text"
                className="form-text-input"
                placeholder="e.g. /services/goat/step3.jpg"
                value={step3Image}
                onChange={(e) => setStep3Image(e.target.value)}
              />
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "6px" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleStepUpload(3, f);
                  }}
                  style={{ fontSize: "12px", maxWidth: "200px" }}
                />
                {step3Image && (
                  <img src={step3Image} alt="Step 3 Preview" style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                )}
              </div>
            </div>

            {/* Step 4 Image */}
            <div className="form-field-group">
              <label className="form-field-label">
                <span>Step 4: Maritime Export &amp; Shipping Image</span>
              </label>
              <input
                type="text"
                className="form-text-input"
                placeholder="e.g. /services/goat/step4.jpg"
                value={step4Image}
                onChange={(e) => setStep4Image(e.target.value)}
              />
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "6px" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleStepUpload(4, f);
                  }}
                  style={{ fontSize: "12px", maxWidth: "200px" }}
                />
                {step4Image && (
                  <img src={step4Image} alt="Step 4 Preview" style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                )}
              </div>
            </div>

            {/* Step 5 Image */}
            <div className="form-field-group">
              <label className="form-field-label">
                <span>Step 5: Culinary Application Image</span>
              </label>
              <input
                type="text"
                className="form-text-input"
                placeholder="e.g. /services/goat/step5.jpg"
                value={step5Image}
                onChange={(e) => setStep5Image(e.target.value)}
              />
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "6px" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleStepUpload(5, f);
                  }}
                  style={{ fontSize: "12px", maxWidth: "200px" }}
                />
                {step5Image && (
                  <img src={step5Image} alt="Step 5 Preview" style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                )}
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
