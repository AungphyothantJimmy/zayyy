import { NextResponse } from "next/server";
import { getActiveShop, getActiveShopProducts } from "@/lib/catalog";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const shop = await getActiveShop(id);
  if (!shop) {
    return NextResponse.json({ error: "Shop not found." }, { status: 404 });
  }

  const products = await getActiveShopProducts(id);
  return NextResponse.json({ shop, products });
}