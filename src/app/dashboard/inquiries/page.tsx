import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import InquiriesClient from "./InquiriesClient";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const user = await getSessionUser();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [inquiries, services] = await Promise.all([
    prisma.tradeInquiry.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.service.findMany({
      select: { name: true, image: true, slug: true },
    }),
  ]);

  const commodityImages: Record<string, string> = {
    "strong steel": "/assets/product-steel.svg",
    "steel": "/assets/product-steel.svg",
    "hms 1&2": "/assets/product-hms.svg",
    "hms": "/assets/product-hms.svg",
    "pure sugar": "/assets/product-sugar.svg",
    "sugar": "/assets/product-sugar.svg",
    "natural spices": "/assets/product-spices.svg",
    "spices": "/assets/product-spices.svg",
    "quality fertilizer": "/assets/product-fertilizer.svg",
    "fertilizer": "/assets/product-fertilizer.svg",
    "agro": "/assets/product-agro.svg",
  };

  services.forEach((s) => {
    commodityImages[s.name.toLowerCase().trim()] = s.image;
    commodityImages[s.slug.toLowerCase().trim()] = s.image;
  });

  return (
    <InquiriesClient
      initialInquiries={JSON.parse(JSON.stringify(inquiries))}
      commodityImages={commodityImages}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
