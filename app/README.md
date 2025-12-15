# BigBets Whitespace Viewer

Aplicação web moderna para visualizar relatórios e oportunidades de mercado gerados pelos agentes autônomos.

## Tecnologias

- **Next.js 15+** (App Router)
- **TypeScript**
- **CSS Modules** (Estilização sem Tailwind)
- **Framer Motion** (Animações)
- **Supabase** (Banco de dados)
- **Lucide React** (Ícones)

## Configuração

1. Copie `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Configure as variáveis com suas credenciais do Supabase.

## Banco de Dados

Para permitir o acesso público (sem login) necessário para a visualização dos relatórios, execute o script SQL localizado em:
`supabase_schema_updates.sql`

Isso ajustará as políticas RLS para permitir `SELECT` público.

## Executando Localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy

### Vercel / Netlify

O projeto está pronto para deploy. Basta conectar o repositório e configurar as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
