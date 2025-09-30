import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const LivePlayer = () => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = 'https://cdn-fundacao-2110.ciclano.io:1443/fundacao-2110/fundacao-2110/playlist.m3u8';

    // Verificar se HLS é suportado
    if (Hls.isSupported()) {
      console.log('HLS.js é suportado');
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        debug: false,
        xhrSetup: function(xhr) {
          // Configurar headers se necessário
          xhr.withCredentials = false;
        }
      });

      hlsRef.current = hls;
      
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('Manifesto carregado');
        video.play()
          .then(() => {
            console.log('Reprodução iniciada');
            setIsLoading(false);
          })
          .catch((err) => {
            console.error('Erro ao iniciar reprodução:', err);
            setError('Clique no player para iniciar a transmissão');
            setIsLoading(false);
          });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Erro de rede fatal, tentando recuperar...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Erro de mídia fatal, tentando recuperar...');
              hls.recoverMediaError();
              break;
            default:
              console.log('Erro fatal irrecuperável');
              setError('Erro ao carregar a transmissão');
              setIsLoading(false);
              hls.destroy();
              break;
          }
        }
      });

      // Event listeners do vídeo
      video.addEventListener('loadstart', () => {
        console.log('Carregando...');
      });

      video.addEventListener('canplay', () => {
        console.log('Pronto para reproduzir');
        setIsLoading(false);
      });

      video.addEventListener('playing', () => {
        console.log('Reproduzindo...');
        setIsLoading(false);
      });

      video.addEventListener('error', () => {
        console.error('Erro no vídeo');
        setError('Erro ao carregar o vídeo');
        setIsLoading(false);
      });

    } 
    // Fallback para Safari (suporte nativo a HLS)
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('Usando suporte nativo a HLS (Safari)');
      video.src = streamUrl;
      
      video.addEventListener('loadedmetadata', () => {
        console.log('Metadata carregada');
        video.play()
          .then(() => {
            console.log('Reprodução iniciada (Safari)');
            setIsLoading(false);
          })
          .catch((err) => {
            console.error('Erro ao iniciar reprodução (Safari):', err);
            setError('Clique no player para iniciar a transmissão');
            setIsLoading(false);
          });
      });

      video.addEventListener('error', () => {
        console.error('Erro no vídeo (Safari)');
        setError('Erro ao carregar o vídeo');
        setIsLoading(false);
      });
    } 
    // HLS não suportado
    else {
      console.error('HLS não é suportado neste navegador');
      setError('Seu navegador não suporta streaming HLS');
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
        <div className="relative aspect-video">
          {/* Video element */}
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            controls
            playsInline
            muted={false}
            autoPlay
            style={{ minHeight: '400px' }}
          />
          
          {/* Loading overlay */}
          {isLoading && !error && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10 pointer-events-none">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-lg font-medium">Carregando transmissão ao vivo...</p>
                <p className="text-sm text-gray-300 mt-2">
                  Conectando ao servidor da TV Metrópole...
                </p>
              </div>
            </div>
          )}
          
          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-10">
              <div className="text-white text-center p-6">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-lg font-medium text-red-300 mb-2">{error}</p>
                <p className="text-sm text-gray-300 mb-4">
                  Tente recarregar a página ou verifique sua conexão
                </p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Recarregar Página
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePlayer;
