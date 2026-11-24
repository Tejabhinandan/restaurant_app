export default function MetricStrip({ items }) {
  return (
    <div className="grid grid-cols-1 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#161210] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between px-6 py-4"
        >
          <span className="text-sm text-stone-400">{item.label}</span>
          <span
            className={`text-base font-bold tabular-nums ${
              item.highlight === "danger" ? "text-[#f0643b]" : "text-stone-100"
            }`}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}