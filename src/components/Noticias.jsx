import { useEffect, useState } from 'react';

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função simples para limpar texto (sem decodificação complexa)
  const cleanText = (text) => {
    if (!text) return '';
    
    // Apenas remover tags HTML e limpar espaços
    let cleaned = text.replace(/<[^>]*>/g, ''); // Remove tags HTML
    cleaned = cleaned.replace(/\s+/g, ' '); // Remove espaços extras
    cleaned = cleaned.trim(); // Remove espaços no início/fim
    
    return cleaned;
  };

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Usar múltiplos proxies como fallback (atualizados)
        const proxies = [
          'https://corsproxy.io/?',
          'https://api.codetabs.com/v1/proxy?quest=',
          'https://thingproxy.freeboard.io/fetch/',
          'https://cors.bridged.cc/',
          'https://proxy.cors.sh/'
        ];
        
        const RSS_URL = 'https://g1.globo.com/dynamo/rss2.xml';
        let response;
        let lastError;
        
        // Tentar cada proxy até um funcionar
        for (let i = 0; i < proxies.length; i++) {
          const proxy = proxies[i];
          try {
            if (proxy.includes('allorigins')) {
              response = await fetch(proxy + encodeURIComponent(RSS_URL), {
                signal: AbortSignal.timeout(5000) // 5 segundos timeout
              });
            } else {
              response = await fetch(proxy + RSS_URL, {
                headers: {
                  'X-Requested-With': 'XMLHttpRequest'
                },
                signal: AbortSignal.timeout(5000) // 5 segundos timeout
              });
            }
            
            if (response.ok) {
              break;
            }
          } catch (err) {
            lastError = err;
            continue;
          }
        }
        
        if (!response || !response.ok) {
          throw new Error('Todos os proxies CORS falharam');
        }
        const xmlText = await response.text();
        
        // Parse XML manualmente (funciona no navegador)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Extrair itens do RSS
        const items = xmlDoc.querySelectorAll('item');
        
        const noticiasLimitadas = Array.from(items).slice(0, 5).map((item, index) => {
          const title = cleanText(item.querySelector('title')?.textContent || '');
          const link = item.querySelector('link')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';
          const description = cleanText(item.querySelector('description')?.textContent || '');
          
          return {
            title,
            link: link.trim(),
            pubDate: pubDate.trim(),
            description
          };
        });

        setNoticias(noticiasLimitadas);
      } catch (err) {
        console.error('Erro ao buscar notícias:', err);
        setError(`Erro ao carregar notícias: ${err.message}. Verifique sua conexão e tente novamente.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  // Função para formatar data em PT-BR
  const formatarData = (dataString) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Data não disponível';
    }
  };

  // Função para limpar HTML do resumo
  const limparHTML = (texto) => {
    if (!texto) return '';
    return texto.replace(/<[^>]*>/g, '').trim();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📰 Últimas Notícias
          </h2>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Carregando notícias...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📰 Últimas Notícias
          </h2>
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📰 Últimas Notícias
        </h2>
        
        
        <div className="grid gap-4 md:gap-6">
          {noticias.map((noticia, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-gray-50 hover:bg-white"
            >
              <div className="flex flex-col space-y-3">
                {/* Título */}
                <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                  <a 
                    href={noticia.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {noticia.title}
                  </a>
                </h3>
                
                {/* Data */}
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatarData(noticia.pubDate)}
                </div>
                
                {/* Resumo */}
                {noticia.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {limparHTML(noticia.description).substring(0, 200)}
                    {limparHTML(noticia.description).length > 200 && '...'}
                  </p>
                )}
                
                {/* Link para ler mais */}
                <div className="pt-2">
                  <a 
                    href={noticia.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    Ler notícia completa
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer com link para o site do G1 */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Notícias fornecidas por{' '}
            <a 
              href="https://g1.globo.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              G1 - Globo
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Noticias;
