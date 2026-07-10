import { useEffect, useMemo, useState } from 'react';
import ChartCard from '../components/ChartCard';
import ExecucaoPorOrgaoChart from '../components/charts/ExecucaoPorOrgaoChart';
import EvolucaoMensalChart from '../components/charts/EvolucaoMensalChart';
import EmpenhadoVsPagoChart from '../components/charts/EmpenhadoVsPagoChart';
import { type GraficosResponse } from '../services/types';
import ApiService from '../services/api';

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

    return (
        <div className="space-y-4">
            <ChartCard title="Execução por órgão">
                <ExecucaoPorOrgaoChart data={graficos?.execucao_por_orgao ?? []} />
            </ChartCard>
            <ChartCard title="Evolução mensal">
                <EvolucaoMensalChart data={graficos?.evolucao_mensal ?? []} />
            </ChartCard>
            <ChartCard title='Empenhado X Pago'>
                <EmpenhadoVsPagoChart 
                    data={
                        graficos?.empenhado_vs_pago ?? 
                        {total_empenhado: 0, total_liquidado: 0, total_pago: 0 }} />
            </ChartCard>
        </div>
    );
}

export default Charts;
