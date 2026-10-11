"use client";

import { SessionUser } from "@/lib/auth";
import Link from "next/link";

export default function DashboardTopbar({ user }: { user: SessionUser }) {
  const isSuperAdmin = user.role === "SUPER_ADMIN";

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

        <div className="topbar-time-pill">
          RJSC: C-207932/2026
        </div>

        <Link
          href="/"
          target="_blank"
          className="dash-btn-secondary"
          style={{ fontSize: "12px", padding: "6px 12px" }}
        >
          <span>View Website</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
