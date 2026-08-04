/**
 * Shared display formatters for the catalog.
 */

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

/**
 * Derives a human-friendly stock message + tone from the raw count.
 * @returns {{ label: string, tone: 'in' | 'low' | 'out' }}
 */
export function getStockStatus(stock) {
  const count = Number(stock ?? 0);
  if (count <= 0) return { label: 'Out of stock', tone: 'out' };
  if (count < 10) return { label: `Only ${count} left`, tone: 'low' };
  return { label: 'In stock', tone: 'in' };
}