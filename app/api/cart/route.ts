import { NextResponse } from "next/server";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { getCart } from "@/lib/cart";

export async function GET() {
  const user = await requireAuthOrApi({ role: "CUSTOMER" });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const cart = await getCart(user.id);
  return NextResponse.json({ cart });
}

export async function DELETE() {
  const user = await requireAuthOrApi({ role: "CUSTOMER" });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const cart = await getCart(user.id);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  const updated = await getCart(user.id);
  return NextResponse.json({ cart: updated });
}
