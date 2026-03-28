import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { AnalystEstimate, IncomeStatement, Period } from "../../types/financial";
import { formatEPS, formatDateLabel } from "../../utils/formatters";

export default function EPSEstimatesChart({
  estimates, actuals, period,
}: {
  estimates: AnalystEstimate[];
  actuals: IncomeStatement[];
  period: Period;
}) {
  if (estimates.length === 0) return <div className="flex items-center justify-center h-full text-[#6b7280] text-sm">No analyst estimate data available</div>;

  const actualMap = new Map(actuals.map((a) => [a.date.slice(0, 7), a.epsdiluted]));
  const chartData = estimates.map((e) => {
    const actual = actualMap.get(e.date.slice(0, 7));
    return {
      label: formatDateLabel(e.date, period),
      estimate: e.estimatedEpsAvg,
      actual: actual ?? null,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={formatEPS} />
        <Tooltip formatter={(v: any, n: any) => [formatEPS(v), n]} contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }} labelStyle={{ color: "#e5e7eb" }} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
        <Bar dataKey="estimate" name="Est. EPS" fill="#a855f7" opacity={0.6} radius={[2, 2, 0, 0]} />
        <Line type="monotone" dataKey="actual" name="Actual EPS" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
