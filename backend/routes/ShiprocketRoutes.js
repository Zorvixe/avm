import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";
import {
  pushToShiprocket,
  getPickupLocations,
  generateAWB,
  checkAWBStatus,
  generateLabel,
  generateInvoice,
  proxyDownload,
  debugShiprocket,
  shiprocketTrackingWebhook
} from "../controllers/ShiprocketControllers.js";

const router = express.Router();

router.post("/webhook/order-tracking", shiprocketTrackingWebhook);
router.get("/webhook/order-tracking", (req, res) => {
  res.json({ success: true, message: "Shiprocket tracking webhook is reachable" });
});

// Shiprocket order actions (admin only)
router.post("/orders/:id/shiprocket", verifyToken, verifyAdmin, pushToShiprocket);
router.post("/orders/:id/awb", verifyToken, verifyAdmin, generateAWB);
router.get("/orders/:id/awb-status", verifyToken, verifyAdmin, checkAWBStatus);
router.post("/orders/:id/label", verifyToken, verifyAdmin, generateLabel);
router.post("/orders/:id/invoice", verifyToken, verifyAdmin, generateInvoice);

// Pickup locations
router.get("/pickup-locations", verifyToken, verifyAdmin, getPickupLocations);

// Proxy download for Shiprocket PDFs
router.post("/proxy-download", verifyToken, verifyAdmin, proxyDownload);

// Debug / test connection
router.get("/debug", verifyToken, verifyAdmin, debugShiprocket);

export default router;
