import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import ServicesClient from "./ServicesClient";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const user = await getSessionUser();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <ServicesClient
      initialServices={JSON.parse(JSON.stringify(services))}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
