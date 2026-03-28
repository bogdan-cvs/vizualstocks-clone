import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { IncomeStatement, Period } from "../../types/financial";
import { formatDateLabel } from "../../utils/formatters";

function formatShares(v: number) {
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
  return `${v}`;
}

export default function SharesOutstandingChart({ data, period }: { data: IncomeStatement[]; period: Period }) {
  const chartData = data.map((d) => ({
    label: formatDateLabel(d.date, period),
    shares: d.weightedAverageShsOutDil,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="sharesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
        <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={formatShares} />
        <Tooltip formatter={(v: any) => [formatShares(v), "Shares Outstanding"]} contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }} labelStyle={{ color: "#e5e7eb" }} />
        <Area type="monotone" dataKey="shares" stroke="#ef4444" strokeWidth={2} fill="url(#sharesGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
