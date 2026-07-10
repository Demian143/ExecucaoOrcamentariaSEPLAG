import { type ReactNode } from 'react';

export function UnavailableValue({ children }: { children: ReactNode }) {
  if (children === null || children === undefined || children === '') {
    return (
      <span className="inline-flex rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-status-muted">
        Informação não disponível
      </span>
    );
  }

  return <>{children}</>;
}
