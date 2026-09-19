import { prisma } from "@/lib/prisma";
import type { CheckoutInput } from "@/types";

export async function createOrder(userId: string, input: CheckoutInput) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty.");
  }

  const productIds = cart.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      shopId: true,
      status: true,
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  let totalAmount = 0;
  const validItems: { item: { productId: string; quantity: number }; product: (typeof products)[number] }[] = [];

  for (const item of cart.items) {
    const product = productMap.get(item.productId);
    if (!product) continue;
    if (product.status !== "ACTIVE") {
      throw new Error(`Product "${item.productId}" is not available.`);
    }
    if (product.stock < item.quantity) {
      throw new Error(
        `Product has only ${product.stock} units available.`,
      );
    }
    validItems.push({ item, product });
    totalAmount += Number(product.price) * item.quantity;
  }

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        shippingName: input.shippingName,
        shippingPhone: input.shippingPhone,
        shippingCity: input.shippingCity,
        shippingTownship: input.shippingTownship,
        shippingInstructions: input.shippingInstructions ?? null,
        paymentMethod: input.paymentMethod,
      },
    });

    await tx.orderItem.createMany({
      data: validItems.map(({ item, product }) => ({
        orderId: order.id,
        productId: item.productId,
        shopId: product.shopId,
        quantity: item.quantity,
        unitPrice: Number(product.price),
        subtotal: Number(product.price) * item.quantity,
      })),
    });

    for (const { item } of validItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    const fullOrder = await tx.order.findUniqueOrThrow({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, image: true } },
            shop: { select: { id: true, name: true } },
          },
        },
      },
    });

    return fullOrder;
  });

  return result;
}

export async function getOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, image: true } },
          shop: { select: { id: true, name: true } },
        },
      },
    },
  });

  return orders.map((order) => ({
    ...order,
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
    })),
  }));
}

export async function getOrderById(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, image: true } },
          shop: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!order) return null;

  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
    })),
  };
}
