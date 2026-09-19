import { NextResponse } from "next/server";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/generated/prisma/client";
import type { SessionUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const ALLOWED_ORDER_STATUS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

async function getOrderWithItems(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, image: true } },
          shop: { select: { id: true, name: true } },
        },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const order = await getOrderWithItems(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await requireAuthOrApi({ role: "SELLER" });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!body.status || !ALLOWED_ORDER_STATUS.includes(body.status as OrderStatus)) {
    return NextResponse.json(
      { error: "Status must be one of: " + ALLOWED_ORDER_STATUS.join(", ") },
      { status: 400 },
    );
  }

  const order = await getOrderWithItems(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const sellerShop = await prisma.shop.findFirst({
    where: { ownerId: user.id },
  });
  if (!sellerShop) {
    return NextResponse.json(
      { error: "Seller shop not found." },
      { status: 403 },
    );
  }

  const hasAccess = order.items.some((item) => item.shopId === sellerShop.id);
  if (!hasAccess) {
    return NextResponse.json(
      { error: "You do not have access to this order." },
      { status: 403 },
    );
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { orderStatus: body.status as OrderStatus },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, image: true } },
          shop: { select: { id: true, name: true } },
        },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ order: updatedOrder });
}
