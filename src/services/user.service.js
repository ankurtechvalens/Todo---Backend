import {prisma} from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import * as userRepository from '../repositories/user.repository.js'

export const createUser = async ({ name, email, password }) => {
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return userRepository.createUser({name, email, password: hashedPassword});

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

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  const user = await userRepository.findUserById(decoded.id);

  if (!user || !user.refreshToken) {
    const error = new Error("User not logged in");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(
    refreshToken,
    user.refreshToken
  );

  if (!isMatch) {
    const error = new Error("Invalid session");
    error.statusCode = 400;
    throw error;
  }

  await userRepository.updateRefreshToken(user.id, null);
};

export const getUserById = async (id) => {
  return userRepository.findUserSafeById(id);
};

export const updateUser = async (id, data) => {
  if (data.role) {
    delete data.role;
  }

  return userRepository.updateUserSafe(id, data);
};

export const saveRefreshToken = async (userId, token) => {
  await userRepository.updateRefreshToken(userId, token)
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("No refresh token provided");
    error.statusCode = 401;
    throw error;
  }

  let decoded;

  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 403;
    throw error;
  }

  const user = await userRepository.findUserById(decoded.id);

  if (!user || !user.refreshToken) {
    const error = new Error("Session not found");
    error.statusCode = 403;
    throw error;
  }

  const isMatch = await bcrypt.compare(
    refreshToken,
    user.refreshToken
  );

  if (!isMatch) {
    // Reuse detection
    await userRepository.updateRefreshToken(user.id, null);

    const error = new Error("Refresh token reuse detected");
    error.statusCode = 403;
    throw error;
  }

  const newAccessToken = generateAccessToken(user);

  const {
    refreshToken: newRefreshToken,
    hashedToken: newHashedToken
  } = await generateRefreshToken(user);

  await userRepository.updateRefreshToken(
    user.id,
    newHashedToken
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

export const changeUserPlan = async (userId, role) => {
  if (role !== "BASIC") {
    const error = new Error("Invalid role change");
    error.statusCode = 400;
    throw error;
  }

  return userRepository.updateUserRole(userId, "BASIC");
};