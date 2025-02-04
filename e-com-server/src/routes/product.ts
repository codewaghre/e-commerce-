import express from "express";
import { onlyAdmin } from "../middlewares/onlyAdmin.js";
import { getAllCategories, getAdminProduct, getLatestProduct, newProduct, getSingleProduct, updateProduct, deleteProduct, getAllProducts } from "../controllers/product.js";
import { mutliUpload, singleUpload } from "../middlewares/multer.js";

const app = express.Router();


app.post("/new", onlyAdmin, mutliUpload, newProduct)

app.get("/latest", getLatestProduct)

app.get("/categories", getAllCategories)

app.get("/admin-product", onlyAdmin, getAdminProduct)

app.get("/all", getAllProducts)

app.get("/:id", getSingleProduct)

app.put("/:id",onlyAdmin, mutliUpload, updateProduct)

app.delete("/:id", onlyAdmin, deleteProduct)



export default app;