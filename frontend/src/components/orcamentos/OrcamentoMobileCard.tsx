import { Link } from 'react-router-dom';
import { type Orcamento } from '../../services/types';
import { formatCompactCurrency, formatPercent } from '../../utils/formatters';
import { InconsistencyMarker, RevisaoBadge, StatusBadge } from './OrcamentoBadges';

function OrcamentoMobileCard({ orcamento }: { orcamento: Orcamento }) {
  const hasNegativeBalance = orcamento.saldo < 0;

  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gov-dark">
            {orcamento.unidade_gestora?.orgao?.sigla ?? 'Sem órgão'}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
            {orcamento.programa?.nome ?? 'Programa não informado'}
          </p>
        </div>
        <InconsistencyMarker orcamento={orcamento} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-slate-500">Dotação</dt>
          <dd className="font-medium text-gov-dark">{formatCompactCurrency(orcamento.dotacao_atualizada)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Empenhado</dt>
          <dd className="font-medium text-gov-dark">{formatCompactCurrency(orcamento.valor_empenhado ?? 0)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Saldo</dt>
          <dd className={hasNegativeBalance ? 'font-medium text-status-danger' : 'font-medium text-gov-dark'}>
            {formatCompactCurrency(orcamento.saldo)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">% Execução</dt>
          <dd className="font-medium text-gov-dark">{formatPercent(orcamento.percentual_execucao ?? 0)}%</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <StatusBadge situacao={orcamento.situacao} />
          <RevisaoBadge orcamento={orcamento} />
        </div>
        <Link className="text-sm font-semibold text-gov-primary hover:text-blue-700" to={`/orcamentos/${orcamento.id}`}>
          Detalhes
        </Link>
      </div>
    </article>
  );
}

export default OrcamentoMobileCard;
