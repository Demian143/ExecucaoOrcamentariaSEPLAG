# Sistema de Acompanhamento da Execução Orçamentária — SEPLAG

Aplicação monorepo para consulta e análise da execução orçamentária, composta por uma API Laravel, uma interface React e banco PostgreSQL.

## Como executar localmente

### Requisitos

- PHP 8.3 ou superior e Composer
- Node.js e npm
- PostgreSQL, local ou via Docker

### Banco de dados

Para iniciar somente o PostgreSQL e o Adminer:

```bash
docker compose up -d
```

O PostgreSQL fica disponível em `localhost:5432`, com banco, usuário e senha definidos no `docker-compose.yml`. O Adminer fica disponível em `http://localhost:8080`.

Configure o arquivo `backend/.env` para usar PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=root
```

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve
```

A API ficará disponível em `http://127.0.0.1:8000`.

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Configure `frontend/.env` quando a API não estiver na mesma origem:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

O endereço do frontend é informado pelo Vite ao iniciar o servidor.

## Como utilizar Docker

Para construir e iniciar automaticamente o backend, o frontend, o PostgreSQL e o Adminer:

```bash
docker compose up -d --build
```

Ao iniciar, o backend aguarda o banco ficar disponível, executa automaticamente as migrations e os seeders e, em seguida, disponibiliza a API. Os seeders usam `updateOrCreate`, permitindo novas execuções sem duplicar os registros centrais. Não é necessário criar arquivos `.env` nem executar comandos adicionais para iniciar o ambiente Docker.

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Adminer: `http://localhost:8080`

Para encerrar os containers:

```bash
docker compose down
```

## Migrations e seeders

Executar somente as migrations:

```bash
cd backend
php artisan migrate
```

Popular a base:

```bash
php artisan db:seed
```

Recriar a base e executar os seeders:

```bash
php artisan migrate:fresh --seed
```

O comando `migrate:fresh` apaga todas as tabelas e dados existentes. Use-o somente quando a recriação completa da base for intencional, normalmente em desenvolvimento.

O `DatabaseSeeder` cria o usuário de demonstração e chama `OrcamentoSeeder`. Esse seeder usa `database/data/dados-referencia.json`, mantém relações coerentes entre as dimensões e inclui casos como valores ausentes, saldo negativo, ausência de execução, contratos vencidos e registros revisados. O uso de `updateOrCreate` permite novas execuções sem duplicar os registros centrais.

## Credenciais de acesso

```text
E-mail: analista@seplag.rj.gov.br
Senha: orcamento@2026
```

## Estrutura do projeto

```text
.
├── backend/
│   ├── app/Http/Controllers e Requests
│   ├── app/Models
│   ├── app/Services
│   ├── database/migrations
│   ├── database/seeders/OrcamentoSeeder.php
│   └── routes/api.php
├── frontend/
│   └── src/
│       ├── components
│       ├── pages
│       ├── services
│       ├── store
│       └── utils
└── docker-compose.yml
```

No backend, controllers tratam HTTP, Form Requests concentram validação, services implementam consultas e regras de aplicação, e models representam entidades e relacionamentos. No frontend, páginas coordenam carregamento e estado, componentes representam blocos da interface, services centralizam o consumo da API e utils concentram formatação e montagem de parâmetros.

## Decisões arquiteturais

### PostgreSQL

O PostgreSQL foi escolhido pela robustez relacional, integridade por chaves estrangeiras e recursos de consulta e agregação adequados ao domínio orçamentário. Embora o banco também ofereça arrays e JSONB, essas capacidades não fundamentam a modelagem atual: funções, subfunções, programas, ações, naturezas e fontes foram normalizados em tabelas próprias. Essa normalização evita dados repetidos e torna filtros, agrupamentos e relacionamentos explícitos.

### Modelagem orçamentária

`orcamentos` é o registro central e referencia as tabelas de dimensão. Unidade gestora pertence a um órgão; ação pertence a um programa; subfunção pertence a uma função; órgão e programa possuem relação muitos-para-muitos. Contrato pertence a exatamente um orçamento e a um fornecedor.

