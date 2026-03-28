import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { CashFlowStatement, IncomeStatement, Period } from "../../types/financial";
import { formatCurrency, formatPercentRaw, formatDateLabel } from "../../utils/formatters";

export default function SBCChart({ cashFlows, incomeStatements, period }: { cashFlows: CashFlowStatement[]; incomeStatements: IncomeStatement[]; period: Period }) {
  const chartData = cashFlows.map((d, i) => {
    const inc = incomeStatements[i];
    const sbcPct = inc && inc.revenue > 0 ? (d.stockBasedCompensation / inc.revenue) * 100 : 0;
    return {
      label: formatDateLabel(d.date, period),
      sbc: d.stockBasedCompensation,
      sbcPct: parseFloat(sbcPct.toFixed(1)),
    };
  });
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
        <YAxis yAxisId="left" tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={formatCurrency} />
        <YAxis yAxisId="right" orientation="right" tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
        <Tooltip formatter={(v: any, n: any) => [n === "SBC %" ? formatPercentRaw(v) : formatCurrency(v), n]} contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }} labelStyle={{ color: "#e5e7eb" }} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
        <Bar yAxisId="left" dataKey="sbc" name="SBC ($)" fill="#a855f7" radius={[2, 2, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="sbcPct" name="SBC %" stroke="#f59e0b" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
