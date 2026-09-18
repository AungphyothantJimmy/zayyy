import { NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth";
import { getActiveShops } from "@/lib/catalog";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { validateShop } from "@/lib/validation";

export async function GET() {
  const shops = await getActiveShops();
  return NextResponse.json({ shops });
}

export async function POST(request: Request) {
  const user = await requireAuthOrApi();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const existing = await prisma.shop.findFirst({ where: { ownerId: user.id } });
  if (existing) {
    return NextResponse.json(
      { error: "You already have a shop on Zayyy." },
      { status: 409 },
    );
  }

  let body: { name?: string; description?: string; logoUrl?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = validateShop({
    name: body.name,
    description: body.description ?? null,
    logoUrl: body.logoUrl ?? null,
  });
  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const { data } = validation;
  const { shop, updatedUser } = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: user.id },
      data: { role: "SELLER" },
      select: { id: true, name: true, email: true, role: true },
    });
    const created = await tx.shop.create({
      data: {
        ownerId: user.id,
        name: data.name,
        description: data.description,
        logoUrl: data.logoUrl,
        status: "PENDING",
      },
    });
    return { shop: created, updatedUser: updated };
  });

  const token = await createSession(updatedUser);
  await setSessionCookie(token);

  return NextResponse.json({ shop }, { status: 201 });
}