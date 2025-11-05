const User = require('../models/User')

/**
 * Login - Autentica um usuário
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email é obrigatório'
      });
    }

    if (!password) {
      return res.status(400).json({
        message: 'Senha é obrigatória'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Credenciais inválidas'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: 'Credenciais inválidas'
      });
    }

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      user: userResponse
    });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    return res.status(500).json({
      message: 'Erro ao processar login'
    });
  }
};

/**
 * Register - Registra um novo usuário
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email já cadastrado'
      });
    }

    const user = await User.create({
      name,
      email,
      password 
    });

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: userResponse
    });
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    return res.status(500).json({
      message: 'Erro ao processar registro'
    });
  }
};

/**
 * Get Users - Lista todos os usuários (para seleção de participantes)
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email _id');
    return res.status(200).json(users);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    return res.status(500).json({
      message: 'Erro ao buscar usuários'
    });
  }
};

module.exports = { login, register, getUsers };
