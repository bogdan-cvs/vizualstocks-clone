import type {
  CompanyProfile,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  KeyMetrics,
  FinancialData,
} from "../types/financial";

const BASE_URL = "https://financialmodelingprep.com/api/v3";
const API_KEY = import.meta.env.VITE_FMP_API_KEY || "";

async function fetchFMP<T>(endpoint: string): Promise<T> {
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}apikey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FMP API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchProfile(ticker: string): Promise<CompanyProfile | null> {
  const data = await fetchFMP<CompanyProfile[]>(`/profile/${ticker}`);
  return data?.[0] ?? null;
}

export async function fetchIncomeStatements(
  ticker: string,
  period: "quarter" | "annual" = "quarter",
  limit = 40
): Promise<IncomeStatement[]> {
  return fetchFMP<IncomeStatement[]>(
    `/income-statement/${ticker}?period=${period}&limit=${limit}`
  );
}

export async function fetchBalanceSheets(
  ticker: string,
  period: "quarter" | "annual" = "quarter",
  limit = 40
): Promise<BalanceSheet[]> {
  return fetchFMP<BalanceSheet[]>(
    `/balance-sheet-statement/${ticker}?period=${period}&limit=${limit}`
  );
}

export async function fetchCashFlows(
  ticker: string,
  period: "quarter" | "annual" = "quarter",
  limit = 40
): Promise<CashFlowStatement[]> {
  return fetchFMP<CashFlowStatement[]>(
    `/cash-flow-statement/${ticker}?period=${period}&limit=${limit}`
  );
}

export async function fetchKeyMetrics(
  ticker: string,
  period: "quarter" | "annual" = "quarter",
  limit = 40
): Promise<KeyMetrics[]> {
  return fetchFMP<KeyMetrics[]>(
    `/key-metrics/${ticker}?period=${period}&limit=${limit}`
  );
}

export async function fetchAllFinancialData(
  ticker: string,
  period: "quarter" | "annual" = "quarter"
): Promise<FinancialData> {
  const [profile, incomeStatements, balanceSheets, cashFlows, keyMetrics] =
    await Promise.all([
      fetchProfile(ticker),
      fetchIncomeStatements(ticker, period),
      fetchBalanceSheets(ticker, period),
      fetchCashFlows(ticker, period),
      fetchKeyMetrics(ticker, period),
    ]);

  return {
    profile,
    incomeStatements: incomeStatements.slice(0, 20).reverse(),
    balanceSheets: balanceSheets.slice(0, 20).reverse(),
    cashFlows: cashFlows.slice(0, 20).reverse(),
    keyMetrics: keyMetrics.slice(0, 20).reverse(),
  };
}
