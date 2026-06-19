import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listarProgramas } from '../../lib/programasService';
import { DIAS_SEMANA, TIPOS_PROGRAMA, normalizarDia, formatarHora } from '../../utils/programacao';
import { CardSkeleton } from '../../components/admin/Skeleton';
import { TipoBadge } from '../../components/admin/Badge';

const Dashboard = () => {
  const [programas, setProgramas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarProgramas()
      .then(setProgramas)
      .catch((e) => console.error(e))
      .finally(() => setCarregando(false));
  }, []);

  const stats = useMemo(() => {
    const total = programas.length;
    const ativos = programas.filter((p) => p.ativo !== false).length;
    const aoVivo = programas.filter((p) => p.tipo === 'AO VIVO').length;
    return { total, ativos, inativos: total - ativos, aoVivo };
  }, [programas]);

  const porDia = useMemo(() => {
    return DIAS_SEMANA.map((dia) => ({
      ...dia,
      total: programas.filter((p) =>
        (Array.isArray(p.dias_semana) ? p.dias_semana : []).map(normalizarDia).includes(dia.value)
      ).length,
    }));
  }, [programas]);

  const maxDia = Math.max(1, ...porDia.map((d) => d.total));

  const cards = [
    { label: 'Total de programas', valor: stats.total, cor: 'text-slate-800', icone: '📺' },
    { label: 'Ativos', valor: stats.ativos, cor: 'text-green-600', icone: '✅' },
    { label: 'Inativos', valor: stats.inativos, cor: 'text-slate-400', icone: '⏸️' },
    { label: 'Ao Vivo', valor: stats.aoVivo, cor: 'text-red-600', icone: '🔴' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">Visão geral da grade de programação.</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {carregando
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{c.label}</p>
                  <span className="text-lg">{c.icone}</span>
                </div>
                <p className={`mt-2 text-3xl font-bold ${c.cor}`}>{c.valor}</p>
              </motion.div>
            ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Distribuição por dia */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-base font-semibold text-slate-800">Programas por dia da semana</h2>
          {carregando ? (
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-6 animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {porDia.map((d) => (
                <div key={d.value} className="flex items-center gap-3">
                  <span className="w-10 text-xs font-medium text-slate-500">{d.curto}</span>
                  <div className="h-5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{ width: `${(d.total / maxDia) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-sm font-semibold text-slate-700">{d.total}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Próximos / lista resumida */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800">Grade (amostra)</h2>
            <Link to="/admin/programacao" className="text-sm font-medium text-green-600 hover:text-green-700">
              Ver tudo →
            </Link>
          </div>
          {carregando ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          ) : programas.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">Nenhum programa cadastrado.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {[...programas]
                .sort((a, b) => (a.horario_inicio || '').localeCompare(b.horario_inicio || ''))
                .slice(0, 6)
                .map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700">{p.titulo}</p>
                      <p className="text-xs text-slate-400">
                        {formatarHora(p.horario_inicio)} – {formatarHora(p.horario_fim)}
                      </p>
                    </div>
                    <TipoBadge tipo={p.tipo} />
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Resumo por tipo */}
      {!carregando && programas.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {TIPOS_PROGRAMA.map((t) => (
            <div
              key={t.value}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2"
            >
              <span className="text-sm text-slate-500">{t.label}:</span>
              <span className="text-sm font-semibold text-slate-800">
                {programas.filter((p) => p.tipo === t.value).length}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
