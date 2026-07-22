import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoryController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/get", getCategories);
router.get("/get/:id", getCategoryById);

// Protected Routes (Admin)
router.post("/create", verifyToken, createCategory);
router.put("/update/:id", verifyToken, updateCategory);
router.delete("/delete/:id", verifyToken, deleteCategory);

export default router;