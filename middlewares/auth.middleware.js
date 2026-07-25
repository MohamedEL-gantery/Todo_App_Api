import expressHandler from "express-async-handler";
import AppError from "../utils/appError.js";
import userRepository from "../repositories/UserRepository.js";
import { verifyAccessToken } from "../utils/services/jwt/accessToken.jwt.service.js";

export const protect = expressHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to get access.", 401)
    );
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new AppError("Your token has expired. Please log in again.", 401)
      );
    }
    return next(new AppError("Invalid access token", 401));
  }

  const currentUser = await userRepository.findById(
    decoded.id,
    "The user belonging to this token no longer exists"
  );

  req.user = currentUser;
  next();
});
