import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import database from "./database.js";
import errorHandler, { notFound } from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.route.js";
import todoRoutes from "./routes/todo.route.js";
import userRoutes from "./routes/user.route.js";
import pushRoutes from "./routes/push.routes.js";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

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
app.use("/api/v1/push", pushRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

const PORT = Number(process.env.PORT) || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other process and try again.`,
    );
  } else {
    console.error("Failed to start server:", err.message);
  }
  process.exit(1);
});
