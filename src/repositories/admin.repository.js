import { prisma } from "../config/prisma.js";

export const getAllUsers = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
};

export const getUserTodos = (userId) => {
  return prisma.todo.findMany({
    where: { userId }
  });
};

export const deleteUser = (userId) => {
  return prisma.user.delete({
    where: { id: userId }
  });
};