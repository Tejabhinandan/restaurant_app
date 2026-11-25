import { useState, useMemo } from "react";
import { Banknote, X } from "lucide-react";

export default function CashPaymentModal({
  isOpen,
  onClose,
  totalBill,
  initialCash = "",
  onConfirm,
}) {
  const [cashInput, setCashInput] = useState(
    initialCash ? String(initialCash) : ""
  );

  // Generate smart quick-cash buttons based on the bill amount
  const quickAmounts = useMemo(() => {
    const nextHundred = Math.ceil((totalBill + 1) / 100) * 100;
    const nextFiveHundred = Math.ceil((totalBill + 1) / 500) * 500;
    const candidates = [totalBill, nextHundred, nextFiveHundred, 2000];
    return [...new Set(candidates.filter((amt) => amt >= totalBill))].slice(
      0,
      4
    );
  }, [totalBill]);

  if (!isOpen) return null;

  const received = Number(cashInput) || 0;
  const difference = received - totalBill;
  const isSufficient = received >= totalBill && totalBill > 0;

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!isSufficient) return;
    onConfirm(received);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#181310] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3a2218] text-[#f0643b]">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100">
                Cash payment
              </h2>
              <p className="text-xs text-stone-400">
                Enter the amount received from the customer
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-1.5 text-stone-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="mt-5 space-y-4">
          {/* Total Bill Box */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#1e1815] px-4 py-3.5">
            <span className="text-sm text-stone-400">Total bill</span>
            <span className="text-xl font-bold tabular-nums text-[#f0643b]">
              ₹{totalBill.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Cash Received Input */}
          <div>
            <label className="block text-xs font-medium text-stone-300">
              Cash received
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-stone-400">
                ₹
              </span>
              <input
                type="number"
                autoFocus
                min="0"
                value={cashInput}
                onChange={(e) => setCashInput(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-[#f0643b]/70 bg-[#120e0c] py-3 pl-10 pr-4 text-right text-2xl font-bold tabular-nums text-stone-100 placeholder-stone-600 focus:border-[#f0643b] focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Amount Pills */}
          <div>
            <span className="block text-xs text-stone-400">Quick amount</span>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {quickAmounts.map((amt, idx) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCashInput(String(amt))}
                  className="rounded-xl border border-white/10 bg-[#1e1815] px-2 py-2 text-xs font-semibold tabular-nums text-stone-200 transition hover:border-[#f0643b]/50 hover:bg-[#28201c]"
                >
                  {idx === 0
                    ? `Exact ₹${amt.toLocaleString("en-IN")}`
                    : `₹${amt.toLocaleString("en-IN")}`}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Status Banner: Green (Change) vs Red (Still Due) */}
          {isSufficient ? (
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-emerald-400">
                  Change to return
                </p>
                <p className="mt-0.5 text-[11px] text-emerald-300/70">
                  Count and return this amount to the customer.
                </p>
              </div>
              <span className="text-xl font-bold tabular-nums text-emerald-400">
                ₹{difference.toLocaleString("en-IN")}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-rose-400">
                  Amount still due
                </p>
                <p className="mt-0.5 text-[11px] text-rose-300/70">
                  Ask the customer for the remaining amount.
                </p>
              </div>
              <span className="text-xl font-bold tabular-nums text-rose-400">
                ₹{Math.abs(difference).toLocaleString("en-IN")}
              </span>
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-[#1e1815] py-3 text-xs font-semibold text-stone-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isSufficient}
              className="col-span-2 rounded-xl bg-[#f0643b] py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#d9532c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirm cash • ₹{received.toLocaleString("en-IN")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}