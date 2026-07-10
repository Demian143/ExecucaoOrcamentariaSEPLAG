export type MetricTone = 'primary' | 'success' | 'warning' | 'muted';

type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
  tone?: MetricTone;
};

const metricToneClasses: Record<MetricTone, string> = {
  primary: 'border-blue-100 bg-blue-50 text-gov-primary',
  success: 'border-emerald-100 bg-emerald-50 text-status-success',
  warning: 'border-amber-100 bg-amber-50 text-status-warning',
  muted: 'border-slate-200 bg-white text-gov-dark',
};

function MetricCard({ label, value, helper, tone = 'muted' }: MetricCardProps) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 truncate text-2xl font-semibold text-gov-dark">{value}</p>
        </div>
        <span
          aria-hidden="true"
          className={[
            'mt-1 h-3 w-3 shrink-0 rounded-full border',
            metricToneClasses[tone],
          ].join(' ')}
        />
      </div>
      {helper ? <p className="mt-3 text-xs leading-5 text-slate-500">{helper}</p> : null}
    </article>
  );
}

export default MetricCard;
