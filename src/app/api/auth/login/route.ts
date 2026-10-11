import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if Super Admin credentials match ENV variables
    const envAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD;
    const envAdminName = process.env.ADMIN_NAME || "Super Admin";

    if (envAdminEmail && cleanEmail === envAdminEmail) {
      if (envAdminPassword && password === envAdminPassword) {
        // Upsert admin record in PostgreSQL with SUPER_ADMIN role
        const hashedPassword = await hashPassword(password);
        const adminUser = await prisma.user.upsert({
          where: { email: cleanEmail },
          update: {
            role: Role.SUPER_ADMIN,
            password: hashedPassword,
            name: envAdminName,
          },
          create: {
            email: cleanEmail,
            password: hashedPassword,
            name: envAdminName,
            role: Role.SUPER_ADMIN,
          },
        });

        await setSessionCookie({
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
        });

        return NextResponse.json({
          success: true,
          user: {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role,
          },
        });
      }
    }

    // Normal database user authentication (Super Admins and Customer/Viewers)
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    await setSessionCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
