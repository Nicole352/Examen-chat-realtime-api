const User = require('../../domain/models/user.model');

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async emailExists(email) {
    const user = await User.findOne({ email });
    return !!user;
  }
}

module.exports = new UserRepository();