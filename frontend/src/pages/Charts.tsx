import ChartCard from '../components/ChartCard';
import ExecucaoPorOrgao from '../components/charts/ExecucaoPorOrgao';
import EvolucaoMensalChart from '../components/charts/EvolucaoMensalChart';

function Charts() {
    return (
        <div className="space-y-4">
            <ChartCard title="Execução por órgão">
                <ExecucaoPorOrgao />
            </ChartCard>
            <ChartCard title="Evolução mensal">
                <EvolucaoMensalChart />
            </ChartCard>
        </div>
    );
}

export default Charts;
