import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Configurar CORS para todas as origens
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas permitir GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('🔄 Buscando RSS do G1 em produção...');
    
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
    console.log('✅ RSS carregado com sucesso em produção');
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(xmlData);
    
  } catch (error) {
    console.error('❌ Erro ao buscar RSS em produção:', error.message);
    res.status(500).json({ error: 'Erro ao buscar RSS' });
  }
}
