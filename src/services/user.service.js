import {prisma} from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { generateAccessToken } from "../utils/generateToken.js";

export const createUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true }
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
};

export const logoutUser = async (req, res) => {
  await prisma.user.update({
    where: { id: req.user.id },
    data: { refreshToken: null }
  });

  res.clearCookie("refreshToken");

  res.json({ message: "Logged out" });
};


export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true }
  });
};

export const updateUser = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true }
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