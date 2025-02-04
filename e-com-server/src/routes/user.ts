import express from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user.js";
import { onlyAdmin } from "../middlewares/onlyAdmin.js";

const app = express.Router();

app.post("/new", newUser)
app.get("/all",onlyAdmin, getAllUsers)
app.get("/:id", getUser)
app.delete("/:id",onlyAdmin, deleteUser)

export default app;