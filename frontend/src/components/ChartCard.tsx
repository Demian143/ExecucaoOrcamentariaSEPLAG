import { type ReactNode, useState } from "react";

type ChartCardProps = {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
};

function ChartCard({ title, children, defaultExpanded = true }: ChartCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3">
        <h2 className="min-w-0 truncate text-base font-semibold text-gov-dark">
          {title}
        </h2>

        <button
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Retrair gráfico" : "Expandir gráfico"}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isExpanded ? <path d="m18 15-6-6-6 6" /> : <path d="m6 9 6 6 6-6" />}
          </svg>
        </button>
      </header>

      {isExpanded ? <div className="p-4">{children}</div> : null}
    </section>
  );
}

export default ChartCard;
