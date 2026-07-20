import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  getOrdersByUser,
  updateOrderAddress,
  updateOrderStatus,
} from "../controllers/OrdersControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/create", createOrder);

router.get("/get", getOrders);
router.get("/get/:id", getOrderById);
router.get("/my/:phone", getOrdersByUser);
router.put("/:id/status", verifyToken, verifyAdmin, updateOrderStatus);
router.put("/:id/address", verifyToken, verifyAdmin, updateOrderAddress);
router.delete("/delete/:id", deleteOrder);

export default router;
