import { formatNumber } from '../../utils/formatters';

type ConsistencyAlertCardProps = {
  saldosNegativos: number;
};

function ConsistencyAlertCard({ saldosNegativos }: ConsistencyAlertCardProps) {
  const hasCriticalBalance = saldosNegativos > 0;

  return (
    <article
      className={[
        'rounded-md border p-5 shadow-sm',
        hasCriticalBalance
          ? 'border-red-200 bg-red-50'
          : 'border-emerald-200 bg-emerald-50',
      ].join(' ')}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p
            className={[
              'text-sm font-semibold uppercase tracking-wide',
              hasCriticalBalance ? 'text-status-danger' : 'text-status-success',
            ].join(' ')}
          >
            Consistência orçamentária
          </p>
          <h2 className="mt-2 text-lg font-semibold text-gov-dark">
            {hasCriticalBalance
              ? 'Existem saldos negativos críticos'
              : 'Nenhum saldo negativo crítico identificado'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {hasCriticalBalance
              ? 'Revise os orçamentos em que o valor empenhado ultrapassa a dotação atualizada.'
              : 'Os saldos consolidados não indicam empenho acima da dotação atualizada.'}
          </p>
        </div>

        <div
          className={[
            'flex min-h-24 min-w-32 shrink-0 flex-col items-center justify-center rounded-md border bg-white px-5',
            hasCriticalBalance ? 'border-red-200' : 'border-emerald-200',
          ].join(' ')}
        >
          <span
            className={[
              'text-3xl font-semibold',
              hasCriticalBalance ? 'text-status-danger' : 'text-status-success',
            ].join(' ')}
          >
            {formatNumber(saldosNegativos)}
          </span>
          <span className="mt-1 text-center text-xs font-medium text-slate-500">
            saldos negativos
          </span>
        </div>
      </div>
    </article>
  );
}

export default ConsistencyAlertCard;
