import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/generated/prisma/client";

export async function getSellerShop(userId: string) {
  return prisma.shop.findFirst({ where: { ownerId: userId } });
}

export async function getSellerProduct(userId: string, productId: string) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      shop: { ownerId: userId },
    },
    include: { shop: true, category: true },
  });
  return product ?? null;
}

export async function getSellerDashboard(userId: string) {
  const shop = await getSellerShop(userId);

  const totals = shop
    ? await prisma.product.groupBy({
        by: ["status"],
        where: { shopId: shop.id },
        _count: { _all: true },
      })
    : [];

  const countByStatus: Record<string, number> = {};
  for (const row of totals) {
    countByStatus[row.status] = row._count._all;
  }

  const visibleCount = countByStatus.ACTIVE ?? 0;

  const pendingOrders = shop
    ? await prisma.orderItem.count({
        where: {
          shopId: shop.id,
          order: { orderStatus: "PENDING" },
        },
      })
    : 0;

  const processingOrders = shop
    ? await prisma.orderItem.count({
        where: {
          shopId: shop.id,
          order: { orderStatus: "PROCESSING" },
        },
      })
    : 0;

  const completedOrders = shop
    ? await prisma.orderItem.count({
        where: {
          shopId: shop.id,
          order: { orderStatus: "DELIVERED" },
        },
      })
    : 0;

  const salesTotal = shop
    ? await prisma.orderItem.aggregate({
        where: {
          shopId: shop.id,
          order: { orderStatus: "DELIVERED" },
        },
        _sum: { subtotal: true },
      })
    : null;

  return {
    shop,
    totalProducts: totals.reduce((sum, row) => sum + row._count._all, 0),
    activeProducts: visibleCount,
    draftProducts: countByStatus.DRAFT ?? 0,
    suspendedProducts: countByStatus.SUSPENDED ?? 0,
    pendingOrders,
    processingOrders,
    completedOrders,
    salesTotal: salesTotal?._sum.subtotal ?? 0,
  };
}

export async function getSellerOrders(userId: string) {
  const shop = await getSellerShop(userId);
  if (!shop) return null;

  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: { shopId: shop.id },
      },
    },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, image: true } },
          shop: { select: { id: true, name: true } },
        },
      },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}

export async function getSellerOrderById(userId: string, orderId: string) {
  const shop = await getSellerShop(userId);
  if (!shop) return null;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      items: { some: { shopId: shop.id } },
    },
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

  return order;
}

export async function updateOrderStatus(
  userId: string,
  orderId: string,
  status: OrderStatus,
) {
  const shop = await getSellerShop(userId);
  if (!shop) return null;

  const hasAccess = await prisma.orderItem.findFirst({
    where: {
      orderId,
      shopId: shop.id,
    },
  });

  if (!hasAccess) return null;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: status },
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

  return order;
}
