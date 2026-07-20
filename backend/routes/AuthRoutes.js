import express from "express";
import {
  registerUser,
  loginUser,
  adminRegister,
  adminLogin,
} from "../controllers/AuthControllers.js";

const router = express.Router();

// Customer
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin
router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);

export default router;