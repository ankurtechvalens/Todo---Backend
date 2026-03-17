import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/generateToken.js";
import * as userRepository from '../repositories/user.repository.js'
import {
  generateVerificationToken
} from "../utils/generateVerificationToken.js";
import crypto from "crypto";
import {
  sendEmail
} from "./email.service.js";
import {
  verifyEmailTemplate
} from '../templates/emails/verifyEmail.template.js'

export const createUser = async ({
  name,
  email,
  password,
  roleId
}) => {

  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return userRepository.createUser({
    name,
    email,
    password: hashedPassword,
    roleId
  });

};

export const verificationEmailService = async (user) => {
  try {
    // 1. Generate token
    const emailToken = generateVerificationToken();

    // 2. Hash token
    const emailVerificationHashed = crypto
      .createHash("sha256")
      .update(emailToken)
      .digest("hex");

    // 3. Save hashed token in DB
    await userRepository.saveEmailVerificatioToken(emailVerificationHashed)

    // 4. Create verification link
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`;

    // 5. Generate email template
    const html = verifyEmailTemplate(user.name, verificationLink);

    // 6. Send email
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html,
    });
  } catch (error) {
    throw (error)
  }
};

export const verifyEmailLink = async (token) => {
  if (!token) {
    const error = new Error("Token is required");
    error.statusCode = 400;
    throw error;
  }

  const emailVerificationHashed = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await userRepository.findUserByEmailToken(emailVerificationHashed);

  if (!user) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 400;
    throw error;
  }

  // 🔥 idempotent check (IMPORTANT)
  if (user.isVerified) {
    return {
      message: "Already verified"
    };
  }

  await userRepository.updateUserDataForEmailLink(user.id);

  return {
    message: "Email verified successfully"
  };
};

export const loginUser = async ({
  email,
  password
}) => {
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
    role: user.role ?.name,
    roleId: user.roleId,
    isVerified: user.isVerified
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

export const updateUserRoleService = async (req) => {
  const { roleId } = req.body;

  return await userRepository.updateUserRoleFunc(roleId, req.params.id)
}

export const changeUserPlan = async (userId, role) => {
  if (role !== "BASIC") {
    const error = new Error("Invalid role change");
    error.statusCode = 400;
    throw error;
  }

  return userRepository.updateUserRole(userId, "BASIC");
};