import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const LivePlayer = () => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const recoveryAttempts = useRef(0);
  const watchdogTimer = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = 'https://cdn-fundacao-2110.ciclano.io:1443/fundacao-2110/fundacao-2110/playlist.m3u8';

    // Função para verificar se o vídeo está travado
    const startWatchdog = () => {
      let lastTime = 0;
      
      watchdogTimer.current = setInterval(() => {
        if (!video.paused && !video.ended) {
          const currentTime = video.currentTime;
          
          // Se o tempo não mudou em 5 segundos, o vídeo está travado
          if (currentTime === lastTime) {
            console.warn('⚠️ Vídeo travado! Tentando recuperar...');
            if (hlsRef.current) {
              hlsRef.current.recoverMediaError();
            }
          }
          
          lastTime = currentTime;
        }
      }, 5000); // Verifica a cada 5 segundos
    };

    // Configurar HLS
    if (Hls.isSupported()) {
      console.log('🎬 Iniciando HLS.js...');
      
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeMaxRetry: 10,
        manifestLoadingTimeOut: 20000,
        manifestLoadingMaxRetry: 6,
        levelLoadingTimeOut: 20000,
        levelLoadingMaxRetry: 6,
        fragLoadingTimeOut: 30000,
        fragLoadingMaxRetry: 6,
        debug: false,
        xhrSetup: function(xhr) {
          xhr.withCredentials = false;
        }
      });

      hlsRef.current = hls;
      
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      // Quando o manifesto é carregado
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ Manifesto carregado');
        
        // Tentar reproduzir automaticamente
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ Reprodução iniciada automaticamente');
              setIsLoading(false);
              setError(null);
              startWatchdog(); // Iniciar watchdog
            })
            .catch((err) => {
              console.warn('⚠️ Autoplay bloqueado:', err.message);
              setError(null); // Não mostrar como erro
              setIsLoading(false);
            });
        }
      });

      // Tratamento de erros
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS Error:', data.type, data.details);
        
        if (data.fatal) {
          recoveryAttempts.current++;
          
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log(`🔄 Erro de rede (tentativa ${recoveryAttempts.current})...`);
              
              if (recoveryAttempts.current < 10) {
                setTimeout(() => {
                  console.log('🔄 Tentando recarregar...');
                  hls.startLoad();
                }, 1000);
              } else {
                setError('Erro de conexão. Verifique sua internet.');
              }
              break;
              
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log(`🔄 Erro de mídia (tentativa ${recoveryAttempts.current})...`);
              
              if (recoveryAttempts.current < 10) {
                hls.recoverMediaError();
              } else {
                setError('Erro na transmissão. Recarregue a página.');
              }
              break;
              
            default:
              console.log('❌ Erro irrecuperável');
              setError('Erro ao carregar a transmissão');
              hls.destroy();
              break;
          }
        }
      });

      // Reset contador de tentativas quando conseguir carregar
      hls.on(Hls.Events.FRAG_LOADED, () => {
        recoveryAttempts.current = 0;
      });

      // Event listeners do vídeo
      video.addEventListener('waiting', () => {
        console.log('⏳ Buffering...');
        setIsLoading(true);
      });

      video.addEventListener('canplay', () => {
        console.log('✅ Pronto para reproduzir');
        setIsLoading(false);
      });

      video.addEventListener('playing', () => {
        console.log('▶️ Reproduzindo...');
        setIsLoading(false);
      });

      video.addEventListener('stalled', () => {
        console.warn('⚠️ Stream travado, tentando recuperar...');
        if (hlsRef.current) {
          hlsRef.current.recoverMediaError();
        }
      });

    } 
    // Fallback Safari
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('🍎 Usando suporte nativo HLS (Safari)');
      video.src = streamUrl;
      
      video.addEventListener('loadedmetadata', () => {
        video.play()
          .then(() => {
            console.log('✅ Safari: reprodução iniciada');
            setIsLoading(false);
            startWatchdog();
          })
          .catch((err) => {
            console.warn('⚠️ Safari: autoplay bloqueado');
            setIsLoading(false);
          });
      });
    } 
    else {
      setError('Navegador não suporta HLS');
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (watchdogTimer.current) {
        clearInterval(watchdogTimer.current);
      }
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
