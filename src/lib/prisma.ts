import { PrismaClient } from "@prisma/client";

function getEffectiveDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl) return undefined;

  // When deployed in Dokploy Docker production, the container cannot route to its own public WAN IP (31.97.239.234:5434)
  // due to Docker hairpin NAT. Automatically route to Dokploy internal Docker network host:
  if (process.env.NODE_ENV === "production" && envUrl.includes("31.97.239.234")) {
    return envUrl
      .replace("31.97.239.234:5434", "britasia-britasiaagro-pr0nsu:5432")
      .replace("31.97.239.234:5433", "britishmerchants-britishmerchants-tmndcg:5432")
      .replace("31.97.239.234", "britasia-britasiaagro-pr0nsu");
  }

  return envUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const effectiveUrl = getEffectiveDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: effectiveUrl ? { db: { url: effectiveUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
