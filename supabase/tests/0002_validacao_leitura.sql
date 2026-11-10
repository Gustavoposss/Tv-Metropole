-- =====================================================================
-- Validação depois da migration 0002
-- =====================================================================
-- Somente leitura. Não inserir, atualizar, apagar nem truncar.
-- Rodar o arquivo inteiro depois de uma execução autorizada.
-- O resultado esperado está nos comentários de cada consulta.
-- =====================================================================

-- Esperado: 46
select count(*) as registros
from public."Programação";

-- Esperado: leitura publica em SELECT.
-- Esperado: insert, update e delete apenas "equipe".
-- Esperado: TABLEPOLICE ausente.
select policyname, cmd, roles::text as papeis
from pg_policies
where schemaname = 'public'
  and tablename = 'Programação'
order by policyname;

-- Esperado para anon: somente SELECT.
-- Esperado para authenticated: SELECT, INSERT, UPDATE e DELETE.
-- Esperado: nenhum TRUNCATE para anon, authenticated ou PUBLIC.
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'Programação'
  and grantee in ('anon', 'authenticated', 'PUBLIC')
order by grantee, privilege_type;

-- Esperado: uma linha, a conta autorizada.
select user_id
from private.administradores
order by user_id;
