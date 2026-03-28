import type {
  CompanyProfile,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  KeyMetrics,
  FinancialData,
} from "../types/financial";

const BASE_URL = "/fmp/stable";
const API_KEY = import.meta.env.VITE_FMP_API_KEY || "";

async function fetchFMP<T>(endpoint: string): Promise<T> {
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}apikey=${API_KEY}`;
  console.log("Fetching:", url);
  const res = await fetch(url);
  console.log("Response:", res.status, res.statusText, url);
  if (!res.ok) {
    const body = await res.text();
    console.log("Error body:", body);
    throw new Error(`FMP API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  // New API returns error messages as strings or objects
  if (typeof data === "string" || data?.["Error Message"] || data?.["Information"]) {
    throw new Error(data?.["Error Message"] || data?.["Information"] || data);
  }
  return data;
}

// Raw types from the new /stable/ API
interface RawProfile {
  symbol: string;
  companyName: string;
  price: number;
  marketCap: number;
  sector: string;
  industry: string;
  image: string;
  currency: string;
  exchange: string;
  exchangeShortName?: string;
  description?: string;
}

interface RawIncomeStatement {
  date: string;
  period: string;
  revenue: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  eps: number;
  epsDiluted: number;
  grossProfitRatio: number;
  operatingIncomeRatio: number;
  netIncomeRatio: number;
}

interface RawBalanceSheet {
  date: string;
  period: string;
  cashAndCashEquivalents: number;
  totalDebt: number;
  totalAssets: number;
  totalStockholdersEquity: number;
  totalLiabilities: number;
  shortTermDebt: number;
  longTermDebt: number;
}

interface RawCashFlow {
  date: string;
  period: string;
  netCashProvidedByOperatingActivities: number;
  investmentsInPropertyPlantAndEquipment: number;
  freeCashFlow: number;
  capitalExpenditure?: number;
}

export async function fetchAllFinancialData(
  ticker: string,
  _period: "quarter" | "annual" = "quarter"
): Promise<FinancialData> {
  const [rawProfiles, rawIncome, rawBalance, rawCashFlow] = await Promise.all([
    fetchFMP<RawProfile[]>(`/profile?symbol=${ticker}`),
    fetchFMP<RawIncomeStatement[]>(
      `/income-statement?symbol=${ticker}&limit=5`
    ),
    fetchFMP<RawBalanceSheet[]>(
      `/balance-sheet-statement?symbol=${ticker}&limit=5`
    ),
    fetchFMP<RawCashFlow[]>(
      `/cash-flow-statement?symbol=${ticker}&limit=5`
    ),
  ]);

  const rawProfile = rawProfiles?.[0] ?? null;

  const profile: CompanyProfile | null = rawProfile
    ? {
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
      }
    : null;

  const incomeStatements: IncomeStatement[] = rawIncome.slice(0, 20).reverse().map((d) => ({
    date: d.date,
    period: d.period,
    revenue: d.revenue,
    grossProfit: d.grossProfit,
    grossProfitRatio: d.grossProfitRatio,
    operatingIncome: d.operatingIncome,
    operatingIncomeRatio: d.operatingIncomeRatio,
    netIncome: d.netIncome,
    netIncomeRatio: d.netIncomeRatio,
    eps: d.eps,
    epsdiluted: d.epsDiluted,
  }));

  const balanceSheets: BalanceSheet[] = rawBalance.slice(0, 20).reverse().map((d) => ({
    date: d.date,
    period: d.period,
    cashAndCashEquivalents: d.cashAndCashEquivalents,
    totalDebt: d.totalDebt ?? (d.shortTermDebt + d.longTermDebt),
    totalAssets: d.totalAssets,
    totalStockholdersEquity: d.totalStockholdersEquity,
    totalLiabilities: d.totalLiabilities,
  }));

  const cashFlows: CashFlowStatement[] = rawCashFlow.slice(0, 20).reverse().map((d) => ({
    date: d.date,
    period: d.period,
    operatingCashFlow: d.netCashProvidedByOperatingActivities,
    capitalExpenditure: d.investmentsInPropertyPlantAndEquipment,
    freeCashFlow: d.freeCashFlow,
  }));

  // Derive key metrics from income + balance sheet (no premium endpoint needed)
  const keyMetrics: KeyMetrics[] = incomeStatements.map((inc, i) => {
    const bal = balanceSheets[i];
    const roe =
      bal && bal.totalStockholdersEquity !== 0
        ? inc.netIncome / Math.abs(bal.totalStockholdersEquity)
        : 0;
    const debtToEquity =
      bal && bal.totalStockholdersEquity !== 0
        ? bal.totalDebt / Math.abs(bal.totalStockholdersEquity)
        : 0;
    return {
      date: inc.date,
      period: inc.period,
      debtToEquity: parseFloat(debtToEquity.toFixed(2)),
      returnOnEquity: parseFloat(roe.toFixed(4)),
    };
  });

  return { profile, incomeStatements, balanceSheets, cashFlows, keyMetrics };
}
