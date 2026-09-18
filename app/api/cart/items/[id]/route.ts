import { NextResponse } from "next/server";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { getCart } from "@/lib/cart";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuthOrApi({ role: "CUSTOMER" });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  let body: { quantity: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.quantity || body.quantity < 0) {
    return NextResponse.json(
      { error: "Quantity must be >= 0." },
      { status: 400 },
    );
  }

  const cart = await getCart(user.id);
  const item = cart.items.find((i) => i.id === id);
  if (!item) {
    return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
  }

  if (body.quantity === 0) {
    await prisma.cartItem.delete({ where: { id } });
  } else {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (product && product.stock < body.quantity) {
      return NextResponse.json(
        { error: `Only ${product.stock} units available.` },
        { status: 409 },
      );
    }
    await prisma.cartItem.update({
      where: { id },
      data: { quantity: body.quantity },
    });
  }

  const updated = await getCart(user.id);
  return NextResponse.json({ cart: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuthOrApi({ role: "CUSTOMER" });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const cart = await getCart(user.id);
  const item = cart.items.find((i) => i.id === id);
  if (!item) {
    return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
  }

  await prisma.cartItem.delete({ where: { id } });
  const updated = await getCart(user.id);
  return NextResponse.json({ cart: updated });
}
