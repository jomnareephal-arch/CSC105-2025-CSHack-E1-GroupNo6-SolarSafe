import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/prisma/client.js";
import "dotenv/config";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const PRODUCTS = [
  { name: "UPF 50+ Wide-Brim Sun Hat", category: "hats", price: 290, protectionScore: 110, imageUrl: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&q=80", description: "หมวกปีกกว้าง ป้องกัน UV ได้สูงสุด" },
  { name: "Lightweight Bucket Hat UPF 40", category: "hats", price: 150, protectionScore: 80, imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80", description: "หมวกบัคเก็ตน้ำหนักเบา" },
  { name: "Foldable Sun Hat UPF 30", category: "hats", price: 89, protectionScore: 60, imageUrl: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=400&q=80", description: "พับเก็บได้ ราคาประหยัด" },
  { name: "Polarized UV400 Sport Sunglasses", category: "sunglasses", price: 450, protectionScore: 120, imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80", description: "แว่นกันแดดโพลาไรซ์ กรอง UV 100%" },
  { name: "Classic UV380 Sunglasses", category: "sunglasses", price: 199, protectionScore: 90, imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80", description: "ทรงคลาสสิก ป้องกัน UV380" },
  { name: "Kids UV300 Sunglasses", category: "sunglasses", price: 79, protectionScore: 60, imageUrl: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&q=80", description: "แว่นสำหรับเด็ก น้ำหนักเบา" },
  { name: "Anessa SPF 50+ PA++++ Sunscreen", category: "sunscreen", price: 350, protectionScore: 120, imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80", description: "ครีมกันแดดสูตรน้ำ กันน้ำ กันเหงื่อ" },
  { name: "Neutrogena SPF 50 Ultra Sheer", category: "sunscreen", price: 280, protectionScore: 100, imageUrl: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&q=80", description: "เนื้อบางเบา ไม่อุดตันรูขุมขน" },
  { name: "Budget SPF 30 Daily Sunscreen", category: "sunscreen", price: 85, protectionScore: 60, imageUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80", description: "ใช้ทุกวัน ราคาประหยัด" },
  { name: "Black Coating UV Protection Umbrella", category: "umbrella", price: 320, protectionScore: 110, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", description: "ร่มเคลือบดำ กัน UV สูงถึง 99%" },
  { name: "Compact Folding UV Umbrella", category: "umbrella", price: 180, protectionScore: 80, imageUrl: "https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=400&q=80", description: "พับเก็บง่าย พกพาสะดวก" },
  { name: "Basic Sun Umbrella", category: "umbrella", price: 75, protectionScore: 50, imageUrl: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=400&q=80", description: "ร่มพื้นฐาน ราคาถูก" },
  { name: "UPF 50+ Sun Protection Jacket", category: "uv-jacket", price: 890, protectionScore: 120, imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80", description: "เสื้อแจ็คเก็ตป้องกัน UV สูงสุด" },
  { name: "Lightweight UV Hoodie UPF 40", category: "uv-jacket", price: 550, protectionScore: 90, imageUrl: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400&q=80", description: "ฮู้ดดี้น้ำหนักเบา ใส่สบาย" },
  { name: "Basic UV Cover-Up UPF 30", category: "uv-jacket", price: 250, protectionScore: 60, imageUrl: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=400&q=80", description: "เสื้อคลุมพื้นฐาน ราคาประหยัด" },
];

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: PRODUCTS });
  console.log(`Seeded ${PRODUCTS.length} products`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
