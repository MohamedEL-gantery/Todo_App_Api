import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import database from "./database.js";
import errorHandler, { notFound } from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.route.js";
import todoRoutes from "./routes/todo.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Ensure MongoDB is connected (cached on Vercel serverless)
app.use(async (req, res, next) => {
  try {
    await database(process.env.BASE_URL);
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/todos", todoRoutes);
app.use("/api/v1/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

// Export for Vercel
export default app;

// Local development only (Vercel sets VERCEL=1)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
