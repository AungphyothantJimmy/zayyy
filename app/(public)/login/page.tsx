import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AuthShell from "@/components/forms/AuthShell";
import LoginForm from "@/components/forms/LoginForm";

export const metadata: Metadata = { title: "Login | MarketHub" };

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login to your MarketHub account"
    >
      <LoginForm />
    </AuthShell>
  );
}