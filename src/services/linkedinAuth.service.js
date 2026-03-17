import axios from "axios";
import qs from "qs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import * as userRepository from '../repositories/user.repository.js'

export const linkedInLoginService = async (code) => {

  if (!code) {
    throw new Error("Authorization code missing");
  }
console.log("Redirect URI:", process.env.LINKEDIN_REDIRECT_URI);
  // Exchange code for access token
  const tokenRes = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    qs.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  const accessToken = tokenRes.data.access_token;

  // Fetch user profile
  const profileRes = await axios.get(
    "https://api.linkedin.com/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0"
        },
    }
  );

  const { email, name, sub } = profileRes.data;

  // Find user
  let user = await userRepository.findUserByEmail(email);

  if (!user) {
    user = await userRepository.createUserByLinkedIn({email, name, sub})
  }

  const appAccessToken = generateAccessToken(user);
  const { refreshToken, hashedToken } =
    await generateRefreshToken(user);

  await userRepository.updateRefreshToken(user.id, hashedToken)

  return {
    accessToken: appAccessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};