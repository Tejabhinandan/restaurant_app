import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  QrCode,
  CreditCard,
  Check,
} from "lucide-react";
import useOrders from "@/hooks/useOrders";
import Receipt from "@/components/Receipt";
import CashPaymentModal from "@/components/CashPaymentModal";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addOrder, clearActiveCart, updateOrder } = useOrders();

  const draftOrder = state?.draftOrder;

  const [discountType, setDiscountType] = useState("FLAT"); // FLAT | PERCENT
  const [discountInput, setDiscountInput] = useState(
    draftOrder?.discountAmount ? String(draftOrder.discountAmount) : ""
  );
  const [appliedDiscount, setAppliedDiscount] = useState({
    type: "FLAT",
    value: draftOrder?.discountAmount || 0,
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash"); // Cash | UPI | Card
  const [cashReceived, setCashReceived] = useState(0);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Recalculate totals dynamically for both ₹ (FLAT) and % (PERCENT)
  const totals = useMemo(() => {
    if (!draftOrder) return { subTotal: 0, discount: 0, tax: 0, payable: 0 };

    const subTotal = draftOrder.subTotal;
    const rawVal = Math.max(0, appliedDiscount.value);

    const discount =
      appliedDiscount.type === "PERCENT"
        ? Math.min(subTotal, Math.round((subTotal * rawVal) / 100))
        : Math.min(subTotal, rawVal);

    const taxable = subTotal - discount;
    const tax = Math.round(taxable * 0.05);
    const payable = taxable + tax;

    return { subTotal, discount, tax, payable };
  }, [draftOrder, appliedDiscount]);

  if (!draftOrder) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#161210] p-8 text-center">
        <p className="text-base font-semibold text-stone-200">
          No active order in checkout
        </p>
        <p className="mt-1 text-xs text-stone-400">
          Build an order in POS Billing first.
        </p>
        <button
          type="button"
          onClick={() => navigate("/pos")}
          className="mt-4 rounded-xl bg-[#f0643b] px-4 py-2 text-xs font-semibold text-white"
        >
          Go to POS Billing
        </button>
      </div>
    );
  }

  const handleSelectMethod = (method) => {
    setPaymentMethod(method);
    if (method === "Cash") {
      setIsCashModalOpen(true);
    }
  };

  const handleApplyDiscount = () => {
    setAppliedDiscount({
      type: discountType,
      value: Number(discountInput) || 0,
    });
  };

  const finalizeOrder = async (status, shouldPrint) => {
    if(isSubmitting){
      return setIsSubmitting(true)
    }
    const now = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const finalOrder = {
      id: draftOrder.orderNo,
      customer: draftOrder.customer || "Walk-in customer",
      table: draftOrder.table,
      itemsCount: draftOrder.items.reduce((sum, i) => sum + i.qty, 0),
      lineItems: draftOrder.items,
      subTotal: totals.subTotal,
      discountAmount: totals.discount,
      taxTotal: totals.tax,
      amount: totals.payable,
      payment: status === "Pending" ? "Pending" : paymentMethod,
      status,
      time: now,
    };

    try{
  if(draftOrder?.existingOrderId){
      await updateOrder(draftOrder.existingOrderId, finalOrder)
    }else{
      await addOrder(finalOrder);
    }

    clearActiveCart();
    setCompletedReceipt(finalOrder);

    if (shouldPrint) {
      setTimeout(() => {
        window.print();
        navigate("/orders");
      }, 150);
    } else {
      navigate("/orders");
    }
    
    }catch(err){
      console.error("Failed to save Order: ", err?.response?.data || err.message)
    }finally {
      setIsSubmitting(false)
    }
  };

  const changeToReturn = Math.max(0, cashReceived - totals.payable);
  const canComplete =
    paymentMethod !== "Cash" || cashReceived >= totals.payable;

  return (
    <>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-100">Checkout</h1>
            <p className="mt-1 text-sm text-stone-400">
              Review order and collect payment.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/pos", { state: { restoreOrder: draftOrder } })
            }
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#161210] px-4 py-2 text-xs font-semibold text-stone-300 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to POS</span>
          </button>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT CARD: Order Summary (5 cols) */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#161210] p-6 lg:col-span-5">
            <div>
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-base font-bold text-stone-100">
                    Order summary
                  </h2>
                  <p className="mt-0.5 text-xs text-stone-400">
                    Order {draftOrder.orderNo} • {draftOrder.table}
                  </p>
                </div>
                <span className="rounded-full bg-[#3a2218] px-3 py-1 text-[11px] font-semibold text-[#f0643b]">
                  {draftOrder.orderType}
                </span>
              </div>

              {/* Itemized List */}
              <div className="divide-y divide-white/5 border-b border-white/10 py-3">
                {draftOrder.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <span className="text-stone-200">
                      <span className="font-semibold text-stone-400">
                        {item.qty} ×
                      </span>{" "}
                      {item.name}
                    </span>
                    <span className="font-semibold tabular-nums text-stone-100">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Discount Input with ₹ / % Toggle + Apply */}
              <div className="mt-4 flex items-center gap-2">
                <div className="flex shrink-0 rounded-xl border border-white/10 bg-[#120e0c] p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setDiscountType("FLAT")}
                    className={`rounded-lg px-2.5 py-1.5 font-semibold transition ${
                      discountType === "FLAT"
                        ? "bg-[#3a2218] text-white"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    ₹
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType("PERCENT")}
                    className={`rounded-lg px-2.5 py-1.5 font-semibold transition ${
                      discountType === "PERCENT"
                        ? "bg-[#3a2218] text-white"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    %
                  </button>
                </div>

                <input
                  type="number"
                  min="0"
                  max={discountType === "PERCENT" ? "100" : undefined}
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  placeholder={
                    discountType === "FLAT"
                      ? "Discount amount (₹)"
                      : "Discount (%)"
                  }
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#120e0c] px-3.5 py-2.5 text-sm text-stone-200 placeholder-stone-500 focus:border-[#f0643b] focus:outline-none"
                />

                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  className="shrink-0 rounded-xl border border-white/10 bg-[#1e1815] px-4 py-2.5 text-xs font-semibold text-stone-200 transition hover:bg-white/10"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="mt-6 space-y-2.5 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-stone-200">
                  ₹{totals.subTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>
                  Discount
                  {appliedDiscount.type === "PERCENT" &&
                  appliedDiscount.value > 0
                    ? ` (${appliedDiscount.value}%)`
                    : ""}
                </span>
                <span className="tabular-nums font-medium text-rose-400">
                  - ₹{totals.discount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>GST (5%)</span>
                <span className="tabular-nums font-medium text-stone-200">
                  ₹{totals.tax.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-white/10 pt-3 text-base font-bold text-stone-100">
                <span>Amount payable</span>
                <span className="text-xl tabular-nums text-stone-100">
                  ₹{totals.payable.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: Payment Method (7 cols) */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#161210] p-6 lg:col-span-7">
            <div>
              <h2 className="text-base font-bold text-stone-100">
                Payment method
              </h2>
              <p className="mt-0.5 text-xs text-stone-400">
                Choose how the customer will pay
              </p>

              {/* 3 Payment Method Cards */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    id: "Cash",
                    subtitle: "Enter cash received",
                    icon: Banknote,
                  },
                  {
                    id: "UPI",
                    subtitle: "Scan QR code",
                    icon: QrCode,
                  },
                  {
                    id: "Card",
                    subtitle: "Use card terminal",
                    icon: CreditCard,
                  },
                ].map((method) => {
                  const Icon = method.icon;
                  const active = paymentMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => handleSelectMethod(method.id)}
                      className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-[#f0643b] bg-[#211814]"
                          : "border-white/10 bg-[#181310] hover:border-white/20"
                      }`}
                    >
                      {active && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#f0643b] text-white">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      )}
                      <Icon
                        className={`h-5 w-5 ${
                          active ? "text-[#f0643b]" : "text-stone-400"
                        }`}
                      />
                      <span className="mt-3 text-sm font-bold text-stone-100">
                        {method.id}
                      </span>
                      <span className="mt-0.5 text-[11px] text-stone-400">
                        {method.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Payment Details Box */}
              <div className="mt-5">
                {paymentMethod === "Cash" && (
                  <>
                    {cashReceived >= totals.payable ? (
                      <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Banknote className="h-5 w-5 text-emerald-400" />
                          <div>
                            <p className="text-sm font-semibold text-emerald-300">
                              Cash received: ₹
                              {cashReceived.toLocaleString("en-IN")}
                            </p>
                            <p className="text-xs text-emerald-400/80">
                              Return change to customer: ₹
                              {changeToReturn.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsCashModalOpen(true)}
                          className="text-xs font-semibold text-emerald-300 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsCashModalOpen(true)}
                        className="flex w-full items-center justify-between rounded-2xl border border-dashed border-[#f0643b]/40 bg-[#1c1613] px-5 py-4 text-left transition hover:bg-[#241c18]"
                      >
                        <span className="text-sm text-stone-300">
                          Click to enter cash amount received from customer
                        </span>
                        <span className="text-xs font-semibold text-[#f0643b]">
                          Enter Cash →
                        </span>
                      </button>
                    )}
                  </>
                )}

                {paymentMethod === "UPI" && (
                  <div className="flex items-center gap-5 rounded-2xl border border-dashed border-white/15 bg-[#181310] p-5">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-white p-2 text-black">
                      <QrCode className="h-20 w-20" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-100">
                        Scan to pay ₹{totals.payable.toLocaleString("en-IN")}
                      </p>
                      <p className="mt-1 text-xs text-stone-400">
                        UPI ID: spicekitchen@okaxis
                      </p>
                      <p className="mt-2 text-xs font-medium text-[#f0643b]">
                        Waiting for payment confirmation...
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === "Card" && (
                  <div className="flex items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-[#181310] p-5">
                    <CreditCard className="h-8 w-8 text-[#f0643b]" />
                    <div>
                      <p className="text-sm font-bold text-stone-100">
                        Swipe or tap card on POS machine
                      </p>
                      <p className="mt-1 text-xs text-stone-400">
                        Amount to charge: ₹
                        {totals.payable.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => finalizeOrder("Pending", false)}
                className="rounded-xl border border-white/10 bg-[#1e1815] px-5 py-3 text-xs font-semibold text-stone-300 transition hover:bg-white/5 hover:text-white"
              >
                Save as pending
              </button>

              <button
                type="button"
                disabled={!canComplete}
                onClick={() => finalizeOrder("Completed", true)}
                className="rounded-xl bg-[#f0643b] px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#d9532c] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Complete payment • ₹{totals.payable.toLocaleString("en-IN")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Calculator Modal */}
      <CashPaymentModal
        key={`${isCashModalOpen}-${totals.payable}`}
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
        totalBill={totals.payable}
        initialCash={cashReceived}
        onConfirm={(amount) => setCashReceived(amount)}
      />

      {/* 80mm Thermal Receipt */}
      <Receipt order={completedReceipt} />
    </>
  );
}