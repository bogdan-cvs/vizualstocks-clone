import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { StockPrice } from "../../types/financial";

type Range = "3M" | "YTD" | "1Y" | "5Y";

function filterByRange(prices: StockPrice[], range: Range): StockPrice[] {
  const now = new Date();
  let from: Date;
  if (range === "3M") { from = new Date(now); from.setMonth(now.getMonth() - 3); }
  else if (range === "YTD") { from = new Date(now.getFullYear(), 0, 1); }
  else if (range === "1Y") { from = new Date(now); from.setFullYear(now.getFullYear() - 1); }
  else { from = new Date(now); from.setFullYear(now.getFullYear() - 5); }
  return prices.filter((p) => new Date(p.date) >= from);
}

export default function StockPriceChart({ data }: { data: StockPrice[] }) {
  const [range, setRange] = useState<Range>("1Y");
  const filtered = filterByRange(data, range);
  const isDown = filtered.length > 1 && filtered[filtered.length - 1].close < filtered[0].close;
  const color = isDown ? "#ef4444" : "#22c55e";

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-1 mb-2 self-end">
        {(["3M", "YTD", "1Y", "5Y"] as Range[]).map((r) => (
          <button key={r} onClick={() => setRange(r)}
            className={`px-2 py-0.5 text-xs rounded cursor-pointer border-none font-medium transition-colors ${range === r ? "bg-[#3b82f6] text-white" : "bg-[#252830] text-[#9ca3af] hover:text-white"}`}>
            {r}
          </button>
        ))}
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filtered}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3039" />
            <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 10 }}
              tickFormatter={(d) => { const dt = new Date(d); return `${dt.toLocaleString("default", { month: "short" })} '${dt.getFullYear().toString().slice(-2)}`; }}
              interval="preserveStartEnd" />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => `$${v.toFixed(0)}`} domain={["auto", "auto"]} />
            <Tooltip formatter={(v: any) => [`$${Number(v).toFixed(2)}`, "Close"]} contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3039", borderRadius: 8 }} labelStyle={{ color: "#e5e7eb" }} />
            <Area type="monotone" dataKey="close" stroke={color} strokeWidth={2} fill="url(#priceGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
