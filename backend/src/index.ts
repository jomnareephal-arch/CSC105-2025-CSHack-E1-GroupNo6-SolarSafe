import express from 'express'
import cors from 'cors'
import dotenv from "dotenv";
import path from 'path'
import { fileURLToPath } from 'url'
import router from './routers.js'
import { errorHandler } from './middlewares/error_handler.js'
import { runMigrations } from './db.js'

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }))
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.get("/", (_req, res) => {
  res.send("Backend is running");
});
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", router);
app.use(errorHandler)


runMigrations().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
