"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  desc: string;
  image: string;
  category: string;
  badge: string;
  order: number;
  isActive: boolean;
  createdAt: Date | string;
}

export default function ServicesClient({
  initialServices,
  isSuperAdmin,
}: {
  initialServices: ServiceItem[];
  isSuperAdmin: boolean;
}) {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [selectedCat, setSelectedCat] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered =
    selectedCat === "all"
      ? services
      : services.filter((s) => s.category === selectedCat);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        router.refresh();
      } else {
        alert("Failed to delete service.");
      }
    } catch (err) {
      alert("Error deleting service.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (service: ServiceItem) => {
    if (!isSuperAdmin) return;
    const newStatus = !service.isActive;

    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: service.id,
          name: service.name,
          desc: service.desc,
          image: service.image,
          category: service.category,
          badge: service.badge,
          isActive: newStatus,
        }),
      });

      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, isActive: newStatus } : s))
        );
        router.refresh();
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Commodities &amp; Services</h1>
          <p className="page-sub-title">
            Manage live commodity cards displayed on the British Merchants public catalog
          </p>
        </div>

        {isSuperAdmin && (
          <Link href="/dashboard/services/new" className="dash-btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <span>Add New Commodity</span>
          </Link>
        )}
      </div>

      {/* Category Tabs Bar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { label: "All Commodities", value: "all", count: services.length },
          {
            label: "Bulk Commodities",
            value: "commodities",
            count: services.filter((s) => s.category === "commodities").length,
          },
          {
            label: "Steel & Metals",
            value: "steel",
            count: services.filter((s) => s.category === "steel").length,
          },
          {
            label: "Agriculture",
            value: "agro",
            count: services.filter((s) => s.category === "agro").length,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedCat(tab.value)}
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              border: "1px solid",
              background: selectedCat === tab.value ? "#c81e26" : "#ffffff",
              color: selectedCat === tab.value ? "#ffffff" : "#475569",
              borderColor: selectedCat === tab.value ? "#c81e26" : "#e2e8f0",
              boxShadow: selectedCat === tab.value ? "0 2px 8px rgba(200, 30, 38, 0.25)" : "none",
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Services Table */}
      <div className="dash-panel-card" style={{ padding: "0" }}>
        <div className="dash-table-wrapper">
          <table className="dash-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Image</th>
                <th>Commodity Name</th>
                <th>Division / Badge</th>
                <th>Description</th>
                <th>Display Order</th>
                <th>Status</th>
                {isSuperAdmin && <th style={{ textAlign: "right" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div
                      style={{
                        width: "60px",
                        height: "44px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#0f172a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  </td>
                  <td>
                    <strong style={{ fontSize: "14.5px" }}>{item.name}</strong>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>/{item.slug}</div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: "#f1f5f9",
                        color: "#334155",
                      }}
                    >
                      {item.badge}
                    </span>
                  </td>
                  <td style={{ maxWidth: "340px", color: "#64748b", fontSize: "13px" }}>
                    {item.desc}
                  </td>
                  <td style={{ fontWeight: 700 }}>#{item.order}</td>
                  <td>
                    <button
                      onClick={() => handleToggleActive(item)}
                      disabled={!isSuperAdmin}
                      style={{
                        cursor: isSuperAdmin ? "pointer" : "default",
                        background: item.isActive ? "#ecfdf5" : "#f1f5f9",
                        color: item.isActive ? "#059669" : "#64748b",
                        border: item.isActive ? "1px solid #a7f3d0" : "1px solid #cbd5e1",
                        padding: "3px 9px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {item.isActive ? "● Active on Site" : "○ Hidden"}
                    </button>
                  </td>
                  {isSuperAdmin && (
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <Link
                          href={`/dashboard/services/${item.id}`}
                          className="dash-btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          disabled={deletingId === item.id}
                          className="dash-btn-danger"
                        >
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
