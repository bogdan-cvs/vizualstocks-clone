import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { BalanceSheet, Period } from "../../types/financial";
import { formatCurrency, formatDateLabel } from "../../utils/formatters";

interface Props {
  data: BalanceSheet[];
  period: Period;
}

export default function CashChart({ data, period }: Props) {
  const chartData = data.map((d) => ({
    label: formatDateLabel(d.date, period),
    cash: d.cashAndCashEquivalents,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={formatCurrency} />
        <Tooltip
          formatter={(value: any) => [formatCurrency(value), "Cash & Equivalents"]}
          contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }}
          labelStyle={{ color: "#e5e7eb" }}
        />
        <Bar dataKey="cash" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
