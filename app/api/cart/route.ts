import { NextResponse } from "next/server";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";

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
    return NextResponse.json({ cart: null });
  }

  const c = cart as any;

  const items = (c.items as any[]).map((item: any) => ({
    id: item.id,
    cartId: item.cartId,
    productId: item.productId,
    quantity: item.quantity,
    product: item.product,
    subtotal: Number(item.product.price) * item.quantity,
  }));

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return NextResponse.json({
    cart: {
      id: c.id,
      userId: c.userId,
      createdAt: new Date(c.createdAt).toISOString(),
      updatedAt: new Date(c.updatedAt).toISOString(),
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      total,
    },
  });
}
