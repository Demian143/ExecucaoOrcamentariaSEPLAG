import { type FormEvent } from 'react';
import {
  type OrcamentoFilters,
  situacaoLabels,
  yearOptions,
} from '../../utils/orcamentos';

type OrcamentosFiltersProps = {
  filters: OrcamentoFilters;
  onChange: (field: keyof OrcamentoFilters, value: string) => void;
  onClear: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const fieldClassName = 'mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-gov-dark outline-none focus:border-gov-primary focus:ring-4 focus:ring-blue-100';

function OrcamentosFilters({
  filters,
  onChange,
  onClear,
  onSubmit,
}: OrcamentosFiltersProps) {
  return (
    <form className="rounded-md border border-slate-200 bg-white p-4 shadow-sm" onSubmit={onSubmit}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-medium text-slate-700">
          Ano
          <select className={fieldClassName} value={filters.ano} onChange={(event) => onChange('ano', event.target.value)}>
            <option value="">Todos</option>
            {yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Situação
          <select className={fieldClassName} value={filters.situacao} onChange={(event) => onChange('situacao', event.target.value)}>
            <option value="">Todas</option>
            {Object.entries(situacaoLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          % mínimo executado
          <input className={fieldClassName} min="0" type="number" value={filters.percentual_minimo_executado} onChange={(event) => onChange('percentual_minimo_executado', event.target.value)} />
        </label>

        <label className="text-sm font-medium text-slate-700">
          % máximo executado
          <input className={fieldClassName} min="0" type="number" value={filters.percentual_maximo_executado} onChange={(event) => onChange('percentual_maximo_executado', event.target.value)} />
        </label>

        <div className="flex items-end gap-2">
          <button className="inline-flex h-10 items-center rounded-md bg-gov-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100" type="submit">
            Aplicar filtros
          </button>
          <button className="inline-flex h-10 items-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-gov-dark transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100" type="button" onClick={onClear}>
            Limpar
          </button>
        </div>
      </div>
    </form>
  );
}

export default OrcamentosFilters;
