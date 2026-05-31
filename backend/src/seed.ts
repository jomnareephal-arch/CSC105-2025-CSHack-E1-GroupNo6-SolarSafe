import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/prisma/client.js";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dateId(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function uvLevel(uv: number): string {
  if (uv === 0)  return "none";
  if (uv <= 26)  return "low";
  if (uv <= 35)  return "moderate";
  if (uv <= 49)  return "high";
  if (uv <= 70)  return "very_high";
  return "extreme";
}

const BASE_UV: Record<number, number> = {
  0: 0,  1: 0,  2: 0,  3: 0,  4: 0,  5: 0,
  6: 20, 7: 23, 8: 26, 9: 30, 10: 34,
  11: 37, 12: 52, 13: 50, 14: 47,
  15: 36, 16: 29, 17: 25,
  18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0,
};

const DAY_SHIFT: Record<number, number> = {
  [-3]: -4, [-2]: -2, [-1]: +3,
  [0]: 0,
  [1]: +5, [2]: -1, [3]: +2,
};

function uvForDay(hour: number, offset: number): number {
  const base = BASE_UV[hour] ?? 0;
  if (base === 0) return 0;
  return Math.max(0, base + (DAY_SHIFT[offset] ?? 0));
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const USERS = [
  { username: "admin", password: "admin1234", role: "admin" },
  { username: "demo",  password: "demo1234",  role: "user"  },
  { username: "alice", password: "alice123",  role: "user"  },
];

const PRODUCTS = [
  // Hats
  { name: "Classic Wide-Brim Straw",   category: "hats",       price: 180,  protectionScore: 80,  imageUrl: "/hat1.png", description: "Classic wide-brim straw hat for sun protection. Blocks 98% of harmful UV rays." },
  { name: "UV Warrior Bucket Hat",     category: "hats",       price: 250,  protectionScore: 50,  imageUrl: null, description: "Breathable polyester bucket hat rated UPF 50. Folds flat for easy packing." },
  { name: "Safari Adventure Hat",      category: "hats",       price: 390,  protectionScore: 50,  imageUrl: null, description: "Full-brim safari hat with neck flap. UPF 50 rated. Adjustable chin strap." },
  { name: "Urban Baseball Cap UPF",    category: "hats",       price: 150,  protectionScore: 40,  imageUrl: null, description: "Modern baseball cap with UPF 40 fabric. Sweat-wicking band inside." },
  { name: "Titanium Wide-Brim UPF 99", category: "hats",       price: 680,  protectionScore: 99,  imageUrl: null, description: "Premium wide-brim hat with UPF 99 rating. Titanium-infused fabric. The ultimate sun shield." },
  // Sunglasses
  { name: "UV Shield Pro Wrap",        category: "sunglasses", price: 450,  protectionScore: 99,  imageUrl: null, description: "Wraparound frame with UV 400 lenses. Blocks 99% of UVA and UVB." },
  { name: "Daily UV Blocker",          category: "sunglasses", price: 180,  protectionScore: 95,  imageUrl: null, description: "Lightweight everyday sunglasses with 95% UV blocking." },
  { name: "Sport Wraparound Elite",    category: "sunglasses", price: 620,  protectionScore: 99,  imageUrl: null, description: "Sport-grade wraparound with anti-glare and UV 99% protection." },
  { name: "Polarized UV Guard",        category: "sunglasses", price: 380,  protectionScore: 98,  imageUrl: null, description: "Polarized lenses cut glare from reflective surfaces. 98% UV protection." },
  { name: "Tactical UV Eyewear",       category: "sunglasses", price: 850,  protectionScore: 99,  imageUrl: null, description: "Military-grade tactical eyewear. Shatterproof ballistic lenses with full UV 99% coverage." },
  // Sunscreen
  { name: "SolarSafe Daily SPF 50",    category: "sunscreen",  price: 180,  protectionScore: 50,  imageUrl: null, description: "Lightweight daily-use sunscreen. SPF 50 broad-spectrum. Water-resistant 80 min." },
  { name: "UltraBlock SPF 100",        category: "sunscreen",  price: 420,  protectionScore: 100, imageUrl: null, description: "Maximum protection SPF 100 sunscreen. Zinc oxide formula for fair skin." },
  { name: "Everyday Defense SPF 30",   category: "sunscreen",  price: 120,  protectionScore: 30,  imageUrl: null, description: "Affordable everyday SPF 30 sunscreen. Tinted formula for a natural look." },
  { name: "Sport Spray SPF 50+",       category: "sunscreen",  price: 280,  protectionScore: 50,  imageUrl: null, description: "Easy-apply spray. SPF 50+ for active outdoor use. Sweat-proof, water-resistant 120 min." },
  { name: "Kids Gentle SPF 70",        category: "sunscreen",  price: 320,  protectionScore: 70,  imageUrl: null, description: "Gentle mineral formula for children. SPF 70. Fragrance-free and hypoallergenic." },
  // Umbrella
  { name: "UV Canopy Elite",           category: "umbrella",   price: 850,  protectionScore: 99,  imageUrl: null, description: "Large 120 cm canopy with UV 99% blocking. Titanium-coated inner lining." },
  { name: "Compact UV Shield",         category: "umbrella",   price: 580,  protectionScore: 95,  imageUrl: null, description: "Foldable compact umbrella with 95% UV protection. Automatic open/close." },
  { name: "Titanium UV Umbrella Pro",  category: "umbrella",   price: 1380, protectionScore: 99,  imageUrl: null, description: "Professional 140 cm UV umbrella. Carbon fibre ribs. Reduces temperature by 10°C." },
  { name: "Everyday UV Parasol",       category: "umbrella",   price: 420,  protectionScore: 90,  imageUrl: null, description: "Elegant parasol with 90% UV blocking. Wooden handle." },
  // UV Jacket
  { name: "UltraShield UV Jacket",     category: "uv-jacket",  price: 1250, protectionScore: 50,  imageUrl: null, description: "Full-body UV jacket with UPF 50 rating. Hooded design. Mesh lining for breathability." },
  { name: "Lightweight UV Hoodie",     category: "uv-jacket",  price: 890,  protectionScore: 40,  imageUrl: null, description: "Slim-fit UV hoodie. UPF 40. Moisture-wicking fabric." },
  { name: "UV Protective Arm Sleeves", category: "uv-jacket",  price: 280,  protectionScore: 50,  imageUrl: null, description: "Pair of UV arm sleeves rated UPF 50. Perfect for cyclists and outdoor workers." },
  { name: "Full UV Coverage Suit",     category: "uv-jacket",  price: 2990, protectionScore: 50,  imageUrl: null, description: "Head-to-toe UV protection suit. UPF 50. Two-piece design." },
  { name: "UV Tech Windbreaker",       category: "uv-jacket",  price: 1580, protectionScore: 50,  imageUrl: null, description: "UV-blocking windbreaker with UPF 50 outer shell. Wind and rain resistant." },
];

const SAMPLE_ACTIVITIES = [
  { name: "morning jog",      start: 6,  end: 8,  dur: 60, reason: "UV 20 in the early morning is low — the safest window for morning jog. Wear a hat and sunglasses." },
  { name: "grocery shopping", start: 9,  end: 11, dur: 60, reason: "UV 30 in the morning offers balanced daylight — a suitable time for grocery shopping." },
  { name: "evening walk",     start: 17, end: 18, dur: 60, reason: "UV 25 in the evening is low — the safest window for evening walk. Wear a hat and sunglasses." },
];

const SAMPLE_CALCULATIONS = [
  { skinType: "II",  outdoorTime: "12:00", protectionItems: JSON.stringify([{ type: "sunscreen", spf: 50 }]),                                                                                                    protectionScore: 24.5, safeOutdoorMinutes: 5  },
  { skinType: "IV",  outdoorTime: "09:00", protectionItems: JSON.stringify([{ type: "sunscreen", spf: 50 }, { type: "hat", hat_factor: 80 }]),                                                                   protectionScore: 32.5, safeOutdoorMinutes: 18 },
  { skinType: "I",   outdoorTime: "06:00", protectionItems: JSON.stringify([]),                                                                                                                                   protectionScore: 0,    safeOutdoorMinutes: 7  },
  { skinType: "VI",  outdoorTime: "12:00", protectionItems: JSON.stringify([{ type: "uvJacket", upf: 50 }, { type: "sunscreen", spf: 50 }, { type: "umbrella", umbrella_factor: 95 }]),                          protectionScore: 82,   safeOutdoorMinutes: 31 },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...\n");

  // ── 1. Clear existing data (FK order) ────────────────────────────────────────
  await prisma.calculation.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.uVData.deleteMany();
  await prisma.day.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  console.log("✓ Cleared existing data");

  // ── 2. Users ──────────────────────────────────────────────────────────────────
  for (const u of USERS) {
    await prisma.user.create({
      data: { username: u.username, password: await bcrypt.hash(u.password, 10), role: u.role },
    });
  }
  console.log(`✓ Seeded ${USERS.length} users  (admin/admin1234 · demo/demo1234 · alice/alice123)`);

  // ── 3. Products ───────────────────────────────────────────────────────────────
  await prisma.product.createMany({ data: PRODUCTS.map(p => ({ ...p, active: 1 })) });
  console.log(`✓ Seeded ${PRODUCTS.length} products`);

  // ── 4. UV data for 7 days ────────────────────────────────────────────────────
  const dayOffsets = [-3, -2, -1, 0, 1, 2, 3];
  for (const offset of dayOffsets) {
    const dayId = dateId(offset);
    await prisma.day.upsert({
      where:  { id: dayId },
      update: {},
      create: {
        id: dayId, date: dayId,
        uvData: {
          create: Array.from({ length: 24 }, (_, hour) => {
            const uv = uvForDay(hour, offset);
            return { hour, uvIndex: uv, level: uvLevel(uv) };
          }),
        },
      },
    });
  }
  console.log(`✓ Seeded UV data for ${dayOffsets.length} days  (${dateId(-3)} → ${dateId(3)})`);

  // ── 5. Sample activities for today ────────────────────────────────────────────
  const todayId = dateId(0);
  for (const act of SAMPLE_ACTIVITIES) {
    await prisma.activity.create({
      data: {
        name: act.name, dayId: todayId,
        recommendedStart: act.start, recommendedEnd: act.end,
        durationMinutes: act.dur, reason: act.reason,
      },
    });
  }
  console.log(`✓ Seeded ${SAMPLE_ACTIVITIES.length} activities for today (${todayId})`);

  // ── 6. Sample calculations ─────────────────────────────────────────────────────
  await prisma.calculation.createMany({ data: SAMPLE_CALCULATIONS });
  console.log(`✓ Seeded ${SAMPLE_CALCULATIONS.length} calculations`);

  console.log("\n🌱 Seed complete!\n");
  console.log("  Admin  →  admin / admin1234");
  console.log("  Demo   →  demo  / demo1234");
  console.log("  Alice  →  alice / alice123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
