import express from "express";
import {
  createTodoController,
  deleteTodoByIdController,
  getAllTodosController,
  getTodoByIdController,
  updateTodoByIdController,
} from "../controllers/todo.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(createTodoController)
  .get(getAllTodosController);

router
  .route("/:id")
  .get(getTodoByIdController)
  .patch(updateTodoByIdController)
  .delete(deleteTodoByIdController);

export default router;
