import { githubLoginService } from "../../services/githubAuth.service.js";

export const githubCallback = async (req, res, next) => {
  try {
    const { code } = req.query;

    const { accessToken, refreshToken } =
      await githubLoginService(code);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
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