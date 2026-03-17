import { prisma } from "../config/prisma.js";

export const createRole = (data) => {
  return prisma.role.create({
    data
  });
};

export const getAllRoles = () => {
  return prisma.role.findMany({
    include: {
      permissions: {
        include: {
          permission: true
        }
      }
    }
  });
};

export const getRoleById = (roleId) => {
  return prisma.role.findUnique({
    where: { id: roleId },
    include: {
      permissions: {
        include: {
          permission: true
        }
      }
    }
  });
};

export const deleteRole = (roleId) => {
  return prisma.role.delete({
    where: { id: roleId }
  });
};