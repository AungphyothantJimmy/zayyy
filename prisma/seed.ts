import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type ProductStatus, type ShopStatus } from "../lib/generated/prisma/client";

const USER_STATUS_PASSWORD = "seller123";

type SeedProduct = {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  status: ProductStatus;
  category: string;
};

type SeedShop = {
  name: string;
  description: string;
  status: ShopStatus;
  email: string;
  products: SeedProduct[];
};

const SEED_SHOPS: SeedShop[] = [
  {
    name: "Tech World",
    description: "Gadgets and electronics for everyday life.",
    status: "ACTIVE",
    email: "seller@Zayyy.test",
    products: [
      {
        name: "Smartphone X",
        description: "6.7-inch AMOLED display, 128GB storage, dual camera with night mode. Battery lasts all day.",
        price: 699.99,
        stock: 25,
        image: "/images/products/smartphone.svg",
        status: "ACTIVE",
        category: "Electronics",
      },
      {
        name: "UltraBook Pro 14",
        description: "Lightweight 14-inch laptop with 16GB RAM and 512GB SSD. Great for work and study.",
        price: 1099.0,
        stock: 12,
        image: "/images/products/laptop.svg",
        status: "ACTIVE",
        category: "Electronics",
      },
      {
        name: "Wireless Earbuds",
        description: "True wireless earbuds with active noise cancelling and 30h battery with the case.",
        price: 99.5,
        stock: 60,
        image: "/images/products/earbuds.svg",
        status: "ACTIVE",
        category: "Electronics",
      },
    ],
  },
  {
    name: "Fashion House",
    description: "Modern, comfortable clothing and footwear at fair prices.",
    status: "ACTIVE",
    email: "fashion@Zayyy.test",
    products: [
      {
        name: "Cotton T-Shirt",
        description: "100% premium cotton unisex tee. Available in multiple colors.",
        price: 19.99,
        stock: 100,
        image: "/images/products/tshirt.svg",
        status: "ACTIVE",
        category: "Fashion",
      },
      {
        name: "Running Shoes",
        description: "Lightweight cushioned sneakers for running and daily wear.",
        price: 59.99,
        stock: 40,
        image: "/images/products/shoes.svg",
        status: "ACTIVE",
        category: "Fashion",
      },
      {
        name: "Denim Jeans",
        description: "Classic slim-fit jeans in dark wash. Durable stretch denim.",
        price: 45.0,
        stock: 35,
        image: "/images/products/jeans.svg",
        status: "ACTIVE",
        category: "Fashion",
      },
    ],
  },
  {
    name: "Glow & Co",
    description: "Gentle skincare and scents for a calmer everyday routine.",
    status: "ACTIVE",
    email: "glow@Zayyy.test",
    products: [
      {
        name: "Vitamin C Serum",
        description: "Brightening serum with 15% vitamin C, hyaluronic acid and vitamin E.",
        price: 24.9,
        stock: 50,
        image: "/images/products/serum.svg",
        status: "ACTIVE",
        category: "Beauty",
      },
      {
        name: "Scented Soy Candle",
        description: "Hand-poured soy candle with a warm vanilla and sandalwood scent. Burns for 45 hours.",
        price: 18.0,
        stock: 30,
        image: "/images/products/candle.svg",
        status: "ACTIVE",
        category: "Home & Living",
      },
    ],
  },
  {
    name: "Active Life",
    description: "Gear that keeps you moving.",
    status: "ACTIVE",
    email: "active@Zayyy.test",
    products: [
      {
        name: "Yoga Mat",
        description: "Non-slip 6mm yoga mat with travel strap. Perfect for home practice.",
        price: 29.99,
        stock: 45,
        image: "/images/products/yoga.svg",
        status: "ACTIVE",
        category: "Sports",
      },
    ],
  },
  {
    name: "Page Turner Books",
    description: "Hand-picked books for curious minds.",
    status: "ACTIVE",
    email: "books@Zayyy.test",
    products: [
      {
        name: "Clean Code",
        description: "A handbook of agile software craftsmanship by Robert C. Martin.",
        price: 39.99,
        stock: 20,
        image: "/images/products/cleancode.svg",
        status: "ACTIVE",
        category: "Books",
      },
    ],
  },
  {
    name: "New Vendor Store",
    description: "Fresh products from a brand-new vendor, awaiting admin approval.",
    status: "PENDING",
    email: "newvendor@Zayyy.test",
    products: [
      {
        name: "Draft Water Bottle",
        description: "Insulated steel bottle, keeps drinks cold for 24h. Added while the shop is pending.",
        price: 24.0,
        stock: 0,
        image: "/images/products/bottle.svg",
        status: "DRAFT",
        category: "Sports",
      },
    ],
  },
];

