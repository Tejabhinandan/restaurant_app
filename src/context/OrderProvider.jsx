import { useState, useEffect, useMemo } from "react";
import { OrderContext } from "./OrderContext";
import { ordersData } from "@/data/mockOrders";

const PENDING_STORAGE_KEY = "restaurant_pro_pending_orders";

const emptyCart = {
  existingOrderId: null,
  items: [],
  orderType: "Dine-in",
  selectedTable: "Table 01",
  customerName: "",
  discountType: "FLAT",
  discountValue: "",
};

export function OrderProvider({ children }) {
  const [completedOrders, setCompletedOrders] = useState(ordersData);
  const [pendingOrders, setPendingOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(PENDING_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeCart, setActiveCart] = useState(emptyCart);

  // Sync pending orders to localStorage so open table tabs survive page refreshes
  useEffect(() => {
    try {
      localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pendingOrders));
    } catch (err) {
      console.error("Failed to save pending orders:", err);
    }
  }, [pendingOrders]);

  // Combined list for Orders table & filter tabs
  const orders = useMemo(
    () => [...pendingOrders, ...completedOrders],
    [pendingOrders, completedOrders]
  );

  const addOrder = (newOrder) => {
    if (newOrder.status === "Pending") {
      setPendingOrders((prev) => [
        newOrder,
        ...prev.filter((o) => o.id !== newOrder.id),
      ]);
      return;
    }

    setCompletedOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrder = (id, updateFields) => {
    if (updateFields.status === "Pending") {
      setPendingOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, ...updateFields } : order
        )
      );
      return;
    }

    // Move from pendingOrders to completedOrders once paid
    const existingPending = pendingOrders.find((o) => o.id === id);
    if (existingPending) {
      setPendingOrders((prev) => prev.filter((o) => o.id !== id));
      setCompletedOrders((prev) => [
        { ...existingPending, ...updateFields },
        ...prev,
      ]);
      return;
    }

    setCompletedOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, ...updateFields } : order
      )
    );
  };

  const updateOrderStatus = (id, status) => {
    const isPendingTab = pendingOrders.some((o) => o.id === id);

    if (isPendingTab) {
      if (status === "Cancelled") {
        setPendingOrders((prev) => prev.filter((o) => o.id !== id));
      } else {
        setPendingOrders((prev) =>
          prev.map((order) =>
            order.id === id ? { ...order, status } : order
          )
        );
      }
      return;
    }

    setCompletedOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const loadOrderIntoCart = (order) => {
    const isTakeaway = order.table === "Takeaway";
    setActiveCart({
      existingOrderId: order.id,
      items: (order.lineItems || []).map((item) => ({
        ...item,
        _id: item._id || item.menuItemId,
      })),
      orderType: isTakeaway ? "Takeaway" : "Dine-in",
      selectedTable: isTakeaway ? "Table 01" : order.table || "Table 01",
      customerName:
        order.customer === "Walk-in customer" ? "" : order.customer || "",
      discountType: "FLAT",
      discountValue: order.discountAmount ? String(order.discountAmount) : "",
    });
  };

  const clearActiveCart = () => {
    setActiveCart(emptyCart);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        activeCart,
        updateOrder,
        loadOrderIntoCart,
        setActiveCart,
        clearActiveCart,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}