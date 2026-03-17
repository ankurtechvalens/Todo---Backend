import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/permission.middleware.js";
import * as roleController from "../../controllers/v2/role.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requirePermission("manage_roles"),
  roleController.createRole
);

router.get(
  "/",
  authMiddleware,
  requirePermission("manage_roles"),
  roleController.getRoles
);

router.get(
  "/:id",
  authMiddleware,
  requirePermission("manage_roles"),
  roleController.getRole
);

router.delete(
  "/:id",
  authMiddleware,
  requirePermission("manage_roles"),
  roleController.deleteRole
);

export default router;