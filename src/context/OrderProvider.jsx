import { useState } from "react";
import { OrderContext } from "./OrderContext";
import { ordersData } from "@/data/mockOrders";

const emptyCart = {
  existingOrderId:null,
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

  const updateOrder = (id, updateFields)=>{
    setOrders((prev)=>
    prev.map((order)=> order.id === id ? {...order, ...updateFields} : order)
  );
  };

  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const loadOrderIntoCart = (order) => {
    const isTakeaway = order.table === "Takeaway";
    setActiveCart({
      existingOrderId: order.id,
      items: order.lineItems || [],
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