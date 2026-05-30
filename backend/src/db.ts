import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/prisma/client.js";
import "dotenv/config";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

export const prisma = new PrismaClient({ adapter });

// Apply pending migrations on startup (idempotent)
export async function runMigrations() {
  // Add active column to Product if it doesn't exist
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "Product" ADD COLUMN "active" INTEGER NOT NULL DEFAULT 1')
  } catch {
    // Column already exists — ignore
  }
  // Add role column to User if it doesn't exist
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT \'user\'')
  } catch {
    // Column already exists — ignore
  }
}