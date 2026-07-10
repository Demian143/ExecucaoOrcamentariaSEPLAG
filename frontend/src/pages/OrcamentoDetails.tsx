import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { OrcamentoClassification } from '../components/orcamentos/OrcamentoClassification';
import { OrcamentoContracts } from '../components/orcamentos/OrcamentoContracts';
import { OrcamentoFinancial } from '../components/orcamentos/OrcamentoFinancial';
import { OrcamentoReviewPanel } from '../components/orcamentos/OrcamentoReviewPanel';
import { StatusBadge } from '../components/orcamentos/OrcamentoBadges';
import ApiService from '../services/api';
import { type Orcamento } from '../services/types';

function OrcamentoDetails() {
  const { id } = useParams();
  const orcamentoId = Number(id);
  const hasValidId = Number.isInteger(orcamentoId) && orcamentoId > 0;
  const api = useMemo(() => new ApiService(), []);
  const [orcamento, setOrcamento] = useState<Orcamento>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;
    if (!hasValidId) {
      return;
    }

    api.getOrcamento(orcamentoId)
      .then((response) => {
        if (isCurrentRequest) setOrcamento(response);
      })
      .catch(() => {
        if (isCurrentRequest) setErrorMessage('Não foi possível carregar o orçamento.');
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [api, hasValidId, orcamentoId]);

  async function reviewOrcamento(observacao: string) {
    if (!orcamento) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const reviewed = await api.revisarOrcamento(orcamento.id, observacao);
      setOrcamento((current) => current ? { ...current, ...reviewed } : reviewed);
    } catch {
      setSubmitError('Não foi possível registrar a revisão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hasValidId) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-status-danger">Orçamento inválido.</div>
        <Link className="text-sm font-semibold text-gov-primary hover:text-blue-700" to="/orcamentos">← Voltar para orçamentos</Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Carregando detalhamento...</div>;
  }

  if (!orcamento || errorMessage) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-status-danger">{errorMessage}</div>
        <Link className="text-sm font-semibold text-gov-primary hover:text-blue-700" to="/orcamentos">← Voltar para orçamentos</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <Link className="text-sm font-semibold text-gov-primary hover:text-blue-700" to="/orcamentos">← Voltar para orçamentos</Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-gov-dark">Orçamento #{orcamento.id}</h1>
            <StatusBadge situacao={orcamento.situacao} />
          </div>
          <p className="mt-1 text-sm text-slate-600">Exercício {orcamento.ano}</p>
        </div>
      </header>

      <OrcamentoClassification orcamento={orcamento} />
      <OrcamentoFinancial orcamento={orcamento} />
      <OrcamentoContracts contratos={orcamento.contratos ?? []} />
      <OrcamentoReviewPanel
        isSubmitting={isSubmitting}
        onSubmit={reviewOrcamento}
        orcamento={orcamento}
        submitError={submitError}
      />
    </div>
  );
}

export default OrcamentoDetails;
