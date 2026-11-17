"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface TradeInquiryItem {
  id: string;
  commodity: string;
  volume: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  status: "NEW" | "CONTACTED" | "IN_NEGOTIATION" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

interface InquiriesClientProps {
  initialInquiries: TradeInquiryItem[];
  commodityImages?: Record<string, string>;
  isSuperAdmin: boolean;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; border: string; text: string; dot: string }
> = {
  NEW: {
    label: "NEW",
    bg: "#EFF6FF",
    border: "#DBEAFE",
    text: "#2563EB",
    dot: "#2563EB",
  },
  CONTACTED: {
    label: "CONTACTED",
    bg: "#FFFBEB",
    border: "#FEF3C7",
    text: "#D97706",
    dot: "#D97706",
  },
  IN_NEGOTIATION: {
    label: "IN NEGOTIATION",
    bg: "#F5F3FF",
    border: "#EDE9FE",
    text: "#7C3AED",
    dot: "#7C3AED",
  },
  COMPLETED: {
    label: "COMPLETED",
    bg: "#ECFDF5",
    border: "#D1FAE5",
    text: "#059669",
    dot: "#059669",
  },
  CANCELLED: {
    label: "CANCELLED",
    bg: "#FEF2F2",
    border: "#FEE2E2",
    text: "#DC2626",
    dot: "#DC2626",
  },
};

