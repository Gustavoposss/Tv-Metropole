-- =====================================================================
-- Testes da escrita restrita da Programação
-- =====================================================================
-- NÃO EXECUTAR NA PRODUÇÃO.
-- A revisão estática não autoriza este arquivo.
-- Só faz sentido num banco local descartável, depois da migration 0002,
-- e com a variável de sessão definida naquela sessão:
--   set tv_possi.teste_local = 'sim';
-- A última instrução é rollback. Não há COMMIT.
-- TRUNCATE fica de fora.
-- =====================================================================

begin;

do $$
begin
  if current_setting('tv_possi.teste_local', true) is distinct from 'sim' then
    raise exception 'Teste recusado. Use apenas um banco local descartável.';
  end if;
end $$;

set local role anon;
select count(*) as total_publico
from public."Programação";
reset role;

do $$
begin
  execute 'set local role anon';
  begin
    insert into public."Programação" (titulo, horario_inicio, horario_fim)
    values ('TESTE NAO GRAVAR', '00:00', '00:01');
    raise exception 'Falha de segurança: anon conseguiu inserir.';
  exception
    when insufficient_privilege then
      null;
  end;
  execute 'reset role';

  perform set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000000', true);
  perform set_config(
    'request.jwt.claims',
    '{"sub":"00000000-0000-0000-0000-000000000000","role":"authenticated"}',
    true
  );
  execute 'set local role authenticated';

  if auth.uid() is null then
    raise exception 'Teste interrompido: auth.uid() voltou nulo.';
  end if;

  begin
    insert into public."Programação" (titulo, horario_inicio, horario_fim)
    values ('TESTE NAO GRAVAR', '00:00', '00:01');
    raise exception 'Falha de segurança: autenticado sem lista conseguiu inserir.';
  exception
    when insufficient_privilege then
      null;
  end;
  execute 'reset role';
end $$;

do $$
declare
  antes integer;
  depois integer;
begin
  perform set_config('request.jwt.claim.sub', '293f07ba-089e-431b-9437-2c5311001f41', true);
  perform set_config(
    'request.jwt.claims',
    '{"sub":"293f07ba-089e-431b-9437-2c5311001f41","role":"authenticated"}',
    true
  );
  execute 'set local role authenticated';

  if auth.uid() is distinct from '293f07ba-089e-431b-9437-2c5311001f41'::uuid then
    raise exception 'Teste interrompido: auth.uid() não é a conta indicada.';
  end if;

  if not private.eh_administrador() then
    raise exception 'A conta autorizada não está na lista deste banco.';
  end if;

  select count(*) into antes from public."Programação";

  insert into public."Programação" (titulo, horario_inicio, horario_fim)
  values ('TESTE TRANSACAO ROLLBACK', '00:00', '00:01');

  select count(*) into depois from public."Programação";

  if depois <> antes + 1 then
    raise exception 'A inserção de teste não ficou visível dentro da transação.';
  end if;

  execute 'reset role';
end $$;

rollback;
