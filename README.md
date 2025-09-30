# TV Metrópole - Plataforma Web

Uma plataforma web moderna para a TV Metrópole, desenvolvida com React, Vite e TailwindCSS.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Player de vídeo ao vivo** com suporte a HLS
- **Página de programação** com destaque automático para programas ao vivo
- **Design responsivo** para desktop, tablet e mobile
- **Animações suaves** com Framer Motion
- **Navegação** entre páginas com React Router
- **Destaque automático** para programa ao vivo com animações pulsantes

### 🎯 Características Técnicas
- **Frontend**: React 19 + Vite
- **Estilização**: TailwindCSS 4.x
- **Animações**: Framer Motion
- **Player**: HLS.js para streaming ao vivo
- **Roteamento**: React Router DOM
- **Responsivo**: Mobile-first design

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]
cd tv-metropole

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Verificar código
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.jsx      # Cabeçalho com navegação
│   ├── LivePlayer.jsx  # Player de vídeo HLS
│   └── ProgramCard.jsx # Card de programa com animações
├── pages/              # Páginas da aplicação
│   ├── Home.jsx        # Página inicial
│   └── Programacao.jsx # Página de programação
├── data/               # Dados simulados
│   └── programacao.json # Programação em JSON
├── assets/             # Recursos estáticos
│   └── logo-tv-metropole.png
└── App.jsx             # Componente principal
```

## 🎨 Design e UX

### Cores Principais
- **Azul**: #3B82F6 (botões, destaques)
- **Vermelho**: #EF4444 (botão "Ao Vivo")
- **Gradientes**: Amarelo → Azul → Ciano

### Animações
- **Transições suaves** entre páginas
- **Destaque pulsante** para programa ao vivo
- **Hover effects** em cards e botões
- **Loading animations** no player

## 📱 Responsividade

- **Mobile**: Layout em coluna única
- **Tablet**: Grid adaptativo
- **Desktop**: Layout completo com sidebar

## 🔧 Configuração do Player

O projeto utiliza **HLS.js** para transmissão ao vivo:

### 🎬 Player de Vídeo (HLS.js)
- **Biblioteca**: HLS.js (HTTP Live Streaming)
- **URL do Stream**: `https://cdn-fundacao-2110.ciclano.io:1443/fundacao-2110/fundacao-2110/playlist.m3u8`
- **Formato**: HLS (m3u8)
- **Resolução**: 1280x720 (HD)
- **Codec**: H.264 (avc1.42c01f) + AAC (mp4a.40.2)
- **Vantagens**: 
  - Compatibilidade universal
  - Recuperação automática de erros
  - Suporte a live streaming
  - Controles nativos do HTML5
  - Baixa latência

### ⚙️ Características Técnicas
- **HLS.js** para navegadores modernos (Chrome, Firefox, Edge)
- **Fallback Safari** com suporte nativo a HLS
- **Recuperação automática** de erros de rede e mídia
- **Loading states** elegantes com spinner verde
- **Error handling** robusto com mensagens informativas
- **Cleanup automático** ao desmontar componente
- **Autoplay** com tratamento de política do navegador

## 📊 Dados da Programação

### 🗄️ Integração com Supabase

A aplicação está integrada com **Supabase** para gerenciar a programação:

- **Banco de Dados**: PostgreSQL no Supabase
- **Tabela**: `programacao`
- **Conexão**: Via Supabase Client (JavaScript)
- **Atualização**: Tempo real com queries otimizadas

### 📋 Estrutura da Tabela

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único auto-incremento |
| `nome` | text | Nome do programa |
| `descricao` | text | Descrição do programa |
| `icone` | text | Emoji ou ícone |
| `hora_inicio` | time | Hora de início |
| `hora_fim` | time | Hora de término |
| `dia` | date | Data do programa |
| `imagem_url` | text | URL da imagem (opcional) |

### 🔧 Configuração

Veja o arquivo [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para instruções completas de configuração.

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

### Servidor de Preview
```bash
npm run preview
```

## 🔮 Próximas Funcionalidades

- [ ] Integração com banco de dados real (Supabase/PostgreSQL)
- [ ] Sistema de usuários e autenticação
- [ ] Chat ao vivo durante transmissões
- [ ] Notificações push para programas favoritos
- [ ] Histórico de programas assistidos
- [ ] Sistema de comentários
- [ ] PWA (Progressive Web App)

## 🐛 Problemas Conhecidos

- Player pode demorar para carregar em conexões lentas
- Alguns navegadores podem ter problemas com HLS
- Animações podem impactar performance em dispositivos antigos

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**TV Metrópole** - Sua TV Digital 🎬📺