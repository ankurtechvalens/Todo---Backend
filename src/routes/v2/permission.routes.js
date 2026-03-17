import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/permission.middleware.js";
import * as permissionController from "../../controllers/v2/permission.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requirePermission("manage_roles"),
  permissionController.createPermission
);

router.get(
  "/",
  authMiddleware,
  requirePermission("manage_roles"),
  permissionController.getPermissions
);

router.post(
  "/assign",
  authMiddleware,
  requirePermission("manage_roles"),
  permissionController.assignPermission
);

router.post(
  "/remove",
  authMiddleware,
  requirePermission("manage_roles"),
  permissionController.removePermission
);

export default router;