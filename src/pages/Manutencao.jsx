import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const TEXTO_DESCRICAO =
  'A TV Possi 16.1 está preparando um novo portal para você. Em breve, uma experiência ainda melhor.';

const Manutencao = () => {
  const reduzirMovimento = useReducedMotion();

  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = 'TV Possi 16.1 — Em breve';

    const aplicarMeta = (nome, conteudo) => {
      let elemento = document.querySelector(`meta[name="${nome}"]`);
      const criou = !elemento;
      const anterior = elemento?.getAttribute('content') ?? null;

      if (!elemento) {
        elemento = document.createElement('meta');
        elemento.setAttribute('name', nome);
        document.head.appendChild(elemento);
      }

      elemento.setAttribute('content', conteudo);

      return () => {
        if (criou) {
          elemento.remove();
          return;
        }
        if (anterior !== null) elemento.setAttribute('content', anterior);
      };
    };

    const restaurarRobots = aplicarMeta('robots', 'noindex, nofollow');
    const restaurarTema = aplicarMeta('theme-color', '#000000');
    const descricao = document.querySelector('meta[name="description"]');
    const descricaoAnterior = descricao?.getAttribute('content') ?? null;

    if (descricao) descricao.setAttribute('content', TEXTO_DESCRICAO);

    return () => {
      document.title = tituloAnterior;
      restaurarRobots();
      restaurarTema();
      if (descricao && descricaoAnterior !== null) {
        descricao.setAttribute('content', descricaoAnterior);
      }
    };
  }, []);

  const surgir = (atraso) =>
    reduzirMovimento
      ? { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: atraso, ease: 'easeOut' },
        };

  return (
    <main className="relative min-h-svh overflow-hidden bg-black text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#14c4c8]/16 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-[#2f78ff]/12 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-[#ff8a1e]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-svh w-full max-w-3xl flex-col items-center justify-center px-5 py-14 text-center sm:px-8">
        <motion.p
          {...surgir(0)}
          className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[#d7dde8] sm:text-xs"
        >
          Canal 16.1
        </motion.p>

        <motion.img
          {...surgir(0.08)}
          src="/logo-tv-possi.jpg"
          alt="TV Possi 16.1"
          width="1000"
          height="1073"
          decoding="async"
          className="mt-4 h-auto w-[min(86vw,420px)]"
        />

        <motion.h1
          {...surgir(0.16)}
          className="mt-2 max-w-xl text-[1.85rem] font-semibold leading-tight tracking-tight text-white sm:text-5xl"
        >
          Estamos de cara nova!
        </motion.h1>

        <motion.p
          {...surgir(0.24)}
          className="mt-5 max-w-xl text-base leading-relaxed text-[#d7dde8] sm:text-lg"
        >
          {TEXTO_DESCRICAO}
        </motion.p>

        <motion.p
          {...surgir(0.32)}
          className="mt-8 inline-flex items-center gap-3 text-sm font-medium tracking-wide text-[#b7f3ee] sm:text-base"
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#ff8a1e]" />
          Em breve, novidades!
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#2f78ff]" />
        </motion.p>
      </div>
    </main>
  );
};

export default Manutencao;
