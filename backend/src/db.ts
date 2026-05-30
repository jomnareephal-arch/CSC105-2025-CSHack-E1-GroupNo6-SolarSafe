import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/prisma/client.js";
import "dotenv/config";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

export const prisma = new PrismaClient({ adapter });