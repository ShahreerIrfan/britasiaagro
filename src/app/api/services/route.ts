import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { Role } from "@prisma/client";

// Get all services
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const activeOnly = searchParams.get("active") === "true";

    const where: any = {};
    if (category && category !== "all") {
      where.category = category;
    }
    if (activeOnly) {
      where.isActive = true;
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Fetch services error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

// Create new service (Super Admin only)
export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "Unauthorized. Super Admin only." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      name,
      desc,
      image,
      category,
      badge,
      breed,
      farmingMethod,
      processingMethod,
      packaging,
      certifications,
      logistics,
      step1Image,
      step2Image,
      step3Image,
      step4Image,
      step5Image,
      order,
      isActive,
    } = body;

    if (!name || !desc) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
    }

    // Generate unique slug
    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    if (!baseSlug) baseSlug = "service";
    let slug = baseSlug;
    let count = 1;
    while (await prisma.service.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const service = await prisma.service.create({
      data: {
        slug,
        name: name.trim(),
        desc: desc.trim(),
        image: image || "/assets/product-grocery.svg",
        category: category || "commodities",
        badge: badge || "Bulk Commodities",
        breed: breed ? String(breed).trim() : null,
        farmingMethod: farmingMethod ? String(farmingMethod).trim() : null,
        processingMethod: processingMethod ? String(processingMethod).trim() : null,
        packaging: packaging ? String(packaging).trim() : null,
        certifications: certifications ? String(certifications).trim() : null,
        logistics: logistics ? String(logistics).trim() : null,
        step1Image: step1Image ? String(step1Image).trim() : null,
        step2Image: step2Image ? String(step2Image).trim() : null,
        step3Image: step3Image ? String(step3Image).trim() : null,
        step4Image: step4Image ? String(step4Image).trim() : null,
        step5Image: step5Image ? String(step5Image).trim() : null,
        order: order ? parseInt(order, 10) : 0,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

// Update service (Super Admin only)
export async function PUT(req: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "Unauthorized. Super Admin only." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      id,
      name,
      desc,
      image,
      category,
      badge,
      breed,
      farmingMethod,
      processingMethod,
      packaging,
      certifications,
      logistics,
      step1Image,
      step2Image,
      step3Image,
      step4Image,
      step5Image,
      order,
      isActive,
    } = body;

    if (!id || !name) {
      return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        name: name.trim(),
        desc: desc.trim(),
        image,
        category,
        badge,
        breed: breed !== undefined ? (breed ? String(breed).trim() : null) : undefined,
        farmingMethod: farmingMethod !== undefined ? (farmingMethod ? String(farmingMethod).trim() : null) : undefined,
        processingMethod: processingMethod !== undefined ? (processingMethod ? String(processingMethod).trim() : null) : undefined,
        packaging: packaging !== undefined ? (packaging ? String(packaging).trim() : null) : undefined,
        certifications: certifications !== undefined ? (certifications ? String(certifications).trim() : null) : undefined,
        logistics: logistics !== undefined ? (logistics ? String(logistics).trim() : null) : undefined,
        step1Image: step1Image !== undefined ? (step1Image ? String(step1Image).trim() : null) : undefined,
        step2Image: step2Image !== undefined ? (step2Image ? String(step2Image).trim() : null) : undefined,
        step3Image: step3Image !== undefined ? (step3Image ? String(step3Image).trim() : null) : undefined,
        step4Image: step4Image !== undefined ? (step4Image ? String(step4Image).trim() : null) : undefined,
        step5Image: step5Image !== undefined ? (step5Image ? String(step5Image).trim() : null) : undefined,
        order: order !== undefined ? parseInt(order, 10) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

// Delete service (Super Admin only)
export async function DELETE(req: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "Unauthorized. Super Admin only." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
