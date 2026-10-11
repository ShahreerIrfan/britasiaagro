import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import ServiceForm from "../ServiceForm";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  const user = await getSessionUser();
  if (user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard/services");
  }

  return <ServiceForm />;
}
