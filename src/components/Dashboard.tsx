import { useState } from "react";
import type { FinancialData, Period } from "../types/financial";
import ChartCard from "./ChartCard";
import SummaryMetrics from "./SummaryMetrics";
import StockPriceChart from "./charts/StockPriceChart";

// Key Charts
import RevenueChart from "./charts/RevenueChart";
import RevenueGrowthChart from "./charts/RevenueGrowthChart";
import ProfitabilityChart from "./charts/ProfitabilityChart";
import MarginsChart from "./charts/MarginsChart";
import EPSChart from "./charts/EPSChart";
import NetIncomeChart from "./charts/NetIncomeChart";
import EBITDAChart from "./charts/EBITDAChart";
import SharesOutstandingChart from "./charts/SharesOutstandingChart";
import OperatingExpensesChart from "./charts/OperatingExpensesChart";
import SBCChart from "./charts/SBCChart";
import CashChart from "./charts/CashChart";
import CashDebtChart from "./charts/CashDebtChart";
import FCFChart from "./charts/FCFChart";
import CashFlowBreakdownChart from "./charts/CashFlowBreakdownChart";
import DebtEquityChart from "./charts/DebtEquityChart";
import DividendBuybackChart from "./charts/DividendBuybackChart";
import OperatingLeverageChart from "./charts/OperatingLeverageChart";
import ROEChart from "./charts/ROEChart";
import ROAChart from "./charts/ROAChart";
import DebtToEquityRatioChart from "./charts/DebtToEquityRatioChart";

// Ratios
import PERatioChart from "./charts/PERatioChart";
import PSRatioChart from "./charts/PSRatioChart";
import PFCFRatioChart from "./charts/PFCFRatioChart";
import EVEBITDAChart from "./charts/EVEBITDAChart";
import RevenuePerEmployeeChart from "./charts/RevenuePerEmployeeChart";

// Estimates
import AnalystEstimatesChart from "./charts/AnalystEstimatesChart";
import EPSEstimatesChart from "./charts/EPSEstimatesChart";

type Tab = "summary" | "charts" | "ratios" | "estimates";

interface Props {
  data: { quarter: FinancialData | null; annual: FinancialData | null };
}

function get(allData: Props["data"], period: Period): FinancialData | null {
  return period === "quarter" ? (allData.quarter ?? allData.annual) : allData.annual;
}

const TAB_LABELS: { id: Tab; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "charts", label: "Key Charts" },
  { id: "ratios", label: "Ratios" },
  { id: "estimates", label: "Estimates" },
];

