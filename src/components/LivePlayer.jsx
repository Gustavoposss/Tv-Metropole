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

  // Detectar se é iOS (iPhone/iPad)
  const isIOSDevice = () => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
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
    const isIOS = isIOSDevice();
    
    console.log('📱 Mobile:', isMobile);
    console.log('🍎 iOS:', isIOS);
    console.log('📶 Velocidade:', speed);

    // Função para verificar se o vídeo está travado (TOTALMENTE DESABILITADA)
    const startWatchdog = () => {
      console.log('🐕 Watchdog TOTALMENTE DESABILITADO - usuário resolve manualmente');
      // Sistema de watchdog completamente removido
      // Usuário resolve manualmente com F5
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
      
      // Sistema de watchdog TOTALMENTE removido
      
      // Configurações específicas para mobile (baseadas em melhores práticas)
      const mobileOptimizations = isMobile;
      
      // Configurações específicas para iOS (iPhone/iPad)
      const iosOptimizations = isIOS;
      
      console.log('📱 Mobile:', isMobile);
      console.log('🍎 iOS:', isIOS);
      console.log('📶 Velocidade:', speed);
      console.log('🐌 Conexão lenta:', isSlowConnection);
      console.log('📶 WiFi:', isWifi);
      console.log('💻 Modo Desktop-like:', useDesktopMode);
      console.log('🖥️ Forçar Desktop Mobile WiFi:', forceDesktopForMobileWifi);
      console.log('🐕 Watchdog: TOTALMENTE DESABILITADO');
      console.log('📱 Otimizações Mobile:', mobileOptimizations);
      console.log('🍎 Otimizações iOS:', iosOptimizations);
      console.log('🍎 iOS Buffer: 6s (ultra conservador)');
      console.log('🍎 iOS ABR: 500kbps (muito conservador)');
      console.log('🍎 iOS Timeout: 10s (mais tolerante)');
      console.log('🍎 iOS Retry: 25x (máxima tentativa)');
      console.log('🔄 Recuperação Automática: TOTALMENTE DESABILITADA (usuário resolve)');
      console.log('⚙️ Modo:', forceConservativeMode ? 'Mobile + Conexão Lenta' : (useDesktopMode ? 'Desktop-like' : 'Mobile Normal'));
      console.log('🔧 Forçar conservador:', forceConservativeMode);
      
      const hls = new Hls({
        // Configurações gerais
        enableWorker: true,
        lowLatencyMode: false,
        debug: false,
        
        // Buffer otimizado para iOS (baseado em melhores práticas 2024)
        maxBufferLength: forceConservativeMode ? 10 : (iosOptimizations ? 6 : (mobileOptimizations ? 15 : 30)), // iOS: 6s (ultra conservador), Mobile: 15s, Desktop: 30s
        maxMaxBufferLength: forceConservativeMode ? 20 : (iosOptimizations ? 12 : (mobileOptimizations ? 30 : 60)), // iOS: 12s, Mobile: 30s, Desktop: 60s
        maxBufferSize: forceConservativeMode ? 20 * 1000 * 1000 : (iosOptimizations ? 10 * 1000 * 1000 : (mobileOptimizations ? 30 * 1000 * 1000 : 60 * 1000 * 1000)), // iOS: 10MB, Mobile: 30MB, Desktop: 60MB
        maxBufferHole: forceConservativeMode ? 0.1 : (iosOptimizations ? 0.15 : (mobileOptimizations ? 0.3 : 0.5)), // iOS: mais tolerante
        backBufferLength: forceConservativeMode ? 5 : (iosOptimizations ? 3 : (mobileOptimizations ? 10 : 20)), // iOS: 3s, Mobile: 10s, Desktop: 20s
        
        // ABR otimizado para iOS (baseado em melhores práticas)
        abrEwmaDefaultEstimate: forceConservativeMode ? 200000 : (iosOptimizations ? 500000 : (mobileOptimizations ? 1000000 : 5000000)), // iOS: 500kbps, Mobile: 1Mbps, Desktop: 5Mbps
        abrBandWidthFactor: forceConservativeMode ? 0.6 : (iosOptimizations ? 0.7 : (mobileOptimizations ? 0.8 : 0.95)), // iOS: mais conservador
        abrBandWidthUpFactor: forceConservativeMode ? 0.3 : (iosOptimizations ? 0.4 : (mobileOptimizations ? 0.5 : 0.7)), // iOS: sobe muito devagar
        abrMaxWithRealBitrate: true,
        abrEwmaFastLive: forceConservativeMode ? 1.5 : (iosOptimizations ? 1.8 : (mobileOptimizations ? 2.0 : 3.0)), // iOS: reage mais rápido
        abrEwmaSlowLive: forceConservativeMode ? 3.0 : (iosOptimizations ? 4.0 : (mobileOptimizations ? 5.0 : 9.0)), // iOS: adapta mais devagar
        
        // Recuperação otimizada para iOS (baseado em melhores práticas 2024)
        capLevelToPlayerSize: true,
        capLevelOnFPSDrop: forceConservativeMode,
        nudgeMaxRetry: forceConservativeMode ? 20 : (iosOptimizations ? 25 : (mobileOptimizations ? 15 : 10)), // iOS: 25x, Mobile: 15x, Desktop: 10x
        manifestLoadingTimeOut: forceConservativeMode ? 10000 : (iosOptimizations ? 12000 : (mobileOptimizations ? 20000 : 30000)), // iOS: 12s, Mobile: 20s, Desktop: 30s
        manifestLoadingMaxRetry: forceConservativeMode ? 15 : (iosOptimizations ? 15 : (mobileOptimizations ? 10 : 8)), // iOS: 15x, Mobile: 10x, Desktop: 8x
        levelLoadingTimeOut: forceConservativeMode ? 10000 : (iosOptimizations ? 12000 : (mobileOptimizations ? 20000 : 30000)), // iOS: 12s, Mobile: 20s, Desktop: 30s
        levelLoadingMaxRetry: forceConservativeMode ? 15 : (iosOptimizations ? 15 : (mobileOptimizations ? 10 : 8)), // iOS: 15x, Mobile: 10x, Desktop: 8x
        fragLoadingTimeOut: forceConservativeMode ? 10000 : (iosOptimizations ? 12000 : (mobileOptimizations ? 20000 : 30000)), // iOS: 12s, Mobile: 20s, Desktop: 30s
        fragLoadingMaxRetry: forceConservativeMode ? 15 : (iosOptimizations ? 15 : (mobileOptimizations ? 10 : 8)), // iOS: 15x, Mobile: 10x, Desktop: 8x
        
        // Otimizações específicas para iOS (baseado em melhores práticas)
        highBufferWatchdogPeriod: forceConservativeMode ? 1 : (iosOptimizations ? 4 : (mobileOptimizations ? 3 : 2)), // iOS: 4s, Mobile: 3s, Desktop: 2s
        startLevel: forceConservativeMode ? 0 : (iosOptimizations ? 0 : (mobileOptimizations ? 0 : -1)), // iOS: começa baixo, Mobile: começa baixo, Desktop: automático
        testBandwidth: true,
        progressive: true,
        
        // Configurações específicas para iOS
        liveSyncDurationCount: forceConservativeMode ? 1 : (iosOptimizations ? 1 : (mobileOptimizations ? 2 : 3)), // iOS: 1, Mobile: 2, Desktop: 3
        liveMaxLatencyDurationCount: forceConservativeMode ? 2 : (iosOptimizations ? 2 : (mobileOptimizations ? 3 : 5)), // iOS: 2, Mobile: 3, Desktop: 5
        
        xhrSetup: function(xhr) {
          xhr.withCredentials = false;
          // Timeout otimizado para iOS (baseado em melhores práticas 2024)
          xhr.timeout = forceConservativeMode ? 8000 : (iosOptimizations ? 10000 : (mobileOptimizations ? 20000 : 30000)); // iOS: 10s, Mobile: 20s, Desktop: 30s
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
              // Sistema de watchdog TOTALMENTE removido
              console.log('🐕 Watchdog TOTALMENTE DESABILITADO - usuário resolve manualmente');
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
      
      // Configuração otimizada para iOS (baseado em melhores práticas)
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        if (forceConservativeMode) {
          console.log('🔧 Mobile + Conexão Lenta: Forçando qualidade mínima');
          hls.currentLevel = 0; // Força qualidade mínima
          hls.startLevel = 0; // Garante que comece baixo
        } else if (iosOptimizations) {
          console.log('🍎 iOS: Começando baixo mas pode subir (otimizado para iOS)');
          hls.startLevel = 0; // iOS começa baixo mas pode subir
        } else if (mobileOptimizations) {
          console.log('📱 Mobile: Começando baixo mas pode subir (otimizado)');
          hls.startLevel = 0; // Mobile começa baixo mas pode subir
        } else {
          console.log('💻 Desktop: Qualidade automática');
          hls.startLevel = -1; // Desktop automático
        }
      });

      // Tratamento de erros - SEM recuperação automática (TOTALMENTE DESABILITADA)
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS Error:', data.type, data.details);
        
        // Sistema de recuperação automática TOTALMENTE removido
        console.log('🔄 Recuperação automática DESABILITADA - usuário resolve manualmente');
        // setError removido - usuário resolve manualmente
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
      
      // Configurar atributos específicos para iOS (baseado em melhores práticas 2024)
      if (isIOS) {
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.preload = 'none'; // iOS: none para economizar recursos
        video.setAttribute('x-webkit-airplay', 'allow');
        video.setAttribute('x5-video-player-type', 'h5');
        video.setAttribute('x5-video-player-fullscreen', 'true');
        video.setAttribute('x5-video-orientation', 'portraint');
        video.setAttribute('controls', 'true');
        video.setAttribute('muted', 'false');
        video.setAttribute('autoplay', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
        // iOS: configurações específicas para estabilidade
        video.setAttribute('crossorigin', 'anonymous');
        video.setAttribute('allowfullscreen', 'true');
        video.setAttribute('webkitallowfullscreen', 'true');
        video.setAttribute('mozallowfullscreen', 'true');
        video.setAttribute('msallowfullscreen', 'true');
      } else if (isMobile) {
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.preload = 'metadata'; // Mobile: metadata, Desktop: auto
        video.setAttribute('x-webkit-airplay', 'allow');
        video.setAttribute('x5-video-player-type', 'h5');
        video.setAttribute('x5-video-player-fullscreen', 'true');
        video.setAttribute('x5-video-orientation', 'portraint');
      }
      
      video.src = streamUrl;
      
      // Listener para erros de rede - SEM retry automático (TOTALMENTE DESABILITADO)
      video.addEventListener('error', (e) => {
        console.error('❌ Safari: erro de vídeo', e);
        
        // Sistema de retry automático TOTALMENTE removido
        console.log('🔄 Retry automático DESABILITADO - usuário resolve manualmente');
        // setError removido - usuário resolve manualmente
      });
      
      video.addEventListener('loadedmetadata', () => {
        console.log('✅ Safari: metadata carregada');
        video.play()
          .then(() => {
            console.log('✅ Safari: reprodução iniciada');
            setIsLoading(false);
            setError(null);
            // Sistema de watchdog TOTALMENTE removido
            console.log('🐕 Watchdog TOTALMENTE DESABILITADO (Safari) - usuário resolve manualmente');
          })
          .catch((err) => {
            console.warn('⚠️ Safari: autoplay bloqueado -', err.message);
            setIsLoading(false);
          });
      });
      
      // Listener para stalling em Safari - SEM recuperação automática (TOTALMENTE DESABILITADA)
      video.addEventListener('stalled', () => {
        console.warn('⚠️ Safari: stream travado');
        
        // Sistema de recuperação automática TOTALMENTE removido
        console.log('🔄 Recuperação automática DESABILITADA - usuário resolve manualmente');
        // setError removido - usuário resolve manualmente
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
            webkit-playsinline="true"
            muted={false}
            autoPlay
            preload={isIOS ? "none" : "metadata"}
            crossOrigin="anonymous"
            allowFullScreen
            webkitAllowFullScreen
            mozAllowFullScreen
            msAllowFullScreen
            style={{ minHeight: '200px' }}
          />
          
          {/* Indicador de qualidade e conexão - Responsivo */}
          {!isLoading && connectionSpeed !== 'checking' && (
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
          {isLoading && (
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
          
          {/* Error overlay - REMOVIDO a pedido do usuário */}
        </div>
      </div>
    </div>
  );
};

export default LivePlayer;
