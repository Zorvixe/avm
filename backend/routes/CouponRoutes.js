import express from "express";

import {

createCoupon,

getCoupons,

getCoupon,

updateCoupon,

deleteCoupon,

applyCoupon,
getAvailableCoupons

} from "../controllers/CouponController.js";

const router = express.Router();

router.post("/create", createCoupon);

router.get("/get", getCoupons);

router.get("/get/:id", getCoupon);

router.put("/update/:id", updateCoupon);

router.delete("/delete/:id", deleteCoupon);

router.post("/apply", applyCoupon);
router.get("/available", getAvailableCoupons);

export default router;