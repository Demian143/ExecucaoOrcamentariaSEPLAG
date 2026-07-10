import { type EvolucaoMensal } from '../../services/types';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { formatCompactCurrency } from '../../utils/formatters';

type EvolucaoMensalChartProps = {
    data: EvolucaoMensal[];
};

function EvolucaoMensalChart({ data }: EvolucaoMensalChartProps) {
    const formatMonth = (month: number | string) =>
        new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(
            new Date(2026, Number(month) - 1, 1),
        );

    return (
        <AreaChart
            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={data}
            margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
        >
            <defs>
                <linearGradient id="evolucaoMensalEmpenhado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0056A4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0056A4" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="evolucaoMensalPago" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" tickFormatter={formatMonth} />
            <YAxis tickFormatter={formatCompactCurrency} />
            <Tooltip
                formatter={(value, name) => [
                    formatCompactCurrency(value as number | string),
                    name,
                ]}
                labelFormatter={(label) => formatMonth(label as number | string)}
            />
            <Legend />
            <Area
                type="monotone"
                dataKey="total_empenhado"
                name="Empenhado"
                stroke="#0056A4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#evolucaoMensalEmpenhado)"
                isAnimationActive={true}
                animationBegin={200}
                animationDuration={1300}
            />
            <Area
                type="monotone"
                dataKey="total_pago"
                name="Pago"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#evolucaoMensalPago)"
                isAnimationActive={true}
                animationBegin={350}
                animationDuration={1300}
            />
        </AreaChart>
    );
}

export default EvolucaoMensalChart;