Os valores consolidados ficam no próprio orçamento. A dotação atualizada, o saldo, o percentual de execução e a indicação de inconsistência são derivados pelo model. Essa escolha mantém a solução direta para o escopo, mas não registra o histórico individual de suplementações, anulações ou movimentações mensais.

### Consultas e carregamento de relações

As listagens usam paginação e filtros aplicados no banco. O detalhamento de orçamento usa eager loading das classificações, contratos, fornecedores e revisão, evitando lazy loading e consultas N+1. Os agregados dos gráficos são calculados no backend para que o navegador receba dados prontos para apresentação.

### Autenticação JWT

A API usa `tymon/jwt-auth` no guard `api`. O token inclui a claim `preferred_username` com o e-mail do usuário, possui expiração e pode ser renovado por `POST /api/auth/refresh`. O cliente tenta renovar o token próximo do vencimento; logout invalida o token atual. JWT simplifica a autenticação stateless, com o custo de exigir estratégia de revogação/blacklist para invalidação antecipada.

### Frontend e estado

O frontend usa React com TypeScript e rotas protegidas. Zustand mantém somente o estado global de autenticação; dados de cada tela permanecem locais, evitando transformar todo estado de servidor em estado global. O acesso HTTP está centralizado em um serviço Axios com inclusão do token, renovação e repetição controlada após resposta 401.

## Justificativa das bibliotecas

- **Laravel:** estrutura a API, validação, autenticação, ORM, paginação e migrations.
- **JWT Auth:** fornece emissão, validação, renovação e invalidação dos JWTs exigidos pela aplicação.
- **React + TypeScript + Vite:** composição da interface, tipagem do contrato da API e desenvolvimento/build rápido.
- **React Router:** proteção e organização das rotas da aplicação.
- **Axios:** cliente HTTP centralizado com interceptadores para autenticação e renovação.
- **Zustand:** estado global pequeno e seletivo para a sessão autenticada.
- **Tailwind CSS:** permite aplicar a identidade visual e os estados semânticos diretamente nos componentes, com ajustes responsivos granulares.
- **Recharts:** gráficos declarativos integrados ao modelo de componentes do React.

## Principais trade-offs

- **Valores orçamentários consolidados:** foi adotada uma tabela central com os valores totais de dotação, suplementações, anulações e execução. A alternativa seria criar tabelas próprias para registrar cada movimentação, oferecendo mais histórico ao custo de maior complexidade, não exigida explicitamente pelo enunciado.
- **JWT:** o token autocontido permite validar assinatura e expiração e carregar claims como `preferred_username`. Em contrapartida, revogar um token antes de sua expiração exige manter uma blacklist.
- **Zustand:** foi escolhido para atualizar somente os componentes inscritos em cada parte do estado de autenticação. A Context API evitaria uma dependência adicional, mas poderia provocar novas renderizações em todos os consumidores quando o estado compartilhado mudasse.
- **Tailwind CSS:** oferece controle granular e responsivo diretamente nos componentes. Bootstrap também seria válido e entregaria componentes prontos, mas ajustes visuais específicos exigiriam estilos e configuração adicionais.

## Melhorias com mais tempo

- Adequar o backend ao Laravel 12.
- Dockerizar backend e frontend e automatizar migrations e seeders no `docker compose up`.
- Escalar o seeder para aproximadamente 500 orçamentos e 300 contratos, preservando os cenários inconsistentes.
- Criar catálogo/facetas de filtros a partir de todo o conjunto consultável, sem depender da página carregada.
- Modelar movimentações orçamentárias com data para uma evolução mensal fiel.
- Adotar TanStack Query para cache, deduplicação e invalidação de requisições.
- Ampliar testes unitários, de integração, componentes e fluxo E2E.
- Adicionar ordenação, exportação e filtros avançados.

## Uso de inteligência artificial

Foi utilizado **Codex (GPT-5.5)** como apoio ao desenvolvimento. A ferramenta auxiliou na inspeção do repositório, implementação incremental, revisão de tipagem, organização de componentes, diagnóstico de integrações e execução de validações de lint, build e backend. As decisões de modelagem, autenticação, separação de responsabilidades e trade-offs foram avaliadas no contexto do código efetivamente mantido no projeto; sugestões que não correspondiam à implementação final não foram tratadas como decisões arquiteturais.
