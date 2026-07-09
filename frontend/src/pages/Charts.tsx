import { useEffect, useMemo, useState } from 'react';
import { type GraficosResponse } from '../services/types';
import ApiService from '../services/api';
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    ReferenceLine,
    Tooltip,
    Legend,
} from 'recharts';

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

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(value);

    return (
        <div>
            <h1>Execução por orgão</h1>
            <BarChart
                responsive
                style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                data={graficos?.execucao_por_orgao}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={'sigla_orgao'} />
                <YAxis yAxisId="valor" tickFormatter={formatCurrency} />
                <YAxis yAxisId="percentual" orientation="right" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="valor" dataKey={'dotacao_atualizada'} name="Dotação atualizada" fill="#1d4ed8" />
                <Bar yAxisId="valor" dataKey={'total_empenhado'} name="Total empenhado" fill="#16a34a" />
                <Bar yAxisId="percentual" dataKey={'percentual_execucao'} name="Execução (%)" fill="#f97316" />
            </BarChart>
        </div>
    );
}

export default Charts;
