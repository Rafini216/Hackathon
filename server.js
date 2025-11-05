// ===== CONSTANTES FIXAS =====
const express = require('express');
const next = require('next');
const cors = require('cors');
const router = require('./backend/routes/index')
require('dotenv').config();
const connectDB = require('./backend/lib/mongodb');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();
app.use(cors());
app.use(express.json());
const localtunnel = require('localtunnel');
app.use('/api', router)

// ===== ENDPOINTS DA API =====


// ===== INICIALIZAÇÃO DO SERVIDOR (também não se deve mexer)=====
// Next.js handle todas as rotas que não são /api
app.use((req, res) => {
  return handle(req, res);
});




const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await connectDB();
    await nextApp.prepare();
   app.listen(PORT, async (err) => {
    if (err) throw err;
    console.log(`> Servidor rodando em http://localhost:${PORT}`);
    
    // Iniciar túnel apenas em desenvolvimento
    if (dev) {
      try {
        const tunnel = await localtunnel({ 
          port: PORT,
          subdomain: 'meuapp' // opcional - escolha um nome único
        });
        
        console.log('═'.repeat(50));
        console.log('🌐 TÚNEL ATIVO:');
        console.log(`🔗 URL pública: ${tunnel.url}`);
        console.log(`🏠 URL local: http://localhost:${PORT}`);
        console.log('═'.repeat(50));
        
        tunnel.on('close', () => {
          console.log('❌ Túnel fechado');
        });
        
      } catch (error) {
        console.log('⚠️  Não foi possível criar túnel, usando apenas local');
        console.log('💡 Dica: Execute manualmente: npx localtunnel --port 3000');
      }
    }
  });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();



