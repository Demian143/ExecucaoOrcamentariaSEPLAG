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
    return (
        <PieChart
            responsive
            style={{ width: '100%', height: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1 }}
        >
            <Pie
                data={data}
                dataKey="percentual_empenhado"
                nameKey="nome_programa"
                cx="50%"
                cy="50%"
                outerRadius="50%"
                fill="#0056A4"
                isAnimationActive={true}
                label
            />
            <Tooltip content={ProgramaTooltip} />
        </PieChart>
    );
}

export default ExecucaoPorProgramaChart;
