import express from "express";
import { onlyAdmin } from "../middlewares/onlyAdmin.js";
import { getDashboardStats, getPieCharts, getBarCharts, getLineCharts } from "../controllers/stats.js";

const app = express.Router();

// route - /api/v1/dashboard/stats
app.get("/stats", onlyAdmin, getDashboardStats );

// route - /api/v1/dashboard/pie
app.get("/pie", onlyAdmin, getPieCharts);

// route - /api/v1/dashboard/bar
app.get("/bar", onlyAdmin,getBarCharts);

// route - /api/v1/dashboard/line
app.get("/line",onlyAdmin, getLineCharts);

export default app;