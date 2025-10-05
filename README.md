# Analisa IA – Work Order Auto-Approval (MVP Demo)

Aplicação Next.js (App Router) totalmente sintética criada para o TCC de MBA. Demonstra a jornada de aprovação automática de ordens de serviço industriais com dados mockados, modo de captura para impressão e exportações prontas.

## Tecnologias

- Next.js 14 + App Router
- TypeScript
- Tailwind CSS
- shadcn/ui (componentes customizados inspirados)
- TanStack Table
- Recharts

## Requisitos

- Node.js 18+
- npm ou pnpm/yarn

## Executar localmente

```bash
npm install
npm run dev
```

A aplicação roda em `http://localhost:3000` com todos os dados em memória. Não há dependências externas.

## Build de produção

```bash
npm run build
npm start
```

## Deploy (ex. Vercel)

1. Faça fork ou clone deste repositório.
2. Configure um projeto na Vercel e selecione este repositório.
3. Use o comando padrão `npm install && npm run build` sem variáveis de ambiente.
4. O deploy publica a demo pública (dados sintéticos).

## Dados sintéticos

- `lib/seed.ts` gera o dataset determinístico com 24 plantas e ~600 ordens.
- `seed.ts` pode ser executado (`ts-node` ou `tsx`) para imprimir o dataset completo.
- APIs em `/api/*` possuem latência simulada (300–700ms) e 5% de falhas aleatórias tratáveis na UI.

## Disclaimer

Esta é uma demonstração. Nenhum dado real de clientes, ERP, e-mail ou LLM é utilizado.
