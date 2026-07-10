import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    type TooltipContentProps,
} from 'recharts';
import { type Contrato } from '../../services/types';

type MaioresContratosProps = {
    data: Contrato[]
}

type ContratoChartData = Contrato & {
    label: string;
    valor_formatado: number;
};

const formatCompactCurrency = (value: number | string) =>
    new Intl.NumberFormat('pt-BR', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(Number(value));

const formatCurrency = (value: number | string) =>
    new Intl.NumberFormat('pt-BR', {
        currency: 'BRL',
        style: 'currency',
    }).format(Number(value));

const truncate = (value: string, maxLength: number) =>
    value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;

function ContratoTooltip({ active, payload }: TooltipContentProps) {
    if (!active || !payload?.length) {
        return null;
    }

    const contrato = payload[0].payload as ContratoChartData;

    return (
        <div className="max-w-sm rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
            <p className="font-semibold text-gov-dark">Contrato {contrato.numero}</p>
            <div className="mt-2 space-y-1 text-slate-600">
                <p>Valor: {formatCurrency(contrato.valor_formatado)}</p>
                {contrato.fornecedor?.nome ? <p>Fornecedor: {contrato.fornecedor.nome}</p> : null}
                <p>Status: {contrato.status}</p>
                <p className="line-clamp-3">Objeto: {contrato.objeto}</p>
            </div>
        </div>
    );
}

function MaioresContratosChart({ data }: MaioresContratosProps) {
    const chartData: ContratoChartData[] = data.map((contrato) => ({
        ...contrato,
        label: truncate(`${contrato.numero} - ${contrato.fornecedor?.nome ?? contrato.objeto}`, 34),
        valor_formatado: Number(contrato.valor),
    }));

    return (
        <BarChart
            layout='vertical'
            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={chartData}
            margin={{
                top: 10,
                right: 24,
                left: 0,
                bottom: 0,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatCompactCurrency} />
            <YAxis
                dataKey="label"
                type="category"
                width={190}
                tick={{ fontSize: 12 }}
            />
            <Tooltip content={ContratoTooltip} />
            <Bar
                dataKey="valor_formatado"
                fill="#0056A4"
                name="Valor"
                radius={[0, 8, 8, 0]}
            />
        </BarChart>
    );
}

export default MaioresContratosChart;
