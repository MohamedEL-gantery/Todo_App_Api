import todoRepository from "../repositories/TodoRepository.js";

class TodoService {
  constructor(todos) {
    this.todos = todos;
  }

  async create(data) {
    return this.todos.create(data);
  }

  async getAll({ userId, search, status, priority, page = 1, limit = 10 }) {
    const filter = { userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: "i" };

    const skip = (page - 1) * limit;
    const { docs, total } = await this.todos.findAllActive(filter, {
      skip,
      limit,
    });

    return {
      todos: docs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getById(id, userId) {
    return this.todos.findByIdForUser(id, userId);
  }

  async updateById(id, userId, updateData) {
    return this.todos.updateByIdForUser(id, userId, updateData);
  }

  async deleteById(id, userId) {
    return this.todos.softDeleteByIdForUser(id, userId);
  }
}

export default new TodoService(todoRepository);
