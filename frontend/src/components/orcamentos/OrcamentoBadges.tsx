import { type Orcamento, type OrcamentoSituacao } from '../../services/types';
import { situacaoLabels } from '../../utils/orcamentos';

export function StatusBadge({ situacao }: { situacao: OrcamentoSituacao }) {
  const classes: Record<OrcamentoSituacao, string> = {
    inconsistente: 'border-red-200 bg-red-50 text-status-danger',
    saldo_negativo: 'border-red-200 bg-red-50 text-status-danger',
    sem_execucao: 'border-slate-200 bg-slate-50 text-slate-600',
    executado: 'border-emerald-200 bg-emerald-50 text-status-success',
    em_execucao: 'border-blue-200 bg-blue-50 text-gov-primary',
  };

  return (
    <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${classes[situacao]}`}>
      {situacaoLabels[situacao]}
    </span>
  );
}

export function RevisaoBadge({ orcamento }: { orcamento: Orcamento }) {
  if (!orcamento.revisado_em) {
    return (
      <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
        Pendente
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-status-success">
      Revisado
    </span>
  );
}

export function InconsistencyMarker({ orcamento }: { orcamento: Orcamento }) {
  if (!orcamento.inconsistente) {
    return null;
  }

  return (
    <span
      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-xs font-bold text-status-warning"
      title="Orçamento com inconsistência"
    >
      !
    </span>
  );
}
