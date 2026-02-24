import {prisma} from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { generateAccessToken } from "../utils/generateToken.js";
import * as userRepository from '../repositories/user.repository.js'

export const createUser = async ({ name, email, password }) => {
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return userRepository.userCreate({name, email, password: hashedPassword});
  // return prisma.user.create({
  //   data: { name, email, password: hashedPassword },
  //   select: { id: true, name: true, email: true }
  // });
};

export const loginUser = async ({ email, password }) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    const error = new Error("Email not found - Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Wrong Password - Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("No refresh token provided");
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.findUserByRefreshToken(refreshToken);

  if (!user) {
    const error = new Error("User not logged in !!");
    error.statusCode = 400;
    throw error;
  }

  await userRepository.clearRefreshToken(user.id);
};

export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true }
  });
};

export const updateUser = async (id, data) => {
  if (data.role) {
    delete data.role;
  }

  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true }
  });
};

export const saveRefreshToken = async (userId, token) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: token }
  });
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("No refresh token provided");
    error.statusCode = 401;
    throw error;
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch {
    const error = new Error("Invalid refresh token");
    error.statusCode = 403;
    throw error;
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { id: decoded.id }
  });

  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("Refresh token mismatch");
    error.statusCode = 403;
    throw error;
  }

  const newAccessToken = generateAccessToken(user);

  return newAccessToken;
};

export const changeUserPlan = async (userId, role) => {

  // Only allow BASIC downgrade manually
  if (role !== "BASIC") {
    const error = new Error("Invalid role change");
    error.statusCode = 400;
    throw error;
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role: "BASIC" },
    select: { id: true, name: true, email: true, role: true }
  });
};