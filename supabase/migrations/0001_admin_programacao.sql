-- =====================================================================
-- Migration: painel administrativo da Programação (TV Metrópole)
-- =====================================================================
-- Adiciona as colunas necessárias ao painel (tipo / ativo) preservando
-- a estrutura existente da tabela "Programação" e configura as políticas
-- de acesso (RLS): leitura pública + escrita apenas para autenticados.
--
-- Como aplicar:
--   1. Supabase Dashboard -> SQL Editor -> cole este arquivo -> Run.
--   (ou)  supabase db push   se você usa a CLI.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Novas colunas
-- ---------------------------------------------------------------------

-- Tipo do programa: AO VIVO | REPRISE | STREAM
alter table "Programação"
  add column if not exists "tipo" text not null default 'AO VIVO';

-- Situação do programa: ativo (true) / inativo (false)
alter table "Programação"
  add column if not exists "ativo" boolean not null default true;

-- Restrição de valores válidos para "tipo"
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'programacao_tipo_check'
  ) then
    alter table "Programação"
      add constraint programacao_tipo_check
      check ("tipo" in ('AO VIVO', 'REPRISE', 'STREAM'));
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 2. Row Level Security
-- ---------------------------------------------------------------------
alter table "Programação" enable row level security;

-- Leitura pública (mantém o site público funcionando com a anon key)
drop policy if exists "Programacao leitura publica" on "Programação";
create policy "Programacao leitura publica"
  on "Programação" for select
  using (true);

-- Inserção apenas para usuários autenticados (painel admin)
drop policy if exists "Programacao insert autenticado" on "Programação";
create policy "Programacao insert autenticado"
  on "Programação" for insert
  to authenticated
  with check (true);

-- Atualização apenas para usuários autenticados
drop policy if exists "Programacao update autenticado" on "Programação";
create policy "Programacao update autenticado"
  on "Programação" for update
  to authenticated
  using (true)
  with check (true);

-- Exclusão apenas para usuários autenticados
drop policy if exists "Programacao delete autenticado" on "Programação";
create policy "Programacao delete autenticado"
  on "Programação" for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------
-- 3. (Opcional) índice para ordenação por horário
-- ---------------------------------------------------------------------
create index if not exists "idx_programacao_horario_inicio"
  on "Programação" ("horario_inicio");
