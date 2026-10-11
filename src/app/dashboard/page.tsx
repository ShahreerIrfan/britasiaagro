import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { InquiryStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

function getCommodityThumb(commodity: string) {
  const c = (commodity || "").toLowerCase();
  if (c.includes("steel")) return "/assets/product-steel.svg";
  if (c.includes("hms") || c.includes("scrap")) return "/assets/product-hms.svg";
  if (c.includes("sugar")) return "/assets/product-sugar.svg";
  if (c.includes("agro") || c.includes("fertilizer")) return "/assets/product-agro.svg";
  if (c.includes("spice")) return "/assets/product-spices.svg";
  if (c.includes("grocery") || c.includes("fresh")) return "/assets/product-grocery.svg";
  return "/assets/product-steel.svg";
}

export default async function DashboardPage() {
  const user = await getSessionUser();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // Fetch real-time metrics & 4 latest services from PostgreSQL
  const [totalServices, totalInquiries, newInquiries, recentInquiries, latestServices] = await Promise.all([
    prisma.service.count(),
    prisma.tradeInquiry.count(),
    prisma.tradeInquiry.count({ where: { status: InquiryStatus.NEW } }),
    prisma.tradeInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.service.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const activeServices = await prisma.service.count({ where: { isActive: true } });

  // Standard fallback defaults matching Image 4 if fewer than 4 services exist
  const defaultServices = [
    {
      id: "def-agro",
      name: "Agro & Fertilizers",
      badge: "Sustainable Supply",
      desc: "Sustainable Supply",
      image: "/assets/product-agro.svg",
      category: "agro",
    },
    {
      id: "def-steel",
      name: "Steel & Metals",
      badge: "HMS 1&2 & Deformed",
      desc: "HMS 1&2 & Deformed",
      image: "/assets/product-steel.svg",
      category: "steel",
    },
    {
      id: "def-shipping",
      name: "CIF / FOB Shipping",
      badge: "Chittagong & Mongla",
      desc: "Chittagong & Mongla",
      image: "/assets/testimonial-cargo.svg",
      category: "shipping",
    },
    {
      id: "def-inspection",
      name: "100% Inspected",
      badge: "Grade & SGS Compliant",
      desc: "Grade & SGS Compliant",
      image: "/assets/about-engineers.svg",
      category: "inspection",
    },
  ];

  // Merge the 4 latest services added with fallback defaults if fewer than 4
  const displayedServices = [
    ...latestServices,
    ...defaultServices.slice(latestServices.length),
  ].slice(0, 4);

  return (
    <div className="dashboard-page-view">
      {/* Title & Action Row */}
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Admin Dashboard</h1>
          <p className="page-sub-title">
            Real-time overview of British Merchants commodity trading operations &amp; inquiries
          </p>
        </div>
      </div>

      {/* Row 1: 4 KPI Metric Cards with Mini Bar Charts & Chevrons */}
      <div className="kpi-cards-grid">
        {/* Card 1: Total Inquiries */}
        <div className="kpi-card">
          <div>
            <div className="kpi-card-top">
              <div className="kpi-icon-box pink">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span className="kpi-chevron">›</span>
            </div>
            <div className="kpi-title">TOTAL INQUIRIES</div>
            <div className="kpi-value-row">
              <div>
                <div className="kpi-value">{totalInquiries}</div>
                <div className="kpi-trend">
                  <span>+25%</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
              </div>

              {/* Rising Red Mini Bar Chart Graphic */}
              <div className="mini-bars-graphic">
                <div className="mini-bar" style={{ height: "12px", background: "#FCA5A5" }}></div>
                <div className="mini-bar" style={{ height: "18px", background: "#F87171" }}></div>
                <div className="mini-bar" style={{ height: "24px", background: "#EF4444" }}></div>
                <div className="mini-bar" style={{ height: "30px", background: "#DC2626" }}></div>
                <div className="mini-bar" style={{ height: "36px", background: "#B91C1C" }}></div>
              </div>
            </div>
          </div>

          <div className="kpi-card-footer">
            <span className="kpi-pill red">Live RFQ</span>
            <span>Buyer trade inquiries</span>
          </div>
        </div>

        {/* Card 2: New Leads */}
        <div className="kpi-card">
          <div>
            <div className="kpi-card-top">
              <div className="kpi-icon-box blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="kpi-chevron">›</span>
            </div>
            <div className="kpi-title">NEW LEADS</div>
            <div className="kpi-value-row">
              <div>
                <div className="kpi-value">{newInquiries}</div>
                <div className="kpi-trend">
                  <span>+12%</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
              </div>

              {/* Rising Blue Mini Bar Chart Graphic */}
              <div className="mini-bars-graphic">
                <div className="mini-bar" style={{ height: "10px", background: "#BFDBFE" }}></div>
                <div className="mini-bar" style={{ height: "16px", background: "#93C5FD" }}></div>
                <div className="mini-bar" style={{ height: "22px", background: "#60A5FA" }}></div>
                <div className="mini-bar" style={{ height: "28px", background: "#3B82F6" }}></div>
                <div className="mini-bar" style={{ height: "35px", background: "#1D4ED8" }}></div>
              </div>
            </div>
          </div>

          <div className="kpi-card-footer">
            <span className="kpi-pill blue">Action Required</span>
            <span>Unanswered RFQs</span>
          </div>
        </div>

        {/* Card 3: Commodities & Services */}
        <div className="kpi-card">
          <div>
            <div className="kpi-card-top">
              <div className="kpi-icon-box green">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span className="kpi-chevron">›</span>
            </div>
            <div className="kpi-title">COMMODITIES &amp; SERVICES</div>
            <div className="kpi-value-row">
              <div>
                <div className="kpi-value">{activeServices}</div>
                <div className="kpi-trend">
                  <span>+17%</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
              </div>

              {/* Rising Green Mini Bar Chart Graphic */}
              <div className="mini-bars-graphic">
                <div className="mini-bar" style={{ height: "12px", background: "#A7F3D0" }}></div>
                <div className="mini-bar" style={{ height: "18px", background: "#6EE7B7" }}></div>
                <div className="mini-bar" style={{ height: "24px", background: "#34D399" }}></div>
                <div className="mini-bar" style={{ height: "30px", background: "#10B981" }}></div>
                <div className="mini-bar" style={{ height: "36px", background: "#059669" }}></div>
              </div>
            </div>
          </div>

          <div className="kpi-card-footer">
            <span className="kpi-pill green">Active</span>
            <span>Published on homepage</span>
          </div>
        </div>

        {/* Card 4: Total Catalog */}
        <div className="kpi-card">
          <div>
            <div className="kpi-card-top">
              <div className="kpi-icon-box orange">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <span className="kpi-chevron">›</span>
            </div>
            <div className="kpi-title">TOTAL CATALOG</div>
            <div className="kpi-value-row">
              <div>
                <div className="kpi-value">{totalServices}</div>
                <div className="kpi-trend">
                  <span>+0%</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
              </div>

              {/* Rising Orange/Red Mini Bar Chart Graphic */}
              <div className="mini-bars-graphic">
                <div className="mini-bar" style={{ height: "14px", background: "#FCA5A5" }}></div>
                <div className="mini-bar" style={{ height: "20px", background: "#F87171" }}></div>
                <div className="mini-bar" style={{ height: "26px", background: "#EF4444" }}></div>
                <div className="mini-bar" style={{ height: "31px", background: "#DC2626" }}></div>
                <div className="mini-bar" style={{ height: "36px", background: "#B91C1C" }}></div>
              </div>
            </div>
          </div>

          <div className="kpi-card-footer">
            <span className="kpi-pill catalog">Catalog</span>
            <span>Steel, Agro &amp; Groceries</span>
          </div>
        </div>
      </div>

      {/* Row 2: 4 Latest Services Added (Matches Image 4) */}
      <div className="divisions-grid">
        {displayedServices.map((service, index) => {
          let theme = "agro";
          let icon = (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a9 9 0 0 1 9 9c0 6-9 11-9 11S3 17 3 11a9 9 0 0 1 9-9z" />
              <path d="M12 12c-2 0-3-1-3-3s2-4 3-4 3 2 3 4-1 3-3 3z" />
            </svg>
          );

          if (index === 1 || service.category === "steel") {
            theme = "steel";
            icon = (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            );
          } else if (index === 2 || service.category === "shipping") {
            theme = "shipping";
            icon = (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 19 21 12 17 5 21 12 2" />
              </svg>
            );
          } else if (index === 3 || service.category === "inspection") {
            theme = "inspection";
            icon = (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            );
          } else if (service.category === "commodities") {
            theme = "groceries";
            icon = (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            );
          }

          const thumb = service.image || defaultServices[index % 4].image;

          return (
            <Link
              key={service.id || index}
              href="/dashboard/services"
              className="division-card"
            >
              <div className="division-thumb-wrapper">
                <img
                  src={thumb}
                  alt={service.name}
                  className="division-thumb-img"
                />
              </div>

              <div className={`division-circle-icon ${theme}`}>
                {icon}
              </div>

              <div className="division-text">
                <h4 title={service.name}>{service.name}</h4>
                <span title={service.badge || service.desc}>
                  {service.badge || service.desc || "Sustainable Supply"}
                </span>
              </div>

              <span className="division-arrow">›</span>
            </Link>
          );
        })}
      </div>

      {/* Row 3: Recent Trade Inquiries (RFQ) Card */}
      <div className="table-panel-card">
        <div className="table-panel-header">
          <div className="panel-title-wrapper">
            <div className="red-indicator-bar"></div>
            <div>
              <h3 className="panel-title-text">Recent Trade Inquiries (RFQ)</h3>
              <p className="panel-subtitle-text">Direct client quotation requests received from website</p>
            </div>
          </div>

          <Link href="/dashboard/inquiries" className="btn-view-all-inquiries">
            <span>View All Inquiries</span>
            <span>→</span>
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px", color: "#64748B" }}>
            No trade inquiries yet. Inquiries submitted on the website will stream here in real-time.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="redesigned-table">
              <thead>
                <tr>
                  <th>COMMODITY</th>
                  <th>ORDER VOLUME</th>
                  <th>BUYER NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE / COMPANY</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th style={{ textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq) => {
                  let statusBadge = <span className="status-pill-new">NEW</span>;
                  if (inq.status === InquiryStatus.CONTACTED) {
                    statusBadge = <span className="status-pill-contacted">CONTACTED</span>;
                  } else if (inq.status === InquiryStatus.IN_NEGOTIATION) {
                    statusBadge = <span className="status-pill-negotiation">IN NEGOTIATION</span>;
                  } else if (inq.status === InquiryStatus.COMPLETED) {
                    statusBadge = <span className="status-pill-completed">COMPLETED</span>;
                  }

                  return (
                    <tr key={inq.id}>
                      <td>
                        <div className="commodity-cell">
                          <img
                            src={getCommodityThumb(inq.commodity)}
                            alt={inq.commodity}
                            className="commodity-thumb-img"
                            style={{
                              width: "38px",
                              height: "38px",
                              minWidth: "38px",
                              maxWidth: "38px",
                              borderRadius: "8px",
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                          <span className="commodity-name-text">{inq.commodity}</span>
                        </div>
                      </td>

                      <td style={{ fontWeight: 500 }}>{inq.volume}</td>

                      <td style={{ fontWeight: 600 }}>{inq.name}</td>

                      <td>
                        <a href={`mailto:${inq.email}`} className="email-link">
                          {inq.email}
                        </a>
                      </td>

                      <td>
                        <div className="company-bold">{inq.company || inq.name}</div>
                        <div className="company-sub">{inq.phone ? inq.phone : "Dhaka, Bangladesh"}</div>
                      </td>

                      <td>{statusBadge}</td>

                      <td style={{ color: "#64748B", fontSize: "12.5px", whiteSpace: "nowrap" }}>
                        {new Date(inq.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <Link href="/dashboard/inquiries" className="dots-action-btn" title="View details">
                          ⋮
                        </Link>
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
