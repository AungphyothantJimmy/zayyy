import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AuthShell from "@/components/forms/AuthShell";
import RegisterForm from "@/components/forms/RegisterForm";

export const metadata: Metadata = { title: "Register | MarketHub" };

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect("/");

  return (
    <AuthShell
      title="Create your account"
      subtitle="One account for buying — and selling later"
    >
      <RegisterForm />
    </AuthShell>
  );
}