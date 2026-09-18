import { NextResponse } from "next/server";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import type { ShopStatus } from "@/lib/generated/prisma/client";

const ALLOWED_STATUS: ShopStatus[] = ["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAuthOrApi({ role: "ADMIN" });
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;
  let body: { status?: ShopStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.status || !ALLOWED_STATUS.includes(body.status)) {
    return NextResponse.json(
      { error: "Status must be one of: " + ALLOWED_STATUS.join(", ") },
      { status: 400 },
    );
  }

  const existing = await prisma.shop.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Shop not found." }, { status: 404 });
  }

  const shop = await prisma.shop.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json({ shop });
}