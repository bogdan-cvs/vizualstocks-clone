import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ currentTicker }: { currentTicker?: string }) {
  const [input, setInput] = useState(currentTicker ?? "");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ticker = input.trim().toUpperCase();
    if (ticker) {
      navigate(`/${ticker}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-lg mx-auto">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter ticker (e.g. AAPL, TSLA, MSFT)"
        className="flex-1 bg-[#252830] text-[#e5e7eb] border border-[#2d3039] rounded-lg px-4 py-3 text-base placeholder-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
      />
      <button
        type="submit"
        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
      >
        Search
      </button>
    </form>
  );
}
