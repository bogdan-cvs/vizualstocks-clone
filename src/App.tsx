import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Layout from "./components/Layout";
import SearchBar from "./components/SearchBar";
import CompanyHeader from "./components/CompanyHeader";
import Dashboard from "./components/Dashboard";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { useFinancialData } from "./hooks/useFinancialData";

function HomePage() {
  return (
    <Layout>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-[#e5e7eb] mb-2">VizualStocks</h1>
        <p className="text-[#9ca3af] text-lg mb-8">Finance is better visually</p>
        <SearchBar />
        <p className="text-[#6b7280] text-sm mt-6">
          Try AAPL, TSLA, MSFT, GOOGL, NVDA...
        </p>
      </div>
    </Layout>
  );
}

function TickerPage() {
  const { ticker } = useParams<{ ticker: string }>();
  const upperTicker = ticker?.toUpperCase();
  const { data, loading, error } = useFinancialData(upperTicker);

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-[#e5e7eb] m-0 shrink-0">VizualStocks</h2>
          <SearchBar currentTicker={upperTicker} />
        </div>
      </div>

      {loading && <LoadingSkeleton />}

      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-[#ef4444] text-lg mb-2">Error</p>
          <p className="text-[#9ca3af]">{error}</p>
        </div>
      )}

      {!loading && !error && data.quarter?.profile && (
        <>
          <CompanyHeader profile={data.quarter.profile} />
          <Dashboard data={data} />
        </>
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:ticker" element={<TickerPage />} />
      </Routes>
    </BrowserRouter>
  );
}
