export interface CompanyProfile {
  symbol: string;
  companyName: string;
  price: number;
  mktCap: number;
  sector: string;
  industry: string;
  image: string;
  currency: string;
  exchange: string;
  exchangeShortName: string;
}

export interface IncomeStatement {
  date: string;
  period: string;
  revenue: number;
  grossProfit: number;
  grossProfitRatio: number;
  operatingIncome: number;
  operatingIncomeRatio: number;
  netIncome: number;
  netIncomeRatio: number;
  eps: number;
  epsdiluted: number;
}

export interface BalanceSheet {
  date: string;
  period: string;
  cashAndCashEquivalents: number;
  totalDebt: number;
  totalAssets: number;
  totalStockholdersEquity: number;
  totalLiabilities: number;
}

export interface CashFlowStatement {
  date: string;
  period: string;
  operatingCashFlow: number;
  capitalExpenditure: number;
  freeCashFlow: number;
}

export interface KeyMetrics {
  date: string;
  period: string;
  debtToEquity: number;
  returnOnEquity: number;
}

export interface FinancialData {
  profile: CompanyProfile | null;
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  cashFlows: CashFlowStatement[];
  keyMetrics: KeyMetrics[];
}

export type Period = "quarter" | "annual";
