import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    // Sanitize to prevent path traversal
    const safeName = path.basename(filename);
    const filePath = path.join(process.cwd(), "public", "uploads", safeName);

    try {
      const fileBuffer = await readFile(filePath);
      const ext = path.extname(safeName).toLowerCase();
      const contentType = MIME_MAP[ext] || "image/png";

      return new Response(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (fsErr) {
      // High-resilience fallback:
      // If the uploaded file is not found on disk (e.g. after Docker container restart without volume),
      // gracefully serve matching high-res imagery so the hero slider NEVER renders black!
      const lower = safeName.toLowerCase();
      let fallback = "cattle-farming.jpg";
      if (lower.includes("10") || lower.includes("cattle") || lower.includes("agro")) fallback = "cattle-farming.jpg";
      else if (lower.includes("11") || lower.includes("goat") || lower.includes("mutton")) fallback = "goat-farming.jpg";
      else if (lower.includes("13") || lower.includes("duck")) fallback = "duck-farming.jpg";
      else if (lower.includes("12") || lower.includes("chicken") || lower.includes("poultry")) fallback = "poultry-farming.jpg";
      else if (lower.includes("27") || lower.includes("fish") || lower.includes("aquaculture")) fallback = "fish-aquaculture.jpg";

      const fallbackPath = path.join(process.cwd(), "public", "services", fallback);
      const fallbackBuffer = await readFile(fallbackPath);
      return new Response(fallbackBuffer, {
        status: 200,
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  } catch (error) {
    return new NextResponse("File not found", { status: 404 });
  }
}
