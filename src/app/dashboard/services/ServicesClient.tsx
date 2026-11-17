"use client";

import { useState, useMemo } from "react";
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
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("order-asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Counts for top cards
  const counts = useMemo(() => {
    return {
      all: services.length,
      commodities: services.filter((s) => s.category === "commodities").length,
      steel: services.filter((s) => s.category === "steel").length,
      agro: services.filter((s) => s.category === "agro").length,
    };
  }, [services]);

  // Filter and sort items
  const filteredAndSorted = useMemo(() => {
    let result = [...services];

    // Division / Category filter
    if (selectedCat !== "all") {
      result = result.filter((s) => s.category === selectedCat);
    }

    // Status filter
    if (statusFilter === "active") {
      result = result.filter((s) => s.isActive);
    } else if (statusFilter === "inactive") {
      result = result.filter((s) => !s.isActive);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.desc.toLowerCase().includes(q) ||
          s.slug.toLowerCase().includes(q) ||
          (s.badge && s.badge.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sortOrder === "order-asc") {
      result.sort((a, b) => a.order - b.order);
    } else if (sortOrder === "order-desc") {
      result.sort((a, b) => b.order - a.order);
    } else if (sortOrder === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [services, selectedCat, statusFilter, searchQuery, sortOrder]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAndSorted.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAndSorted.map((s) => s.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        router.refresh();
      } else {
        alert("Failed to delete commodity.");
      }
    } catch {
      alert("Error deleting commodity.");
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
          prev.map((s) =>
            s.id === service.id ? { ...s, isActive: newStatus } : s
          )
        );
        router.refresh();
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="dashboard-page-view">
      {/* 1. Header Banner Card */}
      <div className="services-banner-card">
        <div className="services-banner-left">
          <div className="services-banner-tag">SERVICES &amp; PRODUCTS</div>
          <h1 className="services-banner-title">Commodities &amp; Services</h1>
          <p className="services-banner-sub">
            Manage live commodity cards displayed on the BritAsia Agro public catalog. Add, edit or organize commodities across different divisions.
          </p>
        </div>

        {isSuperAdmin && (
          <Link href="/dashboard/services/new" className="btn-add-commodity">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New Commodity</span>
          </Link>
        )}

        {/* Decorative Isometric Layers */}
        <div className="services-banner-decor" aria-hidden="true">
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 18L140 48L80 78L20 48L80 18Z" fill="#FDA4AF" fillOpacity="0.45" />
            <path d="M80 50L140 80L80 110L20 80L80 50Z" fill="#FB7185" fillOpacity="0.55" />
            <path d="M80 82L140 112L80 142L20 112L80 82Z" fill="#E11D48" fillOpacity="0.65" />
          </svg>
        </div>
      </div>

      {/* 2. Division Filter Tabs Row */}
      <div className="division-filter-row">
        {/* All Commodities */}
        <button
          type="button"
          onClick={() => setSelectedCat("all")}
          className={`division-tab-card ${selectedCat === "all" ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span>All Commodities</span>
          <span className="division-tab-pill">{counts.all}</span>
        </button>

        {/* Bulk Commodities */}
        <button
          type="button"
          onClick={() => setSelectedCat("commodities")}
          className={`division-tab-card ${selectedCat === "commodities" ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <span>Bulk Commodities</span>
          <span className="division-tab-pill">{counts.commodities}</span>
        </button>

        {/* Steel & Metals */}
        <button
          type="button"
          onClick={() => setSelectedCat("steel")}
          className={`division-tab-card ${selectedCat === "steel" ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Steel &amp; Metals</span>
          <span className="division-tab-pill">{counts.steel}</span>
        </button>

        {/* Agriculture */}
        <button
          type="button"
          onClick={() => setSelectedCat("agro")}
          className={`division-tab-card ${selectedCat === "agro" ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a9 9 0 0 1 9 9c0 6-9 11-9 11S3 17 3 11a9 9 0 0 1 9-9z" />
            <path d="M12 12c-2 0-3-1-3-3s2-4 3-4 3 2 3 4-1 3-3 3z" />
          </svg>
          <span>Agriculture</span>
          <span className="division-tab-pill">{counts.agro}</span>
        </button>
      </div>

      {/* 3. Search and Filters Controls */}
      <div className="filter-controls-row">
        {/* Search */}
        <div className="filter-search-wrapper">
          <svg
            className="filter-search-icon"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search commodity name, description or division..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Division Dropdown */}
        <div className="filter-select-wrapper">
          <select
            className="filter-select"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="all">All Divisions</option>
            <option value="commodities">Bulk Commodities</option>
            <option value="steel">Steel &amp; Metals</option>
            <option value="agro">Agriculture</option>
          </select>
          <span className="filter-select-arrow">▼</span>
        </div>

        {/* Status Dropdown */}
        <div className="filter-select-wrapper">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active on Site</option>
            <option value="inactive">Inactive</option>
          </select>
          <span className="filter-select-arrow">▼</span>
        </div>

        {/* Sort Order Dropdown */}
        <div className="filter-select-wrapper">
          <select
            className="filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="order-asc">⇅ Display Order (Low to High)</option>
            <option value="order-desc">⇅ Display Order (High to Low)</option>
            <option value="name-asc">⇅ Name (A to Z)</option>
            <option value="newest">⇅ Newest First</option>
          </select>
          <span className="filter-select-arrow">▼</span>
        </div>
      </div>

      {/* 4. Table Panel Card */}
      <div className="services-table-card">
        <div style={{ overflowX: "auto" }}>
          <table className="services-table">
            <thead>
              <tr>
                <th style={{ width: "40px", paddingLeft: "20px" }}>
                  <input
                    type="checkbox"
                    className="service-checkbox"
                    checked={
                      filteredAndSorted.length > 0 &&
                      selectedIds.length === filteredAndSorted.length
                    }
                    onChange={toggleSelectAll}
                    title="Select All"
                  />
                </th>
                <th style={{ width: "70px" }}>IMAGE</th>
                <th>COMMODITY NAME ⇅</th>
                <th>DIVISION ⇅</th>
                <th>DESCRIPTION</th>
                <th>DISPLAY ORDER ⇅</th>
                <th>STATUS ⇅</th>
                <th style={{ textAlign: "center" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "48px 20px", color: "#64748B" }}>
                    No commodities match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((item) => {
                  let divisionClass = "commodities";
                  if (item.category === "agro") divisionClass = "agro";
                  if (item.category === "steel") divisionClass = "steel";

                  return (
                    <tr key={item.id}>
                      <td style={{ paddingLeft: "20px" }}>
                        <input
                          type="checkbox"
                          className="service-checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          title={`Select ${item.name}`}
                        />
                      </td>

                      <td>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="commodity-table-img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assets/Logo.svg";
                          }}
                        />
                      </td>

                      <td>
                        <div className="commodity-title-cell">
                          <span className="commodity-title">{item.name}</span>
                          <span className="commodity-slug">/{item.slug}</span>
                        </div>
                      </td>

                      <td>
                        <span className={`division-pill-badge ${divisionClass}`}>
                          {item.badge || (item.category === "agro" ? "Agriculture" : item.category === "steel" ? "Steel & Metals" : "Bulk Commodities")}
                        </span>
                      </td>

                      <td>
                        <div className="commodity-desc">
                          {item.desc}
                        </div>
                      </td>

                      <td>
                        <span className="display-order-pill">
                          #{item.order}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          disabled={!isSuperAdmin}
                          className={item.isActive ? "status-active-pill" : "status-inactive-pill"}
                          title={isSuperAdmin ? "Click to toggle visibility" : undefined}
                        >
                          <span className={item.isActive ? "status-dot-active" : "status-dot-inactive"}></span>
                          <span>{item.isActive ? "Active on Site" : "Inactive"}</span>
                        </button>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <div className="action-btns-cell" style={{ justifyContent: "center" }}>
                          {isSuperAdmin && (
                            <Link
                              href={`/dashboard/services/${item.id}`}
                              className="btn-action-edit"
                              title="Edit Commodity"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              <span>Edit</span>
                            </Link>
                          )}

                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.name)}
                              disabled={deletingId === item.id}
                              className="btn-action-delete"
                              title="Delete Commodity"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              <span>{deletingId === item.id ? "..." : "Delete"}</span>
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

        {/* 5. Table Footer / Pagination */}
        <div className="table-footer-row">
          <div>
            Showing 1 to {filteredAndSorted.length} of {services.length} commodities
          </div>

          <div className="pagination-group">
            <button type="button" className="pagination-btn" disabled title="Previous page">
              &lt;
            </button>
            <button type="button" className="pagination-btn active">
              1
            </button>
            <button type="button" className="pagination-btn" disabled title="Next page">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
