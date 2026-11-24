import { ArrowUpRight } from "lucide-react";

export default function kpiCard({ title, value, change, subtitle, icon:Icon }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#161210] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-stone-300">{title}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-[#1e1815] text-stone-400">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tabular-nums text-stone-100">
            {value}
          </h2>
          <p className="mt-2 flex items-center gap-1 text-xs">
            <span className="inline-flex items-center font-medium text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {change}
            </span>
            <span className="text-stone-500">{subtitle}</span>
          </p>
        </div>

        {/* Mini Sparkline Wave */}
        <svg
          viewBox="0 0 80 28"
          className="h-7 w-20 shrink-0 overflow-visible"
          fill="none"
        >
          <path
            d="M2 22 L12 16 L20 20 L30 12 L38 17 L48 9 L56 14 L66 6 L78 10"
            stroke="#8a5a3c"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
