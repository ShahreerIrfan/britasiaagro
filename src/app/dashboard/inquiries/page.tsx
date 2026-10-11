import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import InquiriesClient from "./InquiriesClient";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const user = await getSessionUser();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const inquiries = await prisma.tradeInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <InquiriesClient
      initialInquiries={JSON.parse(JSON.stringify(inquiries))}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
