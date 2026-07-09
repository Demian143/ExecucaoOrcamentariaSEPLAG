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
    
    return (
        <AreaChart
            style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={graficos}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
            <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis width="auto" />
            <Tooltip />
            <Area
                type="monotone"
                dataKey="total_mes"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
                isAnimationActive={true}
                animationBegin={200}
                animationDuration={1300}
            />
        </AreaChart>
    );
}

export default EvolucaoMensalChart;