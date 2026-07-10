import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { type EmpenhadoVsPago } from "../../services/types";

type EmpenhadoVsPagoProps = {
    data: EmpenhadoVsPago
};

function EmpenhadoVsPagoChart({ data }: EmpenhadoVsPagoProps) {
    const formatCurrency = (value: number | string) =>
        new Intl.NumberFormat('pt-BR', {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(Number(value));

    const chartData = [
        { categoria: 'Empenhado', valor: Number(data.total_empenhado ?? 0), fill: '#8884d8' },
        { categoria: 'Liquidado', valor: Number(data.total_liquidado ?? 0), fill: '#82ca9d' },
        { categoria: 'Pago', valor: Number(data.total_pago ?? 0), fill: '#0056A4' },
    ];

    return (
        <BarChart
            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={chartData}
            margin={{
                top: 5,
                right: 24,
                left: 0,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => [formatCurrency(value as number | string), 'Valor']} />
            <Bar
                dataKey="valor"
                name="Valor"
                radius={[10, 10, 0, 0]}
            />
        </BarChart>
    );
}

export default EmpenhadoVsPagoChart;
