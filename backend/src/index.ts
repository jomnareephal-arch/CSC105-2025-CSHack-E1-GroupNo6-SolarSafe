import express from 'express'
import cors from 'cors'
import dotenv from "dotenv";
import router from './routers.js'
import { errorHandler } from './middlewares/error_handler.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

app.use("/api", router);
app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
