import { useEffect, useState } from 'react';
import { DIAS_SEMANA, TIPOS_PROGRAMA, formatarHora, normalizarDia } from '../../utils/programacao';

const estadoInicial = {
  titulo: '',
  descricao: '',
  horario_inicio: '',
  horario_fim: '',
  dias_semana: [],
  tipo: 'AO VIVO',
  ativo: true,
  imagem_url: '',
};

const ProgramaForm = ({ programa, onSubmit, onCancel, enviando }) => {
  const [form, setForm] = useState(estadoInicial);
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (programa) {
      setForm({
        titulo: programa.titulo || '',
        descricao: programa.descricao || '',
        horario_inicio: formatarHora(programa.horario_inicio),
        horario_fim: formatarHora(programa.horario_fim),
        dias_semana: Array.isArray(programa.dias_semana)
          ? programa.dias_semana.map(normalizarDia).filter(Boolean)
          : [],
        tipo: programa.tipo || 'AO VIVO',
        ativo: programa.ativo ?? true,
        imagem_url: programa.imagem_url || '',
      });
    } else {
      setForm(estadoInicial);
    }
    setErros({});
  }, [programa]);

  const atualizar = (campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  };

  const alternarDia = (dia) => {
    setForm((f) => ({
      ...f,
      dias_semana: f.dias_semana.includes(dia)
        ? f.dias_semana.filter((d) => d !== dia)
        : [...f.dias_semana, dia],
    }));
    setErros((e) => ({ ...e, dias_semana: undefined }));
  };

  const validar = () => {
    const novos = {};
    if (!form.titulo.trim()) novos.titulo = 'Informe o nome do programa.';
    if (!form.horario_inicio) novos.horario_inicio = 'Informe a hora inicial.';
    if (!form.horario_fim) novos.horario_fim = 'Informe a hora final.';
    // Programas podem cruzar a meia-noite (ex.: 22:00 -> 06:00), então só
    // bloqueia quando início e fim são exatamente iguais (duração zero).
    if (form.horario_inicio && form.horario_fim && form.horario_fim === form.horario_inicio) {
      novos.horario_fim = 'A hora final não pode ser igual à inicial.';
    }
    if (!form.dias_semana.length) novos.dias_semana = 'Selecione ao menos um dia.';
    if (!form.tipo) novos.tipo = 'Selecione o tipo.';
    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    onSubmit(form);
  };

  const inputBase =
    'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-green-500/30';
  const inputClasse = (campo) =>
    `${inputBase} ${erros[campo] ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-green-500'}`;

  return (
    <form id="programa-form" onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Nome do programa <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.titulo}
          onChange={(e) => atualizar('titulo', e.target.value)}
          placeholder="Ex.: Metrópole em Ação"
          className={inputClasse('titulo')}
        />
        {erros.titulo && <p className="mt-1 text-xs text-red-600">{erros.titulo}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Hora inicial <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={form.horario_inicio}
            onChange={(e) => atualizar('horario_inicio', e.target.value)}
            className={inputClasse('horario_inicio')}
          />
          {erros.horario_inicio && <p className="mt-1 text-xs text-red-600">{erros.horario_inicio}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Hora final <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={form.horario_fim}
            onChange={(e) => atualizar('horario_fim', e.target.value)}
            className={inputClasse('horario_fim')}
          />
          {erros.horario_fim && <p className="mt-1 text-xs text-red-600">{erros.horario_fim}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Dias da semana <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {DIAS_SEMANA.map((dia) => {
            const ativo = form.dias_semana.includes(dia.value);
            return (
              <button
                type="button"
                key={dia.value}
                onClick={() => alternarDia(dia.value)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  ativo
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-green-400'
                }`}
              >
                {dia.curto}
              </button>
            );
          })}
        </div>
        {erros.dias_semana && <p className="mt-1 text-xs text-red-600">{erros.dias_semana}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Tipo <span className="text-red-500">*</span>
          </label>
          <select
            value={form.tipo}
            onChange={(e) => atualizar('tipo', e.target.value)}
            className={inputClasse('tipo')}
          >
            {TIPOS_PROGRAMA.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Situação</label>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => atualizar('ativo', !form.ativo)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                form.ativo ? 'bg-green-600' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={form.ativo}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  form.ativo ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-slate-600">{form.ativo ? 'Ativo' : 'Inativo'}</span>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Descrição</label>
        <textarea
          value={form.descricao}
          onChange={(e) => atualizar('descricao', e.target.value)}
          rows={2}
          placeholder="Breve descrição do programa (opcional)"
          className={`${inputBase} resize-none border-slate-300 focus:border-green-500`}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">URL da imagem</label>
        <input
          type="url"
          value={form.imagem_url}
          onChange={(e) => atualizar('imagem_url', e.target.value)}
          placeholder="https://... (opcional)"
          className={`${inputBase} border-slate-300 focus:border-green-500`}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={enviando}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={enviando}
          className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
        >
          {enviando ? 'Salvando...' : 'Salvar programa'}
        </button>
      </div>
    </form>
  );
};

export default ProgramaForm;
