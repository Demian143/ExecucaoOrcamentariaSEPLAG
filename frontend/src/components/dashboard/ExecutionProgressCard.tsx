import { formatPercent } from '../../utils/formatters';

type ExecutionProgressCardProps = {
  percentualExecucao: number;
};

function ExecutionProgressCard({ percentualExecucao }: ExecutionProgressCardProps) {
  const clampedPercentual = Math.min(Math.max(percentualExecucao, 0), 100);

  return (
    <article className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gov-dark">
            Percentual de execução geral
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Relação entre o valor empenhado e a dotação atualizada.
          </p>
        </div>
        <p className="text-2xl font-semibold text-gov-primary">
          {formatPercent(percentualExecucao)}%
        </p>
      </div>

      <div
        aria-label={`Execução geral: ${formatPercent(percentualExecucao)}%`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={clampedPercentual}
        className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-gov-primary transition-all"
          style={{ width: `${clampedPercentual}%` }}
        />
      </div>
    </article>
  );
}

export default ExecutionProgressCard;
