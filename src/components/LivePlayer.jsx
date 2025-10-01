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
      const type = connection?.type;
      
      // Detectar WiFi
      if (type === 'wifi' || type === 'ethernet') {
        setConnectionSpeed('wifi');
        return 'wifi';
      }
      
      if (effectiveType) {
        setConnectionSpeed(effectiveType);
        return effectiveType;
      }
    }
    // Se não detectar, assume 4g
    const fallback = '4g';
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
      let stallCount = 0;
      
      watchdogTimer.current = setInterval(() => {
        if (!video.paused && !video.ended) {
          const currentTime = video.currentTime;
          
          // Se o tempo não mudou, incrementa contador
          if (currentTime === lastTime) {
            stallCount++;
            console.log(`⏳ Stall count: ${stallCount}`);
            
            // Só tenta recuperar se travar por 15 segundos (3 verificações de 5s)
            if (stallCount >= 3) {
              console.warn('⚠️ Vídeo travado por 15s! Tentando recuperar...');
              if (hlsRef.current) {
                hlsRef.current.recoverMediaError();
              }
              stallCount = 0; // Reset contador
            }
          } else {
            // Se tempo mudou, reset contador
            stallCount = 0;
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
      const isWifi = speed === 'wifi';
      const isMobileOrSlow = isMobile && isSlowConnection; // SÓ mobile + conexão lenta
      
      // Modo conservador APENAS se mobile E conexão lenta (NÃO WiFi)
      const forceConservativeMode = isMobileOrSlow && !isWifi;
      
      // Modo desktop-like para mobile com WiFi OU desktop
      const useDesktopMode = isWifi || (!isMobile);
      
      // FORÇAR modo desktop para mobile WiFi (igual PC)
      const forceDesktopForMobileWifi = isMobile && isWifi;
      
      // Desabilitar watchdog para mobile WiFi (igual PC)
      const disableWatchdog = forceDesktopForMobileWifi;
      
      console.log('📱 Mobile:', isMobile);
      console.log('📶 Velocidade:', speed);
      console.log('🐌 Conexão lenta:', isSlowConnection);
      console.log('📶 WiFi:', isWifi);
      console.log('💻 Modo Desktop-like:', useDesktopMode);
      console.log('🖥️ Forçar Desktop Mobile WiFi:', forceDesktopForMobileWifi);
      console.log('🐕 Desabilitar Watchdog:', disableWatchdog);
      console.log('⚙️ Modo:', forceConservativeMode ? 'Mobile + Conexão Lenta' : (useDesktopMode ? 'Desktop-like' : 'Mobile Normal'));
      console.log('🔧 Forçar conservador:', forceConservativeMode);
      
      const hls = new Hls({
        // Configurações gerais
        enableWorker: true,
        lowLatencyMode: false,
        debug: false,
        
        // Buffer EXATAMENTE igual ao desktop para mobile WiFi
        maxBufferLength: forceConservativeMode ? 10 : 30, // SEMPRE 30s se não for conexão lenta
        maxMaxBufferLength: forceConservativeMode ? 20 : 60, // SEMPRE 60s se não for conexão lenta
        maxBufferSize: forceConservativeMode ? 20 * 1000 * 1000 : 60 * 1000 * 1000, // SEMPRE 60MB se não for conexão lenta
        maxBufferHole: forceConservativeMode ? 0.1 : 0.5,
        backBufferLength: forceConservativeMode ? 5 : 20, // SEMPRE 20s se não for conexão lenta
        
        // ABR EXATAMENTE igual ao desktop para mobile WiFi
        abrEwmaDefaultEstimate: forceConservativeMode ? 200000 : 5000000, // SEMPRE 5Mbps se não for conexão lenta
        abrBandWidthFactor: forceConservativeMode ? 0.6 : 0.95, // SEMPRE 0.95 se não for conexão lenta
        abrBandWidthUpFactor: forceConservativeMode ? 0.3 : 0.7, // SEMPRE 0.7 se não for conexão lenta
        abrMaxWithRealBitrate: true,
        abrEwmaFastLive: forceConservativeMode ? 1.5 : 3.0, // SEMPRE 3.0 se não for conexão lenta
        abrEwmaSlowLive: forceConservativeMode ? 3.0 : 9.0, // SEMPRE 9.0 se não for conexão lenta
        
        // Recuperação EXATAMENTE igual ao desktop para mobile WiFi
        capLevelToPlayerSize: true,
        capLevelOnFPSDrop: forceConservativeMode,
        nudgeMaxRetry: forceConservativeMode ? 20 : 10, // SEMPRE 10 se não for conexão lenta
        manifestLoadingTimeOut: forceConservativeMode ? 10000 : 30000, // SEMPRE 30s se não for conexão lenta
        manifestLoadingMaxRetry: forceConservativeMode ? 15 : 8, // SEMPRE 8 se não for conexão lenta
        levelLoadingTimeOut: forceConservativeMode ? 10000 : 30000, // SEMPRE 30s se não for conexão lenta
        levelLoadingMaxRetry: forceConservativeMode ? 15 : 8, // SEMPRE 8 se não for conexão lenta
        fragLoadingTimeOut: forceConservativeMode ? 10000 : 30000, // SEMPRE 30s se não for conexão lenta
        fragLoadingMaxRetry: forceConservativeMode ? 15 : 8, // SEMPRE 8 se não for conexão lenta
        
        // Otimizações EXATAMENTE iguais ao desktop
        highBufferWatchdogPeriod: forceConservativeMode ? 1 : (disableWatchdog ? 5 : 2), // Menos agressivo para mobile WiFi
        startLevel: forceConservativeMode ? 0 : -1, // SEMPRE automático se não for conexão lenta
        testBandwidth: true,
        progressive: true,
        
        // Configurações EXATAMENTE iguais ao desktop
        liveSyncDurationCount: forceConservativeMode ? 1 : 3, // SEMPRE 3 se não for conexão lenta
        liveMaxLatencyDurationCount: forceConservativeMode ? 2 : 5, // SEMPRE 5 se não for conexão lenta
        
        xhrSetup: function(xhr) {
          xhr.withCredentials = false;
          // Timeout EXATAMENTE igual ao desktop
          xhr.timeout = forceConservativeMode ? 8000 : 30000; // SEMPRE 30s se não for conexão lenta
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
              // Só inicia watchdog se não for mobile WiFi
              if (!disableWatchdog) {
                startWatchdog(); // Iniciar watchdog
                console.log('🐕 Watchdog iniciado');
              } else {
                console.log('🐕 Watchdog desabilitado (Mobile WiFi = Desktop)');
              }
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
          
          // FORÇAR qualidade baixa APENAS se mobile + conexão lenta (NÃO WiFi)
          if (forceConservativeMode && level.height > 480) {
            console.log('⚠️ Mobile + Conexão Lenta: Forçando qualidade menor (era', quality, ')');
            setTimeout(() => {
              hls.currentLevel = 0; // Força qualidade mínima
            }, 1000);
          } else if (forceDesktopForMobileWifi) {
            console.log('📱 Mobile WiFi: Permitindo qualquer qualidade (igual ao PC)');
            // NÃO força qualidade baixa - deixa igual ao PC
          }
        }
      });
      
      // Configuração EXATAMENTE igual ao desktop para mobile WiFi
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        if (forceConservativeMode) {
          console.log('🔧 Mobile + Conexão Lenta: Forçando qualidade mínima');
          hls.currentLevel = 0; // Força qualidade mínima
          hls.startLevel = 0; // Garante que comece baixo
        } else {
          console.log('💻 Desktop/Mobile WiFi: Qualidade automática (IGUAL AO PC)');
          hls.startLevel = -1; // SEMPRE automático se não for conexão lenta
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
              
              const maxRetries = forceConservativeMode ? 20 : 10; // Mais tentativas só se conexão lenta
              if (recoveryAttempts.current < maxRetries) {
                const retryDelay = forceConservativeMode ? 500 : 1000; // Retry mais rápido só se conexão lenta
                setTimeout(() => {
                  console.log('🔄 Tentando recarregar...');
                  // FORÇAR qualidade mínima APENAS se conexão lenta
                  if (forceConservativeMode) {
                    hls.currentLevel = 0;
                    hls.startLevel = 0;
                  }
                  // Mobile WiFi: NÃO força qualidade baixa (igual ao PC)
                  hls.startLoad();
                }, retryDelay);
              } else {
                setError('Erro de conexão. Verifique sua internet.');
              }
              break;
              
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log(`🔄 Erro de mídia (tentativa ${recoveryAttempts.current})...`);
              
              if (recoveryAttempts.current < (forceConservativeMode ? 20 : 10)) {
                // FORÇAR qualidade mínima APENAS se conexão lenta
                if (forceConservativeMode) {
                  hls.currentLevel = 0;
                }
                // Mobile WiFi: NÃO força qualidade baixa (igual ao PC)
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
            // Só inicia watchdog se não for mobile WiFi
            if (!disableWatchdog) {
              startWatchdog();
              console.log('🐕 Watchdog iniciado (Safari)');
            } else {
              console.log('🐕 Watchdog desabilitado (Safari Mobile WiFi = Desktop)');
            }
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
      'wifi': 'WiFi',
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
      'wifi': 'text-blue-400',
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
