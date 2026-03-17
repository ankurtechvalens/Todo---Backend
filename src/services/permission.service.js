import * as permissionRepository from "../repositories/permission.repository.js";

export const createPermission = async (data) => {
  return permissionRepository.createPermission(data);
};

export const getPermissions = async () => {
  return permissionRepository.getAllPermissions();
};

export const assignPermission = async (roleId, permissionId) => {
  return permissionRepository.assignPermissionToRole(roleId, permissionId);
};

export const removePermission = async (roleId, permissionId) => {
  return permissionRepository.removePermissionFromRole(roleId, permissionId);
};