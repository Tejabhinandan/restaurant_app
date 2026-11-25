import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import process from "node:process";
import { connectDB } from "./config/db.js";
import menuRoutes from "./routes/MenuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";


dotenv.config();
connectDB()

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials:true,
  })
);
app.use(express.json());

app.get("/api/health",(req, res)=>{
  res.json({status: "ok", service: "Restaurant API"})
})

app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes)

const PORT= process.env.PORT || 5000;
app.listen(PORT,()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});