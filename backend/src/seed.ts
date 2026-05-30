import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/prisma/client.js";
import "dotenv/config";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const PRODUCTS = [
  { name: "Classic Wide-Brim Straw", category: "hats", price: 180, protectionScore: 80, imageUrl: "/hat1.png", description: "Classic wide-brim straw hat for sun protection" },
];

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: PRODUCTS });
  console.log(`Seeded ${PRODUCTS.length} products`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
