import models from "../models/index.js";

const { Permission, RolePermission } = models;

/*
  Create permission
*/
export const createPermission = async (data) => {
  return await Permission.create(data);
};

/*
  Get all permissions
*/
export const getAllPermissions = async () => {
  return await Permission.findAll();
};

/*
  Assign permission to role
*/
export const assignPermissionToRole = async (roleId, permissionId) => {
  return await RolePermission.create({
    roleId,
    permissionId
  });
};

/*
  Remove permission from role
*/
export const removePermissionFromRole = async (roleId, permissionId) => {
  const deletedRows = await RolePermission.destroy({
    where: {
      roleId,
      permissionId
    }
  });

  if (deletedRows === 0) {
    throw new Error("Permission not assigned to role");
  }

  return true;
};