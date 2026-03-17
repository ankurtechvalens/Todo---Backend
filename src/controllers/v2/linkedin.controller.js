import { linkedInLoginService } from "../../services/linkedinAuth.service.js";

export const linkedInCallback = async (req, res, next) => {
  try {
    const { code } = req.query;

    const { accessToken, refreshToken, user } =
      await linkedInLoginService(code);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`
    );

  } catch (error) {
    next(error);
  }
};