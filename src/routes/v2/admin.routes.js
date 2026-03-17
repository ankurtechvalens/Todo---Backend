import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/permission.middleware.js";

import * as adminController from "../../controllers/v2/admin.controller.js";
import * as userController from "../../controllers/v2/user.controllers.js";
import * as roleController from "../../controllers/v2/role.controller.js";
import * as permissionController from "../../controllers/v2/permission.controller.js";

const router = express.Router();


// ================= USER MANAGEMENT =================

// Create user
router.post(
  "/users",
  authMiddleware,
  requirePermission("users.create"),
  userController.registerUser
);

// Get all users
router.get(
  "/users",
  authMiddleware,
  requirePermission("users.read"),
  adminController.getAllUsers
);

// Get user's todos
router.get(
  "/users/:id/todos",
  authMiddleware,
  requirePermission("todos.read.any"),
  adminController.getUserTodos
);

// Update user (admin editing another user)
router.patch(
  "/users/:id",
  authMiddleware,
  requirePermission("users.update"),
  userController.updateUserByAdmin
);

// Change user role
router.patch(
  "/users/:id/role",
  authMiddleware,
  requirePermission("users.update"),
  userController.updateUserRole
);

// Delete user
router.delete(
  "/users/:id",
  authMiddleware,
  requirePermission("users.delete"),
  adminController.deleteUser
);


// ================= ROLE MANAGEMENT =================

// Create role
router.post(
  "/roles",
  authMiddleware,
  requirePermission("roles.create"),
  roleController.createRole
);

// Get all roles
router.get(
  "/roles",
  authMiddleware,
  requirePermission("roles.read"),
  roleController.getRoles
);

// Get single role
router.get(
  "/roles/:id",
  authMiddleware,
  requirePermission("roles.read"),
  roleController.getRole
);

// Update role
router.patch(
  "/roles/:id",
  authMiddleware,
  requirePermission("roles.update"),
  roleController.updateRole
);

// Delete role
router.delete(
  "/roles/:id",
  authMiddleware,
  requirePermission("roles.delete"),
  roleController.deleteRole
);


// ================= PERMISSION MANAGEMENT =================

// Create permission
router.post(
  "/permissions",
  authMiddleware,
  requirePermission("permissions.create"),
  permissionController.createPermission
);

// Get all permissions
router.get(
  "/permissions",
  authMiddleware,
  requirePermission("permissions.read"),
  permissionController.getPermissions
);

// Assign permission to role
router.post(
  "/roles/:roleId/permissions/:permissionId",
  authMiddleware,
  requirePermission("permissions.assign"),
  permissionController.assignPermission
);

// Remove permission from role
router.delete(
  "/roles/:roleId/permissions/:permissionId",
  authMiddleware,
  requirePermission("permissions.remove"),
  permissionController.removePermission
);

export default router;