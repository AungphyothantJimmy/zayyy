import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/auth";
import { validateEmail, validateName, validatePassword } from "@/lib/validation";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name ?? "";
  const email = body.email ?? "";
  const password = body.password ?? "";

  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (nameError || emailError || passwordError) {
    return NextResponse.json(
      { error: nameError || emailError || passwordError },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: "CUSTOMER",
    },
    select: { id: true, name: true, email: true, role: true },
  });

  const token = await createSession(user);
  await setSessionCookie(token);

  return NextResponse.json({ user }, { status: 201 });
}