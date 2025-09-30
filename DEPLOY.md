# 🚀 Guia de Deploy - TV Metrópole

## 📋 Pré-requisitos

- ✅ Código funcionando localmente
- ✅ Supabase configurado
- ✅ Conta na Vercel
- ✅ Domínio no Cloudflare

---

## 🌐 DEPLOY NA VERCEL

### Passo 1: Preparar o Repositório Git

```bash
cd tv-metropole
git init
git add .
git commit -m "Deploy inicial TV Metrópole"
```

### Passo 2: Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Nome: `tv-metropole`
3. Visibilidade: Private (recomendado)
4. **NÃO** adicione README, .gitignore ou LICENSE

```bash
git remote add origin https://github.com/SEU_USUARIO/tv-metropole.git
git branch -M main
git push -u origin main
```

### Passo 3: Deploy na Vercel

1. Acesse https://vercel.com
2. Clique em **"Add New Project"**
3. Importe o repositório GitHub
4. Configure:

**Framework Preset:** Vite
**Root Directory:** `tv-metropole`
**Build Command:** `npm run build`
**Output Directory:** `dist`

### Passo 4: Configurar Variáveis de Ambiente

Na Vercel, vá em **Settings → Environment Variables**:

```env
VITE_SUPABASE_URL=https://ugoxaebmfkzscyjxbkpb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnb3hhZWJtZmt6c2N5anhia3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTE3MzksImV4cCI6MjA1NTQ2NzczOX0.mRN3CUON1nrEEAMT7fXg2R9H6-9wNlQO4abQO_F7bzo
```

⚠️ **IMPORTANTE:** Adicione para os 3 ambientes:
- Production
- Preview
- Development

### Passo 5: Deploy!

Clique em **"Deploy"** e aguarde 1-2 minutos.

Sua aplicação estará em: `https://seu-projeto.vercel.app`

---

## ☁️ CONFIGURAR DOMÍNIO NO CLOUDFLARE

### Passo 1: Adicionar Domínio na Vercel

1. Na Vercel, vá em **Settings → Domains**
2. Adicione seu domínio: `seudominio.com.br`
3. A Vercel vai mostrar os registros DNS necessários

### Passo 2: Configurar DNS no Cloudflare

1. Acesse https://dash.cloudflare.com
2. Selecione seu domínio
3. Vá em **DNS → Records**
4. **DELETE** os registros antigos do site anterior

#### Adicionar Novos Registros:

**Opção A - CNAME (Recomendado):**
```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy: ON (nuvem laranja)
```

**Opção B - A Records:**
```
Type: A
Name: @
IPv4: 76.76.21.21
Proxy: ON

Type: A
Name: @
IPv4: 76.76.21.142
Proxy: ON
```

**Para WWW:**
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy: ON
```

### Passo 3: Configurar SSL/TLS

No Cloudflare:
1. Vá em **SSL/TLS**
2. Modo: **Full (strict)**
3. Edge Certificates: **Always Use HTTPS** = ON

### Passo 4: Configurar Cache e Performance

1. **Caching → Configuration:**
   - Browser Cache TTL: 4 hours
   - Caching Level: Standard

2. **Speed → Optimization:**
   - Auto Minify: ✅ JavaScript, CSS, HTML
   - Brotli: ✅ ON
   - Rocket Loader: ❌ OFF (conflita com React)

3. **Page Rules (opcional):**
   ```
   URL: seudominio.com.br/*
   Cache Level: Cache Everything
   Browser Cache TTL: 1 hour
   ```

### Passo 5: Verificar Propagação

Aguarde 5-30 minutos para propagação DNS.

Verificar em:
- https://dnschecker.org
- https://whatsmydns.net

---

## 🔧 Manutenção e Atualizações

### Deploy Automático

Toda vez que você fizer push no GitHub, a Vercel faz deploy automático!

```bash
git add .
git commit -m "Atualização XYZ"
git push
```

### Rollback

Se algo der errado:
1. Vercel Dashboard → Deployments
2. Encontre o deploy anterior funcionando
3. Clique nos 3 pontinhos → **Promote to Production**

---

## 📊 Monitoramento

### Vercel Analytics

1. Vercel Dashboard → Analytics
2. Veja: visitas, performance, erros

### Supabase Logs

1. Supabase Dashboard → Logs
2. Monitore queries e uso do banco

---

## 🐛 Troubleshooting

### Erro 404 nas rotas

- ✅ Verifique se `vercel.json` está configurado
- ✅ Verifique rewrites para SPA

### Variáveis de ambiente não funcionam

- ✅ Nome deve começar com `VITE_`
- ✅ Adicionadas em TODOS os ambientes
- ✅ Redeploy após adicionar

### Domínio não conecta

- ✅ Aguarde propagação DNS (até 48h)
- ✅ Verifique CNAME/A records no Cloudflare
- ✅ SSL no modo Full (strict)

### Performance lenta

- ✅ Ative Cloudflare Cache
- ✅ Minifique assets
- ✅ Use imagens otimizadas

---

## 📝 Checklist Final

Antes de ir ao ar:

- [ ] Build local funciona (`npm run build`)
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] DNS configurado no Cloudflare
- [ ] SSL/TLS ativo e funcionando
- [ ] Teste em diferentes navegadores
- [ ] Teste em mobile
- [ ] Supabase RLS policies configuradas
- [ ] Backup do código no GitHub

---

## 🎯 URLs Importantes

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Supabase Dashboard:** https://app.supabase.com
- **GitHub Repo:** https://github.com/SEU_USUARIO/tv-metropole

---

## 🚀 Pronto para Deploy!

Agora é só seguir os passos e colocar no ar! 🎬📺

Qualquer dúvida, consulte a documentação:
- Vercel: https://vercel.com/docs
- Cloudflare: https://developers.cloudflare.com
