"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SessionUser } from "@/lib/auth";

export default function DashboardSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const isSuperAdmin = user.role === "SUPER_ADMIN";

  interface NavItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    badge?: string;
    external?: boolean;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  const navLinks: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: (
            <svg viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "COMMERCE & SERVICES",
      items: [
        {
          name: "Services & Products",
          href: "/dashboard/services",
          icon: (
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          ),
        },
        ...(isSuperAdmin
          ? [
              {
                name: "Add New Service",
                href: "/dashboard/services/new",
                icon: (
                  <svg viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                ),
              },
            ]
          : []),
        {
          name: "Trade Inquiries / RFQ",
          href: "/dashboard/inquiries",
          badge: "Live",
          icon: (
            <svg viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "SYSTEM & ACCESS",
      items: [
        {
          name: "Users & Roles",
          href: "/dashboard/users",
          icon: (
            <svg viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          ),
        },
        {
          name: "Live Website",
          href: "/",
          external: true,
          icon: (
            <svg viewBox="0 0 24 24">
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <Link href="/dashboard" className="sidebar-brand-link">
          <img
            src="/assets/Logo.svg"
            alt="British Merchants"
            className="sidebar-logo"
          />
          <div>
            <div className="sidebar-brand-name">British Merchants</div>
            <span className="sidebar-brand-badge">
              {isSuperAdmin ? "Admin Suite" : "Viewer Mode"}
            </span>
          </div>
        </Link>
      </div>

      <div className="sidebar-nav-container">
        {navLinks.map((section, idx) => (
          <div key={idx}>
            <div className="sidebar-section-title">{section.title}</div>
            <ul className="sidebar-nav-list">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li
                    key={item.href}
                    className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                  >
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="sidebar-badge">{item.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name" title={user.name}>
            {user.name}
          </div>
          <div className="sidebar-user-role">
            {isSuperAdmin ? "👑 Super Admin" : "👁️ Viewer"}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-logout-btn"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
