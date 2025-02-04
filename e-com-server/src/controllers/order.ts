import { Request, Response, NextFunction } from "express"
import { Order } from "../models/order.js"
import ErrorHandler from "../utils/errorHandler.js"
import { TryCatch } from "../middlewares/asyncHandler.js"
import { NewOrderRequestBody } from "../types/types.js"
import { reduceStock } from "../utils/features.js"



// New Order place
export const newOrder = TryCatch(async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    
      const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total)
      return next(new ErrorHandler("Please Enter All Fields", 400));

    const order = await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });

    await reduceStock(orderItems)
    
    return res.status(201).json({
        success: true,
        message: "Order Placed Successfully",
    });
})

//My order 
export const myOrders = TryCatch(async (req, res, next) => {
    const { id: user } = req.query;

    let orders = await Order.find({ user });
    if (!orders) return next(new ErrorHandler("Order Not Found", 404));
    
    return res.status(200).json({
        success: true,
        ordersCount: orders.length,
        orders,
  });
})

// Admin only all Order Detials
export const allOrders = TryCatch(async (req, res, next) => {

    const orders = await Order.find().populate("user", "name");
    if (!orders) return next(new ErrorHandler("Order Not Found", 404));

    return res.status(200).json({
        success: true,
        odersCount: orders.length,
        orders,
    });
})

//get Single Orders Details
export const getSingleOrderDetails = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    
    const order = await Order.findById(id).populate("user", "name");
    if (!order) return next(new ErrorHandler("Order Not Found", 404));

    
    return res.status(200).json({
        success: true,
        order,
    });
    
})

// Admin Only Process Order
export const    processOrders = TryCatch(async (req, res, next) => {
    
    const { id } = req.params
    
    const order = await Order.findById(id)

    if (!order) return next(new ErrorHandler("Order Not Found", 404));

    // enum: ["Processing", "Shipped", "Delivered"],
    switch (order.status) {
        
        case "Processing": {
            order.status = "Shipped"
            break
        }
        case "Shipped": {
            order.status = "Delivered"
            break
        }
        default: {
            order.status = "Delivered"
            break
        }
    }

    await order.save()

    return res.status(200).json({
        success: true,
        message: "Order Processed Successfully",
    });
})


// Delete Order - Only Admin 
export const deleteOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return next(new ErrorHandler("Order Not Found", 404));
    
    console.log("order", order);
    

    await order.deleteOne();
    
    return res.status(200).json({
        success: true,
        message: "Order Deleted Successfully",
    });
});