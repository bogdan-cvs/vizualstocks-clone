import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { IncomeStatement, Period } from "../../types/financial";
import { formatCurrency, formatDateLabel } from "../../utils/formatters";

export default function OperatingExpensesChart({ data, period }: { data: IncomeStatement[]; period: Period }) {
  const chartData = data.map((d) => ({
    label: formatDateLabel(d.date, period),
    sga: d.sellingGeneralAndAdministrativeExpenses,
    rnd: d.researchAndDevelopmentExpenses,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={formatCurrency} />
        <Tooltip formatter={(v: any, n: any) => [formatCurrency(v), n]} contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }} labelStyle={{ color: "#e5e7eb" }} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
        <Bar dataKey="sga" name="SG&A" fill="#3b82f6" radius={[2, 2, 0, 0]} stackId="a" />
        <Bar dataKey="rnd" name="R&D" fill="#22c55e" radius={[2, 2, 0, 0]} stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  );
}
