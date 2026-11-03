import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

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

    // Validate mime type and extension
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/pjpeg",
      "image/png",
      "image/x-png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "image/avif",
    ];

    const fileType = (file.type || "").toLowerCase();
    const fileName = (file.name || "").toLowerCase();
    const hasValidType = fileType.startsWith("image/") || validTypes.includes(fileType);
    const hasValidExt = /\.(jpe?g|png|webp|svg|gif|avif)$/i.test(fileName);

    if (!hasValidType && !hasValidExt) {
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

    let publicUrl = "";

    // 1. Attempt to write to public/uploads on disk
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, uniqueName);
      await writeFile(filePath, buffer);
      publicUrl = `/uploads/${uniqueName}`;
    } catch (fsErr: any) {
      console.warn("Direct disk write failed (Docker non-root permissions or read-only filesystem), falling back to Base64 data URL:", fsErr?.message);
      // 2. High-resilience fallback:
      // If container disk writes are restricted (e.g. EACCES on production non-root runner),
      // embed image as a Base64 data URL so the slide image works instantly without error!
      const mime = fileType || "image/jpeg";
      publicUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
    });
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload file to server" },
      { status: 500 }
    );
  }
}
