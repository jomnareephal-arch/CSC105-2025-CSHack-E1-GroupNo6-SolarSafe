import express from "express";
import cors from "cors";
import { prisma } from "./db";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import router from "./routers";

const app = express();
const PORT = process.env.PORT ?? 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", router);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
async function main() {
  await prisma.$connect();
  console.log("✅ Database connected");
  app.listen(PORT, () => {
    console.log(`🌞 Solar Safe API → http://localhost:${PORT}`);
  });
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});

export default app;
