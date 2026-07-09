import { useEffect, useMemo, useState } from 'react';
import { type EvolucaoMensal } from '../../services/types';
import ApiService from '../../services/api';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

function EvolucaoMensalChart() {
    const api = useMemo(() => new ApiService(), []);
    const [graficos, setGraficos] = useState<EvolucaoMensal[]>();

    useEffect(() => {
        const carregarDados = async () => {
            const response = await api.getGraficos();
            setGraficos(response.evolucao_mensal);
        };

        carregarDados();
    }, [api]);

    const formatCurrency = (value: number | string) =>
        new Intl.NumberFormat('pt-BR', {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(Number(value));

    const formatMonth = (month: number | string) =>
        new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(
            new Date(2026, Number(month) - 1, 1),
        );

    return (
        <AreaChart
            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={graficos}
            margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
        >
            <defs>
                <linearGradient id="evolucaoMensalTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0056A4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0056A4" stopOpacity={0.02} />
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" tickFormatter={formatMonth} />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip
                formatter={(value) => [formatCurrency(value as number | string), 'Total no mês']}
                labelFormatter={(label) => formatMonth(label as number | string)}
            />
            <Area
                type="monotone"
                dataKey="total_mes"
                name="Total no mês"
                stroke="#0056A4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#evolucaoMensalTotal)"
                isAnimationActive={true}
                animationBegin={200}
                animationDuration={1300}
            />
        </AreaChart>
    );
}

export default EvolucaoMensalChart;
