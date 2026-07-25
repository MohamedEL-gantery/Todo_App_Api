import User from "../models/user.model.js";
import BaseRepository from "./BaseRepository.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.model.findOne({ email });
  }

  async findByEmailWithPassword(email) {
    return this.model.findOne({ email }).select("+password");
  }
}

export default new UserRepository();
