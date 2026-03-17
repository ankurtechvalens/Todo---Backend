import {
  OAuth2Client
} from "google-auth-library";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import * as userRepository from '../repositories/user.repository.js'

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

  const {
    email,
    name,
    sub
  } = payload;

  // Check if user exists
  let user = await userRepository.findUserByEmail(email);

  // Create user if not exists
  if (!user) {
    user = await userRepository.createUserByGoogle({email,name,sub})
    console.log("User created from Google SSO...");
    
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const {
    refreshToken,
    hashedToken
  } = await generateRefreshToken(user);
  
  // Save refresh token in DB
  await userRepository.updateRefreshToken(user.id, hashedToken)

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