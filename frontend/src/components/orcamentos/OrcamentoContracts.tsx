import { type Contrato } from '../../services/types';
import { formatCurrency } from '../../utils/formatters';

type ContractSituation = 'vigente' | 'vencido' | 'suspenso' | 'encerrado';

const situationStyles: Record<ContractSituation, string> = {
  vigente: 'border-emerald-200 bg-emerald-50 text-status-success',
  vencido: 'border-red-200 bg-red-50 text-status-danger',
  suspenso: 'border-amber-200 bg-amber-50 text-status-warning',
  encerrado: 'border-slate-200 bg-slate-100 text-status-muted',
};

const situationLabels: Record<ContractSituation, string> = {
  vigente: 'Vigente',
  vencido: 'Vencido',
  suspenso: 'Suspenso',
  encerrado: 'Encerrado',
};

function contractSituation(contrato: Contrato): ContractSituation {
  return contrato.vencido ? 'vencido' : contrato.status;
}

function ContractBadge({ contrato }: { contrato: Contrato }) {
  const situation = contractSituation(contrato);

  return (
    <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${situationStyles[situation]}`}>
      {situationLabels[situation]}
    </span>
  );
}

export function OrcamentoContracts({ contratos }: { contratos: Contrato[] }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gov-primary">Vínculos</p>
        <h2 className="mt-1 text-lg font-semibold text-gov-dark">Contratos vinculados</h2>
      </div>

      {contratos.length === 0 ? (
        <p className="border-t border-slate-200 px-5 py-8 text-center text-sm text-slate-500">
          Nenhum contrato vinculado a este orçamento.
        </p>
      ) : (
        <div className="overflow-x-auto border-t border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Número</th>
                <th className="px-4 py-3">Objeto</th>
                <th className="px-4 py-3">Fornecedor</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contratos.map((contrato) => (
                <tr key={contrato.id}>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gov-dark">{contrato.numero}</td>
                  <td className="max-w-md px-4 py-3 text-slate-600">{contrato.objeto}</td>
                  <td className="px-4 py-3 text-slate-600">{contrato.fornecedor?.nome ?? '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-gov-dark">{formatCurrency(contrato.valor)}</td>
                  <td className="px-4 py-3"><ContractBadge contrato={contrato} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
