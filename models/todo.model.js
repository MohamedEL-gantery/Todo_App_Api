import mongoose from "mongoose";

export const TASK_STATUSES = ["To Do", "In Progress", "Done"];
export const TASK_PRIORITIES = ["Low", "Medium", "High"];

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title must be at most 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description must be at most 1000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: TASK_STATUSES,
        message: "Status must be one of: To Do, In Progress, Done",
      },
      default: "To Do",
    },
    priority: {
      type: String,
      enum: {
        values: TASK_PRIORITIES,
        message: "Priority must be one of: Low, Medium, High",
      },
      required: [true, "Priority is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        delete ret.isDeleted;
        delete ret.deletedAt;
        return ret;
      },
    },
  },
);

todoSchema.index({ userId: 1, status: 1, priority: 1 });
todoSchema.index({ userId: 1, title: 1 });

export default mongoose.model("Todo", todoSchema);
