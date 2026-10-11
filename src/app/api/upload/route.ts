import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== Role.SUPER_ADMIN) {
    return NextResponse.json(
      { error: "Unauthorized. Super Admin only." },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate mime type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "image/avif",
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only image files (JPEG, PNG, WebP, SVG, GIF, AVIF) are allowed" },
        { status: 400 }
      );
    }

    // 15MB file size limit
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 15MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique timestamp name
    const ext = path.extname(file.name) || ".png";
    const cleanBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const uniqueName = `commodity-${Date.now()}-${cleanBase.slice(0, 30)}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file to server" },
      { status: 500 }
    );
  }
}
