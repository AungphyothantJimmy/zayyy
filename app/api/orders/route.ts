import { NextResponse } from "next/server";
import { requireAuthOrApi } from "@/lib/guards";
import { createOrder, getOrders } from "@/lib/order";
import type { CheckoutInput } from "@/types";

export async function POST(request: Request) {
  const user = await requireAuthOrApi({ role: "CUSTOMER" });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: CheckoutInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const required = [
    "shippingName",
    "shippingPhone",
    "shippingCity",
    "shippingTownship",
    "paymentMethod",
  ] as const;
  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === "") {
      return NextResponse.json(
        { error: `${field} is required.` },
        { status: 400 },
      );
    }
  }

  if (!["cash_on_delivery"].includes(body.paymentMethod)) {
    return NextResponse.json(
      { error: "Only cash_on_delivery is supported." },
      { status: 400 },
    );
  }

  try {
    const order = await createOrder(user.id, body);
    return NextResponse.json({ order }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}

export async function GET() {
  const user = await requireAuthOrApi({ role: "CUSTOMER" });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const orders = await getOrders(user.id);
  return NextResponse.json({ orders });
}