const registerUserUseCase = require('../../domain/use-cases/register-user.use-case');
const loginUserUseCase = require('../../domain/use-cases/login-user.use-case');

class AuthController {
  async register(req, res) {
    try {
      const userData = await registerUserUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: userData
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const authData = await loginUserUseCase.execute(req.body);
      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: authData
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();