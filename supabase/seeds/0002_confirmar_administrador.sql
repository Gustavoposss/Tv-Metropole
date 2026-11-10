-- =====================================================================
-- Recuperação da conta administradora
-- =====================================================================
-- NÃO EXECUTAR NESTA ETAPA.
-- A migration 0002 já inclui esta conta na mesma transação da correção.
-- Use este arquivo somente depois, se a linha em private.administradores
-- tiver sido removida e as políticas da equipe continuarem ativas.
-- Ele não recria TABLEPOLICE e não devolve escrita a anon ou PUBLIC.
-- =====================================================================

do $$
begin
  if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'Programação'
      and policyname = 'TABLEPOLICE'
  ) then
    raise exception 'TABLEPOLICE ainda existe. Não inclua a conta neste estado.';
  end if;

  if not exists (
    select 1
    from pg_proc as funcao
    join pg_namespace as esquema on esquema.oid = funcao.pronamespace
    where esquema.nspname = 'private'
      and funcao.proname = 'eh_administrador'
  ) then
    raise exception 'Aplique a migration 0002 antes de recuperar a conta.';
  end if;

  if not exists (
    select 1
    from auth.users
    where id = '293f07ba-089e-431b-9437-2c5311001f41'
  ) then
    raise exception 'A conta autorizada não existe.';
  end if;
end $$;

insert into private.administradores (user_id)
select id
from auth.users
where id = '293f07ba-089e-431b-9437-2c5311001f41'
on conflict (user_id) do nothing;
