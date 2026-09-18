import { NextResponse } from "next/server";
import { getActiveShop } from "@/lib/catalog";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const shop = await getActiveShop(id);
  if (!shop) {
    return NextResponse.json({ error: "Shop not found." }, { status: 404 });
  }
  return NextResponse.json({ shop });
}