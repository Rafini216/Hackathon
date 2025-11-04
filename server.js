// ===== CONSTANTES FIXAS =====
const express = require('express');
const next = require('next');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./lib/mongodb.js');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();
app.use(cors());
app.use(express.json());

// Esta constante é relativa às coleções da tua base de dados e deves acrescentar mais se for o caso
const Nome = require('./models/Nome');
const User = require('./models/User');







// ===== ENDPOINTS DA API =====

// GET /api/nomes - Retorna todos os nomes existentes
app.get('/api/nomes', async (req, res) => {
  try {
    const nomes = await Nome.find().sort({ nome: 1 });
    res.json(nomes);
  } catch (error) {
    console.error('Erro ao carregar nomes:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// POST /api/login
app.post('/api/login',async (req, res) => {
  try {
  const { email, password } = req.body;
  
  if (!email){
    res.status(400).json({ error: 'Email is required' });
    return;
  }
  if (!password){
    res.status(400).json({ error: 'Password is required' });
    return;
  }
 
     const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
})


// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
   
    const newUser = new User({
      name,
      email,
      password, 
      role: role || 'user'
    });
    
    const savedUser = await newUser.save();
    
    res.status(201).json({
      success: true,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ===== INICIALIZAÇÃO DO SERVIDOR (também não se deve mexer)=====

app.use((req, res) => {
  return handle(req, res);
});

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
     await connectDB();
    await nextApp.prepare();
    app.listen(PORT, () => {
      console.log(`Servidor Next.js + Express a correr em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();


