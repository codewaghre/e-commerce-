import { Response, Request, NextFunction } from "express";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../middlewares/asyncHandler.js";
import { stripe } from "../app.js";    



// Add New Coupon :- Admin Only
export const newCoupon = TryCatch(async (req, res, next) => {
    const { code, amount } = req.body;
    
    if (!code || !amount)
        return next(new ErrorHandler("Please enter both coupon and amount", 400));

    await Coupon.create({ code, amount });

    return res.status(201).json({
        success: true,
        message: `Coupon ${code} Created Successfully`,
    });
})

// Dsicount 
export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;

  const discount = await Coupon.findOne({ code: coupon });

  if (!discount) return next(new ErrorHandler("Invalid Coupon Code", 400));

  return res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});


//get All Coupon list :- admin Only
export const allCoupons = TryCatch(async (req, res, next) => {
  
  const coupons = await Coupon.find()

  if (!coupons) return next(new ErrorHandler("Invalid Coupon Code", 400));

  return res.status(200).json({
      success: true,
      coupons,
  });
});


//get Single Coupon
export const getCoupon = TryCatch(async (req, res, next) => {
  
    const { id } = req.params
    const coupon = await Coupon.findById(id)

    if (!coupon) return next(new ErrorHandler("Invalid Coupon Code", 400));

    return res.status(200).json({
        success: true,
        coupon,
    });
});


// Delete Coupon
export const deleteCoupon = TryCatch(async (req, res, next) => {
  
    const { id } = req.params
    const coupon = await Coupon.findByIdAndDelete(id)

    if (!coupon) return next(new ErrorHandler("Invalid Coupon Code", 400));
    
    return res.status(200).json({
        success: true,
        message: "Coupon Deleted Sucessfully"
    });
});


//update Coupon 
export const updateCoupon = TryCatch(async (req, res, next) => {
  
    const { id } = req.params
    const {code, amount} = req.body
    const coupon = await Coupon.findById(id)

    if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

    if (code) coupon.code = code;
    if (amount) coupon.amount = amount;

    await coupon.save();

    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon.code} Updated Successfully`,
  });
});


//Stripe Payment
export const createPaymentIntent =  TryCatch(async (req, res, next) => {
  
    const { amount } = req.body 

    if(!amount) return next(new ErrorHandler("Please Enter amount",400 ));
 
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr",
        description: "MERN-Ecommerce",
    })
    return res.status(200).json({
        success: true,
        message: `Payment Done Scuessfully`,
         clientSecret: paymentIntent.client_secret,
  });
});



