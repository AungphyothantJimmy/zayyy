import { NextResponse } from "next/server";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth";

export async function GET() {
  const user = await requireAuthOrApi();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              stock: true,
              status: true,
              shop: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return NextResponse.json({ items: [] });
  }

  const items = cart.items.map((item) => ({
    id: item.id,
    cartId: item.cartId,
    productId: item.productId,
    quantity: item.quantity,
    product: item.product,
    subtotal: Number(item.product.price) * item.quantity,
  }));

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const user = await requireAuthOrApi();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { productId: string; quantity?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const productId = body.productId;
  const quantity = body.quantity ?? 1;

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required." },
      { status: 400 },
    );
  }

  if (quantity < 1) {
    return NextResponse.json(
      { error: "Quantity must be at least 1." },
      { status: 400 },
    );
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, price: true, stock: true, status: true, shopId: true },
  });

  if (!product) {
    return NextResponse.json(
      { error: "Product not found." },
      { status: 404 },
    );
  }

  if (product.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Product is not available." },
      { status: 400 },
    );
  }

  if (product.stock < quantity) {
    return NextResponse.json(
      { error: "Insufficient stock." },
      { status: 400 },
    );
  }

  let cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: user.id },
    });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
    return NextResponse.json({ item: updatedItem }, { status: 200 });
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
    include: { product: true },
  });

  return NextResponse.json({ item: cartItem }, { status: 201 });
}
