const EUR = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export function formatPriceEUR(n: number): string {
  return EUR.format(n);
}
