export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type ApiNumeric = number | string;

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type PaginatedResponse<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type PaginationParams = {
  page?: number;
  per_page?: number;
};

export type OrgaoStatus = "ativo" | "inativo";

export type Orgao = {
  id: number;
  nome: string;
  sigla: string;
  status: OrgaoStatus;
  created_at: string | null;
  updated_at: string | null;
};

export type ListOrgaosParams = PaginationParams & {
  nome?: string;
  sigla?: string;
  status?: OrgaoStatus;
};

export type OrcamentoSituacao =
  | "inconsistente"
  | "saldo_negativo"
  | "sem_execucao"
  | "executado"
  | "em_execucao";

export type Programa = {
  id: number;
  nome: string;
  codigo: string;
  created_at: string | null;
  updated_at: string | null;
};

export type Acao = {
  id: number;
  nome: string;
  codigo: string;
  programa_id: number;
  created_at: string | null;
  updated_at: string | null;
};

export type OrcamentoFiltrosResponse = {
  orgaos: Orgao[];
  programas: Programa[];
  acoes: Acao[];
};

export type Funcao = {
  id: number;
  nome: string;
  codigo: string;
};

export type Subfuncao = {
  id: number;
  nome: string;
  funcao_id: number;
  funcao?: Funcao | null;
};

export type NaturezaDespesa = {
  id: number;
  nome: string;
};

export type FonteRecurso = {
  id: number;
  nome: string;
};

export type UnidadeGestora = {
  id: number;
  nome: string;
  orgao_id: number;
  created_at: string | null;
  updated_at: string | null;
  orgao?: Orgao;
};

export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string | null;
  updated_at: string | null;
};

export type Orcamento = {
  id: number;
  ano: number;
  unidade_gestora_id: number;
  programa_id: number;
  acao_id: number;
  subfuncao_id: number;
  natureza_despesa_id: number;
  fonte_recurso_id: number;
  dotacao_inicial: ApiNumeric | null;
  suplementacoes: ApiNumeric | null;
  anulacoes: ApiNumeric | null;
  valor_empenhado: ApiNumeric | null;
  valor_liquidado: ApiNumeric | null;
  valor_pago: ApiNumeric | null;
  situacao: OrcamentoSituacao;
  revisado_por: number | null;
  revisado_em: string | null;
  observacao: string | null;
  created_at: string | null;
  updated_at: string | null;
  dotacao_atualizada: number;
  saldo: number;
  percentual_execucao: number | null;
  inconsistente: boolean;
  unidade_gestora?: UnidadeGestora | null;
  programa?: Programa | null;
  acao?: Acao | null;
  subfuncao?: Subfuncao | null;
  natureza_despesa?: NaturezaDespesa | null;
  fonte_recurso?: FonteRecurso | null;
  contratos?: Contrato[];
  revisor?: User | null;
};

export type ListOrcamentosParams = PaginationParams & {
  orgao_id?: number;
  programa_id?: number;
  acao_id?: number;
  ano?: number;
  situacao?: OrcamentoSituacao;
  percentual_minimo_executado?: number;
  percentual_maximo_executado?: number;
};


export type DashboardResponse = {
  total_orgaos: number;
  total_contratos: number;
  orcamento_total: number;
  empenhado: number;
  liquidado: number;
  pago: number;
  saldo: number;
  percentual_execucao: number;
  saldos_negativos: number;
};

export type ExecucaoPorOrgao = {
  sigla_orgao: string;
  dotacao_atualizada: ApiNumeric;
  total_empenhado: ApiNumeric;
  percentual_execucao: number;
};

export type ExecucaoPorPrograma = {
  nome_programa: string;
  dotacao_atualizada: ApiNumeric;
  total_empenhado: ApiNumeric;
  percentual_empenhado: number;
};

export type EmpenhadoVsPago = {
  total_empenhado: ApiNumeric | null;
  total_liquidado: ApiNumeric | null;
  total_pago: ApiNumeric | null;
};

export type Fornecedor = {
  id: number;
  nome: string;
  created_at: string | null;
  updated_at: string | null;
};

export type Contrato = {
  id: number;
  numero: string;
  objeto: string;
  valor: ApiNumeric;
  status: "vigente" | "encerrado" | "suspenso";
  vigencia_inicio: string;
  vigencia_fim: string;
  orcamento_id: number;
  fornecedor_id: number;
  created_at: string | null;
  updated_at: string | null;
  vencido: boolean;
  fornecedor?: Fornecedor;
  orcamento?: Orcamento;
};

export type EvolucaoMensal = {
  mes: number;
  total_empenhado: ApiNumeric;
  total_pago: ApiNumeric;
};

export type GraficosResponse = {
  execucao_por_orgao: ExecucaoPorOrgao[];
  execucao_por_programa: ExecucaoPorPrograma[];
  empenhado_vs_pago: EmpenhadoVsPago | null;
  top_10_contratos: Contrato[];
  evolucao_mensal: EvolucaoMensal[];
};
