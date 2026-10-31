import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { fallbackServices, ServiceItem } from "@/lib/servicesData";
import ServiceDetailClient from "./ServiceDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let service = await prisma.service.findUnique({
    where: { slug },
  });

  if (!service) {
    service = fallbackServices.find((s) => s.slug === slug) as any;
  }

  if (!service) {
    return {
      title: "Service Not Found | British Merchants Limited",
    };
  }

  return {
    title: `${service.name} | British Merchants Limited`,
    description:
      service.desc ||
      "Commercial agro and commodity export specifications by British Merchants Limited.",
    openGraph: {
      title: `${service.name} | British Merchants Limited`,
      description: service.desc,
      images: [
        {
          url: service.image || "/Logo.png",
          alt: service.name,
        },
      ],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let service: ServiceItem | null = null;

  try {
    const dbService = await prisma.service.findUnique({
      where: { slug },
    });

    if (dbService) {
      service = {
        id: dbService.id,
        slug: dbService.slug,
        name: dbService.name,
        desc: dbService.desc,
        image: dbService.image,
        category: dbService.category as any,
        badge: dbService.badge,
        breed: dbService.breed,
        farmingMethod: dbService.farmingMethod,
        processingMethod: dbService.processingMethod,
        packaging: dbService.packaging,
        certifications: dbService.certifications,
        logistics: dbService.logistics,
        order: dbService.order,
        isActive: dbService.isActive,
      };
    }
  } catch (err) {
    console.error("Error fetching service from database:", err);
  }

  // Fallback to static services definition if DB lookup fails
  if (!service) {
    service = fallbackServices.find((s) => s.slug === slug) || null;
  }

  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} />;
}

