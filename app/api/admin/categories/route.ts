import { NextResponse } from "next/server";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAuthOrApi({ role: "ADMIN" });
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      productCount: category._count.products,
    })),
  });
}

export async function POST(request: Request) {
  const admin = await requireAuthOrApi({ role: "ADMIN" });
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: { name?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "Category name is required (min 2 characters)." },
      { status: 400 },
    );
  }

  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) {
    return NextResponse.json(
      { error: "A category with this name already exists." },
      { status: 409 },
    );
  }

  const category = await prisma.category.create({
    data: { name, description: body.description?.trim() || null },
  });

  return NextResponse.json({ category }, { status: 201 });
}