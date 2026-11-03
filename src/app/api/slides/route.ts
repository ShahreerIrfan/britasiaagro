import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { Role } from "@prisma/client";

// Get slides (all or active only)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    const where: any = {};
    if (!all) {
      where.isActive = true;
    }

    const slides = await prisma.heroSlide.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ slides });
  } catch (error) {
    console.error("Fetch slides error:", error);
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}

// Create new slide (Super Admin only)
export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "Unauthorized. Super Admin only." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      btn1Text,
      btn1Url,
      btn2Text,
      btn2Url,
      bgImage,
      order,
      isActive,
    } = body;

    if (!title || !description || !bgImage) {
      return NextResponse.json(
        { error: "Title, description, and background image are required." },
        { status: 400 }
      );
    }

    const slide = await prisma.heroSlide.create({
      data: {
        title,
        description,
        btn1Text: btn1Text || "Inquiry Products",
        btn1Url: btn1Url || "#inquiry",
        btn2Text: btn2Text || null,
        btn2Url: btn2Url || null,
        bgImage,
        order: typeof order === "number" ? order : parseInt(order || "0", 10),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, slide }, { status: 201 });
  } catch (error: any) {
    console.error("Create slide error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create slide" },
      { status: 500 }
    );
  }
}
