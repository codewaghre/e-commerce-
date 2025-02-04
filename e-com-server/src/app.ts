import express from "express";
import cors from "cors"
import { config } from "dotenv"
import morgan, { Morgan } from "morgan"; 

import {connectDB} from "./utils/db.js";
import { DB_NAME } from "./utils/contance.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import Stripe from "stripe";
import cookieParser from 'cookie-parser'
import { v2 as cloudinary } from 'cloudinary';

//Importing Routes
import userRoute from './routes/user.js'
import productRoute from './routes/product.js'
import orderRoute from "./routes/order.js"
import paymentRoute from './routes/payment.js'
import dashboardRoute from "./routes/stats.js"



config({
  path: "./.env",
});

const port = process.env.PORT
const stripeKey = process.env.STRIPE_KEY || "";


export const stripe = new Stripe(stripeKey)



// Connect Database
connectDB().then(() => {
  console.log(`Database name:- ${DB_NAME}`);
}).catch((error) => {
   console.log(error.message);
}) 


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_APP_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const app = express()

// Middleware to parse JSON bodies
app.use(express.json());
app.use(morgan("dev"))
app.use(cors({
  origin: process.env.ALLOW_ORIGIN,
  credentials:true
}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});

// all Routes
app.use("/api/v1/user", userRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/order", orderRoute)
app.use("/api/v1/payment", paymentRoute)
app.use("/api/v1/dashboard", dashboardRoute)


//make uploads folder static
app.use("/uploads", express.static("uploads"))

//handler Error Middleware
app.use(errorMiddleware)


app.listen(port, () => {
    console.log(` server is running on ${port}`);
})