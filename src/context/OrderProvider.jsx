import { useState } from "react";
import { OrderContext } from "./OrderContext";
import { ordersData } from "@/data/mockOrders";

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(ordersData);

  // Add completed POS order (Phase 4: POST /api/orders)
  const addOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Update status on Orders page (Phase 4: PATCH /api/orders/:id/status)
  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}