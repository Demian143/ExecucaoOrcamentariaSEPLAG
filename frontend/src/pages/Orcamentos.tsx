import { type FormEvent, useEffect, useMemo, useState } from 'react';
import OrcamentosDataView from '../components/orcamentos/OrcamentosDataView';
import OrcamentosFilters from '../components/orcamentos/OrcamentosFilters';
import ApiService from '../services/api';
import {
  type Orcamento,
  type PaginatedResponse,
} from '../services/types';
import {
  buildOrcamentoParams,
  initialOrcamentoFilters,
  type OrcamentoFilters,
} from '../utils/orcamentos';

function Orcamentos() {
  const api = useMemo(() => new ApiService(), []);
  const [filters, setFilters] = useState<OrcamentoFilters>(initialOrcamentoFilters);
  const [appliedFilters, setAppliedFilters] = useState<OrcamentoFilters>(initialOrcamentoFilters);
  const [orcamentos, setOrcamentos] = useState<PaginatedResponse<Orcamento>>();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadOrcamentos() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await api.getOrcamentos(
          buildOrcamentoParams(appliedFilters, page, perPage),
        );

        if (isCurrentRequest) {
          setOrcamentos(response);
        }
      } catch {
        if (isCurrentRequest) {
          setErrorMessage('Não foi possível carregar os orçamentos.');
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    }

    loadOrcamentos();

    return () => {
      isCurrentRequest = false;
    };
  }, [api, appliedFilters, page, perPage]);

  function updateFilter(field: keyof OrcamentoFilters, value: string) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setAppliedFilters(filters);
  }

  function clearFilters() {
    setFilters(initialOrcamentoFilters);
    setAppliedFilters(initialOrcamentoFilters);
    setPage(1);
  }

  function updatePerPage(nextPerPage: number) {
    setPerPage(nextPerPage);
    setPage(1);
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-gov-dark">Orçamentos</h1>
        <p className="mt-2 text-sm text-slate-600">
          Consulte a execução orçamentária por órgão, programa, ação e situação.
        </p>
      </div>

      <OrcamentosFilters
        filters={filters}
        onChange={updateFilter}
        onClear={clearFilters}
        onSubmit={applyFilters}
      />

      {errorMessage ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-status-danger">
          {errorMessage}
        </div>
      ) : null}

      <OrcamentosDataView
        data={orcamentos}
        isLoading={isLoading}
        onPageChange={setPage}
        onPerPageChange={updatePerPage}
        page={page}
        perPage={perPage}
      />
    </section>
  );
}

export default Orcamentos;
