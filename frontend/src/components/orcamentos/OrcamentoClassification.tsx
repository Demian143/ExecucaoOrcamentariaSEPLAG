import { type Orcamento } from '../../services/types';
import { UnavailableValue } from './UnavailableValue';

type ClassificationItemProps = {
  label: string;
  value: string | null | undefined;
};

function ClassificationItem({ label, value }: ClassificationItemProps) {
  return (
    <div className="min-w-0 rounded-md border border-slate-100 bg-slate-50 p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-gov-dark">
        <UnavailableValue>{value}</UnavailableValue>
      </dd>
    </div>
  );
}

export function OrcamentoClassification({ orcamento }: { orcamento: Orcamento }) {
  const orgao = orcamento.unidade_gestora?.orgao;
  const funcao = orcamento.subfuncao?.funcao;

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gov-primary">Quem e para quê</p>
        <h2 className="mt-1 text-lg font-semibold text-gov-dark">Classificação orçamentária</h2>
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <ClassificationItem label="Órgão" value={orgao ? `${orgao.sigla} — ${orgao.nome}` : null} />
        <ClassificationItem label="Unidade gestora" value={orcamento.unidade_gestora?.nome} />
        <ClassificationItem label="Programa" value={orcamento.programa ? `${orcamento.programa.codigo} — ${orcamento.programa.nome}` : null} />
        <ClassificationItem label="Ação" value={orcamento.acao ? `${orcamento.acao.codigo} — ${orcamento.acao.nome}` : null} />
        <ClassificationItem label="Função" value={funcao ? `${funcao.codigo} — ${funcao.nome}` : null} />
        <ClassificationItem label="Subfunção" value={orcamento.subfuncao?.nome} />
        <ClassificationItem label="Natureza da despesa" value={orcamento.natureza_despesa?.nome} />
        <ClassificationItem label="Fonte do recurso" value={orcamento.fonte_recurso?.nome} />
      </dl>
    </section>
  );
}
