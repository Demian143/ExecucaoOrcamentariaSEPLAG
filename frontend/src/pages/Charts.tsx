import ChartCard from '../components/ChartCard';
import ExecucaoPorOrgao from '../components/charts/ExecucaoPorOrgao';
import EvolucaoMensalChart from '../components/charts/EvolucaoMensalChart';

function Charts() {
    
    return (
        <div>
            <ChartCard 
                title='Execução por programa'
                children={<ExecucaoPorOrgao/>}
                />
            <ChartCard 
                title='Evolução Mensal'
                children={<EvolucaoMensalChart/>}
                />
        </div>
    );
}

export default Charts;
