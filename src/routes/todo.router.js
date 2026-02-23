import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
} from "../controllers/todo.controllers.js";
import { createTodoSchema } from "../validators/user.validators.js";
import { validate } from "../middleware/validate.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), validate(createTodoSchema), createTodo);
router.get("/", authMiddleware, getTodos);
router.put("/:id", authMiddleware, updateTodo);
router.delete("/:id", authMiddleware, deleteTodo);

export default router;