import { useState, useEffect, useRef } from "react";
import type { FinancialData } from "../types/financial";
import { fetchAllFinancialData } from "../services/fmpApi";

interface UseFinancialDataReturn {
  data: { quarter: FinancialData | null; annual: FinancialData | null };
  loading: boolean;
  error: string | null;
}

export function useFinancialData(ticker: string | undefined): UseFinancialDataReturn {
  const [data, setData] = useState<{ quarter: FinancialData | null; annual: FinancialData | null }>(
    { quarter: null, annual: null }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<boolean>(false);

  useEffect(() => {
    if (!ticker) {
      setData({ quarter: null, annual: null });
      setError(null);
      setLoading(false);
      return;
    }

    abortRef.current = false;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Fetch annual first (free tier), then try quarterly
        const annualData = await fetchAllFinancialData(ticker!, "annual");
        if (!cancelled) {
          setData((prev) => ({ ...prev, annual: annualData }));
          if (!annualData.profile) {
            setError(`Ticker "${ticker}" not found.`);
            setLoading(false);
            return;
          }
        }

        const quarterData = await fetchAllFinancialData(ticker!, "quarter");
        if (!cancelled) {
          setData({ quarter: quarterData, annual: annualData });
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Failed to fetch data";
          // If quarterly fails (402), keep annual data and show partial error
          if (msg.includes("402") || msg.includes("Premium") || msg.includes("subscription")) {
            setError("Quarterly data requires FMP paid plan. Showing annual data only.");
          } else {
            setError(msg);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [ticker]);

  return { data, loading, error };
}
