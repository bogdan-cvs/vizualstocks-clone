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
import type { KeyMetrics, Period } from "../../types/financial";
import { formatDateLabel, formatPercentRaw } from "../../utils/formatters";

interface Props {
  data: KeyMetrics[];
  period: Period;
}

export default function ROEChart({ data, period }: Props) {
  const chartData = data.map((d) => ({
    label: formatDateLabel(d.date, period),
    roe: parseFloat((d.returnOnEquity * 100).toFixed(1)),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
        <Tooltip
          formatter={(value: any) => [formatPercentRaw(value), "ROE"]}
          contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }}
          labelStyle={{ color: "#e5e7eb" }}
        />
        <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />
        <Line type="monotone" dataKey="roe" stroke="#a855f7" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
