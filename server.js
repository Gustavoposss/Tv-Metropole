import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Liberar CORS para todas as origens
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Rota para proxy do RSS
app.get('/api/rss', async (req, res) => {
  try {
    console.log('🔄 Buscando RSS do G1...');
    
    const response = await fetch('https://g1.globo.com/dynamo/rss2.xml', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const xmlData = await response.text();
    console.log('✅ RSS carregado com sucesso');
    
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(xmlData);
    
  } catch (error) {
    console.error('❌ Erro ao buscar RSS:', error.message);
    res.status(500).json({ error: 'Erro ao buscar RSS' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor proxy rodando em http://localhost:${PORT}`);
  console.log(`📰 RSS disponível em http://localhost:${PORT}/api/rss`);
});
