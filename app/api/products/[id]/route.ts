import { NextResponse } from "next/server";
import { getPublicProductById } from "@/lib/catalog";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { getSellerProduct } from "@/lib/seller";
import { validateProduct } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

function productResponse(product: {
  id: string;
  name: string;
  description: string | null;
  price: { toString(): string };
  stock: number;
  image: string | null;
  status: string;
  category: { id: string; name: string };
}) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    stock: product.stock,
    image: product.image,
    status: product.status,
    category: product.category,
  };
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await getPublicProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await requireAuthOrApi({ role: "SELLER" });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getSellerProduct(user.id, id);
  if (!existing) {
    return NextResponse.json(
      { error: "Product not found or you do not own it." },
      { status: 404 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const categoryId = (body.categoryId as string) ?? existing.categoryId;
  const categoryExists = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!categoryExists) {
    return NextResponse.json(
      { error: "Category does not exist." },
      { status: 400 },
    );
  }

  const validation = validateProduct({
    name: body.name as string,
    description: (body.description as string) ?? existing.description,
    price: (body.price as string | number) ?? existing.price,
    stock: (body.stock as string | number) ?? existing.stock,
    image: (body.image as string) ?? existing.image,
    categoryId,
    status: (body.status as "DRAFT" | "ACTIVE") ?? existing.status,
  });

  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const { data } = validation;
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      image: data.image,
      categoryId: data.categoryId,
      status: data.status,
    },
    include: { category: true },
  });

  return NextResponse.json({ product: productResponse(product) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await requireAuthOrApi({ role: "SELLER" });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getSellerProduct(user.id, id);
  if (!existing) {
    return NextResponse.json(
      { error: "Product not found or you do not own it." },
      { status: 404 },
    );
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}