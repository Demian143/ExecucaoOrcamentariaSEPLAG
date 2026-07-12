# Diário de bordo

## Dia 1 — Domingo

Revisei o enunciado e investiguei o modelo do banco de dados. Também criei os primeiros esboços de como as tabelas estariam conectadas e de como o seeder poderia funcionar com os dados de exemplo disponíveis.

## Dia 2 — Segunda-feira

Decidi seguir com frontend e backend implementados separadamente, utilizando JWT para autenticação em vez da abordagem padrão do Laravel. Essa separação evita que o React fique dependente do Laravel para ser executado e facilita o deploy independente do frontend na Vercel e do backend no Railway ou Render.

O PostgreSQL foi escolhido como banco de dados. Inicialmente, a modelagem previa que as subfunções fossem armazenadas em uma coluna JSON, mas essa decisão foi posteriormente alterada em favor de uma tabela dedicada. A facilidade de implantação do PostgreSQL no Railway e no Render também teve peso nessa escolha.

Criei as primeiras migrations e comecei a esboçar a implementação dos models, avaliando quais dados seriam armazenados de forma persistente no banco e quais seriam calculados em tempo de execução, como saldo, dotação atualizada e percentuais.

Além disso, adicionei a primeira rota da API: a rota de autenticação.

## Dia 3 — Terça-feira

Continuei trabalhando na modelagem, inserindo e removendo colunas conforme avançava na implementação das rotas e dos serviços no Laravel.

Nesse momento, explorei as regras de negócio descritas na documentação: como realizar os cálculos, em quais serviços eles deveriam ficar, qual seria a melhor representação dos payloads de resposta e qual nível de granularidade as respostas deveriam possuir.

Muitas consultas combinavam diferentes relações e regras. Verificar se os resultados correspondiam ao esperado foi uma das partes mais trabalhosas do backend e se estendeu até o quarto dia.

## Dia 4 — Quarta-feira

Concluí a revisão das queries e iniciei o planejamento e a configuração do frontend.

Defini a estrutura das requisições no `ApiService`, conectando-a à store do Zustand para manter o estado do JWT e gerenciar a renovação do token.

Implementei o layout básico, defini a paleta de cores e adotei o React Router para organizar de forma mais clara as rotas de login e as rotas protegidas.

Utilizei Tailwind CSS para manter um controle granular sobre a estilização dos componentes e reduzir a dependência de arquivos CSS externos aos componentes.

## Dia 5 — Quinta-feira

Entre ApexCharts, Recharts e Chart.js, decidi utilizar Recharts porque seu fluxo de implementação se mostrou mais próximo do modelo de componentes do React, tornando mais simples sua integração e posterior modificação no projeto.

Depois de escolher a biblioteca de gráficos, comecei a implementação de cada componente de visualização.

## Dia 6 — Sexta-feira

Finalizei as principais telas e funcionalidades, incluindo dashboard, listagem e detalhamento de orçamentos e o fluxo de revisão.

Por fim, realizei o deploy do frontend e do backend em suas respectivas plataformas.
