import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/prisma/client";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

const rawUrl = process.env["DATABASE_URL"] ?? "file:./dev.db";
const databaseUrl = rawUrl.startsWith("file:./")
  ? `file:${path.resolve(rawUrl.replace("file:", ""))}`
  : rawUrl;

const adapter = new PrismaLibSql({ url: databaseUrl });

const globalForPrisma = globalThis as unknown as { prisma?: any };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env["NODE_ENV"] === "development" ? ["error"] : ["error"],
  });

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = prisma;
}