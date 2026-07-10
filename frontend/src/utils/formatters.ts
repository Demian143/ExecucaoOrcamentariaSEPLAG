export const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(Number(value));

export const formatCompactCurrency = (value: number | string) =>
  new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    maximumFractionDigits: 1,
    notation: 'compact',
    style: 'currency',
  }).format(Number(value));

export const formatNumber = (value: number | string) =>
  new Intl.NumberFormat('pt-BR').format(Number(value));

export const formatPercent = (value: number | string) =>
  new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(Number(value));
