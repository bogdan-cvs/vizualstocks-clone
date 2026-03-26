import { useState, useEffect, useRef } from "react";
import type { FinancialData } from "../types/financial";
import { fetchAllFinancialData } from "../services/fmpApi";

interface UseFinancialDataReturn {
  data: { quarter: FinancialData | null; annual: FinancialData | null };
  loading: boolean;
  error: string | null;
}

export function useFinancialData(ticker: string | undefined): UseFinancialDataReturn {
  const [data, setData] = useState<{
    quarter: FinancialData | null;
    annual: FinancialData | null;
  }>({ quarter: null, annual: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!ticker) {
      setData({ quarter: null, annual: null });
      setError(null);
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [quarterData, annualData] = await Promise.all([
          fetchAllFinancialData(ticker!, "quarter"),
          fetchAllFinancialData(ticker!, "annual"),
        ]);
        if (!cancelled) {
          setData({ quarter: quarterData, annual: annualData });
          if (!quarterData.profile) {
            setError(`Ticker "${ticker}" not found.`);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [ticker]);

  return { data, loading, error };
}
