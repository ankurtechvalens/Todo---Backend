import * as userService from "../services/user.service.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await userService.saveRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      accessToken,
      user
    });
  } catch (error) {
    next(error);
  }
};


export const loginUser = async (req, res, next) => {
  try {
    const user = await userService.loginUser(req.body);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    await userService.saveRefreshToken(user.id, refreshToken);

    // Send refresh token as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production (https)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken, user });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await userService.logoutUser(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

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

export const refreshTokenController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const newAccessToken = await userService.refreshAccessToken(refreshToken);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

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