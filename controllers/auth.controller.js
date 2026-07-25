import expressHandler from "express-async-handler";
import AppError from "../utils/appError.js";
import authService from "../services/auth.service.js";
import { validateLogin, validateSignup } from "../utils/validation.js";

export const signUp = expressHandler(async (req, res, next) => {
  const { error, value } = validateSignup(req.body);

  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const { message } = await authService.register(value);

  res.status(201).json({
    status: "success",
    message,
  });
});

export const login = expressHandler(async (req, res, next) => {
  const { error, value } = validateLogin(req.body);

  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const { message, accessToken, refreshToken, user } =
    await authService.login(value);

  res.status(200).json({
    status: "success",
    message,
    accessToken,
    refreshToken,
    user,
  });
});

export const refresh = expressHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

  const { accessToken } = await authService.refreshAccessToken(refreshToken);

  res.status(200).json({
    status: "success",
    accessToken,
  });
});
