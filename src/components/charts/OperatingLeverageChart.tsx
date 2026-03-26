import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import type { IncomeStatement, Period } from "../../types/financial";
import { formatDateLabel, formatPercentRaw } from "../../utils/formatters";

interface Props {
  data: IncomeStatement[];
  period: Period;
}

export default function OperatingLeverageChart({ data, period }: Props) {
  const offset = period === "quarter" ? 4 : 1;
  const chartData = data.slice(offset).map((d, i) => {
    const prev = data[i];
    const revGrowth =
      prev.revenue !== 0 ? ((d.revenue - prev.revenue) / Math.abs(prev.revenue)) * 100 : 0;
    const opGrowth =
      prev.operatingIncome !== 0
        ? ((d.operatingIncome - prev.operatingIncome) / Math.abs(prev.operatingIncome)) * 100
        : 0;
    return {
      label: formatDateLabel(d.date, period),
      revenueGrowth: parseFloat(revGrowth.toFixed(1)),
      opIncomeGrowth: parseFloat(opGrowth.toFixed(1)),
    };
  });

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
        <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />
        <Line type="monotone" dataKey="revenueGrowth" name="Revenue Growth" stroke="#3b82f6" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="opIncomeGrowth" name="Op. Income Growth" stroke="#f59e0b" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
