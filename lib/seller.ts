import { prisma } from "@/lib/prisma";

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

  return {
    shop,
    totalProducts: totals.reduce((sum, row) => sum + row._count._all, 0),
    activeProducts: visibleCount,
    draftProducts: countByStatus.DRAFT ?? 0,
    suspendedProducts: countByStatus.SUSPENDED ?? 0,
  };
}