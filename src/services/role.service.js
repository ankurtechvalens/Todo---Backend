import * as roleRepository from "../repositories/role.repository.js";

export const createRole = async (data) => {
  return roleRepository.createRole(data);
};

export const getRoles = async () => {
  return roleRepository.getAllRoles();
};

export const getRole = async (roleId) => {
  return roleRepository.getRoleById(roleId);
};

export const deleteRole = async (roleId) => {
  return roleRepository.deleteRole(roleId);
};