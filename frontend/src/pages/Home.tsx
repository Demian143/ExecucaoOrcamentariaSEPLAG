import { useEffect, useMemo, useState } from 'react';
import ConsistencyAlertCard from '../components/dashboard/ConsistencyAlertCard';
import ExecutionProgressCard from '../components/dashboard/ExecutionProgressCard';
import MetricCard, { type MetricTone } from '../components/dashboard/MetricCard';
import ApiService from '../services/api';
import { type DashboardResponse } from '../services/types';
import { formatCompactCurrency, formatCurrency, formatNumber } from '../utils/formatters';

type FinancialMetric = {
  label: string;
  value: number;
  tone: MetricTone;
};

function DashboardLoading() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gov-dark">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Carregando indicadores gerais.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="h-32 animate-pulse rounded-md border border-slate-200 bg-white shadow-sm"
            key={index}
          />
        ))}
      </div>
    </section>
  );
}

function DashboardError({ message }: { message: string }) {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-gov-dark">Dashboard</h1>
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-status-danger">
        {message}
      </div>
    </section>
  );
}

function getFinancialMetrics(dashboard: DashboardResponse): FinancialMetric[] {
  const metrics: FinancialMetric[] = [
    {
      label: 'Empenhado',
      value: dashboard.empenhado,
      tone: 'primary',
    },
    {
      label: 'Liquidado',
      value: dashboard.liquidado,
      tone: 'warning',
    },
    {
      label: 'Pago',
      value: dashboard.pago,
      tone: 'success',
    },
  ];

  return metrics.sort((a, b) => b.value - a.value);
}

function Home() {
  const api = useMemo(() => new ApiService(), []);
  const [dashboard, setDashboard] = useState<DashboardResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    async function carregarDashboard() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await api.getDashboard();

        if (isCurrentRequest) {
          setDashboard(response);
        }
      } catch {
        if (isCurrentRequest) {
          setErrorMessage('Não foi possível carregar os indicadores do dashboard.');
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    }

    carregarDashboard();

    return () => {
      isCurrentRequest = false;
    };
  }, [api]);

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (errorMessage || !dashboard) {
    return <DashboardError message={errorMessage || 'Indicadores indisponíveis.'} />;
  }

  const financialMetrics = getFinancialMetrics(dashboard);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gov-dark">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Visão macro da execução orçamentária consolidada.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total de órgãos"
          value={formatNumber(dashboard.total_orgaos)}
          helper="Órgãos contemplados na base orçamentária."
          tone="muted"
        />
        <MetricCard
          label="Total de contratos"
          value={formatNumber(dashboard.total_contratos)}
          helper="Contratos vinculados aos orçamentos monitorados."
          tone="muted"
        />
        <MetricCard
          label="Orçamento total"
          value={formatCompactCurrency(dashboard.orcamento_total)}
          helper={formatCurrency(dashboard.orcamento_total)}
          tone="primary"
        />
        <MetricCard
          label="Saldo disponível"
          value={formatCompactCurrency(dashboard.saldo)}
          helper={formatCurrency(dashboard.saldo)}
          tone={dashboard.saldo < 0 ? 'warning' : 'success'}
        />
      </div>

      <ConsistencyAlertCard saldosNegativos={dashboard.saldos_negativos} />

      <div className="grid gap-4 lg:grid-cols-3">
        {financialMetrics.map((metric) => (
          <MetricCard
            helper={formatCurrency(metric.value)}
            key={metric.label}
            label={metric.label}
            tone={metric.tone}
            value={formatCompactCurrency(metric.value)}
          />
        ))}
      </div>

      <ExecutionProgressCard percentualExecucao={dashboard.percentual_execucao} />
    </section>
  );
}

export default Home;
