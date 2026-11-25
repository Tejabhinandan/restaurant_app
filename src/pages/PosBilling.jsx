import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { useMenu } from "@/hooks/useMenu";
import { useOrders } from "@/hooks/useOrders";
import FoodTypeBadge from "@/components/ui/FoodTypeBadge.";
import { menuCategories } from "@/data/mockMenu";
import { useNavigate } from "react-router-dom";

const tables = [
  "Table 01",
  "Table 02",
  "Table 03",
  "Table 04",
  "Table 05",
  "Table 06",
  "Table 07",
  "Table 08",
];

export default function PosBilling() {
  const { menuItems } = useMenu();
  const { activeCart, setActiveCart, clearActiveCart } = useOrders();
  const navigate = useNavigate();

  // Catalog Filters (local UI filters)
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);

  // Order & Cart State persisted in OrderProvider
  const {
    items: cart,
    orderType,
    selectedTable,
    customerName,
    discountType,
    discountValue,
  } = activeCart;

  const setCart = (updater) => {
    setActiveCart((prev) => ({
      ...prev,
      items: typeof updater === "function" ? updater(prev.items) : updater,
    }));
  };

  const setOrderType = (val) =>
    setActiveCart((prev) => ({ ...prev, orderType: val }));

  const setSelectedTable = (val) =>
    setActiveCart((prev) => ({ ...prev, selectedTable: val }));

  const setCustomerName = (val) =>
    setActiveCart((prev) => ({ ...prev, customerName: val }));

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesVeg = !vegOnly || item.isVeg;
      return matchesCat && matchesSearch && matchesVeg;
    });
  }, [menuItems, selectedCategory, searchQuery, vegOnly]);

  // Cart Actions
  const addToCart = (item) => {
    if (!item.isAvailable) return;
    setCart((prev) => {
      const existing = prev.find((c) => c._id === item._id);
      if (existing) {
        return prev.map((c) =>
          c._id === item._id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    clearActiveCart();
  };

  // Financial Calculations
  const billingSummary = useMemo(() => {
    const subTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const rawDiscount = Number(discountValue) || 0;
    const discountAmount =
      discountType === "PERCENT"
        ? Math.min(subTotal, (subTotal * rawDiscount) / 100)
        : Math.min(subTotal, rawDiscount);

    const taxableRatio =
      subTotal > 0 ? (subTotal - discountAmount) / subTotal : 0;

    // Calculate GST per item according to each item's configured taxRate
    const taxTotal = cart.reduce((sum, item) => {
      const itemNet = item.price * item.qty * taxableRatio;
      return sum + (itemNet * (item.taxRate || 5)) / 100;
    }, 0);

    const grandTotal = Math.round(subTotal - discountAmount + taxTotal);

    return {
      subTotal,
      discountAmount,
      taxTotal,
      grandTotal,
    };
  }, [cart, discountType, discountValue]);

  const handleProceedToPayment = () => {
    if (cart.length === 0) return;

    navigate("/checkout", {
      state: {
        draftOrder: {
          orderNo: activeCart.existingOrderId || `#RP-${Math.floor(1050 + Math.random() * 900)}`,
          existingOrderId: activeCart?.existingOrderId || null,
          orderType,
          table: orderType === "Dine-in" ? selectedTable : "Takeaway",
          customer: customerName.trim() || "Walk-in customer",
          items: cart,
          subTotal: billingSummary.subTotal,
          discountAmount: billingSummary.discountAmount,
        },
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-6 lg:h-[calc(100vh-7rem)] lg:flex-row">
        {/* LEFT PANEL: Menu Catalog */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#161210] p-5">
          {/* Search + Veg Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="w-full rounded-xl border border-white/10 bg-[#1e1815] py-2.5 pl-10 pr-4 text-sm text-stone-100 placeholder-stone-500 focus:border-[#f0643b] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setVegOnly(!vegOnly)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                vegOnly
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-white/10 bg-[#1e1815] text-stone-400 hover:text-stone-200"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Veg Only</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="mt-4 flex shrink-0 items-center gap-2 overflow-x-auto px-0.5 py-1">
            {menuCategories?.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-[#3a2218] text-white ring-1 ring-[#f0643b]/50"
                    : "border border-white/10 bg-[#1e1815] text-stone-400 hover:text-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="mt-4 grid flex-1 content-start auto-row-max grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMenu.map((item) => {
              const inCart = cart.find((c) => c._id === item._id);

              return (
                <button
                  key={item._id}
                  type="button"
                  disabled={!item.isAvailable}
                  onClick={() => addToCart(item)}
                  className={`flex h-52 flex-col justify-between rounded-xl border p-4 text-left transition ${
                    !item.isAvailable
                      ? "cursor-not-allowed border-white/5 bg-[#120f0d] opacity-45"
                      : inCart
                      ? "border-[#f0643b]/60 bg-[#231915]"
                      : "border-white/10 bg-[#1c1714] hover:border-white/20 hover:bg-[#221c18]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <FoodTypeBadge isVeg={item.isVeg} />
                      <span className="text-[11px] text-stone-500">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-sm font-semibold text-stone-100">
                      {item.name}
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-base font-bold tabular-nums text-[#f0643b]">
                      ₹{item.price}
                    </span>

                    {!item.isAvailable ? (
                      <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400">
                        Sold Out
                      </span>
                    ) : inCart ? (
                      <span className="rounded-lg bg-[#f0643b] px-2.5 py-0.5 text-xs font-bold text-white">
                        {inCart.qty} in cart
                      </span>
                    ) : (
                      <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-stone-300">
                        + Add
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: Current Order Cart & Billing */}
        <div className="flex w-full flex-col justify-between rounded-2xl border border-white/10 bg-[#161210] p-5 lg:w-[410px] xl:w-[440px]">
          {/* Order Type & Table Selector */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-100">
                Current Bill
              </h2>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-medium text-rose-400 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Dine-in vs Takeaway Toggle */}
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-[#100d0c] p-1">
              {[
                { id: "Dine-in", icon: Utensils },
                { id: "Takeaway", icon: ShoppingBag },
              ].map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setOrderType(type.id)}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                      orderType === type.id
                        ? "bg-[#3a2218] text-white"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{type.id}</span>
                  </button>
                );
              })}
            </div>

            {/* Table + Customer Inputs */}
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {orderType === "Dine-in" && (
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#1e1815] px-3 py-2 text-xs font-medium text-stone-200 focus:border-[#f0643b] focus:outline-none"
                >
                  {tables.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}

              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Guest name (optional)"
                className={`rounded-xl border border-white/10 bg-[#1e1815] px-3 py-2 text-xs text-stone-200 placeholder-stone-500 focus:border-[#f0643b] focus:outline-none ${
                  orderType === "Takeaway" ? "col-span-2" : ""
                }`}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="my-4 flex-1 space-y-2.5 overflow-y-auto border-y border-white/10 py-3 pr-1">
            {cart.length === 0 ? (
              <div className="flex h-full min-h-[140px] flex-col items-center justify-center text-center text-stone-500">
                <p className="text-sm font-medium">No items added yet</p>
                <p className="mt-1 text-xs">
                  Tap dishes on the left to build a bill
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-[#1c1714] px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-stone-100">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      ₹{item.price} × {item.qty}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateQty(item._id, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-[#261f1b] text-stone-300 hover:text-white"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold tabular-nums text-stone-100">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item._id, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-[#261f1b] text-stone-300 hover:text-white"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <span className="w-14 text-right text-xs font-bold tabular-nums text-stone-100">
                    ₹{item.price * item.qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id)}
                    className="text-stone-500 hover:text-rose-400"
                    title="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Discount, GST Summary & Payment Checkout */}
          <div className="space-y-3">
            {/* Totals Breakdown */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-stone-400">
                <span>Sub Total</span>
                <span className="tabular-nums">
                  ₹{billingSummary.subTotal.toFixed(2)}
                </span>
              </div>
              {billingSummary.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="tabular-nums">
                    -₹{billingSummary.discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-stone-400">
                <span>GST (5%)</span>
                <span className="font-semibold tabular-nums text-stone-100">
                  ₹{Math.round(billingSummary.taxTotal).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-dashed border-white/10 pt-3 text-lg font-bold text-stone-100">
                <span>Total</span>
                <span className="tabular-nums text-[#f0643b]">
                  ₹{billingSummary.grandTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="button"
                disabled={cart.length === 0}
                onClick={handleProceedToPayment}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f0643b] py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#d9532c] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>Proceed to payment</span>
                <span>›</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}