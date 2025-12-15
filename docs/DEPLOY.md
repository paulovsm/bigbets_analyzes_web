# Guia de Deploy

Este guia detalha como publicar a aplicação **BigBets Whitespaces** (Next.js) nas plataformas Vercel e Netlify.

## Pré-requisitos Gerais
1. O código deve estar hospedado em um repositório Git (GitHub, GitLab ou Bitbucket).
2. Você deve ter as credenciais do Supabase (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`) em mãos.

---

## Opção 1: Vercel (Recomendado)

A Vercel é a criadora do Next.js, oferecendo a integração mais fluida e suporte nativo a todas as funcionalidades (Image Optimization, Server Actions, etc).

### Passo a Passo

1. **Crie uma conta** em [vercel.com](https://vercel.com) se ainda não tiver.
2. No Dashboard, clique em **"Add New..."** > **"Project"**.
3. **Importe seu repositório** Git onde o projeto está salvo.
4. **Configuração do Projeto**:
   - **Framework Preset**: Next.js (deve ser detectado automaticamente).
   - **Root Directory**: Clique em "Edit" e selecione a pasta `app`. (Importante: O projeto Next.js não está na raiz do repo, mas na subpasta `app`).
   - **Build Command**: `npm run build` (Padrão).
5. **Environment Variables**:
   Expanda a seção e adicione as seguintes variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL`: *Sua URL do Supabase*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: *Sua chave pública (anon) do Supabase*
6. Clique em **"Deploy"**.

A Vercel irá construir o projeto e, em alguns minutos, fornecerá uma URL pública (ex: `project-name.vercel.app`).

---

## Opção 2: Netlify

O Netlify também suporta Next.js via "Next.js Runtime".

### Passo a Passo

1. **Crie uma conta** em [netlify.com](https://www.netlify.com).
2. No Dashboard, clique em **"Add new site"** > **"Import an existing project"**.
3. Conecte seu provedor Git e selecione o repositório.
4. **Configurações de Build**:
   - **Base directory**: `app` (Muito importante definir isso pois o app está numa subpasta).
   - **Build command**: `npm run build`
   - **Publish directory**: `.next` (O Netlify geralmente detecta e ajusta isso automaticamente para usar o Runtime).
5. **Environment Variables**:
   Clique em "Add environment variables" (ou vá em Site Settings > Environment variables após criar) e adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Clique em **"Deploy site"**.

> **Nota**: O Netlify deve instalar automaticamente o plugin "Essential Next.js" durante o build. Se houver erros, verifique se a versão do Node.js está compatível (pode definir `NODE_VERSION` como `20` nas variáveis de ambiente se necessário).
>
> **Segurança**: O projeto inclui um arquivo `netlify.toml` na raiz que configura automaticamente o build e previne falsos positivos no scanner de segredos do Netlify (que pode bloquear o deploy por detectar a chave pública do Supabase no código client-side).

---

## Verificação Pós-Deploy

Após o deploy, acesse a URL gerada e:
1. Verifique se a aplicação carrega a Landing Page.
2. Navegue até a página de **Relatórios**.
3. Teste a **Busca** e a navegação entre os relatórios.
   - *Se a busca ou listagem falhar, confirme se você aplicou o script SQL de atualização de permissões (RLS) no Supabase para permitir acesso público.*
