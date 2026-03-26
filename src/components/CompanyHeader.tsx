import type { CompanyProfile } from "../types/financial";
import { formatMarketCap } from "../utils/formatters";

export default function CompanyHeader({ profile }: { profile: CompanyProfile }) {
  return (
    <div className="flex items-center gap-5 bg-[#1a1d27] border border-[#2d3039] rounded-xl p-5 mb-6">
      {profile.image && (
        <img
          src={profile.image}
          alt={profile.companyName}
          className="w-14 h-14 rounded-lg bg-white p-1 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-xl font-bold text-[#e5e7eb] m-0">{profile.companyName}</h1>
          <span className="text-[#3b82f6] font-semibold text-lg">{profile.symbol}</span>
        </div>
        <div className="flex items-center gap-4 mt-1 text-sm text-[#9ca3af] flex-wrap">
          <span className="text-lg font-semibold text-[#e5e7eb]">
            ${profile.price.toFixed(2)}
          </span>
          <span>Mkt Cap: {formatMarketCap(profile.mktCap)}</span>
          <span>{profile.sector}</span>
          <span>{profile.industry}</span>
          <span className="text-xs">{profile.exchangeShortName}</span>
        </div>
      </div>
    </div>
  );
}
