const statusStyles = {
  Completed: {
    pill: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  Pending: {
    pill: "bg-[#f0643b]/15 text-[#f0643b] border-[#f0643b]/20",
    dot: "bg-[#f0643b]",
  },
  Preparing: {
    pill: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  Cancelled: {
    pill: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    dot: "bg-rose-400",
  },
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || statusStyles.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${style.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}