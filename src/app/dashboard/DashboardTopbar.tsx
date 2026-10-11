"use client";

import { SessionUser } from "@/lib/auth";
import Link from "next/link";

export default function DashboardTopbar({ user }: { user: SessionUser }) {
  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <button className="topbar-menu-toggle" title="Toggle Navigation" aria-label="Toggle Navigation">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="topbar-greeting">
          Welcome back, <strong>{user.name}</strong>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-status-pill">
          <span className="status-dot-pulse"></span>
          <span>Live Operations</span>
        </div>

        <div className="topbar-rjsc-badge">
          RJSC: C-207932/2026
        </div>

        <Link
          href="/"
          target="_blank"
          className="topbar-website-btn"
        >
          <span>View Website</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </Link>

        {/* Bell notification icon */}
        <button className="topbar-bell-btn" title="Notifications" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="topbar-bell-dot"></span>
        </button>

        {/* User circle avatar */}
        <div className="topbar-user-avatar-circle" title={user.name}>
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
