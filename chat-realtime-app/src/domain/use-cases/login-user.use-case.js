const userRepository = require('../../infrastructure/repositories/user.repository');
const jwt = require('jsonwebtoken');

class LoginUserUseCase {
  async execute(credentials) {
    const { email, password } = credentials;

    // Validar que se proporcionen credenciales
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    // Buscar el usuario por email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar la contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user._id,
        email: user.email
      }
    };
  }
}

module.exports = new LoginUserUseCase();