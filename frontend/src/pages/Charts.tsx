import { useEffect, useMemo, useState } from 'react';
import { type GraficosResponse } from '../services/types';
import ChartCard from '../components/charts/ChartCard';
import ExecucaoPorOrgaoChart from '../components/charts/ExecucaoPorOrgaoChart';
import ExecucaoPorProgramaChart from '../components/charts/ExecucaoPorProgramaChart';
import EvolucaoMensalChart from '../components/charts/EvolucaoMensalChart';
import EmpenhadoVsPagoChart from '../components/charts/EmpenhadoVsPagoChart';
import MaioresContratosChart from '../components/charts/MaioresContratosChart';
import ApiService from '../services/api';

const emptyEmpenhadoVsPago = {
    total_empenhado: 0,
    total_liquidado: 0,
    total_pago: 0,
};

function Charts() {
    const api = useMemo(() => new ApiService(), []);
    const [graficos, setGraficos] = useState<GraficosResponse>();

    useEffect(() => {
        const carregarDados = async () => {
            const response = await api.getGraficos();
            setGraficos(response);
        };

        carregarDados();
    }, [api]);

    const charts = [
        {
            title: 'Execução por órgão',
            chart: <ExecucaoPorOrgaoChart data={graficos?.execucao_por_orgao ?? []} />,
        },
        {
            title: 'Execução por Programa',
            chart: <ExecucaoPorProgramaChart data={graficos?.execucao_por_programa ?? []} />,
        },
        {
            title: 'Evolução mensal',
            chart: <EvolucaoMensalChart data={graficos?.evolucao_mensal ?? []} />,
        },
        {
            title: 'Empenhado X Pago',
            chart: <EmpenhadoVsPagoChart data={graficos?.empenhado_vs_pago ?? emptyEmpenhadoVsPago} />,
        },
        {
            title: 'Top 10 Maiores Contratos',
            chart: <MaioresContratosChart data={graficos?.top_10_contratos ?? []} />,
        },
    ];

    return (
        <div className="space-y-4">
            {charts.map(({ title, chart }) => (
                <ChartCard key={title} title={title}>
                    {chart}
                </ChartCard>
            ))}
        </div>
    );
}

export default Charts;
