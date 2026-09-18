import { NextResponse } from "next/server";
import { requireAuthOrApi } from "@/lib/guards";
import { getOrderById } from "@/lib/order";

type Params = { params: Promise<{ id: string }> };

export async function GET(
  _request: Request,
  { params }: Params,
) {
  const user = await requireAuthOrApi({ role: "CUSTOMER" });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOrderById(user.id, id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order });
}