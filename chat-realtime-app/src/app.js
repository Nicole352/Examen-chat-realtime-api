require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./api/routes/auth.routes');
const ChatHandler = require('./infrastructure/websockets/chat.handler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Ruta básica para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ 
    message: 'Servidor de Chat en tiempo real funcionando',
    version: '1.0.0'
  });
});

// Inicializar el manejador de WebSockets
const chatHandler = new ChatHandler(io);

// Ruta para obtener usuarios conectados (opcional)
app.get('/api/users/connected', (req, res) => {
  res.json({
    success: true,
    users: chatHandler.getConnectedUsers()
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Accede a: http://localhost:${PORT}`);
});