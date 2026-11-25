import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Orders from "@/pages/Orders";
import MenuManagement from "@/pages/MenuManagement";
import { MenuProvider } from "@/context/MenuProvider";
import { OrderProvider } from "@/context/OrderProvider";
import PosBilling from "@/pages/PosBilling";
import Checkout from "@/pages/Checkout";

function ComingSoon({ title }) {
  return (
    <div className="flex h-full items-center justify-center rounded-2xl border border-white/5 bg-[#161210] p-8">
      <h1 className="text-xl font-semibold text-stone-300">{title} — Coming Soon</h1>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <MenuProvider>
      <OrderProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pos" element={<PosBilling/>} />
          <Route path="checkout" element={<Checkout/>}/>
          <Route path="orders" element={<Orders/>} />
          <Route path="menu" element={<MenuManagement/>} />
          <Route path="inventory" element={<ComingSoon title="Inventory" />} />
          <Route path="expenses" element={<ComingSoon title="Expenses" />} />
          <Route path="reports" element={<ComingSoon title="Reports" />} />
          <Route path="bill-history" element={<ComingSoon title="Bill History" />} />
          <Route path="daily-closing" element={<ComingSoon title="Daily Closing" />} />
          <Route path="settings" element={<ComingSoon title="Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </OrderProvider>
    </MenuProvider>
  );
}