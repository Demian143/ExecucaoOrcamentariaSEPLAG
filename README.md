# Decisões de arquitetura

Ferramenta de IA utilizada no desenvolvimento: Codex (gpt-5.5 e gpt-5.6-sol)

## Por que PostgreSQL se encaixa melhor aqui

Arrays nativos: o campo `subfuncoes` no seu JSON já vem como array (`["Planejamento e orçamento", "Administração geral", ...]`). Você pode normalizar isso em tabela separada (recomendado) ou, se quiser prototipar rápido, o Postgres tem tipo array nativo — o MySQL não tem isso, teria que serializar em JSON ou string.

JSONB: se em algum momento você precisar guardar atributos variáveis (ex: metadados de um lançamento orçamentário que mudam por tipo), o JSONB do Postgres é indexável e muito mais maduro que o JSON do MySQL.

### Errata

Durante o desenvolvimento escolhi por as subfunções como uma tabela separada, invalidando a argumento inicial, ainda sim continua sendo uma demonstração da flexibilidade dos bancos postgres.

## JWT Auth (ex: jwt-auth)

JWT é um padrão aberto (RFC 7519) — o token é uma string com 3 partes (header, payload, signature) codificadas em Base64, e qualquer um pode decodificar o payload (sem precisar de banco) pra ver as claims.

Self-contained: o token carrega os dados dele mesmo (ex: sub, iat, exp, e qualquer claim customizado que você definir).

Você controla o payload: pode adicionar `preferred_username`, `role`, ou qualquer outro campo direto no token.

Sem consulta ao banco pra validar (a validação é só verificar assinatura + expiração) — mais performático em tese, mas também significa que revogar um token antes do tempo de expiração é mais difícil (não tem como "apagar" um JWT já emitido sem manter uma blacklist).

O controle do payload é importante pois `preferred_username` é pedido no enunciado como campo requerido no token.

## Estratégia de renovação da autenticação

A aplicação utiliza renovação explícita do JWT por meio do endpoint `POST /api/auth/refresh`.

Quando o token estiver próximo do vencimento, o cliente deve chamar esse endpoint enviando o token atual no cabeçalho:

```text
Authorization: Bearer <token>
```

O endpoint invalida o token anterior e devolve um novo token, evitando que o usuário precise realizar login novamente durante o período permitido para renovação.

Se o prazo máximo de renovação (`refresh_ttl`) também tiver expirado, a renovação será recusada e o usuário deverá realizar um novo login em `POST /api/auth/login`.

Essa estratégia foi escolhida por manter a API stateless e separar claramente login, renovação e encerramento da sessão.

# Atribuição de unidades gestoras a órgãos no seeder

Será feito um sorteio entre estes itens para facilitar a relação e deixar os dados de teste corretamente relacionados, assim evitando a atribuição manual ao subir o projeto.

O método `seedOrcamentos()`:

- Carrega unidades gestoras, ações com seus programas, subfunções, naturezas de despesa e fontes de recurso.
- Localiza o usuário analista para preencher os campos de revisão.
- Valida se todas as dimensões necessárias possuem registros.
- Cria 10 orçamentos referentes a 2026.
- Garante que cada programa esteja associado ao órgão da unidade gestora.
- Inclui propositalmente dados inconsistentes, como valores nulos, pagamento maior que liquidação, liquidação maior que empenho e empenho maior que dotação atualizada.
- Marca os três primeiros registros como revisados.
- Usa `updateOrCreate`, permitindo executar o seeder novamente sem duplicar os orçamentos.
- Ao final, envia os orçamentos criados para `seedContratos()`, que associa contratos apenas a alguns deles.

## Exemplo de orçamento

- Órgão: Secretaria de Estado de Educação
- Unidade Gestora: Fundo Estadual de Educação
- Programa: Educação pública de qualidade
- Ação: Manutenção de unidades escolares
- Função: Educação
- Subfunção: Ensino fundamental
- Natureza da despesa: Material de consumo
- Fonte de recurso: Tesouro estadual
- Ano: 2026
- Dotação atualizada: R$ 10.000.000,00
- Valor empenhado: R$ 7.000.000,00
- Valor liquidado: R$ 5.500.000,00
- Valor pago: R$ 4.800.000,00
- Saldo: R$ 3.000.000,00

## Sobre valores orçamentários

Segui por uma abordagem mais direta, me baseando em uma tabela única com valores totais ao invés de um possível over engeneering com tables suplementações / anulações, que é uma opção também válida, mas não explicitada no enunciado.

## Tabelas de dimensão (todas cobertas)

| Entidade | Tabela | Status |
|---|---|---|
| Órgão | `orgaos` | ✅ |
| Unidade Gestora | `unidades_gestoras` (FK `orgao_id`) | ✅ |
| Programa | `programas` | ✅ |
| Ação | `acoes` (FK `programa_id`) | ✅ |
| Função | `funcoes` | ✅ |
| Subfunção | `subfuncoes` (FK `funcao_id`) | ✅ |
| Natureza da despesa | `naturezas_despesa` | ✅ |
| Fonte de recurso | `fontes_recurso` | ✅ |
| Pivot Órgão↔Programa | `orgao_programa` | ✅ |
| Registro central | `orcamentos` | ✅ |

