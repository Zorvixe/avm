import express from "express";
import {
  getPublicRazorpayKey,
  getSettings,
  getShiprocketSettings,
  testShiprocketConnection,
  updateSetting,
  updateSettingsBulk,
} from "../controllers/SettingsControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public — frontend fetches Razorpay key_id
router.get("/public/razorpay-key", getPublicRazorpayKey);

// Admin only
router.get("/", verifyToken, verifyAdmin, getSettings);
router.get("/shiprocket", verifyToken, verifyAdmin, getShiprocketSettings);
router.post("/shiprocket-test", verifyToken, verifyAdmin, testShiprocketConnection);
router.put("/", verifyToken, verifyAdmin, updateSettingsBulk);
router.put("/:key", verifyToken, verifyAdmin, updateSetting);

export default router;
