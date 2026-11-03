import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "../DashboardSidebar";
import AppearanceClient from "./AppearanceClient";
import "../dashboard.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Appearance & Hero Slider | Admin Dashboard",
  description: "Customize homepage hero slider, background images, and call-to-action buttons.",
};

export default async function AppearancePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="dashboard-container">
      <DashboardSidebar user={user} />
      <div className="dashboard-main-wrapper">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-left">
            <span className="dashboard-breadcrumb-title">
              Appearance / Hero Slider
            </span>
          </div>
          <div className="dashboard-topbar-right">
            <span className="dashboard-user-badge">
              {user.name} ({user.role})
            </span>
          </div>
        </header>

        <main className="dashboard-content-area">
          <AppearanceClient initialSlides={slides} isSuperAdmin={user.role === "SUPER_ADMIN"} />
        </main>
      </div>
    </div>
  );
}
