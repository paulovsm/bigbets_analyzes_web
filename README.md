# BigBets Analyzes Web

**BigBets Analyzes Web** é a interface visual para o ecossistema BigBets de agentes autônomos. Esta aplicação permite visualizar, filtrar e analisar relatórios de mercado, sinais de oferta e demanda, cadeias de valor e modelagens financeiras geradas pelos agentes de IA.

## 🚀 Funcionalidades

- **Dashboard de Relatórios**: Visualização consolidada de estudos de mercado.
- **Detalhamento de Estudos**: Explore profundamente a cadeia de valor, "whitespaces" (oportunidades), e drivers de risco.
- **Filtros Avançados**: Busque relatórios por indústria, região ou tags específicas.
- **Design Responsivo**: Interface moderna e fluida, otimizada para Desktop e Mobile.
- **Integração Supabase**: Conexão direta com banco de dados para leitura de relatórios em tempo real.

## 📂 Estrutura do Projeto

O repositório está organizado da seguinte forma:

- **`/app`**: Contém o código fonte da aplicação web (Next.js 15, React 19, Tailwind/CSS Modules).
- **`/docs`**: Documentação técnica e guias de referência.
  - [Esquema do Banco de Dados](docs/database_schema.md)
  - [Guia de Deploy](docs/DEPLOY.md)

## 🛠️ Tecnologias

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Estilização**: CSS Modules, Framer Motion
- **Dados**: Supabase (PostgreSQL)
- **Ícones**: Lucide React

## 🏁 Como Executar

Para rodar a aplicação localmente:

1. Acesse o diretório da aplicação:
   ```bash
   cd app
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Copie o arquivo de exemplo e preencha com suas chaves do Supabase.
   ```bash
   cp .env.example .env.local
   ```
   *Você precisará das chaves `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.*

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## ☁️ Deploy

O projeto é otimizado para deploy na **Vercel** ou **Netlify**.
Consulte o [Guia de Deploy](docs/DEPLOY.md) para instruções detalhadas.
