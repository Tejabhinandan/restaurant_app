import { OrderContext } from "@/context/OrderContext";
import { useContext } from "react";

export function useOrders() {
  return useContext(OrderContext);
}

export default useOrders;