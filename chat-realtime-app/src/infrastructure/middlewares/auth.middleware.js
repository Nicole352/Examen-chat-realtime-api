const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para validar JWT en WebSockets
const validateSocketToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findById(decoded.userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: user._id,
      email: user.email
    };
  } catch (error) {
    throw new Error('Token inválido');
  }
};

module.exports = {
  authMiddleware,
  validateSocketToken
};