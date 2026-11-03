import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppearanceClient from "./AppearanceClient";

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
    <AppearanceClient
      initialSlides={JSON.parse(JSON.stringify(slides))}
      isSuperAdmin={user.role === "SUPER_ADMIN"}
    />
  );
}
