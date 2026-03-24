import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

import * as userRepository from "../repositorySequalize/user.repository.js";
import * as sessionRepo from "../repositorySequalize/userSession.repository.js";

import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { sendEmail } from "./email.service.js";
import { verifyEmailTemplate } from "../templates/emails/verifyEmail.template.js";

/*
  CREATE USER
*/
export const createUser = async ({ name, email, password, roleId }) => {
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return userRepository.createUser({
    name,
    email,
    password: hashedPassword,
    roleId,
  });
};


/*
  REGISTER SERVICE (NEW)
*/
export const registerUserService = async (data) => {
  const user = await createUser(data);

  const accessToken = generateAccessToken(user);
  const { refreshToken, hashedToken } = await generateRefreshToken(user);

  return {
    user,
    accessToken,
    refreshToken,
    hashedToken,
  };
};


/*
  EMAIL VERIFICATION
*/
export const verificationEmailService = async (user) => {
  const emailToken = generateVerificationToken();

  const hashed = crypto
    .createHash("sha256")
    .update(emailToken)
    .digest("hex");

  await userRepository.saveEmailVerificationToken(user.id, hashed);

  const link = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`;
  const html = verifyEmailTemplate(user.name, link);

  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html,
  });
};


/*
  VERIFY EMAIL LINK
*/
export const verifyEmailLink = async (token) => {
  if (!token) throw new Error("Token is required");

  const hashed = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await userRepository.findUserByEmailToken(hashed);

  if (!user) throw new Error("Invalid or expired token");

  if (user.isVerified) {
    return { message: "Already verified" };
  }

  await userRepository.updateUserDataForEmailLink(user.id);

  return { message: "Email verified successfully" };
};


/*
  LOGIN SERVICE
*/
export const loginUserService = async ({ email, password }) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) throw new Error("Invalid credentials");

  // SSO CHECK
  if (user.googleId || user.linkedinId || user.githubId) {
    let provider = "SSO";
    if (user.googleId) provider = "Google";
    if (user.linkedinId) provider = "LinkedIn";
    if (user.githubId) provider = "GitHub";

    throw new Error(`Please login using ${provider}`);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (!user.isVerified) {
    throw new Error("Please verify your email first");
  }

  const accessToken = generateAccessToken(user);
  const { refreshToken, hashedToken } = await generateRefreshToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name,
      roleId: user.roleId,
      isVerified: user.isVerified,
    },
    accessToken,
    refreshToken,
    hashedToken,
  };
};


/*
  CREATE SESSION
*/
export const createSessionService = async ({
  userId,
  hashedToken,
  userAgent,
  ipAddress,
}) => {
  return sessionRepo.createSession({
    userId,
    refreshTokenHash: hashedToken,
    userAgent,
    ipAddress,
    isActive: true,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};


/*
  LOGOUT (single device)
*/
export const logoutUserService = async (refreshToken) => {
  if (!refreshToken) throw new Error("No token provided");

  const hashed = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionRepo.findSessionByHash(hashed);
  console.log("sesion check --- ", hashed);
  if (!session) throw new Error("Session not found");

  await sessionRepo.deactivateSession(hashed);
};


/*
  REFRESH TOKEN (ROTATION)
*/
export const refreshAccessTokenService = async (refreshToken) => {
  if (!refreshToken) throw new Error("No token provided");

  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch {
    throw new Error("Invalid or expired refresh token");
  }

  const hashed = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionRepo.findSessionByHash(hashed);

  if (!session) throw new Error("Session expired");

  const user = await userRepository.findUserById(decoded.id);

  const accessToken = generateAccessToken(user);

  const {
    refreshToken: newRefreshToken,
    hashedToken: newHash,
  } = await generateRefreshToken(user);

  // rotate session
  await sessionRepo.deactivateSession(hashed);

  await sessionRepo.createSession({
    userId: user.id,
    refreshTokenHash: newHash,
    userAgent: "unknown",
    ipAddress: "unknown",
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};


/*
  GET USER
*/
export const getUserById = async (id) => {
  return userRepository.findUserSafeById(id);
};


/*
  UPDATE USER
*/
export const updateUser = async (id, data) => {
  if (data.role) delete data.role;
  return userRepository.updateUserSafe(id, data);
};


/*
  UPDATE ROLE
*/
export const updateUserRoleService = async (req) => {
  const { roleId } = req.body;
  return userRepository.updateUserRoleFunc(roleId, req.params.id);
};


/*
  CHANGE PLAN
*/
export const changeUserPlan = async (userId, role) => {
  if (role !== "BASIC") throw new Error("Invalid role change");
  return userRepository.updateUserRole(userId, "BASIC");
};


/*
  SAVE FCM TOKEN
*/
export const saveFcmToken = async (userId, token) => {
  return userRepository.saveFcmTok(userId, token);
};