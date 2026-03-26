import type { FinancialData, Period } from "../types/financial";
import ChartCard from "./ChartCard";
import RevenueChart from "./charts/RevenueChart";
import RevenueGrowthChart from "./charts/RevenueGrowthChart";
import ProfitabilityChart from "./charts/ProfitabilityChart";
import MarginsChart from "./charts/MarginsChart";
import EPSChart from "./charts/EPSChart";
import NetIncomeChart from "./charts/NetIncomeChart";
import CashChart from "./charts/CashChart";
import FCFChart from "./charts/FCFChart";
import CashFlowBreakdownChart from "./charts/CashFlowBreakdownChart";
import DebtEquityChart from "./charts/DebtEquityChart";
import OperatingLeverageChart from "./charts/OperatingLeverageChart";
import ROEChart from "./charts/ROEChart";
import DebtToEquityRatioChart from "./charts/DebtToEquityRatioChart";

interface Props {
  data: { quarter: FinancialData | null; annual: FinancialData | null };
}

function getData(
  allData: { quarter: FinancialData | null; annual: FinancialData | null },
  period: Period
) {
  return period === "quarter" ? allData.quarter : allData.annual;
}

export default function Dashboard({ data }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Revenue & Profitability */}
      <ChartCard title="Revenue">
        {(period) => {
          const d = getData(data, period);
          return d ? <RevenueChart data={d.incomeStatements} period={period} /> : null;
        }}
      </ChartCard>

      <ChartCard title="Revenue Growth YoY %">
        {(period) => {
          const d = getData(data, period);
          return d ? <RevenueGrowthChart data={d.incomeStatements} period={period} /> : null;
        }}
      </ChartCard>

      <ChartCard title="Gross Profit / Operating Income / Net Income">
        {(period) => {
          const d = getData(data, period);
          return d ? <ProfitabilityChart data={d.incomeStatements} period={period} /> : null;
        }}
      </ChartCard>

      <ChartCard title="Margins (Gross / Operating / Net)">
        {(period) => {
          const d = getData(data, period);
          return d ? <MarginsChart data={d.incomeStatements} period={period} /> : null;
        }}
      </ChartCard>

      {/* Earnings */}
      <ChartCard title="EPS (Diluted)">
        {(period) => {
          const d = getData(data, period);
          return d ? <EPSChart data={d.incomeStatements} period={period} /> : null;
        }}
      </ChartCard>

      <ChartCard title="Net Income">
        {(period) => {
          const d = getData(data, period);
          return d ? <NetIncomeChart data={d.incomeStatements} period={period} /> : null;
        }}
      </ChartCard>

      {/* Cash & Balance Sheet */}
      <ChartCard title="Cash & Cash Equivalents">
        {(period) => {
          const d = getData(data, period);
          return d ? <CashChart data={d.balanceSheets} period={period} /> : null;
        }}
      </ChartCard>

      <ChartCard title="Free Cash Flow">
        {(period) => {
          const d = getData(data, period);
          return d ? <FCFChart data={d.cashFlows} period={period} /> : null;
        }}
      </ChartCard>

      <ChartCard title="Operating Cash Flow vs CapEx">
        {(period) => {
          const d = getData(data, period);
          return d ? <CashFlowBreakdownChart data={d.cashFlows} period={period} /> : null;
        }}
      </ChartCard>

      <ChartCard title="Total Debt vs Stockholders Equity">
        {(period) => {
          const d = getData(data, period);
          return d ? <DebtEquityChart data={d.balanceSheets} period={period} /> : null;
        }}
      </ChartCard>

      {/* Efficiency / Leverage */}
      <ChartCard title="Operating Leverage">
        {(period) => {
          const d = getData(data, period);
          return d ? <OperatingLeverageChart data={d.incomeStatements} period={period} /> : null;
        }}
      </ChartCard>

      <ChartCard title="Return on Equity (ROE %)">
        {(period) => {
          const d = getData(data, period);
          return d ? <ROEChart data={d.keyMetrics} period={period} /> : null;
        }}
      </ChartCard>

      <ChartCard title="Debt-to-Equity Ratio">
        {(period) => {
          const d = getData(data, period);
          return d ? <DebtToEquityRatioChart data={d.keyMetrics} period={period} /> : null;
        }}
      </ChartCard>
    </div>
  );
}
