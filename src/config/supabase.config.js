// Configuração do Supabase
// IMPORTANTE: Coloque suas credenciais aqui ou use variáveis de ambiente

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://ugoxaebmfkzscyjxbkpb.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnb3hhZWJtZmt6c2N5anhia3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTE3MzksImV4cCI6MjA1NTQ2NzczOX0.mRN3CUON1nrEEAMT7fXg2R9H6-9wNlQO4abQO_F7bzo',
};

// Para variáveis de ambiente, crie um arquivo .env.local na raiz do projeto com:
// VITE_SUPABASE_URL=https://ugoxaebmfkzscyjxbkpb.supabase.co
// VITE_SUPABASE_ANON_KEY=sua_chave_anon_key_aqui
