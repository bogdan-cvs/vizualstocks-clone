import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { KeyMetrics, Period } from "../../types/financial";
import { formatDateLabel } from "../../utils/formatters";

function fmt(v: number) {
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v}`;
}

export default function RevenuePerEmployeeChart({ data, period }: { data: KeyMetrics[]; period: Period }) {
  const chartData = data.filter((d) => d.revenuePerEmployee != null && d.revenuePerEmployee > 0).map((d) => ({
    label: formatDateLabel(d.date, period),
    rpe: d.revenuePerEmployee ?? 0,
  }));
  if (chartData.length === 0) return <div className="flex items-center justify-center h-full text-[#6b7280] text-sm">No data available</div>;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={fmt} />
        <Tooltip formatter={(v: any) => [fmt(v), "Revenue / Employee"]} contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }} labelStyle={{ color: "#e5e7eb" }} />
        <Bar dataKey="rpe" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
