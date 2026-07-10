import { Link } from 'react-router-dom';
import { type Orcamento, type PaginatedResponse } from '../../services/types';
import { formatCompactCurrency, formatCurrency, formatPercent } from '../../utils/formatters';
import OrcamentoMobileCard from './OrcamentoMobileCard';
import { InconsistencyMarker, RevisaoBadge, StatusBadge } from './OrcamentoBadges';

type OrcamentosDataViewProps = {
  data?: PaginatedResponse<Orcamento>;
  isLoading: boolean;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
};

function OrcamentosDataView({
  data,
  isLoading,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
}: OrcamentosDataViewProps) {
  const hasPreviousPage = Boolean(data?.prev_page_url);
  const hasNextPage = Boolean(data?.next_page_url);

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          {data ? `${data.total} registros encontrados` : 'Carregando registros'}
        </p>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Itens por página
          <select className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-gov-dark outline-none focus:border-gov-primary focus:ring-4 focus:ring-blue-100" value={perPage} onChange={(event) => onPerPageChange(Number(event.target.value))}>
            {[10, 25, 50, 100].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Órgão</th>
              <th className="px-4 py-3">Programa</th>
              <th className="px-4 py-3 text-right">Dotação atualizada</th>
              <th className="px-4 py-3 text-right">Empenhado</th>
              <th className="px-4 py-3 text-right">Saldo disponível</th>
              <th className="px-4 py-3 text-right">% Execução</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={8}>Carregando orçamentos...</td></tr>
            ) : data?.data.length ? (
              data.data.map((orcamento) => {
                const hasNegativeBalance = orcamento.saldo < 0;

                return (
                  <tr className={hasNegativeBalance ? 'bg-red-50/60' : 'bg-white'} key={orcamento.id}>
                    <td className="px-4 py-3 font-medium text-gov-dark">{orcamento.unidade_gestora?.orgao?.sigla ?? '-'}</td>
                    <td className="max-w-xs px-4 py-3 text-slate-700">
                      <div className="flex items-start gap-2">
                        <InconsistencyMarker orcamento={orcamento} />
                        <span className="line-clamp-2">{orcamento.programa?.nome ?? '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700" title={formatCurrency(orcamento.dotacao_atualizada)}>{formatCompactCurrency(orcamento.dotacao_atualizada)}</td>
                    <td className="px-4 py-3 text-right text-slate-700" title={formatCurrency(orcamento.valor_empenhado ?? 0)}>{formatCompactCurrency(orcamento.valor_empenhado ?? 0)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${hasNegativeBalance ? 'text-status-danger' : 'text-slate-700'}`} title={formatCurrency(orcamento.saldo)}>{formatCompactCurrency(orcamento.saldo)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{formatPercent(orcamento.percentual_execucao ?? 0)}%</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge situacao={orcamento.situacao} />
                        <RevisaoBadge orcamento={orcamento} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link className="font-semibold text-gov-primary hover:text-blue-700" to={`/orcamentos/${orcamento.id}`}>
                        Detalhes
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={8}>Nenhum orçamento encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {isLoading ? (
          <p className="py-4 text-center text-sm text-slate-500">Carregando orçamentos...</p>
        ) : data?.data.length ? (
          data.data.map((orcamento) => <OrcamentoMobileCard key={orcamento.id} orcamento={orcamento} />)
        ) : (
          <p className="py-4 text-center text-sm text-slate-500">Nenhum orçamento encontrado.</p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Página {data?.current_page ?? page} de {data?.last_page ?? 1}
        </p>
        <div className="flex gap-2">
          <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-gov-dark disabled:cursor-not-allowed disabled:opacity-50" disabled={!hasPreviousPage || isLoading} type="button" onClick={() => onPageChange(Math.max(1, page - 1))}>
            Anterior
          </button>
          <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-gov-dark disabled:cursor-not-allowed disabled:opacity-50" disabled={!hasNextPage || isLoading} type="button" onClick={() => onPageChange(page + 1)}>
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrcamentosDataView;
