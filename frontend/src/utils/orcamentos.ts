import { type ListOrcamentosParams, type OrcamentoSituacao } from '../services/types';

export type OrcamentoFilters = {
  ano: string;
  situacao: string;
  percentual_minimo_executado: string;
  percentual_maximo_executado: string;
};

export const initialOrcamentoFilters: OrcamentoFilters = {
  ano: '',
  situacao: '',
  percentual_minimo_executado: '',
  percentual_maximo_executado: '',
};

export const situacaoLabels: Record<OrcamentoSituacao, string> = {
  inconsistente: 'Inconsistente',
  saldo_negativo: 'Saldo negativo',
  sem_execucao: 'Sem execução',
  executado: 'Executado',
  em_execucao: 'Em execução',
};

export const yearOptions = Array.from(
  { length: 5 },
  (_, index) => new Date().getFullYear() - index,
);

const toOptionalNumber = (value: string) => value === '' ? undefined : Number(value);

export function buildOrcamentoParams(
  filters: OrcamentoFilters,
  page: number,
  perPage: number,
): ListOrcamentosParams {
  return {
    ano: toOptionalNumber(filters.ano),
    situacao: filters.situacao ? filters.situacao as OrcamentoSituacao : undefined,
    percentual_minimo_executado: toOptionalNumber(filters.percentual_minimo_executado),
    percentual_maximo_executado: toOptionalNumber(filters.percentual_maximo_executado),
    page,
    per_page: perPage,
  };
}
