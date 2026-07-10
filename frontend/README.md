# Frontend — Execução Orçamentária

Interface web em React para autenticação, visualização de indicadores, gráficos e consulta detalhada de orçamentos.

## Tecnologias

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Zustand
- Tailwind CSS
- Recharts

## Execução com Docker

O frontend faz parte do Compose localizado na raiz do repositório. Para iniciar todo o ambiente, execute na raiz:

```bash
docker compose up
```

O build React será servido pelo Nginx em `http://localhost:5173`. A API utilizada pelo build Docker fica em `http://localhost:8000`.

## Execução local

Requisitos: Node.js 24 ou versão compatível e npm.

```bash
npm install
cp .env.example .env
npm run dev
```

O endereço local será exibido pelo Vite no terminal.

## Variável de ambiente

```env
VITE_API_BASE_URL=http://localhost:8000
```

`VITE_API_BASE_URL` define a origem da API Laravel. Variáveis expostas pelo Vite são incorporadas ao build e não devem conter segredos.

## Credenciais de demonstração

```text
E-mail: analista@seplag.rj.gov.br
Senha: orcamento@2026
```

Essas credenciais são criadas pelo seeder do backend.

## Rotas da interface

| Rota | Descrição | Protegida |
| --- | --- | --- |
| `/login` | Autenticação | Não |
| `/` | Visão geral | Sim |
| `/home` | Redireciona para a visão geral | Sim |
| `/orcamentos` | Consulta de orçamentos | Sim |
| `/orcamentos/:id` | Detalhamento e revisão | Sim |
| `/graficos` | Visualizações gráficas | Sim |

## Autenticação e API

O serviço em `src/services/api.ts` centraliza as requisições Axios. Ele adiciona o JWT às chamadas protegidas, tenta renovar tokens próximos do vencimento e repete uma requisição uma única vez após uma resposta `401` renovável.

O Zustand mantém o estado da sessão. Token, tipo, validade e usuário são persistidos no `localStorage` para preservar a autenticação após a atualização da página. O logout remove esses dados.

## Scripts

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o servidor Vite com recarregamento automático |
| `npm run build` | Valida o TypeScript e gera o build em `dist/` |
| `npm run lint` | Executa o ESLint |
| `npm run preview` | Serve localmente o build de produção |

## Verificação

Antes de entregar alterações no frontend, execute:

```bash
npm run lint
npm run build
```

## Organização

```text
src/components/   layout, navegação e proteção de rotas
src/pages/        páginas da aplicação
src/services/     cliente HTTP e tipos da API
src/store/        estado global de autenticação
src/utils/        formatação e regras auxiliares
```

O Nginx do container usa fallback para `index.html`, permitindo acessar diretamente as rotas do React Router.
