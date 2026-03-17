import axios from "axios";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/generateToken.js";
import * as userRepository from '../repositories/user.repository.js'

export const githubLoginService = async (code) => {

  // 1. Exchange code → token
  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: { Accept: "application/json" },
    }
  );

  const githubAccessToken = tokenRes.data.access_token;

  // 2. Get profile
  const profileRes = await axios.get(
    "https://api.github.com/user",
    {
      headers: {
        Authorization: `token ${githubAccessToken}`,
        Accept: "application/vnd.github+json"
      },
    }
  );

  const emailRes = await axios.get(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `token ${githubAccessToken}`,
        Accept: "application/vnd.github+json"
      },
    }
  );

  const email = emailRes.data.find(e => e.primary)?.email;

  const { id, name } = profileRes.data;

  // 3. Check user
  let user = await userRepository.findUserByEmail(email);

  // 4. Create user if not exists
  if (!user) {
    user = await userRepository.createUserByGithub({
      email,
      name,
      githubId: String(id)
    });
  }

  // 5. Generate tokens
  const accessToken = generateAccessToken(user);
  const { refreshToken, hashedToken } = await generateRefreshToken(user);

  // 6. Save refresh token
  await userRepository.updateRefreshToken(user.id, hashedToken);

  return {
    accessToken,
    refreshToken
  };
};