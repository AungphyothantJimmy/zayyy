import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

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

  await prisma.$disconnect();
  console.log("Seed complete.");
  console.log("  Admin:    admin@Zayyy.test / admin123");
  console.log("  Customer: customer@Zayyy.test / customer123");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});