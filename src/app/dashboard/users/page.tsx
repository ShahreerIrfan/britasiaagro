import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const user = await getSessionUser();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

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

  return (
    <UsersClient
      initialUsers={JSON.parse(JSON.stringify(users))}
      currentUserId={user?.id}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
