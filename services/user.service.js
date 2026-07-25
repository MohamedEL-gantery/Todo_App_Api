import userRepository from "../repositories/UserRepository.js";

class UserService {
  constructor(users) {
    this.users = users;
  }

  async getById(id) {
    return this.users.findById(id, "User not found");
  }
}

export default new UserService(userRepository);
