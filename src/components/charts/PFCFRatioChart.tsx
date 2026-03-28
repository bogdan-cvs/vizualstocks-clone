import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { KeyMetrics, Period } from "../../types/financial";
import { formatDateLabel } from "../../utils/formatters";

export default function PFCFRatioChart({ data, period }: { data: KeyMetrics[]; period: Period }) {
  const chartData = data.filter((d) => d.priceToFreeCashFlow != null && d.priceToFreeCashFlow > 0 && d.priceToFreeCashFlow < 1000).map((d) => ({
    label: formatDateLabel(d.date, period),
    pfcf: parseFloat((d.priceToFreeCashFlow ?? 0).toFixed(1)),
  }));
  if (chartData.length === 0) return <div className="flex items-center justify-center h-full text-[#6b7280] text-sm">No P/FCF data available</div>;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => `${v}x`} />
        <Tooltip formatter={(v: any) => [`${v}x`, "P/FCF Ratio"]} contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }} labelStyle={{ color: "#e5e7eb" }} />
        <Line type="monotone" dataKey="pfcf" stroke="#a855f7" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
