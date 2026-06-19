import { useRef, useState } from 'react';
import Modal from './Modal';
import { aplicarImportacao } from '../../lib/programasService';
import { formatarHora, labelDias } from '../../utils/programacao';
import { TipoBadge } from './Badge';
import { useToast } from '../../context/ToastContext';

const ImportarGradeModal = ({ aberto, onClose, programasAtuais, onAplicado }) => {
  const toast = useToast();
  const inputRef = useRef(null);

  const [etapa, setEtapa] = useState('upload'); // upload | analisando | revisao | aplicando
  const [arquivo, setArquivo] = useState(null);
  const [diff, setDiff] = useState({ novos: [], alterados: [], removidos: [] });
  const [sel, setSel] = useState({ novos: new Set(), alterados: new Set(), removidos: new Set() });

  const resetar = () => {
    setEtapa('upload');
    setArquivo(null);
    setDiff({ novos: [], alterados: [], removidos: [] });
    setSel({ novos: new Set(), alterados: new Set(), removidos: new Set() });
  };

  const fechar = () => {
    if (etapa === 'analisando' || etapa === 'aplicando') return;
    resetar();
    onClose?.();
  };

  const selecionarArquivo = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      toast.erro('Selecione um arquivo PDF.');
      return;
    }
    setArquivo(f);
  };

  const analisar = async () => {
    if (!arquivo) return;
    setEtapa('analisando');
    try {
      // Carrega o parser (pdfjs) sob demanda para não pesar no carregamento inicial
      const { lerGradePdf, compararGrade } = await import('../../lib/pdfParser');
      const importados = await lerGradePdf(arquivo);
      if (!importados.length) {
        toast.erro('Não foi possível extrair programas deste PDF. Verifique o layout.');
        setEtapa('upload');
        return;
      }
      const resultado = compararGrade(importados, programasAtuais);
      setDiff(resultado);
      setSel({
        novos: new Set(resultado.novos.map((_, i) => i)),
        alterados: new Set(resultado.alterados.map((_, i) => i)),
        removidos: new Set(resultado.removidos.map((_, i) => i)),
      });
      setEtapa('revisao');
    } catch (err) {
      console.error(err);
      toast.erro('Erro ao ler o PDF.');
      setEtapa('upload');
    }
  };

  const alternar = (cat, i) => {
    setSel((s) => {
      const novo = new Set(s[cat]);
      if (novo.has(i)) novo.delete(i);
      else novo.add(i);
      return { ...s, [cat]: novo };
    });
  };

  const totalSelecionado = sel.novos.size + sel.alterados.size + sel.removidos.size;

  const aplicar = async () => {
    setEtapa('aplicando');
    try {
      const payload = {
        novos: diff.novos.filter((_, i) => sel.novos.has(i)),
        alterados: diff.alterados
          .filter((_, i) => sel.alterados.has(i))
          .map((a) => ({ id: a.id, dados: { ...a.atual, ...a.novo } })),
        removidos: diff.removidos.filter((_, i) => sel.removidos.has(i)).map((p) => p.id),
      };
      const res = await aplicarImportacao(payload);
      toast.sucesso(
        `Importação concluída: ${res.inseridos} novo(s), ${res.atualizados} alterado(s), ${res.excluidos} removido(s).`
      );
      resetar();
      onClose?.();
      await onAplicado?.();
    } catch (err) {
      console.error(err);
      toast.erro(err?.message || 'Erro ao aplicar as alterações.');
      setEtapa('revisao');
    }
  };

  const rodape =
    etapa === 'revisao' ? (
      <>
        <button
          onClick={fechar}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          onClick={aplicar}
          disabled={totalSelecionado === 0}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
        >
          Aplicar alterações ({totalSelecionado})
        </button>
      </>
    ) : etapa === 'upload' ? (
      <>
        <button
          onClick={fechar}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          onClick={analisar}
          disabled={!arquivo}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
        >
          Analisar grade
        </button>
      </>
    ) : null;

  return (
    <Modal
      aberto={aberto}
      onClose={fechar}
      titulo="Importar grade"
      descricao="Faça upload do PDF da grade para comparar com a programação atual."
      tamanho="xl"
      rodape={rodape}
    >
      {etapa === 'upload' && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            selecionarArquivo(e.dataTransfer.files?.[0]);
          }}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-green-400 hover:bg-green-50/40"
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => selecionarArquivo(e.target.files?.[0])}
          />
          <div className="mb-3 text-4xl">📄</div>
          {arquivo ? (
            <p className="text-sm font-medium text-slate-700">{arquivo.name}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-700">Clique ou arraste o PDF aqui</p>
              <p className="mt-1 text-xs text-slate-400">Somente arquivos .pdf</p>
            </>
          )}
        </div>
      )}

      {etapa === 'analisando' && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-600" />
          <p className="mt-4 text-sm text-slate-500">Lendo e analisando o PDF...</p>
        </div>
      )}

      {etapa === 'aplicando' && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-600" />
          <p className="mt-4 text-sm text-slate-500">Aplicando alterações no banco...</p>
        </div>
      )}

      {etapa === 'revisao' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <ResumoCard cor="text-green-600" label="Novos" valor={diff.novos.length} />
            <ResumoCard cor="text-amber-600" label="Alterados" valor={diff.alterados.length} />
            <ResumoCard cor="text-red-600" label="Removidos" valor={diff.removidos.length} />
          </div>

          {diff.novos.length === 0 && diff.alterados.length === 0 && diff.removidos.length === 0 && (
            <p className="rounded-lg bg-slate-50 py-8 text-center text-sm text-slate-500">
              Nenhuma diferença encontrada. A grade já está atualizada.
            </p>
          )}

          {diff.novos.length > 0 && (
            <Secao titulo="Programas novos" cor="text-green-700">
              {diff.novos.map((p, i) => (
                <LinhaDiff
                  key={i}
                  marcado={sel.novos.has(i)}
                  onToggle={() => alternar('novos', i)}
                  titulo={p.titulo}
                  detalhe={`${formatarHora(p.horario_inicio)}–${formatarHora(p.horario_fim)} · ${labelDias(p.dias_semana)}`}
                  extra={<TipoBadge tipo={p.tipo} />}
                />
              ))}
            </Secao>
          )}

          {diff.alterados.length > 0 && (
            <Secao titulo="Programas alterados" cor="text-amber-700">
              {diff.alterados.map((a, i) => (
                <LinhaDiff
                  key={i}
                  marcado={sel.alterados.has(i)}
                  onToggle={() => alternar('alterados', i)}
                  titulo={a.novo.titulo}
                  detalhe={
                    <>
                      <span className="text-slate-400 line-through">
                        {formatarHora(a.atual.horario_inicio)}–{formatarHora(a.atual.horario_fim)}
                      </span>{' '}
                      →{' '}
                      <span className="text-slate-700">
                        {formatarHora(a.novo.horario_inicio)}–{formatarHora(a.novo.horario_fim)}
                      </span>
                      <span className="ml-2 text-xs text-amber-600">({a.campos.join(', ')})</span>
                    </>
                  }
                />
              ))}
            </Secao>
          )}

          {diff.removidos.length > 0 && (
            <Secao titulo="Programas removidos" cor="text-red-700">
              {diff.removidos.map((p, i) => (
                <LinhaDiff
                  key={i}
                  marcado={sel.removidos.has(i)}
                  onToggle={() => alternar('removidos', i)}
                  titulo={p.titulo}
                  detalhe={`${formatarHora(p.horario_inicio)}–${formatarHora(p.horario_fim)} · ${labelDias(p.dias_semana)}`}
                  perigo
                />
              ))}
            </Secao>
          )}
        </div>
      )}
    </Modal>
  );
};

const ResumoCard = ({ cor, label, valor }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
    <p className={`text-2xl font-bold ${cor}`}>{valor}</p>
    <p className="text-xs text-slate-500">{label}</p>
  </div>
);

const Secao = ({ titulo, cor, children }) => (
  <div>
    <h4 className={`mb-2 text-sm font-semibold ${cor}`}>{titulo}</h4>
    <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">{children}</div>
  </div>
);

const LinhaDiff = ({ marcado, onToggle, titulo, detalhe, extra, perigo }) => (
  <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-slate-50">
    <input
      type="checkbox"
      checked={marcado}
      onChange={onToggle}
      className={`h-4 w-4 rounded border-slate-300 ${perigo ? 'accent-red-600' : 'accent-green-600'}`}
    />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-slate-800">{titulo}</p>
      <p className="truncate text-xs text-slate-500">{detalhe}</p>
    </div>
    {extra}
  </label>
);

export default ImportarGradeModal;
