const { validateSocketToken } = require('../middlewares/auth.middleware');
const saveMessageUseCase = require('../../domain/use-cases/save-message.use-case');

class ChatHandler {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map();
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Nuevo cliente conectado:', socket.id);

      // Manejar autenticación
      socket.on('authenticate', async (data) => {
        try {
          const { token } = data;
          
          if (!token) {
            socket.emit('authentication_error', { message: 'Token requerido' });
            socket.disconnect();
            return;
          }

          const user = await validateSocketToken(token);
          
          // Guardar información del usuario autenticado
          socket.userId = user.id;
          socket.userEmail = user.email;
          
          // Agregar a la lista de usuarios conectados
          this.connectedUsers.set(socket.id, {
            id: user.id,
            email: user.email,
            socketId: socket.id
          });

          socket.emit('authenticated', { 
            message: 'Autenticación exitosa',
            user: { id: user.id, email: user.email }
          });

          console.log(`Usuario autenticado: ${user.email}`);

        } catch (error) {
          socket.emit('authentication_error', { message: error.message });
          socket.disconnect();
        }
      });

      // Manejar envío de mensajes
      socket.on('sendMessage', async (data) => {
        try {
          // Verificar que el usuario esté autenticado
          if (!socket.userId) {
            socket.emit('message_error', { message: 'Usuario no autenticado' });
            return;
          }

          const { text } = data;
          
          // Guardar mensaje en la base de datos
          const savedMessage = await saveMessageUseCase.execute({
            text,
            userId: socket.userId
          });

          // Enviar el mensaje a todos los clientes conectados
          this.io.emit('newMessage', {
            id: savedMessage.id,
            text: savedMessage.text,
            user: savedMessage.user,
            createdAt: savedMessage.createdAt
          });

          console.log(`Mensaje enviado por ${socket.userEmail}: ${text}`);

        } catch (error) {
          socket.emit('message_error', { message: error.message });
        }
      });

      // Manejar desconexión
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.connectedUsers.delete(socket.id);
          console.log(`Usuario desconectado: ${socket.userEmail}`);
        }
        console.log('Cliente desconectado:', socket.id);
      });
    });
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }
}

module.exports = ChatHandler;