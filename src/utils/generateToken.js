import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1m" }
  );
};

export const generateRefreshToken = async (user) => {

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  const hashedToken = await bcrypt.hash(refreshToken, 10);

  return {
    refreshToken,     // send to client
    hashedToken       // store in DB
  };
};