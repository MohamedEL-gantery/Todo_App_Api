import AppError from "../utils/appError.js";
import { generateAccessToken } from "../utils/services/jwt/accessToken.jwt.service.js";
import { generateRefreshToken } from "../utils/services/jwt/refreshToken.jwt.service.js";
import { verifyRefreshToken } from "../utils/services/jwt/refreshToken.jwt.service.js";
import {
  comparePassword,
  hashPassword,
} from "../utils/services/password/password.service.js";
import userRepository from "../repositories/UserRepository.js";

class AuthService {
  constructor(users) {
    this.users = users;
  }

  async register({ name, email, password }) {
    const existingUser = await this.users.findByEmail(email);

    if (existingUser) {
      throw new AppError("User already exists with this email", 400);
    }

    const passwordHash = await hashPassword(password);

    await this.users.create({
      name,
      email,
      password: passwordHash,
    });

    return { message: "User registered successfully" };
  }

  async login({ email, password }) {
    const user = await this.users.findByEmailWithPassword(email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return {
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 401);
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AppError(
          "Refresh token has expired. Please log in again.",
          401
        );
      }
      throw new AppError("Invalid refresh token", 401);
    }

    const user = await this.users.findById(decoded.id, "User not found");

    return {
      accessToken: generateAccessToken(user._id),
    };
  }
}

export default new AuthService(userRepository);
