import express from "express";
import userRoutes from "./user.router.js";
import todoRoutes from "./todo.router.js";
import paymentRoutes from './payment.router.js'
import authRoutes from "./auth.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/todos", todoRoutes);
router.use("/payments", paymentRoutes);
router.use("/auth", authRoutes);
export default router;