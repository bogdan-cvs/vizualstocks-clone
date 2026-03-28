import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { AnalystEstimate, IncomeStatement, Period } from "../../types/financial";
import { formatCurrency, formatDateLabel } from "../../utils/formatters";

export default function AnalystEstimatesChart({
  estimates, actuals, period,
}: {
  estimates: AnalystEstimate[];
  actuals: IncomeStatement[];
  period: Period;
}) {
  if (estimates.length === 0) return <div className="flex items-center justify-center h-full text-[#6b7280] text-sm">No analyst estimate data available</div>;

  const actualMap = new Map(actuals.map((a) => [a.date.slice(0, 7), a.revenue]));
  const chartData = estimates.map((e) => {
    const key = e.date.slice(0, 7);
    const actual = actualMap.get(key);
    return {
      label: formatDateLabel(e.date, period),
      estimate: e.estimatedRevenueAvg,
      actual: actual ?? null,
      range: [e.estimatedRevenueLow, e.estimatedRevenueHigh],
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={formatCurrency} />
        <Tooltip formatter={(v: any, n: any) => [formatCurrency(v), n]} contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }} labelStyle={{ color: "#e5e7eb" }} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
        <Bar dataKey="estimate" name="Est. Revenue" fill="#3b82f6" opacity={0.6} radius={[2, 2, 0, 0]} />
        <Line type="monotone" dataKey="actual" name="Actual Revenue" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
