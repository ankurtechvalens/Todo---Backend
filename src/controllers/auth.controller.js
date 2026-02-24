import { googleLoginService } from "../services/googleAuth.service.js";

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    const { accessToken, refreshToken, user } = await googleLoginService(idToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken, user });

  } catch (error) {
    next(error);
  }
};