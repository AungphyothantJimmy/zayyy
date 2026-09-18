import { NextResponse } from "next/server";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { getCart } from "@/lib/cart";

export async function POST(request: Request) {
  const user = await requireAuthOrApi({ role: "CUSTOMER" });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { productId: string; quantity: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { productId, quantity } = body;

  if (!productId || !quantity || quantity < 1) {
    return NextResponse.json(
      { error: "productId and quantity (>= 1) are required." },
      { status: 400 },
    );
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.status !== "ACTIVE") {
    return NextResponse.json({ error: "Product not available." }, { status: 404 });
  }

  if (product.stock < quantity) {
    return NextResponse.json(
      { error: `Only ${product.stock} units available.` },
      { status: 409 },
    );
  }

  const cart = await getCart(user.id);
  const existingItem = cart.items.find((i) => i.productId === productId);

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (product.stock < newQty) {
      return NextResponse.json(
        { error: `Only ${product.stock} units available.` },
        { status: 409 },
      );
    }
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQty },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  const updated = await getCart(user.id);
  return NextResponse.json({ cart: updated }, { status: 201 });
}
