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
  enterpriseValue?: number;
  fcfYield?: number;
  volume?: number;
  avgVolume?: number;
  dividendYield?: number;
}

export interface IncomeStatement {
  date: string;
  period: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  grossProfitRatio: number;
  researchAndDevelopmentExpenses: number;
  sellingGeneralAndAdministrativeExpenses: number;
  operatingExpenses: number;
  operatingIncome: number;
  operatingIncomeRatio: number;
  ebitda: number;
  ebitdaRatio: number;
  netIncome: number;
  netIncomeRatio: number;
  eps: number;
  epsdiluted: number;
  weightedAverageShsOutDil: number;
}

export interface BalanceSheet {
  date: string;
  period: string;
  cashAndCashEquivalents: number;
  shortTermInvestments: number;
  cashAndShortTermInvestments: number;
  totalDebt: number;
  shortTermDebt: number;
  longTermDebt: number;
  totalAssets: number;
  totalStockholdersEquity: number;
  totalLiabilities: number;
  retainedEarnings: number;
}

export interface CashFlowStatement {
  date: string;
  period: string;
  operatingCashFlow: number;
  capitalExpenditure: number;
  freeCashFlow: number;
  stockBasedCompensation: number;
  dividendPayout: number;
  commonStockRepurchased: number;
}

export interface KeyMetrics {
  date: string;
  period: string;
  debtToEquity: number;
  returnOnEquity: number;
  returnOnAssets?: number;
  returnOnCapitalEmployed?: number;
  priceToEarnings?: number;
  priceToSales?: number;
  priceToBook?: number;
  priceToFreeCashFlow?: number;
  evToSales?: number;
  evToEbitda?: number;
  currentRatio?: number;
  revenuePerEmployee?: number;
  peRatio?: number;
  pbRatio?: number;
  pegRatio?: number;
  psFcfRatio?: number;
}

export interface StockPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AnalystEstimate {
  date: string;
  estimatedRevenueLow: number;
  estimatedRevenueHigh: number;
  estimatedRevenueAvg: number;
  estimatedEpsLow: number;
  estimatedEpsHigh: number;
  estimatedEpsAvg: number;
  estimatedEbitLow: number;
  estimatedEbitHigh: number;
  estimatedEbitAvg: number;
  numberAnalystEstimatedRevenue: number;
  numberAnalystsEstimatedEps: number;
}

export interface FinancialData {
  profile: CompanyProfile | null;
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  cashFlows: CashFlowStatement[];
  keyMetrics: KeyMetrics[];
  stockPrices: StockPrice[];
  analystEstimates: AnalystEstimate[];
}

export type Period = "quarter" | "annual";
