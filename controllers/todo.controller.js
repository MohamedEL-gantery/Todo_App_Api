import expressHandler from "express-async-handler";
import AppError from "../utils/appError.js";
import todoService from "../services/todo.service.js";
import {
  validateCreateTodo,
  validateTodoQuery,
  validateUpdateTodo,
} from "../utils/validation.js";

export const createTodoController = expressHandler(async (req, res, next) => {
  const { error, value } = validateCreateTodo(req.body);

  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const todo = await todoService.create({
    ...value,
    userId: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: todo,
  });
});

export const getAllTodosController = expressHandler(async (req, res, next) => {
  const { error, value } = validateTodoQuery(req.query);

  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const result = await todoService.getAll({
    userId: req.user._id,
    ...value,
  });

  res.status(200).json({
    status: "success",
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
    data: result.todos,
  });
});

export const getTodoByIdController = expressHandler(async (req, res) => {
  const todo = await todoService.getById(req.params.id, req.user._id);

  res.status(200).json({
    status: "success",
    data: todo,
  });
});

export const updateTodoByIdController = expressHandler(
  async (req, res, next) => {
    const { error, value } = validateUpdateTodo(req.body);

    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const updated = await todoService.updateById(
      req.params.id,
      req.user._id,
      value,
    );

    res.status(200).json({
      status: "success",
      data: updated,
    });
  },
);

export const deleteTodoByIdController = expressHandler(async (req, res) => {
  await todoService.deleteById(req.params.id, req.user._id);

  res.status(200).json({
    status: "success",
    message: "Task deleted successfully",
  });
});