Pra autenticação, você também tem a `users` (padrão do Laravel), que já resolvemos com JWT.

## Fluxo de requisições

Auth:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"analista@seplag.rj.gov.br","password":"orcamento@2026"}'
```

Copie o valor de `access_token` retornado e consulte o dashboard:

```bash
curl http://127.0.0.1:8000/api/dashboard \
    -H "Accept: application/json" \
    -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

Orçamentos:

```bash
curl --get "http://localhost:8000/api/orcamentos" \
    -H "Accept: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    --data-urlencode "orgao_id=1" \
    --data-urlencode "ano=2026" \
    --data-urlencode "situacao=em_execucao" \
    --data-urlencode "percentual_minimo_executado=20" \
    --data-urlencode "percentual_maximo_executado=80" \
    --data-urlencode "per_page=10" \
    --data-urlencode "page=1"
```

Gráficos:

```bash
curl -X GET 'http://localhost:8000/api/graficos' \
    -H 'Accept: application/json' \
    -H 'Authorization: Bearer SEU_TOKEN_JWT'
```

## Métricas usadas como base para implementação de `/graficos`

### 1. Execução por Órgão e por Programa

A palavra "execução" no domínio público deste desafio refere-se ao Percentual de Execução ou ao volume financeiro consumido.

A expectativa real: o banco precisa agrupar os valores (`SUM`) de dotação e empenho agrupados por Órgão ou por Programa.

Métrica ideal para o gráfico:

$$\text{Percentual Global} = \left( \frac{\sum \text{valor\_empenhado}}{\sum (\text{dotacao\_inicial} + \text{suplementacoes} - \text{anulacoes})} \right) \times 100$$

Formato no React: um gráfico de barras horizontais ou um gráfico de pizza/rosca mostrando o top 5 órgãos/programas que mais consumiram orçamento.

### 2. Empenhado x Pago

Este gráfico serve para o analista avaliar o ritmo da execução e o gargalo financeiro do estado (já que o empenho é o contrato assinado e o pago é o dinheiro saindo do caixa).

A expectativa real: duas barras ou duas linhas comparativas agregando o total de todas as Unidades Gestoras.

Métrica: `SUM(valor_empenhado)` versus `SUM(valor_pago)`.

Formato no React: gráfico de barras agrupadas (lado a lado) ou linhas comparativas.

### 3. Top 10 Maiores Contratos

Este é o mais direto e busca avaliar sua habilidade com ordenação e paginação limitante no SQL.

A expectativa real: uma query na tabela de contratos que traga os 10 registros com os maiores valores totais de contrato, ordenados de forma decrescente (`ORDER BY valor DESC LIMIT 10`).

Formato no React: uma tabela simples e elegante no dashboard ou um gráfico de barras verticais com o nome/sigla do fornecedor ou número do contrato.

### 4. Evolução Mensal da Execução

Este é o único ponto que exige atenção na modelagem do banco de dados (nas tabelas ou no Seeder). Para ter uma evolução mensal, o sistema precisa saber quando as despesas aconteceram.

A expectativa real: agrupar os valores pagos ou empenhados pelo mês do ano corrente.

Métrica: `SUM(valor_pago)` agrupado por mês (Janeiro, Fevereiro, Março...). Como a tabela de orçamentos possui apenas a coluna ano, essa evolução mensal provavelmente terá que ser extraída da tabela de Contratos (usando a data de assinatura/vigência) ou adicionando campos de controle de data nas movimentações.

Formato no React: gráfico de linha (`Line Chart`) contínuo de Janeiro a Dezembro.

# Frontend

## Decisão de performance, uso do Zustand para gerenciar estado

Performance Absurda (Sem Renderizações Desnecessárias): A Context API nativa do React tem um problema sério: sempre que o Token muda, todos os componentes que estão dentro do Contexto sofrem re-render (re-pintura na tela), mesmo aqueles que não usam o token. O Zustand possui um sistema de seletores que avisa o React para atualizar apenas o componente específico que está escutando aquela variável.

## Tailwind CSS como CDN

Liberdade granular para ajustar classe a classe dos componentes, dando mais flexibilidade.

Bootstrap é uma boa opção também, mas para ajustes específicos seria necessário mais setup como classes CSS específicas, tirando um pouco da praticidade e fluxo de visualização dos componentes.

## Recharts como biblioteca para gráficos

Foco: Simplicidade e Integração Nativa.

Por que usar: é construída especificamente para o React baseada em componentes (ex: `<LineChart>`, `<Bar>`). É extremamente fácil de usar, possui animações fluidas e aceita estilização com Tailwind de forma nativa. Perfeita para entregar o dashboard do desafio rapidamente.

