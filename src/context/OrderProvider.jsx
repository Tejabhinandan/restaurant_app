import { useState } from "react";
import { OrderContext } from "./OrderContext";
import { ordersData } from "@/data/mockOrders";

const emptyCart = {
  items: [],
  orderType: "Dine-in",
  selectedTable: "Table 01",
  customerName: "",
  discountType: "FLAT",
  discountValue: "",
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(ordersData);
  const [activeCart, setActiveCart] = useState(emptyCart);

  const addOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
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
        setActiveCart,
        clearActiveCart,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}