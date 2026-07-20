import express from "express";

import {
  getProducts,
  postProducts,
  updateProducts,
  deleteProducts,
  getProductById,
} from "../controllers/ProductControllers.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public route
router.get("/get", getProducts);
router.get("/get/:id", getProductById);

// Admin protected routes
router.post("/post", verifyToken, verifyAdmin, postProducts);

router.put("/update/:id", verifyToken, verifyAdmin, updateProducts);

router.delete("/delete/:id", verifyToken, verifyAdmin, deleteProducts);

export default router;