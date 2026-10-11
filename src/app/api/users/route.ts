import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, hashPassword } from "@/lib/auth";
import { Role } from "@prisma/client";

// Get all users
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// Create new user (Super Admin only)
export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "Unauthorized. Super Admin only." }, { status: 403 });
  }

  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const userRole = role === "SUPER_ADMIN" ? Role.SUPER_ADMIN : Role.CUSTOMER;

    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        password: hashedPassword,
        role: userRole,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// Delete user
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

    if (id === session.id) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
