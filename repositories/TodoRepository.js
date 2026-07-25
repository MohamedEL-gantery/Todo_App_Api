import Todo from "../models/todo.model.js";
import BaseRepository from "./BaseRepository.js";

class TodoRepository extends BaseRepository {
  constructor() {
    super(Todo);
  }

  #activeFilter(extra = {}) {
    return { ...extra, isDeleted: false };
  }

  async findByIdForUser(id, userId, message = "Task not found") {
    return this.findOne(this.#activeFilter({ _id: id, userId }), message);
  }

  async updateByIdForUser(id, userId, data, message = "Task not found") {
    return this.updateOne(
      this.#activeFilter({ _id: id, userId }),
      data,
      { new: true, runValidators: true },
      message
    );
  }

  async softDeleteByIdForUser(id, userId, message = "Task not found") {
    return this.updateOne(
      this.#activeFilter({ _id: id, userId }),
      { isDeleted: true, deletedAt: new Date() },
      { new: true, runValidators: true },
      message
    );
  }

  async findAllActive(query = {}, options = {}) {
    return this.findAll(this.#activeFilter(query), options);
  }
}

export default new TodoRepository();
