# 🔧 Configuração do Supabase

Guia passo a passo para conectar a aplicação ao banco de dados Supabase.

## 📋 Pré-requisitos

- Conta no Supabase: https://supabase.com
- Projeto criado no Supabase
- Tabela de programação já criada

## 🔑 Passo 1: Obter as Credenciais

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto: `ugoxaebmfkzscyjxbkpb`
3. Vá em **Settings** (⚙️) → **API**
4. Copie as seguintes informações:
   - **Project URL**: `https://ugoxaebmfkzscyjxbkpb.supabase.co`
   - **anon/public key**: Uma chave longa começando com `eyJ...`

## 🔧 Passo 2: Configurar as Variáveis

### Opção 1: Arquivo de Configuração (Recomendado para desenvolvimento)

Edite o arquivo `src/config/supabase.config.js`:

```javascript
export const supabaseConfig = {
  url: 'https://ugoxaebmfkzscyjxbkpb.supabase.co',
  anonKey: 'SUA_ANON_KEY_AQUI', // Cole a anon key aqui
};
```

### Opção 2: Variáveis de Ambiente (Recomendado para produção)

1. Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://ugoxaebmfkzscyjxbkpb.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

2. Reinicie o servidor de desenvolvimento

## 📊 Passo 3: Estrutura da Tabela

A aplicação espera uma tabela chamada `programacao` com os seguintes campos:

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | integer | ID único (auto-incremento) | 1 |
| `nome` | text | Nome do programa | "Bom Dia Metrópole" |
| `descricao` | text | Descrição do programa | "Notícias da manhã" |
| `icone` | text | Ícone/emoji ou URL da imagem | "☀️" ou URL |
| `hora_inicio` | time | Hora de início | "06:00:00" |
| `hora_fim` | time | Hora de término | "08:00:00" |
| `dia` | date | Data do programa | "2025-09-30" |
| `imagem_url` | text | URL da imagem (opcional) | "https://..." |

### SQL para criar a tabela (se necessário):

```sql
CREATE TABLE programacao (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  icone TEXT,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  dia DATE NOT NULL,
  imagem_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice para melhor performance
CREATE INDEX idx_programacao_dia ON programacao(dia);
CREATE INDEX idx_programacao_hora ON programacao(hora_inicio, hora_fim);
```

## 🔐 Passo 4: Configurar Políticas de Segurança (RLS)

No Supabase, vá em **Authentication** → **Policies** e habilite RLS para a tabela `programacao`:

```sql
-- Permitir leitura pública
CREATE POLICY "Permitir leitura pública da programação"
ON programacao
FOR SELECT
TO public
USING (true);
```

## ✅ Passo 5: Testar a Conexão

1. Reinicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse a página de **Programação**
3. Verifique o console do navegador (F12):
   - Se houver erro de conexão, verifique as credenciais
   - Se houver erro de query, verifique o nome da tabela e campos

## 📝 Exemplo de Dados

Insira alguns programas de teste:

```sql
INSERT INTO programacao (nome, descricao, icone, hora_inicio, hora_fim, dia) VALUES
('Bom Dia Metrópole', 'As primeiras notícias do dia', '☀️', '06:00', '08:00', '2025-09-30'),
('Jornal da Metrópole', 'Resumo das notícias', '📰', '19:00', '20:00', '2025-09-30'),
('Cine Metrópole', 'Cinema à noite', '🎬', '22:00', '00:00', '2025-09-30');
```

## 🐛 Solução de Problemas

### Erro: "Invalid API key"
- Verifique se copiou a `anon key` correta
- Certifique-se de não copiar espaços extras

### Erro: "relation 'programacao' does not exist"
- Verifique se a tabela foi criada
- Verifique se o nome está correto (case-sensitive)

### Erro: "Row Level Security"
- Ative as políticas de RLS conforme o Passo 4

### Nenhum programa aparece
- Verifique se há dados na tabela
- Verifique a data dos programas (campo `dia`)
- Abra o console do navegador para ver logs

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [API Reference](https://supabase.com/docs/reference/javascript/introduction)

## 🔄 Conexão Direta (Opcional)

As credenciais fornecidas também incluem conexão direta PostgreSQL:

```
Host: aws-0-sa-east-1.pooler.supabase.com
Port: 6543
Database: postgres
User: postgres.ugoxaebmfkzscyjxbkpb
Password: [SUA-SENHA]
```

⚠️ **Importante**: Use a conexão pooler (porta 6543) para conexões do frontend via Supabase client.
