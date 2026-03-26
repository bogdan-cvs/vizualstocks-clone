import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { IncomeStatement, Period } from "../../types/financial";
import { formatDateLabel, formatPercentRaw } from "../../utils/formatters";

interface Props {
  data: IncomeStatement[];
  period: Period;
}

export default function RevenueGrowthChart({ data, period }: Props) {
  const offset = period === "quarter" ? 4 : 1;
  const chartData = data.slice(offset).map((d, i) => {
    const prev = data[i];
    const growth = prev.revenue !== 0 ? ((d.revenue - prev.revenue) / Math.abs(prev.revenue)) * 100 : 0;
    return {
      label: formatDateLabel(d.date, period),
      growth: parseFloat(growth.toFixed(1)),
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
        <Tooltip
          formatter={(value: any) => [formatPercentRaw(value), "YoY Growth"]}
          contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }}
          labelStyle={{ color: "#e5e7eb" }}
        />
        <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />
        <Line type="monotone" dataKey="growth" stroke="#22c55e" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
