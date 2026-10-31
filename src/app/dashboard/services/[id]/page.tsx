import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import ServiceForm from "../ServiceForm";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard/services");
  }

  const { id } = await params;
  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    notFound();
  }

  return (
    <ServiceForm
      initialData={{
        id: service.id,
        name: service.name,
        desc: service.desc,
        image: service.image,
        category: service.category,
        badge: service.badge,
        breed: service.breed || "",
        farmingMethod: service.farmingMethod || "",
        processingMethod: service.processingMethod || "",
        packaging: service.packaging || "",
        certifications: service.certifications || "",
        logistics: service.logistics || "",
        step1Image: service.step1Image || "",
        step2Image: service.step2Image || "",
        step3Image: service.step3Image || "",
        step4Image: service.step4Image || "",
        step5Image: service.step5Image || "",
        order: service.order,
        isActive: service.isActive,
      }}
    />
  );
}
