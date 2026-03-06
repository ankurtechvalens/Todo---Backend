import { googleLoginService } from "../../services/googleAuth.service.js";

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    const { accessToken, refreshToken, user } = await googleLoginService(idToken);

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};