import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { InquiryStatus, Role } from "@prisma/client";

// Public submission from website
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { commodity, volume, name, email, phone, company, message } = data;

    if (!commodity || !name || !email) {
      return NextResponse.json(
        { error: "Commodity, name, and email are required" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.tradeInquiry.create({
      data: {
        commodity,
        volume: volume ? String(volume) : "500 Metric Tons",
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        company: company ? String(company).trim() : null,
        message: message ? String(message).trim() : null,
        status: InquiryStatus.NEW,
      },
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    console.error("Inquiry create error:", error);
    return NextResponse.json(
      { error: "Failed to submit trade inquiry" },
      { status: 500 }
    );
  }
}

// Protected list retrieval
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const inquiries = await prisma.tradeInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Inquiry fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

// Update inquiry status
export async function PATCH(req: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "Unauthorized. Super Admin only." }, { status: 403 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const updated = await prisma.tradeInquiry.update({
      where: { id },
      data: { status: status as InquiryStatus },
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error("Inquiry update error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

// Delete inquiry
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

    await prisma.tradeInquiry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry delete error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
