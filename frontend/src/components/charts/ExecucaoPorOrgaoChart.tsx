import { type ExecucaoPorOrgao } from '../../services/types';
import { formatCompactCurrency, formatPercent } from '../../utils/formatters';
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';

type ExecucaoPorOrgaoChartProps = {
    data: ExecucaoPorOrgao[];
};

function ExecucaoPorOrgaoChart({ data }: ExecucaoPorOrgaoChartProps) {
    return (
        <BarChart
            responsive
            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
            data={data}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={'sigla_orgao'} />
            <YAxis yAxisId="valor" tickFormatter={formatCompactCurrency} />
            <YAxis yAxisId="percentual" orientation="right" domain={[0, 100]} />
            <Tooltip
                formatter={(value, name) => [
                    name === 'Execução (%)'
                        ? `${formatPercent(value as number | string)}%`
                        : formatCompactCurrency(value as number | string),
                    name,
                ]}
            />
            <Legend />
            <Bar yAxisId="valor" dataKey={'dotacao_atualizada'} name="Dotação atualizada" fill="#1d4ed8" />
            <Bar yAxisId="valor" dataKey={'total_empenhado'} name="Total empenhado" fill="#16a34a" />
            <Bar yAxisId="percentual" dataKey={'percentual_execucao'} name="Execução (%)" fill="#f97316" />
        </BarChart>
    );
}

export default ExecucaoPorOrgaoChart;
