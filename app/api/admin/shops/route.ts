import { NextResponse, type NextRequest } from "next/server";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import type { ShopStatus } from "@/lib/generated/prisma/client";

const ALLOWED_STATUS: ShopStatus[] = ["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"];

export async function GET(request: NextRequest) {
  const admin = await requireAuthOrApi({ role: "ADMIN" });
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const status = request.nextUrl.searchParams.get("status");
  const where = status && ALLOWED_STATUS.includes(status as ShopStatus)
    ? { status: status as ShopStatus }
    : undefined;

  const shops = await prisma.shop.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { products: true } },
    },
  });

  return NextResponse.json({
    shops: shops.map((shop) => ({
      id: shop.id,
      name: shop.name,
      description: shop.description,
      logoUrl: shop.logoUrl,
      status: shop.status,
      createdAt: shop.createdAt.toISOString(),
      updatedAt: shop.updatedAt.toISOString(),
      owner: shop.owner,
      productCount: shop._count.products,
    })),
  });
}