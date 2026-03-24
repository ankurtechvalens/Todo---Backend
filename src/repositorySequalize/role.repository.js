import models from "../models/index.js";

const { Role, RolePermission, Permission } = models;

/*
  Create role
*/
export const createRole = async (data) => {
  return await Role.create(data);
};

/*
  Get all roles with permissions
*/
export const getAllRoles = async () => {
  return await Role.findAll({
    include: [
      {
        model: RolePermission,
        as: "permissions",
        include: [
          {
            model: Permission,
            as: "permission"
          }
        ]
      }
    ]
  });
};

/*
  Get role by ID with permissions
*/
export const getRoleById = async (roleId) => {
  return await Role.findByPk(roleId, {
    include: [
      {
        model: RolePermission,
        as: "permissions",
        include: [
          {
            model: Permission,
            as: "permission"
          }
        ]
      }
    ]
  });
};

/*
  Delete role
*/
export const deleteRole = async (roleId) => {
  const deletedRows = await Role.destroy({
    where: { id: roleId }
  });

  if (deletedRows === 0) {
    throw new Error("Role not found");
  }

  return true;
};