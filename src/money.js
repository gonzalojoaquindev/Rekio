// Precios de entrada en la moneda del lugar: fee.yen (Japón) o fee.eur (Europa).
export const feeCurrency = (fee) => (fee && fee.eur != null ? 'eur' : 'yen');
export const feeAmount = (fee) => (!fee ? 0 : fee.eur != null ? fee.eur : fee.yen || 0);
export function money(n, currency = 'yen') {
  if (currency === 'eur') {
    const s = Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',');
    return `€${s}`;
  }
  return `¥${n.toLocaleString('es-CL')}`;
}
export const feeText = (fee) => money(feeAmount(fee), feeCurrency(fee));
