import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { InquiryStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getSessionUser();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // Fetch real-time metrics from PostgreSQL
  const [totalServices, totalInquiries, newInquiries, recentInquiries] = await Promise.all([
    prisma.service.count(),
    prisma.tradeInquiry.count(),
    prisma.tradeInquiry.count({ where: { status: InquiryStatus.NEW } }),
    prisma.tradeInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const activeServices = await prisma.service.count({ where: { isActive: true } });

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Admin Dashboard</h1>
          <p className="page-sub-title">
            Real-time overview of British Merchants commodity trading operations &amp; inquiries
          </p>
        </div>

        {isSuperAdmin && (
          <div style={{ display: "flex", gap: "12px" }}>
            <Link href="/dashboard/services/new" className="dash-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <span>Add New Service</span>
            </Link>
          </div>
        )}
      </div>

      {/* 4 KPI Metric Cards (EezzyMart reference style) */}
      <div className="dashboard-stats-grid">
        <div className="dash-stat-card">
          <div className="stat-header">
            <span className="stat-label">TOTAL INQUIRIES</span>
            <div className="stat-icon-circle pink">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{totalInquiries}</div>
          <div className="stat-trend-row">
            <span className="stat-badge-trend">Live RFQ</span>
            <span>Buyer trade inquiries</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-header">
            <span className="stat-label">NEW LEADS</span>
            <div className="stat-icon-circle blue">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{newInquiries}</div>
          <div className="stat-trend-row">
            <span className="stat-badge-trend" style={{ background: "#eff6ff", color: "#2563eb" }}>
              Action Required
            </span>
            <span>Unanswered RFQs</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-header">
            <span className="stat-label">COMMODITIES &amp; SERVICES</span>
            <div className="stat-icon-circle green">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{activeServices}</div>
          <div className="stat-trend-row">
            <span className="stat-badge-trend">Active</span>
            <span>Published on homepage</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="stat-header">
            <span className="stat-label">TOTAL CATALOG</span>
            <div className="stat-icon-circle red">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{totalServices}</div>
          <div className="stat-trend-row">
            <span>Steel, Agro &amp; Groceries</span>
          </div>
        </div>
      </div>

      {/* Mini Secondary Stat Row */}
      <div className="dash-mini-stats-row">
        <div className="mini-stat-card">
          <span style={{ fontSize: "24px" }}>🌾</span>
          <div className="mini-stat-info">
            <h4>Agro &amp; Fertilizers</h4>
            <span>Sustainable Supply</span>
          </div>
        </div>
        <div className="mini-stat-card">
          <span style={{ fontSize: "24px" }}>🔩</span>
          <div className="mini-stat-info">
            <h4>Steel &amp; Metals</h4>
            <span>HMS 1&amp;2 &amp; Deformed</span>
          </div>
        </div>
        <div className="mini-stat-card">
          <span style={{ fontSize: "24px" }}>🚢</span>
          <div className="mini-stat-info">
            <h4>CIF / FOB Shipping</h4>
            <span>Chittagong &amp; Mongla</span>
          </div>
        </div>
        <div className="mini-stat-card">
          <span style={{ fontSize: "24px" }}>🛡️</span>
          <div className="mini-stat-info">
            <h4>100% Inspected</h4>
            <span>Grade &amp; SGS Compliant</span>
          </div>
        </div>
      </div>

      {/* Recent Inquiries Panel */}
      <div className="dash-panel-card">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Recent Trade Inquiries (RFQ)</h3>
            <span className="panel-subtitle">Direct client quotation requests received from website</span>
          </div>
          <Link href="/dashboard/inquiries" className="dash-btn-secondary" style={{ fontSize: "12px", padding: "6px 12px" }}>
            View All Inquiries →
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            No trade inquiries yet. Inquiries submitted on the website will appear here in real-time.
          </div>
        ) : (
          <div className="dash-table-wrapper">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Commodity</th>
                  <th>Order Volume</th>
                  <th>Buyer Name</th>
                  <th>Email</th>
                  <th>Phone / Company</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq) => {
                  const statusClass = inq.status.toLowerCase();
                  return (
                    <tr key={inq.id}>
                      <td style={{ fontWeight: 700 }}>{inq.commodity}</td>
                      <td>{inq.volume}</td>
                      <td>{inq.name}</td>
                      <td style={{ color: "#64748b" }}>{inq.email}</td>
                      <td>
                        {inq.company ? (
                          <strong>{inq.company}</strong>
                        ) : (
                          inq.phone || "—"
                        )}
                      </td>
                      <td>
                        <span className={`status-pill ${statusClass}`}>
                          {inq.status.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ color: "#94a3b8", fontSize: "12px" }}>
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
