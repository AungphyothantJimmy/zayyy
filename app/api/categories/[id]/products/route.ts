import { NextResponse } from "next/server";
import { getCategoryById, getCategoryProducts } from "@/lib/catalog";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  const products = await getCategoryProducts(id);
  return NextResponse.json({ category, products });
}