import { OAuth2Client } from "google-auth-library";
import { prisma } from "../config/prisma.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginService = async (idToken) => {

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const { email, name, sub } = payload;

  let user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        googleId: sub,
      }
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
    await userService.saveRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  return { accessToken, user };
};