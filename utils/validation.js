import joi from "joi";
import { TASK_PRIORITIES, TASK_STATUSES } from "../models/todo.model.js";

export const validateSignup = (data) => {
  const schema = joi.object({
    name: joi.string().trim().min(3).max(50).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "any.required": "Name is required",
    }),
    email: joi.string().trim().email().required().messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),
    password: joi.string().min(6).max(64).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
    passwordConfirm: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "Password confirmation is required",
      }),
  });

  return schema.validate(data, { abortEarly: true, stripUnknown: true });
};

export const validateLogin = (data) => {
  const schema = joi.object({
    email: joi.string().trim().email().required().messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),
    password: joi.string().required().messages({
      "any.required": "Password is required",
    }),
  });

  return schema.validate(data, { abortEarly: true, stripUnknown: true });
};

export const validateCreateTodo = (data) => {
  const schema = joi.object({
    title: joi.string().trim().min(1).max(100).required().messages({
      "any.required": "Title is required",
      "string.empty": "Title is required",
    }),
    description: joi.string().trim().min(1).max(1000).required().messages({
      "any.required": "Description is required",
      "string.empty": "Description is required",
    }),
    status: joi
      .string()
      .valid(...TASK_STATUSES)
      .default("To Do"),
    priority: joi
      .string()
      .valid(...TASK_PRIORITIES)
      .required()
      .messages({
        "any.only": "Priority must be one of: Low, Medium, High",
        "any.required": "Priority is required",
      }),
    dueDate: joi.date().iso().required().messages({
      "date.base": "Due date must be a valid date",
      "any.required": "Due date is required",
    }),
  });

  return schema.validate(data, { abortEarly: true, stripUnknown: true });
};

export const validateUpdateTodo = (data) => {
  const schema = joi
    .object({
      title: joi.string().trim().min(1).max(100),
      description: joi.string().trim().min(1).max(1000),
      status: joi.string().valid(...TASK_STATUSES),
      priority: joi.string().valid(...TASK_PRIORITIES),
      dueDate: joi.date().iso(),
    })
    .min(1)
    .messages({
      "object.min": "At least one field is required to update",
    });

  return schema.validate(data, { abortEarly: true, stripUnknown: true });
};

export const validateTodoQuery = (data) => {
  const schema = joi.object({
    search: joi.string().trim().allow(""),
    status: joi.string().valid(...TASK_STATUSES),
    priority: joi.string().valid(...TASK_PRIORITIES),
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).max(100).default(20),
  });

  return schema.validate(data, { abortEarly: true, stripUnknown: true });
};
