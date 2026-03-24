import express from "express";
import userRoutes from "./user.router.js";
import todoRoutes from "./todo.router.js";
import paymentRoutes from './payment.router.js'
import authRoutes from "./auth.routes.js";
import adminRoutes from './admin.routes.js'
import roleRoutes from "./role.routes.js";
import permissionRoutes from "./permission.routes.js";
import developerRoutes from "./developer.routes.js";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/todos", todoRoutes);
router.use("/payments", paymentRoutes);
router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/developer", developerRoutes);

export default router;