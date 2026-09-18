import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import type {
  CategoryDto,
  ProductListResponse,
  ProductQuery,
  ProductSummaryDto,
  ShopDto,
} from "@/types";

export const PUBLIC_PRODUCT_WHERE: Prisma.ProductWhereInput = {
  status: "ACTIVE",
  shop: { status: "ACTIVE" },
};

export function pageFromQuery(query: Record<string, string | undefined>) {
  const page = Math.max(1, parseInt(query.page ?? "1", 10) || 1);
  const pageRaw = Math.min(48, Math.max(1, parseInt(query.pageSize ?? "12", 10) || 12));
  return { page, pageSize: Number.isNaN(pageRaw) ? 12 : pageRaw };
}

export function serializeCategory(
  category: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count?: { products?: number };
  },
): CategoryDto {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
    productCount: category._count?.products,
  };
}

export function serializeShop(
  shop: {
    id: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    status: "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";
    createdAt: Date;
    updatedAt: Date;
    _count?: { products?: number };
  } & { productCount?: number },
): ShopDto {
  const count = shop.productCount ?? shop._count?.products;
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description,
    logoUrl: shop.logoUrl,
    status: shop.status,
    createdAt: shop.createdAt.toISOString(),
    updatedAt: shop.updatedAt.toISOString(),
    productCount: count,
  };
}

export async function getCategories(): Promise<CategoryDto[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          products: { where: PUBLIC_PRODUCT_WHERE },
        },
      },
    },
  });
  return categories.map(serializeCategory);
}

export async function getCategoryById(id: string): Promise<CategoryDto | null> {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          products: { where: PUBLIC_PRODUCT_WHERE },
        },
      },
    },
  });
  return category ? serializeCategory(category) : null;
}

export async function getActiveShops(): Promise<ShopDto[]> {
  const shops = await prisma.shop.findMany({
    where: { status: "ACTIVE" },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          products: { where: PUBLIC_PRODUCT_WHERE },
        },
      },
    },
  });
  return shops.map((shop) => serializeShop(shop));
}

export async function getActiveShop(
  id: string,
): Promise<(ShopDto & { ownerName: string }) | null> {
  const shop = await prisma.shop.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true } },
      _count: {
        select: {
          products: { where: PUBLIC_PRODUCT_WHERE },
        },
      },
    },
  });

  if (!shop || shop.status !== "ACTIVE") return null;

  return {
    ...serializeShop(shop),
    ownerName: shop.owner.name,
  };
}

function productSummarySelect() {
  return {
    id: true,
    name: true,
    price: true,
    stock: true,
    image: true,
    status: true,
    shopId: true,
    categoryId: true,
    category: { select: { id: true, name: true } },
    shop: { select: { id: true, name: true, logoUrl: true } },
  } as const;
}

export function serializeProductSummary(
  product: Prisma.ProductGetPayload<{
    select: ReturnType<typeof productSummarySelect>;
  }>,
): ProductSummaryDto {
  return {
    id: product.id,
    name: product.name,
    price: product.price.toString(),
    stock: product.stock,
    image: product.image,
    status: product.status,
    shopId: product.shopId,
    category: product.category ?? undefined,
    shop: product.shop ?? undefined,
  };
}

function buildProductWhere(query: ProductQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { ...PUBLIC_PRODUCT_WHERE };

  if (query.search?.trim()) {
    where.name = {
      contains: query.search.trim(),
      mode: "insensitive",
    };
  }
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.shopId) where.shopId = query.shopId;

  const minPrice = query.minPrice ? Number(query.minPrice) : NaN;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : NaN;
  if (Number.isFinite(minPrice) && minPrice >= 0) {
    where.price = { ...(where.price as object), gte: minPrice };
  }
  if (Number.isFinite(maxPrice) && maxPrice >= 0) {
    where.price = { ...(where.price as object), lte: maxPrice };
  }
  if (query.inStock) where.stock = { gt: 0 };

  return where;
}

export async function getPublicProducts(
  query: ProductQuery,
): Promise<ProductListResponse> {
  const { page, pageSize } = pageFromQuery(
    query as unknown as Record<string, string | undefined>,
  );
  const where = buildProductWhere(query);

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      select: productSummarySelect(),
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    products: products.map(serializeProductSummary),
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPublicProductById(id: string) {
  const product = await prisma.product.findFirst({
    where: { id, ...PUBLIC_PRODUCT_WHERE },
    include: {
      category: true,
      shop: {
        include: {
          _count: {
            select: {
              products: { where: PUBLIC_PRODUCT_WHERE },
            },
          },
        },
      },
    },
  });

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    stock: product.stock,
    image: product.image,
    status: product.status,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    categoryId: product.categoryId,
    shopId: product.shopId,
    category: serializeCategory(product.category),
    shop: {
      ...serializeShop(product.shop),
      ownerName: undefined,
    },
  };
}

export async function getActiveShopProducts(
  shopId: string,
): Promise<ProductSummaryDto[]> {
  const products = await prisma.product.findMany({
    where: { shopId, ...PUBLIC_PRODUCT_WHERE },
    select: productSummarySelect(),
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProductSummary);
}

export async function getCategoryProducts(
  categoryId: string,
): Promise<ProductSummaryDto[]> {
  const products = await prisma.product.findMany({
    where: { categoryId, ...PUBLIC_PRODUCT_WHERE },
    select: productSummarySelect(),
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProductSummary);
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
): Promise<ProductSummaryDto[]> {
  const products = await prisma.product.findMany({
    where: {
      id: { not: productId },
      categoryId,
      ...PUBLIC_PRODUCT_WHERE,
    },
    select: productSummarySelect(),
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(serializeProductSummary);
}