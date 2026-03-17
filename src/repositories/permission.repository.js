import { prisma } from "../config/prisma.js";

export const createPermission = (data) => {
  return prisma.permission.create({
    data
  });
};

export const getAllPermissions = () => {
  return prisma.permission.findMany();
};

export const assignPermissionToRole = (roleId, permissionId) => {
  return prisma.rolePermission.create({
    data: {
      roleId,
      permissionId
    }
  });
};

export const removePermissionFromRole = (roleId, permissionId) => {
  return prisma.rolePermission.delete({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId
      }
    }
  });
};