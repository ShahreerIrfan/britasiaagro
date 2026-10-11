"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function InquiriesClient({
  initialInquiries,
  isSuperAdmin,
}: {
  initialInquiries: TradeInquiryItem[];
  isSuperAdmin: boolean;
}) {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<TradeInquiryItem[]>(initialInquiries);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<TradeInquiryItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    NEW: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
    CONTACTED: { bg: "#FEF3C7", text: "#B45309", border: "#FDE68A" },
    IN_NEGOTIATION: { bg: "#F3E8FF", text: "#7E22CE", border: "#E9D5FF" },
    COMPLETED: { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0" },
    CANCELLED: { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA" },
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!isSuperAdmin) return;
    setUpdatingId(id);
    setError("");

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

      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus as any } : item
        )
      );

      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to change status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isSuperAdmin) return;
    if (!confirm("Are you sure you want to permanently delete this trade inquiry?")) return;

    setDeleteId(id);
    setError("");

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
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = inquiries.filter((item) => {
    const matchesStatus = filterStatus === "ALL" || item.status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.commodity.toLowerCase().includes(query) ||
      (item.company && item.company.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  const countNew = inquiries.filter((i) => i.status === "NEW").length;
  const countInNegotiation = inquiries.filter((i) => i.status === "IN_NEGOTIATION").length;
  const countCompleted = inquiries.filter((i) => i.status === "COMPLETED").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#0F172A",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Buyer Trade Inquiries (RFQs)
          </h1>
          <p
            style={{
              margin: "0.25rem 0 0 0",
              color: "#64748B",
              fontSize: "0.875rem",
            }}
          >
            Track commodity requirements, quote states, and communicate with global buyers.
          </p>
        </div>

        {/* Live Metrics Quick Badges */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <div
            style={{
              padding: "0.5rem 0.875rem",
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "#1D4ED8",
            }}
          >
            {countNew} New Leads
          </div>
          <div
            style={{
              padding: "0.5rem 0.875rem",
              background: "#F3E8FF",
              border: "1px solid #E9D5FF",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "#7E22CE",
            }}
          >
            {countInNegotiation} In Negotiation
          </div>
          <div
            style={{
              padding: "0.5rem 0.875rem",
              background: "#ECFDF5",
              border: "1px solid #A7F3D0",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "#047857",
            }}
          >
            {countCompleted} Completed
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#991B1B",
            borderRadius: "8px",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="eezzy-card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          padding: "1rem 1.25rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["ALL", "NEW", "CONTACTED", "IN_NEGOTIATION", "COMPLETED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                border: "1px solid",
                cursor: "pointer",
                transition: "all 0.15s ease",
                borderColor: filterStatus === st ? "#0F766E" : "#E2E8F0",
                background: filterStatus === st ? "#0F766E" : "#FFFFFF",
                color: filterStatus === st ? "#FFFFFF" : "#475569",
              }}
            >
              {st === "ALL" ? `All (${inquiries.length})` : st.replace("_", " ")}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "260px" }}>
          <input
            type="text"
            placeholder="Search company, buyer, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem 0.875rem 0.5rem 2.25rem",
              fontSize: "0.875rem",
              border: "1px solid #CBD5E1",
              borderRadius: "8px",
              outline: "none",
              backgroundColor: "#F8FAFC",
            }}
          />
          <svg
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: "1rem",
              height: "1rem",
              color: "#94A3B8",
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Main Table */}
      <div className="eezzy-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="eezzy-table">
            <thead>
              <tr>
                <th>Buyer / Client</th>
                <th>Commodity & Volume</th>
                <th>Message / Specifications</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>
                    No inquiries found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const styleColor = statusColors[item.status] || {
                    bg: "#F1F5F9",
                    text: "#475569",
                    border: "#CBD5E1",
                  };

                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.9375rem" }}>
                          {item.name}
                        </div>
                        {item.company && (
                          <div style={{ fontSize: "0.8125rem", color: "#64748B", fontWeight: 500 }}>
                            🏢 {item.company}
                          </div>
                        )}
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>
                          ✉️ {item.email} {item.phone ? `• 📞 ${item.phone}` : ""}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: "#0F766E", fontSize: "0.875rem" }}>
                          {item.commodity}
                        </div>
                        <div style={{ fontSize: "0.8125rem", color: "#475569", fontWeight: 500 }}>
                          📦 {item.volume}
                        </div>
                      </td>

                      <td style={{ maxWidth: "240px" }}>
                        <div
                          style={{
                            fontSize: "0.8125rem",
                            color: "#475569",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={item.message || "No custom message provided"}
                        >
                          {item.message || <span style={{ color: "#94A3B8" }}>No specific notes</span>}
                        </div>
                      </td>

                      <td>
                        {isSuperAdmin ? (
                          <select
                            value={item.status}
                            disabled={updatingId === item.id}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            style={{
                              padding: "0.25rem 0.5rem",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              backgroundColor: styleColor.bg,
                              color: styleColor.text,
                              border: `1px solid ${styleColor.border}`,
                              outline: "none",
                            }}
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="IN_NEGOTIATION">IN NEGOTIATION</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        ) : (
                          <span
                            style={{
                              padding: "0.25rem 0.6rem",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              backgroundColor: styleColor.bg,
                              color: styleColor.text,
                              border: `1px solid ${styleColor.border}`,
                              display: "inline-block",
                            }}
                          >
                            {item.status.replace("_", " ")}
                          </span>
                        )}
                      </td>

                      <td style={{ fontSize: "0.8125rem", color: "#64748B", whiteSpace: "nowrap" }}>
                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
                          <button
                            onClick={() => setSelectedInquiry(item)}
                            style={{
                              padding: "0.35rem 0.75rem",
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                              background: "#F8FAFC",
                              color: "#334155",
                              border: "1px solid #CBD5E1",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            View
                          </button>

                          {isSuperAdmin && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={deleteId === item.id}
                              style={{
                                padding: "0.35rem 0.6rem",
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                background: "#FEF2F2",
                                color: "#DC2626",
                                border: "1px solid #FECACA",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                              title="Delete inquiry"
                            >
                              🗑️
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

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="eezzy-card"
            style={{
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              padding: "1.75rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #E2E8F0",
                paddingBottom: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#0F766E",
                  }}
                >
                  RFQ Lead Details
                </span>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#0F172A",
                    margin: "0.25rem 0 0 0",
                  }}
                >
                  {selectedInquiry.commodity} ({selectedInquiry.volume})
                </h2>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  color: "#64748B",
                  padding: "0.25rem",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  background: "#F8FAFC",
                  padding: "1rem",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>Buyer Name</div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0F172A" }}>
                    {selectedInquiry.name}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>Company</div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0F172A" }}>
                    {selectedInquiry.company || "Individual / Not specified"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>Email</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0F766E" }}>
                    <a href={`mailto:${selectedInquiry.email}`} style={{ color: "#0F766E" }}>
                      {selectedInquiry.email}
                    </a>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>Phone / WhatsApp</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0F172A" }}>
                    {selectedInquiry.phone ? (
                      <a href={`tel:${selectedInquiry.phone}`} style={{ color: "#0F172A" }}>
                        {selectedInquiry.phone}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.8125rem", color: "#475569", fontWeight: 700, marginBottom: "0.35rem" }}>
                  Procurement Notes / Message
                </div>
                <div
                  style={{
                    padding: "0.875rem",
                    background: "#F1F5F9",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    color: "#334155",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedInquiry.message || "No custom message or cargo instructions provided by the buyer."}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "0.5rem",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                  Submitted on {new Date(selectedInquiry.createdAt).toLocaleString()}
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Quotation: ${encodeURIComponent(
                      selectedInquiry.commodity
                    )} - British Merchants Limited`}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#0F766E",
                      color: "#FFFFFF",
                      borderRadius: "8px",
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    ✉️ Reply to Buyer
                  </a>
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#F1F5F9",
                      color: "#475569",
                      borderRadius: "8px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      border: "1px solid #CBD5E1",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
