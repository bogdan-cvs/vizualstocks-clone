import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { IncomeStatement, Period } from "../../types/financial";
import { formatDateLabel, formatPercentRaw } from "../../utils/formatters";

interface Props {
  data: IncomeStatement[];
  period: Period;
}

export default function MarginsChart({ data, period }: Props) {
  const chartData = data.map((d) => ({
    label: formatDateLabel(d.date, period),
    grossMargin: parseFloat((d.grossProfitRatio * 100).toFixed(1)),
    operatingMargin: parseFloat((d.operatingIncomeRatio * 100).toFixed(1)),
    netMargin: parseFloat((d.netIncomeRatio * 100).toFixed(1)),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
        <Tooltip
          formatter={(value: any, name: any) => [formatPercentRaw(value), name]}
          contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }}
          labelStyle={{ color: "#e5e7eb" }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
        <Line type="monotone" dataKey="grossMargin" name="Gross Margin" stroke="#3b82f6" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="operatingMargin" name="Operating Margin" stroke="#22c55e" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="netMargin" name="Net Margin" stroke="#a855f7" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
