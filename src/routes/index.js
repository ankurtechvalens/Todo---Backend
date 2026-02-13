import express from "express";
import userRoutes from "./user.router.js";
import todoRoutes from "./todo.router.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/todos", todoRoutes);

export default router;