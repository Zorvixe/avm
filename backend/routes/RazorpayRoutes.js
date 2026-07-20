import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment, razorpayWebhook } from "../controllers/RazorpayControllers.js";

const router = express.Router();

router.post("/order", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);
router.post("/webhook", express.raw({ type: "application/json" }), razorpayWebhook);

export default router;
