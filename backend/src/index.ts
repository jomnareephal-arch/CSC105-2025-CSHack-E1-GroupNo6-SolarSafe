import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
