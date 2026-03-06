import { OAuth2Client } from "google-auth-library";
import { prisma } from "../config/prisma.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginService = async (idToken) => {
  if (!idToken) {
    throw new Error("Google ID token is required");
  }

  // Verify Google token
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw new Error("Invalid Google token");
  }

  const { email, name, sub } = payload;

  // Check if user exists
  let user = await prisma.user.findUnique({
    where: { email },
  });

  // Create user if not exists
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        googleId: sub,
        role: "BASIC", // optional default role
      },
    });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};