# Planejamento frontend

Com base na documentação fornecida para o sistema da SEPLAG, aqui está um planejamento básico da interface do usuário (UI) para o Front-end.

Para a estilização, a sugestão é utilizar Tailwind CSS. Como o sistema lida com dados densos, tabelas complexas e dashboards, o Tailwind facilita o controle refinado de espaçamento, estados de erro customizados e layouts responsivos cruciais para resoluções entre 375px e 1440px.

## Fluxo de Navegação e Rotas

- `/login` (Pública) → Tela de Autenticação.
- `/` (Protegida) → Dashboard Principal (Indicadores gerais).
- `/orcamentos` (Protegida) → Listagem e Filtros de Orçamentos.
- `/orcamentos/:id` (Protegida) → Detalhes do Orçamento + Gestão de Contratos + Revisão.
- `/analise` (Protegida) → Dashboard Analítico (Gráficos).

## Wireframe Conceitual e Componentes da UI

### 1. Tela de Login (`/login`)

Uma interface limpa e centralizada com foco em usabilidade.

- Card central com o logo da SEPLAG.
- Inputs de e-mail e senha com validação visual em tempo real.
- Botão de submit com estado de loading (carregando).
- Alertas visuais claros para credenciais inválidas.

### 2. Layout Global (Sidebar + Header)

Todas as telas protegidas compartilham esta estrutura responsiva (colapsável em tablets/mobile).

- Header: exibe o e-mail do analista (`preferred_username` decodificado do JWT), um indicador de "Última Sincronização" e o botão de Logout.
- Sidebar: links de navegação com ícones para Dashboard, Orçamentos e Gráficos.

### 3. Dashboard Principal (`/`)

Focado nos KPIs macro retornados pelo endpoint `GET /dashboard`.

- Total de Órgãos e Total de Contratos.
- Orçamento Total (Dotação Atualizada).
- Empenhado, Liquidado e Pago.
- Barra de Progresso de Execução destacando o `percentual_execucao` geral.
- Card de Alerta de Consistência para saldos negativos críticos.

### 4. Tela de Orçamentos (`/orcamentos`)

- Filtros: Órgão, Programa, Ação, Ano, Situação e alcance Min/Max do percentual executado.
- Tabela: Órgão, Programa, Dotação Atualizada, Empenhado, Saldo Disponível, % Execução e Ações.
- Saldo negativo em vermelho/alerta e ícone de aviso para inconsistências.
- Badge visual para orçamentos já Revisados.
- Paginação com itens por página, anterior e próximo.

### 5. Detalhamento do Orçamento (`/orcamentos/:id`)

- Bloco 1 — Classificação Orçamentária: Órgão, Unidade Gestora, Programa, Ação, Função/Subfunção, Natureza e Fonte. Campo nulo deve renderizar badge cinza "Informação não disponível".
- Bloco 2 — Régua Financeira: Dotação Inicial + Suplementações - Anulações = Dotação Atualizada; cards de Empenhado, Liquidado e Pago.
- Bloco 3 — Contratos Vinculados: tabela e badges Vigente (Verde), Vencido (Vermelho), Suspenso (Amarelo) e Encerrado (Cinza).
- Bloco 4 — Painel de Revisão: se não revisado, observações e botão "Marcar como Revisado" (PATCH); se revisado, container verde com usuário, data e observação e botão desabilitado.

### 6. Dashboard Analítico / Gráficos (`/analise`)

| Tipo de Gráfico | Dados Exibidos | Objetivo do Analista |
|---|---|---|
| Gráfico de Barras Horizontal | Execução por Órgão | Identificar quais órgãos têm os maiores orçamentos e quem está gastando mais rápido. |
| Gráfico de Linhas / Área | Evolução Mensal da Execução | Enxergar picos de empenho/pagamento ao longo do ano. |
| Gráfico de Barras Agrupadas | Empenhado x Pago | Detectar gargalos onde o serviço foi contratado, mas o dinheiro não está saindo. |
| Gráfico de Rosca / Pizza | Execução por Programa | Entender a distribuição estratégica dos gastos do governo. |
| Lista / Ranking Card | Top 10 Maiores Contratos | Monitorar os contratos de maior impacto financeiro e seus status. |

## Diretrizes de Responsividade (375px a 1440px)

- 1440px: grid multifuncional, detalhes do orçamento na esquerda, contratos e revisão na direita e tabelas expandidas.
- 768px: sidebar recolhida, tabela ocultando colunas secundárias ou com scroll horizontal e cards em grid 2x2.
- 375px: gráficos empilhados verticalmente e tabela de orçamentos transformada em cards empilhados.

## Paleta para seguir o padrão de aplicações governamentais

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        gov: {
          primary: '#0056A4',
          dark: '#0A2540',
          light: '#F4F6F9',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
          muted: '#94A3B8',
        },
      },
    },
  },
}
```
