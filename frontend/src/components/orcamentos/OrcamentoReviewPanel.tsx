import { type SubmitEvent, useState } from 'react';
import { type Orcamento } from '../../services/types';
import { UnavailableValue } from './UnavailableValue';

type OrcamentoReviewPanelProps = {
  isSubmitting: boolean;
  onSubmit: (observacao: string) => Promise<void>;
  orcamento: Orcamento;
  submitError: string;
};

function formatReviewDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function OrcamentoReviewPanel({
  isSubmitting,
  onSubmit,
  orcamento,
  submitError,
}: OrcamentoReviewPanelProps) {
  const [observacao, setObservacao] = useState('');

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(observacao.trim());
  }

  const isReviewed = Boolean(orcamento.revisado_em);

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gov-primary">Ação do analista</p>
      <h2 className="mt-1 text-lg font-semibold text-gov-dark">Painel de revisão</h2>

      {isReviewed ? (
        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-slate-700">
          <p>
            <span className="font-semibold text-status-success">Revisado por </span>
            <UnavailableValue>{orcamento.revisor?.name}</UnavailableValue>
            {' em '}
            {orcamento.revisado_em ? formatReviewDate(orcamento.revisado_em) : null}
            {' - Obs: '}
            <UnavailableValue>{orcamento.observacao}</UnavailableValue>
          </p>
          <button className="mt-4 rounded-md bg-slate-300 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed" disabled type="button">
            Orçamento revisado
          </button>
        </div>
      ) : (
        <form className="mt-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Observações
            <textarea
              className="mt-1 block min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-gov-dark outline-none transition placeholder:text-slate-400 focus:border-gov-primary focus:ring-4 focus:ring-blue-100"
              maxLength={255}
              onChange={(event) => setObservacao(event.target.value)}
              placeholder="Registre as observações da análise"
              required
              value={observacao}
            />
          </label>
          <div className="mt-1 text-right text-xs text-slate-500">{observacao.length}/255</div>
          {submitError ? <p className="mt-2 text-sm text-status-danger">{submitError}</p> : null}
          <button
            className="mt-3 inline-flex items-center rounded-md bg-gov-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSubmitting || observacao.trim().length === 0}
            type="submit"
          >
            {isSubmitting ? 'Salvando revisão...' : 'Marcar como revisado'}
          </button>
        </form>
      )}
    </section>
  );
}