const CATEGORIES: { name: string; description: string }[] = [
  { name: "Electronics", description: "Phones, computers, audio and gadgets." },
  { name: "Fashion", description: "Clothing, shoes and accessories." },
  { name: "Beauty", description: "Skincare, makeup and personal care." },
  { name: "Home & Living", description: "Decor, furniture and daily essentials." },
  { name: "Sports", description: "Fitness and outdoor equipment." },
  { name: "Books", description: "Fiction, non-fiction and learning." },
];

async function seedUsers(prisma: PrismaClient) {
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@Zayyy.test" },
    update: {},
    create: {
      name: "Zayyy Admin",
      email: "admin@Zayyy.test",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const customerPassword = await bcrypt.hash("customer123", 10);
  await prisma.user.upsert({
    where: { email: "customer@Zayyy.test" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@Zayyy.test",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  const sellerPassword = await bcrypt.hash(USER_STATUS_PASSWORD, 10);
  const sellerEmails = Array.from(
    new Set(SEED_SHOPS.map((shop) => shop.email)),
  );
  for (const email of sellerEmails) {
    await prisma.user.upsert({
      where: { email },
      update: { role: "SELLER" },
      create: {
        name: email.split("@")[0],
        email,
        password: sellerPassword,
        role: "SELLER",
      },
    });
  }
}

async function seedCategories(prisma: PrismaClient) {
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { description: category.description },
      create: category,
    });
  }
}

async function seedShopsAndProducts(prisma: PrismaClient) {
  for (const shop of SEED_SHOPS) {
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: shop.email },
    });

    const existingShop = await prisma.shop.findFirst({
      where: { ownerId: owner.id },
    });

    const savedShop = existingShop
      ? await prisma.shop.update({
          where: { id: existingShop.id },
          data: {
            name: shop.name,
            description: shop.description,
            status: shop.status,
            logoUrl: "/images/logos/logo.svg",
          },
        })
      : await prisma.shop.create({
          data: {
            ownerId: owner.id,
            name: shop.name,
            description: shop.description,
            status: shop.status,
            logoUrl: "/images/logos/logo.svg",
          },
        });

    for (const product of shop.products) {
      const category = await prisma.category.findUniqueOrThrow({
        where: { name: product.category },
      });

      const existingProduct = await prisma.product.findFirst({
        where: { shopId: savedShop.id, name: product.name },
      });

      if (existingProduct) {
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            categoryId: category.id,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image: product.image,
            status: product.status,
          },
        });
      } else {
        await prisma.product.create({
          data: {
            shopId: savedShop.id,
            categoryId: category.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image: product.image,
            status: product.status,
          },
        });
      }
    }
  }
}

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  await seedUsers(prisma);
  await seedCategories(prisma);
  await seedShopsAndProducts(prisma);

  await prisma.$disconnect();
  console.log("Seed complete.");
  console.log("  Admin:       admin@Zayyy.test / admin123");
  console.log("  Customer:    customer@Zayyy.test / customer123");
  console.log("  Sellers:     seller123 (all sellers)");
  console.log("  Seller accounts: seller@Zayyy.test, fashion@Zayyy.test, glow@Zayyy.test, active@Zayyy.test, books@Zayyy.test, newvendor@Zayyy.test");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});