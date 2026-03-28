import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import type { IncomeStatement, Period } from "../../types/financial";
import { formatCurrency, formatDateLabel } from "../../utils/formatters";

export default function EBITDAChart({ data, period }: { data: IncomeStatement[]; period: Period }) {
  const chartData = data.map((d) => ({
    label: formatDateLabel(d.date, period),
    ebitda: d.ebitda,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={formatCurrency} />
        <Tooltip formatter={(v: any) => [formatCurrency(v), "EBITDA"]} contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }} labelStyle={{ color: "#e5e7eb" }} />
        <Bar dataKey="ebitda" radius={[4, 4, 0, 0]}>
          {chartData.map((e, i) => <Cell key={i} fill={e.ebitda >= 0 ? "#3b82f6" : "#ef4444"} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
