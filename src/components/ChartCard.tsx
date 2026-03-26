import { useState, type ReactNode } from "react";
import type { Period } from "../types/financial";

interface ChartCardProps {
  title: string;
  children: (period: Period) => ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  const [period, setPeriod] = useState<Period>("quarter");

  return (
    <div className="bg-[#1a1d27] border border-[#2d3039] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#e5e7eb] m-0">{title}</h3>
        <div className="flex bg-[#252830] rounded-lg p-0.5">
          <button
            onClick={() => setPeriod("quarter")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer border-none ${
              period === "quarter"
                ? "bg-[#3b82f6] text-white"
                : "bg-transparent text-[#9ca3af] hover:text-[#e5e7eb]"
            }`}
          >
            Quarterly
          </button>
          <button
            onClick={() => setPeriod("annual")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer border-none ${
              period === "annual"
                ? "bg-[#3b82f6] text-white"
                : "bg-transparent text-[#9ca3af] hover:text-[#e5e7eb]"
            }`}
          >
            Annual
          </button>
        </div>
      </div>
      <div className="h-64">{children(period)}</div>
    </div>
  );
}
