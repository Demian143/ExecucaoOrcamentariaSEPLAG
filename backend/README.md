# Backend — API de Execução Orçamentária

API REST desenvolvida com Laravel para autenticação, consulta e revisão de dados da execução orçamentária.

## Tecnologias

- PHP 8.3 ou superior
- Laravel 13
- PostgreSQL
- Eloquent ORM
- JWT Auth
- Pest

## Execução com Docker

O backend faz parte do Compose localizado na raiz do repositório. Para iniciar todo o ambiente, execute na raiz:

```bash
docker compose up
```

O container aguarda o PostgreSQL, executa migrations e seeders automaticamente e disponibiliza a API em `http://localhost:8000`.

## Execução local

Requisitos: PHP, Composer e PostgreSQL em execução.

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve
```

O `.env.example` usa o banco `laravel` em `127.0.0.1:5432`. Ajuste as credenciais caso seu PostgreSQL local utilize outros valores.

## Variáveis principais

| Variável | Finalidade | Exemplo |
| --- | --- | --- |
| `APP_URL` | URL da API | `http://localhost:8000` |
| `APP_KEY` | Chave de criptografia do Laravel | gerada por `key:generate` |
| `JWT_SECRET` | Chave de assinatura dos tokens | gerada por `jwt:secret` |
| `DB_HOST` | Servidor PostgreSQL | `127.0.0.1` local ou `db` no Docker |
| `DB_DATABASE` | Nome do banco | `laravel` |
| `DB_USERNAME` | Usuário do banco | `root` |
| `DB_PASSWORD` | Senha do banco | `root` |

## Autenticação

As rotas de negócio exigem JWT no cabeçalho:

```http
Authorization: Bearer <token>
```

O seeder cria um usuário de demonstração:

```text
E-mail: analista@seplag.rj.gov.br
Senha: orcamento@2026
```

## Rotas da API

Todas as URLs possuem o prefixo `/api`.

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | Não | Autentica e retorna um JWT |
| `POST` | `/auth/logout` | Sim | Invalida o token atual |
| `POST` | `/auth/refresh` | Sim | Renova o token |
| `POST` | `/auth/me` | Sim | Retorna o usuário autenticado |
| `GET` | `/dashboard` | Sim | Retorna os indicadores consolidados |
| `GET` | `/graficos` | Sim | Retorna dados agregados dos gráficos |
| `GET` | `/orgaos` | Sim | Lista órgãos |
| `GET` | `/orcamentos` | Sim | Lista e filtra orçamentos |
| `GET` | `/orcamentos/{id}` | Sim | Detalha um orçamento |
| `PATCH` | `/orcamentos/{id}/revisao` | Sim | Atualiza a revisão de um orçamento |
| `GET` | `/contratos` | Sim | Lista e filtra contratos |

O endpoint de saúde da aplicação está disponível em `GET /up`.

## Migrations e seeders

Aplicar migrations pendentes:

```bash
php artisan migrate
```

Popular o banco:

```bash
php artisan db:seed
```

Recriar completamente o banco de desenvolvimento:

```bash
php artisan migrate:fresh --seed
```

`migrate:fresh` apaga todas as tabelas. O seeder usa `updateOrCreate`, permitindo reexecuções sem duplicar os registros centrais.

## Testes e qualidade

Os testes usam Pest e esperam um banco PostgreSQL chamado `laravel_testing`:

```bash
php artisan test --compact
```

Formatar o código PHP:

```bash
vendor/bin/pint
```

## Organização

```text
app/Http/Controllers/   entrada e respostas HTTP
app/Http/Requests/      validação dos filtros e alterações
app/Models/             entidades e relacionamentos Eloquent
app/Services/           consultas e regras de aplicação
database/migrations/    estrutura do banco
database/seeders/       dados iniciais e de demonstração
routes/api.php          rotas REST
tests/                  testes unitários e de integração
```
