const userRepository = require('../../infrastructure/repositories/user.repository');

class RegisterUserUseCase {
  async execute(userData) {
    const { email, password } = userData;

    // Validar que el email no esté vacío
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Formato de email inválido');
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Verificar si el usuario ya existe
    const existingUser = await userRepository.emailExists(email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    // Crear el usuario
    const user = await userRepository.create({ email, password });
    
    return {
      id: user._id,
      email: user.email,
      createdAt: user.createdAt
    };
  }
}

module.exports = new RegisterUserUseCase();