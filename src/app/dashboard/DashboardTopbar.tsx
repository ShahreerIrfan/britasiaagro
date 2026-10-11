"use client";

import { SessionUser } from "@/lib/auth";
import Link from "next/link";

export default function DashboardTopbar({ user }: { user: SessionUser }) {
  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
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
      </div>
    </header>
  );
}
