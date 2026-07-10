import { useEffect, useMemo, useState } from 'react';
import ApiService from '../services/api';
import { type DashboardResponse } from '../services/types';

type MetricCardProps = {
    label: string;
    value: string;
    helper?: string;
    tone?: 'primary' | 'success' | 'warning' | 'muted';
};

const metricToneClasses = {
    primary: 'border-blue-100 bg-blue-50 text-gov-primary',
    success: 'border-emerald-100 bg-emerald-50 text-status-success',
    warning: 'border-amber-100 bg-amber-50 text-status-warning',
    muted: 'border-slate-200 bg-white text-gov-dark',
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
        currency: 'BRL',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(value);

const formatCompactCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
        notation: 'compact',
        maximumFractionDigits: 1,
        style: 'currency',
        currency: 'BRL',
    }).format(value);

const formatNumber = (value: number) =>
    new Intl.NumberFormat('pt-BR').format(value);

const formatPercent = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
    }).format(value);

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

function ConsistencyAlertCard({ saldosNegativos }: { saldosNegativos: number }) {
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

    const percentualExecucao = Math.min(
        Math.max(dashboard?.percentual_execucao ?? 0, 0),
        100,
    );

    const financialMetrics = dashboard
        ? [
            {
                label: 'Empenhado',
                value: dashboard.empenhado,
                tone: 'primary' as const,
            },
            {
                label: 'Liquidado',
                value: dashboard.liquidado,
                tone: 'warning' as const,
            },
            {
                label: 'Pago',
                value: dashboard.pago,
                tone: 'success' as const,
            },
        ].sort((a, b) => b.value - a.value)
        : [];

    if (isLoading) {
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

    if (errorMessage || !dashboard) {
        return (
            <section className="space-y-4">
                <h1 className="text-2xl font-semibold text-gov-dark">Dashboard</h1>
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-status-danger">
                    {errorMessage || 'Indicadores indisponíveis.'}
                </div>
            </section>
        );
    }

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
                        {formatPercent(dashboard.percentual_execucao)}%
                    </p>
                </div>

                <div
                    aria-label={`Execução geral: ${formatPercent(dashboard.percentual_execucao)}%`}
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={percentualExecucao}
                    className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                >
                    <div
                        className="h-full rounded-full bg-gov-primary transition-all"
                        style={{ width: `${percentualExecucao}%` }}
                    />
                </div>
            </article>
        </section>
    );
}

export default Home;
