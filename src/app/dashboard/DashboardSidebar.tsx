"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SessionUser } from "@/lib/auth";

interface SubNavItem {
  name: string;
  href: string;
  external?: boolean;
}

interface NavItem {
  id: string;
  name: string;
  href?: string;
  icon: React.ReactNode;
  badge?: string;
  external?: boolean;
  children?: SubNavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function DashboardSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const isSuperAdmin = user.role === "SUPER_ADMIN";

  // Collapsible parent menu state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    commerce: true,
    system: true,
  });

  // Ensure active section is automatically open when navigating
  useEffect(() => {
    if (pathname.startsWith("/dashboard/services")) {
      setOpenSections((prev) => ({ ...prev, commerce: true }));
    } else if (pathname.startsWith("/dashboard/users")) {
      setOpenSections((prev) => ({ ...prev, system: true }));
    }
  }, [pathname]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const navLinks: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        {
          id: "dashboard",
          name: "Dashboard",
          href: "/dashboard",
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "COMMERCE & SERVICES",
      items: [
        {
          id: "commerce",
          name: "Services & Products",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" strokeLinecap="round" />
              <path d="M2 12l10 5 10-5" strokeLinecap="round" />
            </svg>
          ),
          children: [
            {
              name: "All Services & Products",
              href: "/dashboard/services",
            },
            ...(isSuperAdmin
              ? [
                  {
                    name: "Add new Services & Products",
                    href: "/dashboard/services/new",
                  },
                ]
              : []),
          ],
        },
        {
          id: "inquiries",
          name: "Trade Inquiries / RFQ",
          href: "/dashboard/inquiries",
          badge: "Live",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "SYSTEM & ACCESS",
      items: [
        {
          id: "system",
          name: "System & Access",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ),
          children: [
            {
              name: "Users & Roles",
              href: "/dashboard/users",
            },
          ],
        },
        {
          id: "live-website",
          name: "Live Website",
          href: "/",
          external: true,
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <aside className="dashboard-sidebar">
      {/* Top Header with Logo & Admin Suite Badge */}
      <div className="sidebar-header">
        <Link href="/dashboard" className="sidebar-brand-link">
          <img
            src="/assets/Logo.svg"
            alt="British Merchants Connecting The Dots..."
            className="sidebar-logo"
          />
        </Link>
        <span className="sidebar-admin-badge">ADMIN SUITE</span>
      </div>

      {/* Nav Menu */}
      <div className="sidebar-nav-container">
        {navLinks.map((section, idx) => (
          <div key={idx}>
            <div className="sidebar-section-title">{section.title}</div>
            <ul className="sidebar-nav-list">
              {section.items.map((item) => {
                // If item has children, render as collapsible parent
                if (item.children) {
                  const isOpen = !!openSections[item.id];
                  const hasActiveChild = item.children.some((child) => {
                    if (child.href === "/dashboard/services/new") {
                      return pathname === "/dashboard/services/new";
                    }
                    if (child.href === "/dashboard/services") {
                      return (
                        pathname === "/dashboard/services" ||
                        (pathname.startsWith("/dashboard/services/") &&
                          pathname !== "/dashboard/services/new")
                      );
                    }
                    return pathname === child.href;
                  });

                  return (
                    <li
                      key={item.id}
                      className={`sidebar-nav-item sidebar-parent-item ${
                        hasActiveChild ? "has-active-child" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSection(item.id)}
                        className={`sidebar-parent-btn ${isOpen ? "expanded" : ""}`}
                        aria-expanded={isOpen}
                      >
                        <div className="sidebar-item-left">
                          {item.icon}
                          <span>{item.name}</span>
                        </div>

                        <svg
                          className={`sidebar-chevron-arrow ${isOpen ? "open" : ""}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>

                      {/* Collapsible Submenu */}
                      <div
                        className={`sidebar-submenu-wrapper ${
                          isOpen ? "open" : "collapsed"
                        }`}
                      >
                        <ul className="sidebar-submenu-list">
                          {item.children.map((sub) => {
                            const isSubActive =
                              sub.href === "/dashboard/services/new"
                                ? pathname === "/dashboard/services/new"
                                : sub.href === "/dashboard/services"
                                ? pathname === "/dashboard/services" ||
                                  (pathname.startsWith("/dashboard/services/") &&
                                    pathname !== "/dashboard/services/new")
                                : pathname === sub.href;

                            return (
                              <li key={sub.href} className="sidebar-submenu-item">
                                <Link
                                  href={sub.href}
                                  className={`sidebar-submenu-link ${
                                    isSubActive ? "active" : ""
                                  }`}
                                >
                                  <span className="sidebar-submenu-dot" />
                                  <span>{sub.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </li>
                  );
                }

                // Standard flat menu link
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href;

                return (
                  <li
                    key={item.href || item.id}
                    className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                  >
                    <Link
                      href={item.href || "/dashboard"}
                      target={item.external ? "_blank" : undefined}
                    >
                      <div className="sidebar-item-left">
                        {item.icon}
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="sidebar-live-badge">{item.badge}</span>
                        )}
                      </div>

                      <svg
                        className="sidebar-chevron-arrow"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer Profile with Red Avatar and Sign Out Icon */}
      <div className="sidebar-footer">
        <div className="sidebar-user-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name" title={user.name}>
            {user.name}
          </div>
          <div className="sidebar-user-role">
            {isSuperAdmin ? "👑 Super Admin" : "Viewer"}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-logout-btn"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
