import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { Role } from "@prisma/client";

// Get single slide
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slide = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json({ slide });
  } catch (error) {
    console.error("Fetch single slide error:", error);
    return NextResponse.json({ error: "Failed to fetch slide" }, { status: 500 });
  }
}

// Update slide (Super Admin only)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session || session.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "Unauthorized. Super Admin only." }, { status: 403 });
  }

  try {
    const { id } = await params;
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

    const existing = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    const updated = await prisma.heroSlide.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(btn1Text !== undefined && { btn1Text }),
        ...(btn1Url !== undefined && { btn1Url }),
        ...(btn2Text !== undefined && { btn2Text }),
        ...(btn2Url !== undefined && { btn2Url }),
        ...(bgImage !== undefined && { bgImage }),
        ...(order !== undefined && {
          order: typeof order === "number" ? order : parseInt(order || "0", 10),
        }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({ success: true, slide: updated });
  } catch (error: any) {
    console.error("Update slide error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update slide" },
      { status: 500 }
    );
  }
}

// Delete slide (Super Admin only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session || session.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "Unauthorized. Super Admin only." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    await prisma.heroSlide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Slide deleted successfully" });
  } catch (error: any) {
    console.error("Delete slide error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete slide" },
      { status: 500 }
    );
  }
}
