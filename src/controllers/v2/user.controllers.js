import * as userService from "../../services/user.service.js";

/*
  REGISTER
*/
export const registerUser = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken, hashedToken } =
      await userService.registerUserService(req.body);

    // create session (per device)
    await userService.createSessionService({
      userId: user.id,
      hashedToken,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Verification mail sent...",
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};


/*
  VERIFY EMAIL
*/
export const verifyEmail = async (req, res, next) => {
  try {
    const result = await userService.verifyEmailLink(req.query.token);
    res.json(result);
  } catch (error) {
    next(error);
  }
};


/*
  LOGIN
*/
export const loginUser = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken, hashedToken } =
      await userService.loginUserService(req.body);

    // create session (device-specific)
    await userService.createSessionService({
      userId: user.id,
      hashedToken,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user });
  } catch (error) {
    next(error);
  }
};


/*
  LOGOUT (only current device)
*/
export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await userService.logoutUserService(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};


/*
  REFRESH TOKEN
*/
export const refreshTokenController = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    const { accessToken, refreshToken } =
      await userService.refreshAccessTokenService(oldRefreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};


/*
  PROFILE
*/
export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};


/*
  UPDATE USER
*/
export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(
      req.user.id,
      req.body
    );
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};


/*
  ADMIN UPDATE USER
*/
export const updateUserByAdmin = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(
      Number(req.params.id),
      req.body
    );

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};


/*
  CHANGE PLAN
*/
export const changePlan = async (req, res, next) => {
  try {
    const { role } = req.body;

    const updatedUser = await userService.changeUserPlan(
      req.user.id,
      role
    );

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};


/*
  UPDATE USER ROLE
*/
export const updateUserRole = async (req, res, next) => {
  try {
    const user = await userService.updateUserRoleService(req);
    res.json(user);
  } catch (error) {
    next(error);
  }
};


/*
  SAVE FCM TOKEN
*/
export const saveFcmToken = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    await userService.saveFcmToken(userId, token);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};