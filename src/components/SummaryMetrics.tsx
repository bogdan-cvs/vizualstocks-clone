import type { FinancialData } from "../types/financial";
import { formatPercentRaw } from "../utils/formatters";

interface MetricRow {
  label: string;
  value: string;
  direction?: "up" | "down" | "neutral";
}

function calcGrowth(data: number[]): number | null {
  if (data.length < 2) return null;
  const prev = data[data.length - 2];
  const curr = data[data.length - 1];
  if (prev === 0) return null;
  return ((curr - prev) / Math.abs(prev)) * 100;
}

function calcCagr(data: number[], years: number): number | null {
  if (data.length < 2) return null;
  const start = data[Math.max(0, data.length - years - 1)];
  const end = data[data.length - 1];
  if (start <= 0 || end <= 0) return null;
  const n = Math.min(years, data.length - 1);
  return (Math.pow(end / start, 1 / n) - 1) * 100;
}

function dir(v: number | null): "up" | "down" | "neutral" {
  if (v == null) return "neutral";
  return v > 0 ? "up" : v < 0 ? "down" : "neutral";
}

function MetricTable({ title, rows }: { title: string; rows: MetricRow[] }) {
  return (
    <div className="bg-[#1a1d27] border border-[#2d3039] rounded-xl p-4">
      <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">{title}</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[#6b7280] text-xs">
            <th className="text-left pb-1 font-normal">Metric</th>
            <th className="text-right pb-1 font-normal">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-[#2d3039]">
              <td className="py-1.5 text-[#9ca3af]">{row.label}</td>
              <td className={`py-1.5 text-right font-medium ${
                row.direction === "up" ? "text-[#22c55e]" :
                row.direction === "down" ? "text-[#ef4444]" :
                "text-[#e5e7eb]"
              }`}>
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SummaryMetrics({ data }: { data: FinancialData }) {
  const inc = data.incomeStatements;
  const km = data.keyMetrics;
  const bal = data.balanceSheets;

  const revenues = inc.map((d) => d.revenue);
  const profits = inc.map((d) => d.netIncome);

  const revGrowth = calcGrowth(revenues);
  const profGrowth = calcGrowth(profits);
  const rev3yr = calcCagr(revenues, 3);
  const prof3yr = calcCagr(profits, 3);

  const latestKm = km[km.length - 1];
  const latestInc = inc[inc.length - 1];
  const latestBal = bal[bal.length - 1];

  const cashToDebt = latestBal && latestBal.totalDebt > 0
    ? (latestBal.cashAndShortTermInvestments / latestBal.totalDebt).toFixed(2)
    : "N/A";

  const growthRows: MetricRow[] = [
    { label: "Revenue Growth (YoY)", value: revGrowth != null ? `${revGrowth.toFixed(1)}%` : "N/A", direction: dir(revGrowth) },
    { label: "Profits Growth (YoY)", value: profGrowth != null ? `${profGrowth.toFixed(1)}%` : "N/A", direction: dir(profGrowth) },
    { label: "3Y Revenue CAGR", value: rev3yr != null ? `${rev3yr.toFixed(1)}%` : "N/A", direction: dir(rev3yr) },
    { label: "3Y Profits CAGR", value: prof3yr != null ? `${prof3yr.toFixed(1)}%` : "N/A", direction: dir(prof3yr) },
  ];

  const valuationRows: MetricRow[] = [
    { label: "P/E Ratio", value: latestKm?.peRatio ? `${latestKm.peRatio.toFixed(1)}x` : "N/A" },
    { label: "P/S Ratio", value: latestKm?.priceToSales ? `${latestKm.priceToSales.toFixed(2)}x` : "N/A" },
    { label: "P/B Ratio", value: latestKm?.pbRatio ? `${latestKm.pbRatio.toFixed(2)}x` : "N/A" },
    { label: "P/FCF Ratio", value: latestKm?.priceToFreeCashFlow ? `${latestKm.priceToFreeCashFlow.toFixed(1)}x` : "N/A" },
    { label: "EV/EBITDA", value: latestKm?.evToEbitda ? `${latestKm.evToEbitda.toFixed(1)}x` : "N/A" },
    { label: "EV/Sales", value: latestKm?.evToSales ? `${latestKm.evToSales.toFixed(2)}x` : "N/A" },
  ];

  const grossMargin = latestInc?.grossProfitRatio != null ? latestInc.grossProfitRatio * 100 : null;
  const netMargin = latestInc?.netIncomeRatio != null ? latestInc.netIncomeRatio * 100 : null;
  const roe = latestKm?.returnOnEquity != null ? latestKm.returnOnEquity * 100 : null;
  const roa = latestKm?.returnOnAssets != null ? latestKm.returnOnAssets * 100 : null;

  const qualityRows: MetricRow[] = [
    { label: "Gross Margin", value: grossMargin != null ? formatPercentRaw(grossMargin) : "N/A", direction: grossMargin != null ? (grossMargin > 40 ? "up" : grossMargin > 20 ? "neutral" : "down") : "neutral" },
    { label: "Net Margin", value: netMargin != null ? formatPercentRaw(netMargin) : "N/A", direction: dir(netMargin) },
    { label: "ROE", value: roe != null ? formatPercentRaw(roe) : "N/A", direction: dir(roe) },
    { label: "ROA", value: roa != null ? formatPercentRaw(roa) : "N/A", direction: dir(roa) },
    { label: "Cash-to-Debt", value: cashToDebt !== "N/A" ? `${cashToDebt}x` : "N/A" },
    { label: "Current Ratio", value: latestKm?.currentRatio ? `${latestKm.currentRatio.toFixed(2)}x` : "N/A" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <MetricTable title="Growth Metrics" rows={growthRows} />
      <MetricTable title="Valuation Metrics" rows={valuationRows} />
      <MetricTable title="Quality Metrics" rows={qualityRows} />
    </div>
  );
}
