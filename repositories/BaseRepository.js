import AppError from "../utils/appError.js";

export default class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async findAll(query = {}, options = {}) {
    const { sort = { createdAt: -1 }, skip = 0, limit = 10 } = options;

    const [docs, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit),
      this.model.countDocuments(query),
    ]);

    return { docs, total };
  }

  async findOne(query, message = "Document not found") {
    const doc = await this.model.findOne(query);
    if (!doc) {
      throw new AppError(message, 404);
    }
    return doc;
  }

  async findById(id, message = "Document not found") {
    const doc = await this.model.findById(id);
    if (!doc) {
      throw new AppError(message, 404);
    }
    return doc;
  }

  async updateOne(
    query,
    data,
    options = { new: true, runValidators: true },
    message = "Document not found",
  ) {
    const doc = await this.model.findOneAndUpdate(query, data, options);
    if (!doc) {
      throw new AppError(message, 404);
    }
    return doc;
  }

  async deleteOne(query, message = "Document not found") {
    const doc = await this.model.findOneAndDelete(query);
    if (!doc) {
      throw new AppError(message, 404);
    }
    return doc;
  }
}
