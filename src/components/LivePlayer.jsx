import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const LivePlayer = () => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionSpeed, setConnectionSpeed] = useState('checking');
  const [currentQuality, setCurrentQuality] = useState('auto');
  const recoveryAttempts = useRef(0);
  const watchdogTimer = useRef(null);

  // Detectar se é dispositivo mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Detectar velocidade de conexão
  const detectConnectionSpeed = () => {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const effectiveType = connection?.effectiveType;
      
      if (effectiveType) {
        setConnectionSpeed(effectiveType);
        return effectiveType;
      }
    }
    // Se não detectar, assume 3g em mobile
    const fallback = isMobileDevice() ? '3g' : '4g';
    setConnectionSpeed(fallback);
    return fallback;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = 'https://cdn-fundacao-2110.ciclano.io:1443/fundacao-2110/fundacao-2110/playlist.m3u8';
    
    // Detectar velocidade de conexão e dispositivo
    const speed = detectConnectionSpeed();
    const isMobile = isMobileDevice();
    
    console.log('📱 Mobile:', isMobile);
    console.log('📶 Velocidade:', speed);

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

    // Configurar HLS - Otimizado para mobile e conexões lentas
    if (Hls.isSupported()) {
      console.log('🎬 Iniciando HLS.js...');
      
      // Configurações adaptativas baseadas na conexão e dispositivo
      const isSlowConnection = speed === '2g' || speed === 'slow-2g' || speed === '3g';
      const isMobileOrSlow = isMobile || isSlowConnection;
      
      // FORÇAR modo conservador se for mobile (mesmo com WiFi)
      const forceConservativeMode = isMobile;
      
      console.log('⚙️ Modo:', forceConservativeMode ? 'Mobile Conservador' : 'Desktop');
      console.log('🔧 Forçar conservador:', forceConservativeMode);
      
      const hls = new Hls({
        // Configurações gerais
        enableWorker: true,
        lowLatencyMode: false,
        debug: false,
        
        // Buffer ULTRA REDUZIDO para mobile - inicia MUITO mais rápido
        maxBufferLength: forceConservativeMode ? 10 : 30, // ULTRA REDUZIDO: 10s mobile!
        maxMaxBufferLength: forceConservativeMode ? 20 : 60, // ULTRA REDUZIDO
        maxBufferSize: forceConservativeMode ? 20 * 1000 * 1000 : 60 * 1000 * 1000, // 20MB mobile
        maxBufferHole: 0.1, // MUITO tolerante a "buracos"
        backBufferLength: forceConservativeMode ? 5 : 20, // Mínimo em mobile
        
        // ABR ULTRA conservador para mobile
        abrEwmaDefaultEstimate: forceConservativeMode ? 200000 : 5000000, // 200kbps mobile!
        abrBandWidthFactor: forceConservativeMode ? 0.6 : 0.95, // MUITO conservador
        abrBandWidthUpFactor: forceConservativeMode ? 0.3 : 0.7, // Sobe MUITO devagar
        abrMaxWithRealBitrate: true,
        abrEwmaFastLive: forceConservativeMode ? 1.5 : 3.0, // Reage MUITO rápido
        abrEwmaSlowLive: forceConservativeMode ? 3.0 : 9.0, // Adapta MUITO devagar
        
        // Recuperação ULTRA agressiva para mobile
        capLevelToPlayerSize: true,
        capLevelOnFPSDrop: forceConservativeMode, // Drop de FPS força qualidade menor
        nudgeMaxRetry: forceConservativeMode ? 20 : 15, // AINDA mais tentativas
        manifestLoadingTimeOut: forceConservativeMode ? 10000 : 20000, // ULTRA REDUZIDO
        manifestLoadingMaxRetry: forceConservativeMode ? 15 : 10,
        levelLoadingTimeOut: forceConservativeMode ? 10000 : 20000, // ULTRA REDUZIDO
        levelLoadingMaxRetry: forceConservativeMode ? 15 : 10,
        fragLoadingTimeOut: forceConservativeMode ? 10000 : 20000, // ULTRA REDUZIDO
        fragLoadingMaxRetry: forceConservativeMode ? 15 : 10,
        
        // Otimizações ULTRA mobile
        highBufferWatchdogPeriod: forceConservativeMode ? 1 : 2, // Verifica mais frequentemente
        startLevel: forceConservativeMode ? 0 : -1, // SEMPRE qualidade mínima
        testBandwidth: true,
        progressive: true,
        
        // Configurações extras para mobile
        liveSyncDurationCount: forceConservativeMode ? 1 : 3, // Menos fragmentos em live
        liveMaxLatencyDurationCount: forceConservativeMode ? 2 : 5, // Menor latência
        
        xhrSetup: function(xhr) {
          xhr.withCredentials = false;
          // Timeout ULTRA curto em mobile
          xhr.timeout = forceConservativeMode ? 8000 : 30000; // 8s mobile!
        }
      });

      hlsRef.current = hls;
      
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      // Quando o manifesto é carregado
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log('✅ Manifesto carregado');
        console.log('📊 Níveis disponíveis:', data.levels.length);
        
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

      // Monitorar mudanças de qualidade
      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level];
        if (level) {
          const quality = `${level.height}p`;
          setCurrentQuality(quality);
          console.log('📊 Qualidade alterada para:', quality);
          
          // FORÇAR qualidade baixa em mobile se subir muito
          if (forceConservativeMode && level.height > 480) {
            console.log('⚠️ Mobile: Forçando qualidade menor (era', quality, ')');
            setTimeout(() => {
              hls.currentLevel = 0; // Força qualidade mínima
            }, 1000);
          }
        }
      });
      
      // FORÇAR qualidade baixa em mobile após carregar
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        if (forceConservativeMode) {
          console.log('🔧 Mobile: Forçando qualidade mínima');
          hls.currentLevel = 0; // Força qualidade mínima
          hls.startLevel = 0; // Garante que comece baixo
        }
      });

      // Tratamento de erros ULTRA agressivo para mobile
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS Error:', data.type, data.details);
        
        if (data.fatal) {
          recoveryAttempts.current++;
          
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log(`🔄 Erro de rede (tentativa ${recoveryAttempts.current})...`);
              
              const maxRetries = forceConservativeMode ? 20 : 10; // Mais tentativas em mobile
              if (recoveryAttempts.current < maxRetries) {
                const retryDelay = forceConservativeMode ? 500 : 1000; // Retry mais rápido em mobile
                setTimeout(() => {
                  console.log('🔄 Tentando recarregar...');
                  // FORÇAR qualidade mínima em mobile após erro
                  if (forceConservativeMode) {
                    hls.currentLevel = 0;
                    hls.startLevel = 0;
                  }
                  hls.startLoad();
                }, retryDelay);
              } else {
                setError('Erro de conexão. Verifique sua internet.');
              }
              break;
              
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log(`🔄 Erro de mídia (tentativa ${recoveryAttempts.current})...`);
              
              if (recoveryAttempts.current < (forceConservativeMode ? 20 : 10)) {
                // FORÇAR qualidade mínima antes de recuperar
                if (forceConservativeMode) {
                  hls.currentLevel = 0;
                }
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
    // Fallback Safari/iOS - HLS Nativo
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('🍎 Usando suporte nativo HLS (Safari/iOS)');
      console.log('📱 Mobile:', isMobile);
      
      // Configurar atributos para melhor performance em mobile
      if (isMobile) {
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.preload = 'auto'; // Preload em mobile Safari
      }
      
      video.src = streamUrl;
      
      // Listener para erros de rede
      video.addEventListener('error', (e) => {
        console.error('❌ Safari: erro de vídeo', e);
        if (video.error) {
          console.error('Código do erro:', video.error.code);
          // Tentar recarregar
          setTimeout(() => {
            console.log('🔄 Tentando recarregar...');
            video.load();
            video.play().catch(err => console.warn('Erro ao reproduzir:', err));
          }, 2000);
        }
      });
      
      video.addEventListener('loadedmetadata', () => {
        console.log('✅ Safari: metadata carregada');
        video.play()
          .then(() => {
            console.log('✅ Safari: reprodução iniciada');
            setIsLoading(false);
            setError(null);
            startWatchdog();
          })
          .catch((err) => {
            console.warn('⚠️ Safari: autoplay bloqueado -', err.message);
            setIsLoading(false);
          });
      });
      
      // Listener para stalling em Safari
      video.addEventListener('stalled', () => {
        console.warn('⚠️ Safari: stream travado');
        setIsLoading(true);
      });
      
      video.addEventListener('waiting', () => {
        console.log('⏳ Safari: buffering...');
        setIsLoading(true);
      });
      
      video.addEventListener('playing', () => {
        console.log('▶️ Safari: reproduzindo');
        setIsLoading(false);
      });
      
      video.addEventListener('canplay', () => {
        console.log('✅ Safari: pode reproduzir');
        setIsLoading(false);
      });
    } 
    else {
      setError('Navegador não suporta HLS');
      setIsLoading(false);
    }

    // Monitorar mudanças de conexão em tempo real
    const handleConnectionChange = () => {
      detectConnectionSpeed();
      console.log('🔄 Velocidade de conexão mudou');
    };

    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      connection?.addEventListener('change', handleConnectionChange);
    }

    // Cleanup
    return () => {
      if (watchdogTimer.current) {
        clearInterval(watchdogTimer.current);
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        connection?.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  // Traduzir velocidade para texto amigável
  const getConnectionLabel = () => {
    const labels = {
      'slow-2g': '2G Lento',
      '2g': '2G',
      '3g': '3G',
      '4g': '4G',
      '5g': '5G',
      'unknown': 'Desconhecida',
      'checking': 'Verificando...'
    };
    return labels[connectionSpeed] || connectionSpeed;
  };

  const getConnectionColor = () => {
    const colors = {
      'slow-2g': 'text-red-400',
      '2g': 'text-orange-400',
      '3g': 'text-yellow-400',
      '4g': 'text-green-400',
      '5g': 'text-green-400',
    };
    return colors[connectionSpeed] || 'text-gray-400';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
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
            style={{ minHeight: '200px' }}
          />
          
          {/* Indicador de qualidade e conexão - Responsivo */}
          {!isLoading && !error && connectionSpeed !== 'checking' && (
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black bg-opacity-80 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs z-20 pointer-events-none">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-white">
                {/* Qualidade */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline font-medium">📊 Qualidade:</span>
                  <span className="sm:hidden">📊</span>
                  <span className="text-green-400 font-semibold">{currentQuality}</span>
                </div>
                
                {/* Separador - só desktop */}
                <span className="hidden sm:inline text-gray-500">•</span>
                
                {/* Conexão */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline font-medium">📶 Conexão:</span>
                  <span className="sm:hidden">📶</span>
                  <span className={`${getConnectionColor()} font-semibold`}>{getConnectionLabel()}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Loading overlay */}
          {isLoading && !error && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10 pointer-events-none">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-lg font-medium">Carregando transmissão ao vivo...</p>
                <p className="text-sm text-gray-300 mt-2">
                  Conectando ao servidor da TV Metrópole...
                </p>
                {connectionSpeed !== 'checking' && (
                  <p className="text-xs text-gray-400 mt-2">
                    Conexão detectada: {getConnectionLabel()}
                  </p>
                )}
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
