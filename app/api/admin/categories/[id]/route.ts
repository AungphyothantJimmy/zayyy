import { NextResponse } from "next/server";
import { requireAuthOrApi } from "@/lib/guards";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const admin = await requireAuthOrApi({ role: "ADMIN" });
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;
  let body: { name?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  const data: { name?: string; description?: string | null } = {};
  if (body.name !== undefined) {
    const name = body.name.trim();
    if (name.length < 2) {
      return NextResponse.json(
        { error: "Category name must be at least 2 characters." },
        { status: 400 },
      );
    }
    const dup = await prisma.category.findFirst({
      where: { name, id: { not: id } },
    });
    if (dup) {
      return NextResponse.json(
        { error: "A category with this name already exists." },
        { status: 409 },
      );
    }
    data.name = name;
  }
  if (body.description !== undefined) {
    data.description = body.description.trim() || null;
  }

  const category = await prisma.category.update({
    where: { id },
    data,
  });

  return NextResponse.json({ category });
}

export async function DELETE(_request: Request, { params }: Params) {
  const admin = await requireAuthOrApi({ role: "ADMIN" });
  if (!admin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  if (existing._count.products > 0) {
    return NextResponse.json(
      { error: "Cannot delete a category that still has products." },
      { status: 409 },
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}