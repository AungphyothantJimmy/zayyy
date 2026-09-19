import { NextResponse } from "next/server";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const user = await requireAuthOrApi();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  let body: { quantity?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id },
    include: { product: true },
  });

  if (!cartItem) {
    return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  if (!cart || cart.id !== cartItem.cartId) {
    return NextResponse.json(
      { error: "Cart item not found." },
      { status: 404 },
    );
  }

  if (body.quantity !== undefined && body.quantity < 1) {
    return NextResponse.json(
      { error: "Quantity must be at least 1." },
      { status: 400 },
    );
  }

  const updatedItem = await prisma.cartItem.update({
    where: { id },
    data: { quantity: body.quantity ?? cartItem.quantity + 1 },
    include: { product: true },
  });

  return NextResponse.json({ item: updatedItem });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await requireAuthOrApi();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  const cartItem = await prisma.cartItem.findUnique({
    where: { id },
  });

  if (!cartItem) {
    return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  if (!cart || cart.id !== cartItem.cartId) {
    return NextResponse.json(
      { error: "Cart item not found." },
      { status: 404 },
    );
  }

  await prisma.cartItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
