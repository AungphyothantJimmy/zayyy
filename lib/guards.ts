import { redirect } from "next/navigation";
import { getSessionUser, type SessionUser } from "./auth";

export type AuthError = { error: "UNAUTHORIZED" | "FORBIDDEN" };

export async function requireAuth(
  options?: { role?: SessionUser["role"] },
): Promise<SessionUser> {
  const user = await getSessionUser();

  if (!user) redirect("/login");
  if (options?.role && user.role !== options.role) redirect("/");

  return user;
}

export async function requireAuthOrApi(
  options?: { role?: SessionUser["role"] },
): Promise<SessionUser | null> {
  const user = await getSessionUser();

  if (!user) return null;
  if (options?.role && user.role !== options.role) return null;

  return user;
}