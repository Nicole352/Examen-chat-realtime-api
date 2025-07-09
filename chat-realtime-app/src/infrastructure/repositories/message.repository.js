const Message = require('../../domain/models/message.model');

class MessageRepository {
  async create(messageData) {
    const message = new Message(messageData);
    return await message.save();
  }

  async findByIdWithUser(id) {
    return await Message.findById(id).populate('user', 'email');
  }

  async findAllWithUser() {
    return await Message.find().populate('user', 'email').sort({ createdAt: 1 });
  }
}

module.exports = new MessageRepository();