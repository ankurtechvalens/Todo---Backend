import { prisma } from "../config/prisma.js";

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id }
  });
};

export const createUser = async (data) => {
  return prisma.user.create({
    data,
    select: { id: true, name: true, email: true, role: true }
  });
};

export const updateUserById = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data
  });
};

export const findUserByRefreshToken = async (refreshToken) => {
  return prisma.user.findFirst({
    where: { refreshToken }
  });
};

export const clearRefreshToken = async (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null }
  });
};