export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(1)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(0)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatPercentRaw(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatEPS(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function formatDateLabel(date: string, periodType: "quarter" | "annual"): string {
  if (periodType === "annual") {
    return new Date(date).getFullYear().toString();
  }
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const year = d.getFullYear().toString().slice(-2);
  let q: string;
  if (month <= 3) q = "Q1";
  else if (month <= 6) q = "Q2";
  else if (month <= 9) q = "Q3";
  else q = "Q4";
  return `${q}'${year}`;
}

export function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}
