import { 
    Pie, 
    PieChart, 
    Tooltip, 
    TooltipIndex 
} from 'recharts';
import { type ExecucaoPorPrograma } from '../../services/types';

type ExecucaoPorProgramaProps = {
    data: ExecucaoPorPrograma[]
}

function ExecucaoPorProgramaChart({data}: ExecucaoPorProgramaProps) {
    return (
        <PieChart
            responsive
            style={{ 
                width: '100%', 
                height: '100%', 
                maxWidth: '500px', 
                maxHeight: '80vh', 
                aspectRatio: 1 }}>

        </PieChart>
    );
}

export default ExecucaoPorProgramaChart