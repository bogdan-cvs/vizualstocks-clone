import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { BalanceSheet, Period } from "../../types/financial";
import { formatCurrency, formatDateLabel } from "../../utils/formatters";

export default function CashDebtChart({ data, period }: { data: BalanceSheet[]; period: Period }) {
  const chartData = data.map((d) => ({
    label: formatDateLabel(d.date, period),
    cash: d.cashAndShortTermInvestments,
    shortTermDebt: d.shortTermDebt,
    longTermDebt: d.longTermDebt,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={formatCurrency} />
        <Tooltip formatter={(v: any, n: any) => [formatCurrency(v), n]} contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }} labelStyle={{ color: "#e5e7eb" }} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
        <Bar dataKey="cash" name="Cash & ST Investments" fill="#22c55e" radius={[2, 2, 0, 0]} />
        <Bar dataKey="shortTermDebt" name="Short-Term Debt" fill="#f59e0b" radius={[2, 2, 0, 0]} />
        <Bar dataKey="longTermDebt" name="Long-Term Debt" fill="#ef4444" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
