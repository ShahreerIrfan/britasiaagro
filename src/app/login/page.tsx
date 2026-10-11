import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return <LoginClient />;
}
