import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  listarProgramas,
  criarPrograma,
  atualizarPrograma,
  excluirPrograma,
  duplicarPrograma,
  alternarAtivo,
} from '../../lib/programasService';
import { DIAS_SEMANA, formatarHora, labelDias, normalizarDia } from '../../utils/programacao';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ProgramaForm from '../../components/admin/ProgramaForm';
import EmptyState from '../../components/admin/EmptyState';
import { TabelaSkeleton } from '../../components/admin/Skeleton';
import { TipoBadge, StatusBadge } from '../../components/admin/Badge';
import ImportarGradeModal from '../../components/admin/ImportarGradeModal';

const POR_PAGINA = 8;

const ProgramacaoAdmin = () => {
  const toast = useToast();

  const [programas, setProgramas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [busca, setBusca] = useState('');
  const [filtroDia, setFiltroDia] = useState('');
  const [ordemAsc, setOrdemAsc] = useState(true);
  const [pagina, setPagina] = useState(1);

  const [modalForm, setModalForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const [confirmExcluir, setConfirmExcluir] = useState(null);
  const [modalImportar, setModalImportar] = useState(false);

  const carregar = async () => {
    setCarregando(true);
    try {
      const dados = await listarProgramas();
      setProgramas(dados);
    } catch (err) {
      toast.erro('Erro ao carregar a programação.');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtragem + ordenação
  const filtrados = useMemo(() => {
    let lista = [...programas];

    if (busca.trim()) {
      const termo = busca.trim().toLowerCase();
      lista = lista.filter((p) => (p.titulo || '').toLowerCase().includes(termo));
    }

    if (filtroDia) {
      lista = lista.filter((p) =>
        (Array.isArray(p.dias_semana) ? p.dias_semana : [])
          .map(normalizarDia)
          .includes(filtroDia)
      );
    }

    lista.sort((a, b) => {
      const ha = a.horario_inicio || '';
      const hb = b.horario_inicio || '';
      return ordemAsc ? ha.localeCompare(hb) : hb.localeCompare(ha);
    });

    return lista;
  }, [programas, busca, filtroDia, ordemAsc]);

  // Paginação
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtrados.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  useEffect(() => {
    setPagina(1);
  }, [busca, filtroDia]);

  // Ações
  const abrirNovo = () => {
    setEditando(null);
    setModalForm(true);
  };

  const abrirEdicao = (programa) => {
    setEditando(programa);
    setModalForm(true);
  };

  const salvar = async (dados) => {
    setSalvando(true);
    try {
      if (editando) {
        await atualizarPrograma(editando.id, dados);
        toast.sucesso('Programa atualizado com sucesso.');
      } else {
        await criarPrograma(dados);
        toast.sucesso('Programa criado com sucesso.');
      }
      setModalForm(false);
      setEditando(null);
      await carregar();
    } catch (err) {
      toast.erro(err?.message || 'Erro ao salvar o programa.');
      console.error(err);
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExclusao = async () => {
    try {
      await excluirPrograma(confirmExcluir.id);
      toast.sucesso('Programa excluído.');
      setConfirmExcluir(null);
      await carregar();
    } catch (err) {
      toast.erro('Erro ao excluir o programa.');
      console.error(err);
    }
  };

  const duplicar = async (programa) => {
    try {
      await duplicarPrograma(programa);
      toast.sucesso('Programa duplicado.');
      await carregar();
    } catch (err) {
      toast.erro('Erro ao duplicar o programa.');
      console.error(err);
    }
  };

  const alternarSituacao = async (programa) => {
    try {
      await alternarAtivo(programa.id, !programa.ativo);
      setProgramas((lista) =>
        lista.map((p) => (p.id === programa.id ? { ...p, ativo: !programa.ativo } : p))
      );
      toast.sucesso(programa.ativo ? 'Programa inativado.' : 'Programa ativado.');
    } catch (err) {
      toast.erro('Erro ao alterar a situação.');
      console.error(err);
    }
  };

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Programação</h1>
          <p className="text-sm text-slate-500">Gerencie a grade de programas da TV Metrópole.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setModalImportar(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Importar Grade
          </button>
          <button
            onClick={abrirNovo}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Novo programa
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar por nome..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
          />
        </div>
        <select
          value={filtroDia}
          onChange={(e) => setFiltroDia(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/30 sm:w-48"
        >
          <option value="">Todos os dias</option>
          {DIAS_SEMANA.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      {carregando ? (
        <TabelaSkeleton linhas={6} colunas={6} />
      ) : filtrados.length === 0 ? (
        <EmptyState
          icone="📺"
          titulo={programas.length === 0 ? 'Nenhum programa cadastrado' : 'Nenhum resultado encontrado'}
          descricao={
            programas.length === 0
              ? 'Comece criando o primeiro programa da grade.'
              : 'Tente ajustar a busca ou o filtro de dia.'
          }
          acao={
            programas.length === 0 ? (
              <button
                onClick={abrirNovo}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Novo programa
              </button>
            ) : null
          }
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Programa</th>
                  <th className="px-4 py-3">Dias</th>
                  <th className="px-4 py-3">
                    <button
                      onClick={() => setOrdemAsc((v) => !v)}
                      className="inline-flex items-center gap-1 hover:text-slate-700"
                      title="Ordenar por horário"
                    >
                      Horário
                      <span className="text-[10px]">{ordemAsc ? '▲' : '▼'}</span>
                    </button>
                  </th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Situação</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visiveis.map((p) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.imagem_url ? (
                          <img
                            src={p.imagem_url}
                            alt=""
                            className="h-9 w-9 flex-shrink-0 rounded-lg object-cover"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        ) : (
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm">
                            📺
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-800">{p.titulo}</p>
                          {p.descricao && (
                            <p className="truncate text-xs text-slate-400">{p.descricao}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{labelDias(p.dias_semana)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatarHora(p.horario_inicio)} – {formatarHora(p.horario_fim)}
                    </td>
                    <td className="px-4 py-3">
                      <TipoBadge tipo={p.tipo} />
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => alternarSituacao(p)} title="Ativar/Inativar">
                        <StatusBadge ativo={p.ativo} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <BotaoAcao titulo="Editar" onClick={() => abrirEdicao(p)}>
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                        </BotaoAcao>
                        <BotaoAcao titulo="Duplicar" onClick={() => duplicar(p)}>
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </BotaoAcao>
                        <BotaoAcao titulo="Excluir" perigo onClick={() => setConfirmExcluir(p)}>
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </BotaoAcao>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-slate-500">
              Mostrando {(paginaAtual - 1) * POR_PAGINA + 1}–
              {Math.min(paginaAtual * POR_PAGINA, filtrados.length)} de {filtrados.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPaginas }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPagina(i + 1)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition ${
                    paginaAtual === i + 1
                      ? 'bg-green-600 text-white'
                      : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal de formulário */}
      <Modal
        aberto={modalForm}
        onClose={salvando ? undefined : () => setModalForm(false)}
        titulo={editando ? 'Editar programa' : 'Novo programa'}
        descricao={editando ? 'Atualize as informações do programa.' : 'Preencha os dados do novo programa.'}
        tamanho="lg"
      >
        <ProgramaForm
          programa={editando}
          onSubmit={salvar}
          onCancel={() => setModalForm(false)}
          enviando={salvando}
        />
      </Modal>

      {/* Confirmação de exclusão */}
      <ConfirmDialog
        aberto={!!confirmExcluir}
        onClose={() => setConfirmExcluir(null)}
        onConfirmar={confirmarExclusao}
        titulo="Excluir programa"
        mensagem={`Tem certeza que deseja excluir "${confirmExcluir?.titulo}"? Esta ação não pode ser desfeita.`}
        textoConfirmar="Excluir"
      />

      {/* Importar grade */}
      <ImportarGradeModal
        aberto={modalImportar}
        onClose={() => setModalImportar(false)}
        programasAtuais={programas}
        onAplicado={carregar}
      />
    </div>
  );
};

const BotaoAcao = ({ titulo, onClick, children, perigo }) => (
  <button
    onClick={onClick}
    title={titulo}
    aria-label={titulo}
    className={`rounded-lg p-2 transition ${
      perigo ? 'text-slate-400 hover:bg-red-50 hover:text-red-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
    }`}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  </button>
);

export default ProgramacaoAdmin;
