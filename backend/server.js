import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { initDatabase } from "./database/initDatabase.js";
import ProductRoutes from "./routes/ProductRoutes.js"
import AuthRoutes from "./routes/AuthRoutes.js";
import OrderRoutes from "./routes/OrderRoutes.js";
import RazorpayRoutes from "./routes/RazorpayRoutes.js";
import SettingsRoutes from "./routes/SettingsRoutes.js";
import ShiprocketRoutes from "./routes/ShiprocketRoutes.js";
import { razorpayWebhook } from "./controllers/RazorpayControllers.js";
dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)

// Socket.IO for real-time order notifications
const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
})

io.on("connection", (socket) => {
  console.log("🔌 Admin connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔌 Admin disconnected:", socket.id);
  });
});

// Make io accessible in routes
app.set("io", io);

app.use(cors())

app.post("/razorpay/webhook", express.raw({ type: "application/json" }), razorpayWebhook);

app.use(express.json())

app.use("/products", ProductRoutes)
app.use("/auth", AuthRoutes);
app.use("/orders", OrderRoutes);
app.use("/razorpay", RazorpayRoutes);
app.use("/settings", SettingsRoutes);
app.use("/shiprocket", ShiprocketRoutes);

app.get("/", (req, res) => res.send("AVM API is running 🚀"));

const startServer = async () => {
  try {
    await initDatabase();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
