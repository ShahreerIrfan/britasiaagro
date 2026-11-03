"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface HeroSlideItem {
  id: string;
  title: string;
  description: string;
  btn1Text?: string | null;
  btn1Url?: string | null;
  btn2Text?: string | null;
  btn2Url?: string | null;
  bgImage: string;
  order: number;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export default function AppearanceClient({
  initialSlides,
  isSuperAdmin,
}: {
  initialSlides: any[];
  isSuperAdmin: boolean;
}) {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlideItem[]>(initialSlides);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlideItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [btn1Text, setBtn1Text] = useState("Inquiry Products");
  const [btn1Url, setBtn1Url] = useState("#inquiry");
  const [btn2Text, setBtn2Text] = useState("Explore Products");
  const [btn2Url, setBtn2Url] = useState("#products");
  const [bgImage, setBgImage] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // UI state
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const openAddModal = () => {
    setEditingSlide(null);
    setTitle("");
    setDescription("");
    setBtn1Text("Inquiry Products");
    setBtn1Url("#inquiry");
    setBtn2Text("Explore Products");
    setBtn2Url("#products");
    setBgImage("/images/hero-modern.svg");
    setOrder(slides.length + 1);
    setIsActive(true);
    setErrorMsg("");
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSlideItem) => {
    setEditingSlide(slide);
    setTitle(slide.title);
    setDescription(slide.description);
    setBtn1Text(slide.btn1Text || "Inquiry Products");
    setBtn1Url(slide.btn1Url || "#inquiry");
    setBtn2Text(slide.btn2Text || "");
    setBtn2Url(slide.btn2Url || "");
    setBgImage(slide.bgImage);
    setOrder(slide.order);
    setIsActive(slide.isActive);
    setErrorMsg("");
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg("");

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

      setBgImage(data.url);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !bgImage.trim()) {
      setErrorMsg("Title, description, and background image are required.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const payload = {
        title,
        description,
        btn1Text,
        btn1Url,
        btn2Text: btn2Text || null,
        btn2Url: btn2Url || null,
        bgImage,
        order: Number(order),
        isActive,
      };

      let res;
      if (editingSlide) {
        res = await fetch(`/api/slides/${editingSlide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/slides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save slide");
      }

      // Refresh list
      const fetchRes = await fetch("/api/slides?all=true");
      const fetchData = await fetchRes.json();
      if (fetchData.slides) {
        setSlides(fetchData.slides);
      }

      setSuccessMsg(editingSlide ? "Slide updated successfully!" : "Slide created successfully!");
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg("");
      }, 800);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while saving the slide.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (slide: HeroSlideItem) => {
    try {
      const updatedStatus = !slide.isActive;
      const res = await fetch(`/api/slides/${slide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: updatedStatus }),
      });

      if (res.ok) {
        setSlides((prev) =>
          prev.map((s) => (s.id === slide.id ? { ...s, isActive: updatedStatus } : s))
        );
        router.refresh();
      }
    } catch (err) {
      console.error("Error toggling slide status:", err);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) {
      return;
    }

    try {
      const res = await fetch(`/api/slides/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete slide");
      }

      setSlides((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete slide");
    }
  };

  return (
    <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "8px 0 40px" }}>
      {/* Top Banner / Actions Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "28px",
          background: "#ffffff",
          padding: "24px 28px",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0b1120" }}>
              Appearance: Homepage Hero Slider
            </h1>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#c81e26",
                background: "#fef2f2",
                padding: "3px 10px",
                borderRadius: "9999px",
                border: "1px solid #fee2e2",
              }}
            >
              {slides.length} {slides.length === 1 ? "Slide" : "Slides"}
            </span>
          </div>
          <p style={{ fontSize: "0.88rem", color: "#64748b", marginTop: "4px" }}>
            Add, customize, and reorder dynamic slides in the homepage Hero section with background imagery and dual call-to-action buttons.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              borderRadius: "10px",
              fontSize: "13.5px",
              fontWeight: 600,
              color: "#334155",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              textDecoration: "none",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>View Live Website</span>
          </Link>

          {isSuperAdmin && (
            <button
              onClick={openAddModal}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "10px",
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#ffffff",
                background: "#c81e26",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(200, 30, 38, 0.25)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add New Slide</span>
            </button>
          )}
        </div>
      </div>

      {/* Slide Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }}>
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            {/* Slide Header Background Image Preview */}
            <div
              style={{
                position: "relative",
                height: "180px",
                background: "#0f172a",
                overflow: "hidden",
              }}
            >
              <img
                src={slide.bgImage}
                alt={slide.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.85,
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/hero-modern.svg";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(11,17,32,0.2) 0%, rgba(11,17,32,0.7) 100%)",
                }}
              />

              {/* Order Badge & Status Pill */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    background: "rgba(11, 17, 32, 0.85)",
                    backdropFilter: "blur(6px)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "9999px",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  Order #{slide.order}
                </span>

                <button
                  onClick={() => handleToggleActive(slide)}
                  title="Click to toggle slide visibility on homepage"
                  style={{
                    background: slide.isActive ? "#16a34a" : "#64748b",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "9999px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {slide.isActive ? "● Active Live" : "○ Inactive"}
                </button>
              </div>
            </div>

            {/* Slide Details Content */}
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#0b1120",
                  marginBottom: "8px",
                  lineHeight: 1.35,
                }}
              >
                {slide.title}
              </h3>

              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#64748b",
                  lineHeight: 1.5,
                  marginBottom: "16px",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  flex: 1,
                }}
              >
                {slide.description}
              </p>

              {/* Action Buttons Badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "18px" }}>
                {slide.btn1Text && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#b91c1c",
                      background: "#fef2f2",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid #fee2e2",
                    }}
                  >
                    Btn 1: {slide.btn1Text} ➔ {slide.btn1Url || "#inquiry"}
                  </span>
                )}
                {slide.btn2Text && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#0369a1",
                      background: "#f0f9ff",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid #e0f2fe",
                    }}
                  >
                    Btn 2: {slide.btn2Text} ➔ {slide.btn2Url || "#products"}
                  </span>
                )}
              </div>

              {/* Card Footer Actions */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "14px",
                  borderTop: "1px solid #f1f5f9",
                  marginTop: "auto",
                }}
              >
                <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                  Slide ID: {slide.id.slice(0, 8)}...
                </div>

                {isSuperAdmin && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => openEditModal(slide)}
                      style={{
                        padding: "6px 14px",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: "#0b1120",
                        background: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      style={{
                        padding: "6px 14px",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: "#dc2626",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Edit / Add Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11, 17, 32, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              padding: "28px 32px",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                paddingBottom: "14px",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0b1120" }}>
                  {editingSlide ? "Edit Hero Slide" : "Add New Hero Slide"}
                </h2>
                <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "2px" }}>
                  Configure slide title, description, imagery, and interactive call-to-actions.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "16px",
                  border: "1px solid #fee2e2",
                }}
              >
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div
                style={{
                  background: "#f0fdf4",
                  color: "#166534",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "16px",
                  border: "1px solid #bbf7d0",
                }}
              >
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSaveSlide}>
              {/* 1. Title */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Slide Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. British Merchants Worldwide Commodity & Steel Trade"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    color: "#0b1120",
                    outline: "none",
                  }}
                />
              </div>

              {/* 2. Description */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Slide Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter a compelling overview of this division or vertical..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    color: "#0b1120",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* 3. Button 1: Text & URL */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Button-01 Text *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inquiry Products"
                    value={btn1Text}
                    onChange={(e) => setBtn1Text(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13.5px",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Button-01 URL / Target
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. #inquiry or /services/agro"
                    value={btn1Url}
                    onChange={(e) => setBtn1Url(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13.5px",
                    }}
                  />
                </div>
              </div>

              {/* 4. Button 2: Text & URL (Optional) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Button-02 Text (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Explore Products"
                    value={btn2Text}
                    onChange={(e) => setBtn2Text(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13.5px",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Button-02 URL / Target
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. #products or /#contact"
                    value={btn2Url}
                    onChange={(e) => setBtn2Url(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13.5px",
                    }}
                  />
                </div>
              </div>

              {/* 5. Background Image Upload / Path */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Slide Background Image *
                </label>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /images/hero-modern.svg or upload below"
                    value={bgImage}
                    onChange={(e) => setBgImage(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13.5px",
                    }}
                  />
                  <label
                    style={{
                      padding: "10px 18px",
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>{uploading ? "Uploading..." : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                      disabled={uploading}
                    />
                  </label>
                </div>

                {/* Preview Box */}
                {bgImage && (
                  <div
                    style={{
                      position: "relative",
                      height: "140px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid #cbd5e1",
                      background: "#0f172a",
                    }}
                  >
                    <img
                      src={bgImage}
                      alt="Background preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>

              {/* 6. Order & Active status */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#f8fafc",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                    Display Order:
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value || "0", 10))}
                    style={{
                      width: "80px",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13.5px",
                      fontWeight: 600,
                    }}
                  />
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "#c81e26" }}
                  />
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0b1120" }}>
                    Active (Show on Homepage)
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "#334155",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  style={{
                    padding: "10px 26px",
                    borderRadius: "10px",
                    background: "#c81e26",
                    border: "none",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    color: "#ffffff",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(200, 30, 38, 0.25)",
                  }}
                >
                  {saving ? "Saving..." : editingSlide ? "Update Slide" : "Create Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
