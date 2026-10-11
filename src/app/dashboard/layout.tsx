import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import "./dashboard.css";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar user={user} />
      <div className="dashboard-main">
        <DashboardTopbar user={user} />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