export default function Dashboard({ data }: Props) {
  const [tab, setTab] = useState<Tab>("summary");
  const displayData = data.annual ?? data.quarter;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#2d3039]">
        {TAB_LABELS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer border-none border-b-2 -mb-px ${
              tab === id
                ? "text-[#3b82f6] border-b-2 border-[#3b82f6] bg-transparent"
                : "text-[#9ca3af] border-transparent bg-transparent hover:text-[#e5e7eb]"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Summary Tab */}
      {tab === "summary" && displayData && (
        <div>
          <SummaryMetrics data={displayData} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Stock Price — full width */}
            {displayData.stockPrices.length > 0 && (
              <div className="lg:col-span-2 bg-[#1a1d27] border border-[#2d3039] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[#e5e7eb] mb-4">Stock Price</h3>
                <div className="h-64">
                  <StockPriceChart data={displayData.stockPrices} />
                </div>
              </div>
            )}
            <ChartCard title="Revenue">
              {(p) => { const d = get(data, p); return d ? <RevenueChart data={d.incomeStatements} period={p} /> : null; }}
            </ChartCard>
            <ChartCard title="Net Income">
              {(p) => { const d = get(data, p); return d ? <NetIncomeChart data={d.incomeStatements} period={p} /> : null; }}
            </ChartCard>
            <ChartCard title="Free Cash Flow">
              {(p) => { const d = get(data, p); return d ? <FCFChart data={d.cashFlows} period={p} /> : null; }}
            </ChartCard>
            <ChartCard title="EPS (Diluted)">
              {(p) => { const d = get(data, p); return d ? <EPSChart data={d.incomeStatements} period={p} /> : null; }}
            </ChartCard>
          </div>
        </div>
      )}

      {/* Key Charts Tab */}
      {tab === "charts" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="Revenue">
            {(p) => { const d = get(data, p); return d ? <RevenueChart data={d.incomeStatements} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Revenue Growth YoY %">
            {(p) => { const d = get(data, p); return d ? <RevenueGrowthChart data={d.incomeStatements} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Gross Profit / Operating Income / Net Income">
            {(p) => { const d = get(data, p); return d ? <ProfitabilityChart data={d.incomeStatements} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Margins (Gross / Operating / Net)">
            {(p) => { const d = get(data, p); return d ? <MarginsChart data={d.incomeStatements} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="EBITDA">
            {(p) => { const d = get(data, p); return d ? <EBITDAChart data={d.incomeStatements} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="EPS (Diluted)">
            {(p) => { const d = get(data, p); return d ? <EPSChart data={d.incomeStatements} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Net Income">
            {(p) => { const d = get(data, p); return d ? <NetIncomeChart data={d.incomeStatements} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Operating Expenses (SG&A + R&D)">
            {(p) => { const d = get(data, p); return d ? <OperatingExpensesChart data={d.incomeStatements} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="SBC as % of Revenue">
            {(p) => { const d = get(data, p); return d ? <SBCChart cashFlows={d.cashFlows} incomeStatements={d.incomeStatements} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Shares Outstanding">
            {(p) => { const d = get(data, p); return d ? <SharesOutstandingChart data={d.incomeStatements} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Cash & Cash Equivalents">
            {(p) => { const d = get(data, p); return d ? <CashChart data={d.balanceSheets} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Cash & Debt Breakdown">
            {(p) => { const d = get(data, p); return d ? <CashDebtChart data={d.balanceSheets} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Free Cash Flow">
            {(p) => { const d = get(data, p); return d ? <FCFChart data={d.cashFlows} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Operating Cash Flow vs CapEx">
            {(p) => { const d = get(data, p); return d ? <CashFlowBreakdownChart data={d.cashFlows} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Dividends & Buybacks">
            {(p) => { const d = get(data, p); return d ? <DividendBuybackChart data={d.cashFlows} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Total Debt vs Stockholders Equity">
            {(p) => { const d = get(data, p); return d ? <DebtEquityChart data={d.balanceSheets} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Operating Leverage">
            {(p) => { const d = get(data, p); return d ? <OperatingLeverageChart data={d.incomeStatements} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Return on Equity (ROE %)">
            {(p) => { const d = get(data, p); return d ? <ROEChart data={d.keyMetrics} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Return on Assets (ROA %)">
            {(p) => { const d = get(data, p); return d ? <ROAChart data={d.keyMetrics} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Debt-to-Equity Ratio">
            {(p) => { const d = get(data, p); return d ? <DebtToEquityRatioChart data={d.keyMetrics} period={p} /> : null; }}
          </ChartCard>
        </div>
      )}

      {/* Ratios Tab */}
      {tab === "ratios" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="P/E Ratio (LTM)">
            {(p) => { const d = get(data, p); return d ? <PERatioChart data={d.keyMetrics} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="P/S Ratio (LTM)">
            {(p) => { const d = get(data, p); return d ? <PSRatioChart data={d.keyMetrics} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="P/FCF Ratio (LTM)">
            {(p) => { const d = get(data, p); return d ? <PFCFRatioChart data={d.keyMetrics} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="EV/EBITDA (LTM)">
            {(p) => { const d = get(data, p); return d ? <EVEBITDAChart data={d.keyMetrics} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Return on Equity (ROE %)">
            {(p) => { const d = get(data, p); return d ? <ROEChart data={d.keyMetrics} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Return on Assets (ROA %)">
            {(p) => { const d = get(data, p); return d ? <ROAChart data={d.keyMetrics} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Debt-to-Equity Ratio">
            {(p) => { const d = get(data, p); return d ? <DebtToEquityRatioChart data={d.keyMetrics} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="Revenue per Employee (LTM)">
            {(p) => { const d = get(data, p); return d ? <RevenuePerEmployeeChart data={d.keyMetrics} period={p} /> : null; }}
          </ChartCard>
        </div>
      )}

      {/* Estimates Tab */}
      {tab === "estimates" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="Revenue Estimate vs Actual">
            {(p) => { const d = get(data, p); return d ? <AnalystEstimatesChart estimates={d.analystEstimates} actuals={d.incomeStatements} period={p} /> : null; }}
          </ChartCard>
          <ChartCard title="EPS Estimate vs Actual">
            {(p) => { const d = get(data, p); return d ? <EPSEstimatesChart estimates={d.analystEstimates} actuals={d.incomeStatements} period={p} /> : null; }}
          </ChartCard>
        </div>
      )}
    </div>
  );
}
