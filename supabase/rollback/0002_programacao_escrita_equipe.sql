-- =====================================================================
-- Rollback da escrita restrita da Programação
-- =====================================================================
-- NÃO EXECUTAR sem aprovação.
-- Este arquivo fica fora de supabase/migrations para não rodar sozinho.
--
-- Registro observado em 10 de novembro de 2026, antes de qualquer mudança.
-- Estas linhas são memória. Este arquivo não as recria.
--   TABLEPOLICE: ALL, public, using true, check true
--   Programacao leitura publica: SELECT, public, using true
--   Programacao insert autenticado: INSERT, authenticated, check true
--   Programacao update autenticado: UPDATE, authenticated, using true, check true
--   Programacao delete autenticado: DELETE, authenticated, using true
--   ACL: postgres, anon, authenticated e service_role com arwdDxt
--   PUBLIC não tinha GRANT direto na tabela
--
-- O rollback abaixo remove a escrita da equipe e não restaura esse estado.
-- Não recria TABLEPOLICE.
-- Não devolve INSERT, UPDATE, DELETE nem TRUNCATE a PUBLIC, anon ou authenticated.
-- A leitura pública permanece. As linhas da Programação não são apagadas.
--
-- Para devolver só o acesso da conta autorizada, sem reabrir a escrita
-- pública, rode novamente a migration 0002. Se as políticas da equipe já
-- existirem e apenas a linha da conta tiver sumido, use a seed de recuperação.
-- =====================================================================

drop policy if exists "Programacao insert equipe" on public."Programação";
drop policy if exists "Programacao update equipe" on public."Programação";
drop policy if exists "Programacao delete equipe" on public."Programação";

revoke insert, update, delete, truncate, trigger, references
  on table public."Programação" from public;

revoke insert, update, delete, truncate, trigger, references
  on table public."Programação" from anon;

revoke insert, update, delete, truncate, trigger, references
  on table public."Programação" from authenticated;

drop function if exists private.eh_administrador();
drop table if exists private.administradores;
drop schema if exists private;
