import express from "express";
import { onlyAdmin } from "../middlewares/onlyAdmin.js";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, getCoupon, newCoupon, updateCoupon } from "../controllers/payment.js";
const app = express.Router();


// Payment
app.post("/create", createPaymentIntent)

app.post("/coupon/new",onlyAdmin, newCoupon)
app.get("/discount", applyDiscount)

app.get("/coupon/all", onlyAdmin, allCoupons)

app.get("/coupon/:id", onlyAdmin, getCoupon)
app.delete("/coupon/:id", onlyAdmin, deleteCoupon)
app.put("/coupon/:id", onlyAdmin, updateCoupon)

export default app;