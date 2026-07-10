import {
    Pie,
    PieChart,
    Tooltip,
    type TooltipContentProps,
} from 'recharts';
import { type ExecucaoPorPrograma } from '../../services/types';

type ExecucaoPorProgramaProps = {
    data: ExecucaoPorPrograma[]
}

const sliceColors = [
    '#0056A4',
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#0A2540',
    '#94A3B8',
];

function ProgramaTooltip({ active, payload }: TooltipContentProps) {
    if (!active || !payload?.length) {
        return null;
    }

    const programa = payload[0].payload as ExecucaoPorPrograma;

    return (
        <div className="max-w-xs rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
            <p className="font-semibold text-gov-dark">{programa.nome_programa}</p>
            <div className="mt-2 space-y-1 text-slate-600">
                <p>Dotação atualizada: {programa.dotacao_atualizada}</p>
                <p>Total empenhado: {programa.total_empenhado}</p>
            </div>
        </div>
    );
}

function ExecucaoPorProgramaChart({ data }: ExecucaoPorProgramaProps) {
    const chartData = data.map((programa, index) => ({
        ...programa,
        fill: sliceColors[index % sliceColors.length],
    }));

    return (
        <PieChart
            responsive
            style={{ width: '100%', height: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1 }}
        >
            <Pie
                data={chartData}
                dataKey="percentual_empenhado"
                nameKey="nome_programa"
                cx="50%"
                cy="50%"
                outerRadius="50%"
                isAnimationActive={true}
                label
            />
            <Tooltip content={ProgramaTooltip} />
        </PieChart>
    );
}

export default ExecucaoPorProgramaChart;
