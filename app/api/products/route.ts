import { NextResponse, type NextRequest } from "next/server";
import { getPublicProducts } from "@/lib/catalog";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { getSellerShop } from "@/lib/seller";
import { validateProduct } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const result = await getPublicProducts({
    search: params.get("q") ?? params.get("search") ?? undefined,
    categoryId: params.get("categoryId") ?? undefined,
    shopId: params.get("shopId") ?? undefined,
    minPrice: params.get("minPrice") ?? undefined,
    maxPrice: params.get("maxPrice") ?? undefined,
    inStock: params.get("inStock") === "true",
    page: params.get("page") ? parseInt(params.get("page")!, 10) : undefined,
    pageSize: params.get("pageSize")
      ? parseInt(params.get("pageSize")!, 10)
      : undefined,
  });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const user = await requireAuthOrApi({ role: "SELLER" });
  if (!user) {
    return NextResponse.json(
      { error: "You must be a seller to create products." },
      { status: 401 },
    );
  }

  const shop = await getSellerShop(user.id);
  if (!shop) {
    return NextResponse.json(
      { error: "You need a shop before adding products." },
      { status: 403 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = validateProduct({
    name: body.name as string,
    description: (body.description as string) ?? null,
    price: body.price as string | number,
    stock: body.stock as string | number,
    image: (body.image as string) ?? null,
    categoryId: body.categoryId ? String(body.categoryId) : undefined,
    status: body.status as "DRAFT" | "ACTIVE",
  });

  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const { data } = validation;
  const categoryExists = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!categoryExists) {
    return NextResponse.json(
      { error: "Category does not exist." },
      { status: 400 },
    );
  }

  const product = await prisma.product.create({
    data: {
      shopId: shop.id,
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      image: data.image,
      status: data.status,
    },
    include: { category: true, shop: { select: { id: true, name: true } } },
  });

  return NextResponse.json(
    {
      product: {
        id: product.id,
        name: product.name,
        price: product.price.toString(),
        stock: product.stock,
        image: product.image,
        status: product.status,
        category: product.category,
        shop: product.shop,
      },
    },
    { status: 201 },
  );
}