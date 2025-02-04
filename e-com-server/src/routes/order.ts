import express from "express";
import { onlyAdmin } from "../middlewares/onlyAdmin.js";
import { allOrders, deleteOrder, getSingleOrderDetails, myOrders, newOrder, processOrders } from "../controllers/order.js";
const app = express.Router();

app.post("/new", newOrder)

app.get("/my", myOrders)

app.get("/allorder", onlyAdmin, allOrders)

app.get("/:id", getSingleOrderDetails)
app.put("/:id", onlyAdmin, processOrders)
app.delete("/:id", onlyAdmin, deleteOrder)

export default app;