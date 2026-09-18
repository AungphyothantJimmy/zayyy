import { prisma } from "@/lib/prisma";
import type { CartItemDto } from "@/types";

export async function getCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: true },
    });
  }

  const productIds = cart.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      image: true,
      status: true,
      shop: { select: { id: true, name: true } },
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  const items: CartItemDto[] = cart.items.map((item) => {
    const product = productMap.get(item.productId)!;
    const price = product.price.toNumber();
    const subtotal = price * item.quantity;
    return {
      id: item.id,
      cartId: item.cartId,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price.toString(),
        stock: product.stock,
        image: product.image,
        status: product.status,
        shop: product.shop,
      },
      subtotal: subtotal.toString(),
    };
  });

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + parseFloat(i.subtotal), 0);

  return {
    ...cart,
    items,
    itemCount,
    total: total.toString(),
  };
}