const messageRepository = require('../../infrastructure/repositories/message.repository');

class SaveMessageUseCase {
  async execute(messageData) {
    const { text, userId } = messageData;

    // Validar que se proporcione el texto del mensaje
    if (!text || text.trim() === '') {
      throw new Error('El mensaje no puede estar vacío');
    }

    // Validar que se proporcione el ID del usuario
    if (!userId) {
      throw new Error('Usuario requerido');
    }

    // Crear el mensaje
    const message = await messageRepository.create({
      text: text.trim(),
      user: userId
    });

    // Obtener el mensaje con los datos del usuario
    const messageWithUser = await messageRepository.findByIdWithUser(message._id);

    return {
      id: messageWithUser._id,
      text: messageWithUser.text,
      user: {
        id: messageWithUser.user._id,
        email: messageWithUser.user.email
      },
      createdAt: messageWithUser.createdAt
    };
  }
}

module.exports = new SaveMessageUseCase();