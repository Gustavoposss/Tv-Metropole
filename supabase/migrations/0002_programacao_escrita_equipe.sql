-- =====================================================================
-- Migration: escrita da Programação apenas para a equipe
-- =====================================================================
-- Já aplicada manualmente no SQL Editor do projeto Site_Tv_Metropole
-- em 10/11/2026. O deploy da Vercel não executa este arquivo.
-- Não rodar de novo. Uma CLI futura só deve vê-lo como pendente se
-- a versão não estiver em supabase_migrations.schema_migrations;
-- o arquivo é idempotente, mas reaplicá-lo não é o caminho previsto.
--
-- BEGIN e COMMIT, abaixo, delimitam a transação externa.
-- Os blocos "do $$ begin ... end $$" são código interno: o begin
-- deles não abre outra transação e o end não a encerra.
-- Não há COMMIT, ROLLBACK nem SAVEPOINT no meio do arquivo.
--
-- A conta 293f07ba-089e-431b-9437-2c5311001f41 foi autorizada pelo
-- proprietário a administrar a grade. A inclusão fez parte da
-- transação já aplicada.
-- Esta transação não altera as linhas de public."Programação".
-- =====================================================================

BEGIN;

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;
grant usage on schema private to authenticated;

alter default privileges in schema private
  revoke execute on functions from public, anon, authenticated;

alter default privileges for role postgres in schema private
  revoke execute on functions from public, anon, authenticated;

create table if not exists private.administradores (
  user_id uuid primary key references auth.users (id) on delete cascade,
  criado_em timestamptz not null default now()
);

revoke all on table private.administradores from public;
revoke all on table private.administradores from anon;
revoke all on table private.administradores from authenticated;
alter table private.administradores enable row level security;

create or replace function private.eh_administrador()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.administradores
    where user_id = (select auth.uid())
  );
$$;

alter function private.eh_administrador() owner to postgres;
alter function private.eh_administrador() security definer;
alter function private.eh_administrador() set search_path = '';

revoke all on function private.eh_administrador() from public;
revoke all on function private.eh_administrador() from anon;
revoke all on function private.eh_administrador() from authenticated;
grant execute on function private.eh_administrador() to authenticated;

alter table public."Programação" enable row level security;

-- Bloco interno. Não é a transação aberta por BEGIN.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'Programação'
      and policyname = 'Programacao leitura publica'
  ) then
    create policy "Programacao leitura publica"
      on public."Programação"
      for select
      to public
      using (true);
  end if;
end $$;

drop policy if exists "TABLEPOLICE" on public."Programação";
drop policy if exists "Programacao insert autenticado" on public."Programação";
drop policy if exists "Programacao update autenticado" on public."Programação";
drop policy if exists "Programacao delete autenticado" on public."Programação";

drop policy if exists "Programacao insert equipe" on public."Programação";
drop policy if exists "Programacao update equipe" on public."Programação";
drop policy if exists "Programacao delete equipe" on public."Programação";

create policy "Programacao insert equipe"
  on public."Programação"
  for insert
  to authenticated
  with check ((select private.eh_administrador()));

create policy "Programacao update equipe"
  on public."Programação"
  for update
  to authenticated
  using ((select private.eh_administrador()))
  with check ((select private.eh_administrador()));

create policy "Programacao delete equipe"
  on public."Programação"
  for delete
  to authenticated
  using ((select private.eh_administrador()));

revoke insert, update, delete, truncate, trigger, references
  on table public."Programação" from public;

revoke insert, update, delete, truncate, trigger, references
  on table public."Programação" from anon;

revoke truncate, trigger, references
  on table public."Programação" from authenticated;

-- Bloco interno. O raise, se ocorrer, desfaz a transação externa.
do $$
begin
  if not exists (
    select 1
    from auth.users
    where id = '293f07ba-089e-431b-9437-2c5311001f41'
  ) then
    raise exception 'A conta autorizada não existe. Nada será gravado.';
  end if;
end $$;

insert into private.administradores (user_id)
select id
from auth.users
where id = '293f07ba-089e-431b-9437-2c5311001f41'
on conflict (user_id) do nothing;

COMMIT;
