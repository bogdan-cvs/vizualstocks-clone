import type {
  CompanyProfile,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  KeyMetrics,
  StockPrice,
  AnalystEstimate,
  FinancialData,
} from "../types/financial";

const BASE_URL = "/fmp/stable";
const API_KEY = import.meta.env.VITE_FMP_API_KEY || "";

async function fetchFMP<T>(endpoint: string): Promise<T> {
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}apikey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `FMP API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (typeof data === "string" || data?.["Error Message"] || data?.["Information"]) {
    throw new Error(data?.["Error Message"] || data?.["Information"] || String(data));
  }
  return data;
}

// ─── Raw API shapes ───────────────────────────────────────────────────────────

interface RawProfile {
  symbol: string; companyName: string; price: number; marketCap: number;
  sector: string; industry: string; image: string; currency: string;
  exchange: string; exchangeShortName?: string; enterpriseValue?: number;
  lastDividend?: number; volume?: number; averageVolume?: number;
  beta?: number;
}

interface RawIncomeStatement {
  date: string; period: string; revenue: number; costOfRevenue: number;
  grossProfit: number; grossProfitRatio: number;
  researchAndDevelopmentExpenses: number;
  sellingGeneralAndAdministrativeExpenses: number;
  operatingExpenses: number; operatingIncome: number;
  operatingIncomeRatio: number; ebitda: number; ebitdaRatio?: number;
  netIncome: number; netIncomeRatio: number; eps: number; epsDiluted: number;
  weightedAverageShsOutDil: number;
}

interface RawBalanceSheet {
  date: string; period: string; cashAndCashEquivalents: number;
  shortTermInvestments: number; cashAndShortTermInvestments: number;
  totalDebt: number; shortTermDebt: number; longTermDebt: number;
  totalAssets: number; totalStockholdersEquity: number;
  totalLiabilities: number; retainedEarnings: number;
}

interface RawCashFlow {
  date: string; period: string;
  netCashProvidedByOperatingActivities: number;
  investmentsInPropertyPlantAndEquipment: number;
  freeCashFlow: number; stockBasedCompensation: number;
  dividendPayout: number; commonStockRepurchased: number;
}

interface RawKeyMetrics {
  date: string; period: string; debtToEquity: number; returnOnEquity: number;
  returnOnAssets?: number; returnOnCapitalEmployed?: number;
  peRatio?: number; pbRatio?: number; pegRatio?: number;
  priceToSalesRatio?: number; priceToFreeCashFlowsRatio?: number;
  evToSales?: number; evToEbitda?: number; currentRatio?: number;
  revenuePerEmployee?: number;
}

interface RawStockPrice {
  date: string; open: number; high: number; low: number;
  close: number; volume: number;
}

interface RawAnalystEstimate {
  date: string;
  estimatedRevenueLow: number; estimatedRevenueHigh: number; estimatedRevenueAvg: number;
  estimatedEpsLow: number; estimatedEpsHigh: number; estimatedEpsAvg: number;
  estimatedEbitLow: number; estimatedEbitHigh: number; estimatedEbitAvg: number;
  numberAnalystEstimatedRevenue: number; numberAnalystsEstimatedEps: number;
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

async function safeFetch<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    return await fetchFMP<T>(endpoint);
  } catch {
    return fallback;
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function fetchAllFinancialData(
  ticker: string,
  period: "quarter" | "annual" = "annual"
): Promise<FinancialData> {
  const fmpPeriod = period === "quarter" ? "quarter" : "annual";
  const limit = period === "quarter" ? 20 : 10;

  const [
    rawProfiles, rawIncome, rawBalance, rawCashFlow,
    rawKeyMetrics, rawPrices, rawEstimates,
  ] = await Promise.all([
    fetchFMP<RawProfile[]>(`/profile?symbol=${ticker}`),
    fetchFMP<RawIncomeStatement[]>(
      `/income-statement?symbol=${ticker}&period=${fmpPeriod}&limit=${limit}`
    ),
    fetchFMP<RawBalanceSheet[]>(
      `/balance-sheet-statement?symbol=${ticker}&period=${fmpPeriod}&limit=${limit}`
    ),
    fetchFMP<RawCashFlow[]>(
      `/cash-flow-statement?symbol=${ticker}&period=${fmpPeriod}&limit=${limit}`
    ),
    safeFetch<RawKeyMetrics[]>(
      `/key-metrics?symbol=${ticker}&period=${fmpPeriod}&limit=${limit}`, []
    ),
    safeFetch<RawStockPrice[]>(
      `/historical-price-eod/light?symbol=${ticker}&limit=365`, []
    ),
    safeFetch<RawAnalystEstimate[]>(
      `/analyst-estimates?symbol=${ticker}&period=${fmpPeriod}&limit=${limit}`, []
    ),
  ]);

  const rawProfile = rawProfiles?.[0] ?? null;

  const profile: CompanyProfile | null = rawProfile ? {
    symbol: rawProfile.symbol,
    companyName: rawProfile.companyName,
    price: rawProfile.price,
    mktCap: rawProfile.marketCap,
    sector: rawProfile.sector,
    industry: rawProfile.industry,
    image: rawProfile.image,
    currency: rawProfile.currency,
    exchange: rawProfile.exchange,
    exchangeShortName: rawProfile.exchangeShortName ?? rawProfile.exchange,
    enterpriseValue: rawProfile.enterpriseValue,
    volume: rawProfile.volume,
    avgVolume: rawProfile.averageVolume,
  } : null;

  const incomeStatements: IncomeStatement[] = rawIncome.slice(0, limit).reverse().map((d) => ({
    date: d.date, period: d.period,
    revenue: d.revenue, costOfRevenue: d.costOfRevenue,
    grossProfit: d.grossProfit, grossProfitRatio: d.grossProfitRatio,
    researchAndDevelopmentExpenses: d.researchAndDevelopmentExpenses,
    sellingGeneralAndAdministrativeExpenses: d.sellingGeneralAndAdministrativeExpenses,
    operatingExpenses: d.operatingExpenses,
    operatingIncome: d.operatingIncome, operatingIncomeRatio: d.operatingIncomeRatio,
    ebitda: d.ebitda, ebitdaRatio: d.ebitdaRatio ?? 0,
    netIncome: d.netIncome, netIncomeRatio: d.netIncomeRatio,
    eps: d.eps, epsdiluted: d.epsDiluted,
    weightedAverageShsOutDil: d.weightedAverageShsOutDil,
  }));

  const balanceSheets: BalanceSheet[] = rawBalance.slice(0, limit).reverse().map((d) => ({
    date: d.date, period: d.period,
    cashAndCashEquivalents: d.cashAndCashEquivalents,
    shortTermInvestments: d.shortTermInvestments,
    cashAndShortTermInvestments: d.cashAndShortTermInvestments,
    totalDebt: d.totalDebt ?? (d.shortTermDebt + d.longTermDebt),
    shortTermDebt: d.shortTermDebt, longTermDebt: d.longTermDebt,
    totalAssets: d.totalAssets,
    totalStockholdersEquity: d.totalStockholdersEquity,
    totalLiabilities: d.totalLiabilities,
    retainedEarnings: d.retainedEarnings,
  }));

  const cashFlows: CashFlowStatement[] = rawCashFlow.slice(0, limit).reverse().map((d) => ({
    date: d.date, period: d.period,
    operatingCashFlow: d.netCashProvidedByOperatingActivities,
    capitalExpenditure: d.investmentsInPropertyPlantAndEquipment,
    freeCashFlow: d.freeCashFlow,
    stockBasedCompensation: d.stockBasedCompensation,
    dividendPayout: d.dividendPayout,
    commonStockRepurchased: d.commonStockRepurchased,
  }));

  // Key metrics: use API data if available, else derive from income+balance
  const keyMetrics: KeyMetrics[] = incomeStatements.map((inc, i) => {
    const bal = balanceSheets[i];
    const api = rawKeyMetrics[rawKeyMetrics.length - 1 - (incomeStatements.length - 1 - i)];
    const equity = bal?.totalStockholdersEquity ?? 0;
    const roe = equity !== 0 ? inc.netIncome / Math.abs(equity) : 0;
    const dte = equity !== 0 ? (bal?.totalDebt ?? 0) / Math.abs(equity) : 0;
    return {
      date: inc.date, period: inc.period,
      debtToEquity: api?.debtToEquity ?? parseFloat(dte.toFixed(2)),
      returnOnEquity: api?.returnOnEquity ?? parseFloat(roe.toFixed(4)),
      returnOnAssets: api?.returnOnAssets,
      returnOnCapitalEmployed: api?.returnOnCapitalEmployed,
      peRatio: api?.peRatio,
      pbRatio: api?.pbRatio,
      pegRatio: api?.pegRatio,
      priceToSales: api?.priceToSalesRatio,
      priceToFreeCashFlow: api?.priceToFreeCashFlowsRatio,
      evToSales: api?.evToSales,
      evToEbitda: api?.evToEbitda,
      currentRatio: api?.currentRatio,
      revenuePerEmployee: api?.revenuePerEmployee,
    };
  });

  const stockPrices: StockPrice[] = [...rawPrices].reverse().map((d) => ({
    date: d.date, open: d.open, high: d.high,
    low: d.low, close: d.close, volume: d.volume,
  }));

  const analystEstimates: AnalystEstimate[] = [...rawEstimates].reverse().map((d) => ({
    date: d.date,
    estimatedRevenueLow: d.estimatedRevenueLow, estimatedRevenueHigh: d.estimatedRevenueHigh,
    estimatedRevenueAvg: d.estimatedRevenueAvg,
    estimatedEpsLow: d.estimatedEpsLow, estimatedEpsHigh: d.estimatedEpsHigh,
    estimatedEpsAvg: d.estimatedEpsAvg,
    estimatedEbitLow: d.estimatedEbitLow, estimatedEbitHigh: d.estimatedEbitHigh,
    estimatedEbitAvg: d.estimatedEbitAvg,
    numberAnalystEstimatedRevenue: d.numberAnalystEstimatedRevenue,
    numberAnalystsEstimatedEps: d.numberAnalystsEstimatedEps,
  }));

  return { profile, incomeStatements, balanceSheets, cashFlows, keyMetrics, stockPrices, analystEstimates };
}
