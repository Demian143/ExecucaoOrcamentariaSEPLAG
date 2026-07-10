import { type ApiNumeric, type Orcamento } from '../../services/types';
import { formatCurrency } from '../../utils/formatters';
import { UnavailableValue } from './UnavailableValue';

function MoneyValue({ value }: { value: ApiNumeric | null }) {
  return <UnavailableValue>{value === null ? null : formatCurrency(value)}</UnavailableValue>;
}

export function OrcamentoFinancial({ orcamento }: { orcamento: Orcamento }) {
  const comparisons = [
    { label: 'Empenhado', value: orcamento.valor_empenhado, color: 'text-status-info' },
    { label: 'Liquidado', value: orcamento.valor_liquidado, color: 'text-status-warning' },
    { label: 'Pago', value: orcamento.valor_pago, color: 'text-status-success' },
  ];

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gov-primary">Valores</p>
      <h2 className="mt-1 text-lg font-semibold text-gov-dark">Régua financeira</h2>

      <div className="mt-4 grid items-stretch gap-2 rounded-md border border-blue-100 bg-blue-50 p-4 text-center sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-center">
        <div><p className="text-xs text-slate-500">Dotação inicial</p><p className="mt-1 font-semibold text-gov-dark"><MoneyValue value={orcamento.dotacao_inicial} /></p></div>
        <span className="font-semibold text-gov-primary">+</span>
        <div><p className="text-xs text-slate-500">Suplementações</p><p className="mt-1 font-semibold text-gov-dark"><MoneyValue value={orcamento.suplementacoes} /></p></div>
        <span className="font-semibold text-gov-primary">−</span>
        <div><p className="text-xs text-slate-500">Anulações</p><p className="mt-1 font-semibold text-gov-dark"><MoneyValue value={orcamento.anulacoes} /></p></div>
        <span className="font-semibold text-gov-primary">=</span>
        <div><p className="text-xs text-slate-500">Dotação atualizada</p><p className="mt-1 font-semibold text-gov-primary">{formatCurrency(orcamento.dotacao_atualizada)}</p></div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {comparisons.map((item) => (
          <div className="rounded-md border border-slate-200 p-4" key={item.label}>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className={`mt-2 text-xl font-semibold ${item.color}`}><MoneyValue value={item.value} /></p>
          </div>
        ))}
      </div>
    </section>
  );
}