export default function InquiriesClient({
  initialInquiries,
  commodityImages = {},
  isSuperAdmin,
}: InquiriesClientProps) {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<TradeInquiryItem[]>(initialInquiries);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<TradeInquiryItem | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".status-dropdown-container")) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Helper to resolve commodity image
  const getCommodityImage = (commodityName: string) => {
    const key = commodityName.toLowerCase().trim();
    if (commodityImages[key]) return commodityImages[key];
    if (key.includes("steel")) return "/assets/product-steel.svg";
    if (key.includes("hms") || key.includes("scrap")) return "/assets/product-hms.svg";
    if (key.includes("sugar")) return "/assets/product-sugar.svg";
    if (key.includes("spice")) return "/assets/product-spices.svg";
    if (key.includes("fertilizer")) return "/assets/product-fertilizer.svg";
    if (key.includes("agro")) return "/assets/product-agro.svg";
    return "/assets/product-steel.svg";
  };

  // Status counts
  const counts = useMemo(() => {
    const map: Record<string, number> = {
      ALL: inquiries.length,
      NEW: 0,
      CONTACTED: 0,
      IN_NEGOTIATION: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    inquiries.forEach((item) => {
      if (map[item.status] !== undefined) {
        map[item.status]++;
      }
    });
    return map;
  }, [inquiries]);

  // Filtered inquiries
  const filtered = useMemo(() => {
    return inquiries.filter((item) => {
      const matchesStatus = filterStatus === "ALL" || item.status === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.commodity.toLowerCase().includes(q) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [inquiries, filterStatus, searchQuery]);

  // Update Status
  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!isSuperAdmin) return;
    setUpdatingId(id);
    setActiveDropdownId(null);

    // Optimistic update
    const previous = [...inquiries];
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus as any } : item
      )
    );
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) =>
        prev ? { ...prev, status: newStatus as any } : null
      );
    }

    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }

      showToast(`Status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      router.refresh();
    } catch (err: any) {
      setInquiries(previous);
      showToast(`Error: ${err.message || "Failed to change status"}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Inquiry
  const handleDelete = async (id: string) => {
    if (!isSuperAdmin) return;
    if (!confirm("Are you sure you want to permanently delete this trade inquiry?")) {
      return;
    }

    setDeleteId(id);

    try {
      const res = await fetch(`/api/inquiries?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete inquiry");
      }

      setInquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
      setSelectedRowIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast("Trade inquiry permanently deleted.");
      router.refresh();
    } catch (err: any) {
      showToast(`Error: ${err.message || "Failed to delete"}`);
    } finally {
      setDeleteId(null);
    }
  };

  // Checkbox selection
  const handleToggleSelectAll = () => {
    if (selectedRowIds.size === filtered.length && filtered.length > 0) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(filtered.map((item) => item.id)));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="trade-inquiries-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="inquiry-toast-popup">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER BANNER matching Buyer Trade Inquiries.png */}
      <div className="inquiries-banner-card">
        <div className="inquiries-banner-left">
          <div className="inquiries-kicker">TRADE INQUIRIES</div>
          <h1 className="inquiries-main-title">Buyer Trade Inquiries (RFQs)</h1>
          <p className="inquiries-subtitle">
            Track commodity requirements, quote states, and communicate with global buyers.
          </p>
        </div>

        {/* 3 KPI SUMMARY CARDS */}
        <div className="inquiries-kpi-row">
          {/* KPI 1: New Leads */}
          <div className="inquiries-kpi-card kpi-leads">
            <div className="kpi-icon-circle kpi-icon-blue">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                <path
                  d="M19 8c1.38 0 2.5-1.12 2.5-2.5S20.38 3 19 3s-2.5 1.12-2.5 2.5S17.62 8 19 8zm0 2c-1.63 0-3.11.53-4.14 1.43 1.39.92 2.37 2.38 2.64 4.07H22v-1.5c0-2.33-4.67-4-7-4z"
                  opacity="0.7"
                />
              </svg>
            </div>
            <div className="kpi-stat-info">
              <div className="kpi-stat-value">{counts.NEW}</div>
              <div className="kpi-stat-label">New Leads</div>
            </div>
          </div>

          {/* KPI 2: In Negotiation */}
          <div className="inquiries-kpi-card kpi-negotiation">
            <div className="kpi-icon-circle kpi-icon-purple">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 12l-3-3 1.41-1.41L11 11.17l5.59-5.59L18 7l-7 7z" />
              </svg>
            </div>
            <div className="kpi-stat-info">
              <div className="kpi-stat-value">{counts.IN_NEGOTIATION}</div>
              <div className="kpi-stat-label text-purple">In Negotiation</div>
            </div>
          </div>

          {/* KPI 3: Completed */}
          <div className="inquiries-kpi-card kpi-completed">
            <div className="kpi-icon-circle kpi-icon-green">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="kpi-stat-info">
              <div className="kpi-stat-value">{counts.COMPLETED}</div>
              <div className="kpi-stat-label text-green">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH ROW */}
      <div className="inquiries-controls-row">
        {/* Left Filter Buttons */}
        <div className="inquiries-filter-tabs">
          {[
            { key: "ALL", label: `All (${counts.ALL})` },
            { key: "NEW", label: `New (${counts.NEW})` },
            { key: "CONTACTED", label: `Contacted (${counts.CONTACTED})` },
            { key: "IN_NEGOTIATION", label: `In Negotiation (${counts.IN_NEGOTIATION})` },
            { key: "COMPLETED", label: `Completed (${counts.COMPLETED})` },
            { key: "CANCELLED", label: `Cancelled (${counts.CANCELLED})` },
          ].map((tab) => {
            const isActive = filterStatus === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                className={`inquiry-filter-btn ${isActive ? "active" : ""}`}
                onClick={() => setFilterStatus(tab.key)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Search Input */}
        <div className="inquiries-search-box">
          <svg
            className="search-mag-icon"
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
            className="search-input-field"
            placeholder="Search company, buyer, email, commodity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* MAIN INQUIRIES TABLE CARD */}
      <div className="inquiries-table-wrapper">
        <div className="inquiries-table-scroller">
          <table className="inquiries-custom-table">
            <thead>
              <tr>
                <th className="th-checkbox">
                  <input
                    type="checkbox"
                    className="custom-table-checkbox"
                    checked={
                      filtered.length > 0 &&
                      selectedRowIds.size === filtered.length
                    }
                    onChange={handleToggleSelectAll}
                  />
                </th>
                <th className="th-buyer">Buyer / Client</th>
                <th className="th-commodity">Commodity & Volume</th>
                <th className="th-message">Message / Specifications</th>
                <th className="th-status">Status</th>
                <th className="th-date">Date</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="inquiries-empty-state">
                    <div className="empty-state-content">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <h3>No inquiries found</h3>
                      <p>Try adjusting your search filter or status selection.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.NEW;
                  const isRowSelected = selectedRowIds.has(item.id);
                  const isDropdownOpen = activeDropdownId === item.id;
                  const commodityImg = getCommodityImage(item.commodity);

                  return (
                    <tr
                      key={item.id}
                      className={`inquiry-table-row ${isRowSelected ? "row-selected" : ""}`}
                    >
                      {/* 1. Checkbox */}
                      <td className="td-checkbox">
                        <input
                          type="checkbox"
                          className="custom-table-checkbox"
                          checked={isRowSelected}
                          onChange={() => handleToggleRow(item.id)}
                        />
                      </td>

                      {/* 2. Buyer / Client */}
                      <td className="td-buyer">
                        <div className="buyer-primary-name">{item.name}</div>
                        {item.company && (
                          <div className="buyer-detail-item">
                            <svg className="buyer-detail-icon" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                            </svg>
                            <span>{item.company}</span>
                          </div>
                        )}
                        <div className="buyer-detail-item">
                          <svg className="buyer-detail-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                          </svg>
                          <a href={`mailto:${item.email}`} className="buyer-link">
                            {item.email}
                          </a>
                        </div>
                        {item.phone && (
                          <div className="buyer-detail-item">
                            <svg className="buyer-detail-icon" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                            <a href={`tel:${item.phone}`} className="buyer-link">
                              {item.phone}
                            </a>
                          </div>
                        )}
                      </td>

                      {/* 3. Commodity & Volume */}
                      <td className="td-commodity">
                        <div className="commodity-flex-cell">
                          <div className="commodity-thumb-container">
                            <img
                              src={commodityImg}
                              alt={item.commodity}
                              className="commodity-thumb-img"
                              onError={(e) => {
                                // fallback to steel svg if broken
                                (e.target as HTMLImageElement).src = "/assets/product-steel.svg";
                              }}
                            />
                          </div>
                          <div className="commodity-text-block">
                            <div className="commodity-title-emerald">{item.commodity}</div>
                            <div className="commodity-volume-line">
                              <svg className="volume-box-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-4.5-4.5 1.41-1.41L12 14.17l5.09-5.09 1.41 1.41L12 17z" />
                                <path d="M21 16.5l-9 4.5-9-4.5V7.5l9-4.5 9 4.5v9z" opacity="0.6" />
                              </svg>
                              <span>{item.volume}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 4. Message / Specifications */}
                      <td className="td-message">
                        <div
                          className="inquiry-message-preview"
                          title={item.message || "No custom message provided"}
                        >
                          {item.message || "Requesting quotation and delivery schedule..."}
                        </div>
                      </td>

                      {/* 5. Status Pill Dropdown */}
                      <td className="td-status">
                        <div className="status-dropdown-container">
                          <button
                            type="button"
                            className="status-pill-btn"
                            style={{
                              backgroundColor: statusCfg.bg,
                              borderColor: statusCfg.border,
                              color: statusCfg.text,
                            }}
                            onClick={() =>
                              setActiveDropdownId(isDropdownOpen ? null : item.id)
                            }
                            disabled={updatingId === item.id || !isSuperAdmin}
                            title={isSuperAdmin ? "Click to change status" : undefined}
                          >
                            <span
                              className="status-dot"
                              style={{ backgroundColor: statusCfg.dot }}
                            />
                            <span className="status-pill-text">{statusCfg.label}</span>
                            {isSuperAdmin && (
                              <svg
                                className="status-chevron"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            )}
                          </button>

                          {/* Dropdown Menu */}
                          {isDropdownOpen && isSuperAdmin && (
                            <div className="status-dropdown-menu">
                              {Object.entries(STATUS_CONFIG).map(([stKey, stVal]) => (
                                <button
                                  key={stKey}
                                  type="button"
                                  className={`status-dropdown-option ${
                                    item.status === stKey ? "active-option" : ""
                                  }`}
                                  onClick={() => handleStatusChange(item.id, stKey)}
                                >
                                  <span
                                    className="status-dot-sm"
                                    style={{ backgroundColor: stVal.dot }}
                                  />
                                  <span>{stVal.label}</span>
                                  {item.status === stKey && (
                                    <svg
                                      className="check-icon"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 6. Date */}
                      <td className="td-date">
                        <div className="date-cell-flex">
                          <svg className="calendar-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                          </svg>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </td>

                      {/* 7. Actions */}
                      <td className="td-actions">
                        <div className="action-buttons-flex">
                          <button
                            type="button"
                            className="btn-view-inquiry"
                            onClick={() => setSelectedInquiry(item)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>View</span>
                          </button>

                          {isSuperAdmin && (
                            <button
                              type="button"
                              className="btn-delete-inquiry"
                              onClick={() => handleDelete(item.id)}
                              disabled={deleteId === item.id}
                              title="Delete inquiry"
                            >
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER when View is clicked */}
      {selectedInquiry && (
        <div className="inquiry-modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div
            className="inquiry-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="inquiry-modal-header">
              <div>
                <div className="modal-kicker">TRADE INQUIRY SPECIFICATION</div>
                <h2 className="modal-title">{selectedInquiry.name}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedInquiry(null)}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="inquiry-modal-body">
              {/* Buyer & Company Info Card */}
              <div className="modal-info-card">
                <div className="modal-card-title">Buyer & Company Details</div>
                <div className="modal-grid-2">
                  <div>
                    <span className="modal-label">Contact Person:</span>
                    <p className="modal-value font-bold">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <span className="modal-label">Company Name:</span>
                    <p className="modal-value">
                      {selectedInquiry.company || "Individual / Private Buyer"}
                    </p>
                  </div>
                  <div>
                    <span className="modal-label">Email Address:</span>
                    <p className="modal-value">
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="modal-link-highlight"
                      >
                        {selectedInquiry.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <span className="modal-label">Direct Phone:</span>
                    <p className="modal-value">
                      {selectedInquiry.phone ? (
                        <a
                          href={`tel:${selectedInquiry.phone}`}
                          className="modal-link-highlight"
                        >
                          {selectedInquiry.phone}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Commodity & Volume Card */}
              <div className="modal-info-card">
                <div className="modal-card-title">Requested Commodity & Volume</div>
                <div className="modal-commodity-row">
                  <img
                    src={getCommodityImage(selectedInquiry.commodity)}
                    alt={selectedInquiry.commodity}
                    className="modal-commodity-thumb"
                  />
                  <div>
                    <h3 className="modal-commodity-title">{selectedInquiry.commodity}</h3>
                    <p className="modal-commodity-volume">
                      Requested Volume: <strong>{selectedInquiry.volume}</strong>
                    </p>
                    <p className="modal-date-sub">
                      Received on: {formatDate(selectedInquiry.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Notes Card */}
              <div className="modal-info-card">
                <div className="modal-card-title">Buyer Message / Requirements</div>
                <div className="modal-message-box">
                  {selectedInquiry.message || "No specific requirement message was written."}
                </div>
              </div>

              {/* Current Status & Inline Quick Update */}
              {isSuperAdmin && (
                <div className="modal-info-card">
                  <div className="modal-card-title">Inquiry Status Lifecycle</div>
                  <div className="modal-status-buttons-row">
                    {Object.entries(STATUS_CONFIG).map(([stKey, stVal]) => (
                      <button
                        key={stKey}
                        type="button"
                        className={`modal-status-choice-btn ${
                          selectedInquiry.status === stKey ? "active" : ""
                        }`}
                        style={{
                          backgroundColor:
                            selectedInquiry.status === stKey ? stVal.bg : "#FFFFFF",
                          borderColor:
                            selectedInquiry.status === stKey ? stVal.border : "#E2E8F0",
                          color: selectedInquiry.status === stKey ? stVal.text : "#475569",
                        }}
                        onClick={() => handleStatusChange(selectedInquiry.id, stKey)}
                      >
                        <span
                          className="status-dot-sm"
                          style={{ backgroundColor: stVal.dot }}
                        />
                        <span>{stVal.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="inquiry-modal-footer">
              <a
                href={`mailto:${selectedInquiry.email}?subject=BritAsia Agro RFQ - ${selectedInquiry.commodity}`}
                className="btn-modal-primary"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span>Reply via Email</span>
              </a>

              {selectedInquiry.phone && (
                <a href={`tel:${selectedInquiry.phone}`} className="btn-modal-secondary">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  <span>Call Buyer</span>
                </a>
              )}

              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setSelectedInquiry(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
