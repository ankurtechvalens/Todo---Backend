import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
} from "../../controllers/v2/todo.controllers.js";
import { createTodoSchema } from "../../validators/user.validators.js";
import { validate } from "../../middleware/validate.js";
import upload from "../../middleware/upload.js";
import { authorize } from "../../middleware/role.middleware.js";
import { apiAuthMiddleware } from "../../middleware/apiKey.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), validate(createTodoSchema), createTodo);
router.get("/", authMiddleware, getTodos);
router.put("/:id", authMiddleware, updateTodo);
router.delete("/:id", authMiddleware, deleteTodo);

router.get("/developer", apiAuthMiddleware, getTodos);

export default router;