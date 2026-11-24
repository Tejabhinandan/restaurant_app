import { Bell, Calendar, ChevronRight, Menu, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

  const routeTitles={
    "/dashboard":"Dashboard",
    "/pos":"POS Billing",
    "/orders":"Orders",
    "/menu":"Menu Management",
    "/inventory":"Inventory",
    "/expenses":"Expenses",
    "/reports":"Reports",
    "/bill-history":"Bill History",
    "/daily-closing":"Daily Closing",
    "/settings":"Settings"
  }
  function Header({onMenuClick}) {
 const {pathname} = useLocation()
 const currentPage = routeTitles[pathname] || "Dashboard"

 const businessDate = new Date().toLocaleDateString("en-GB",{
  day:"2-digit",
  month:"short",
  year:"numeric"
 });
  return (
  <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#161210] px-6">
      {/* Left: Mobile Drawer Button + Dynamic Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-stone-400 hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="flex items-center gap-2 text-sm">
          <span className="hidden text-stone-400 sm:inline">RestaurantPro</span>
          <ChevronRight className="hidden h-4 w-4 text-stone-600 sm:inline" />
          <span className="font-semibold text-stone-100">{currentPage}</span>
        </nav>
      </div>

      {/* Right: Quick Bill + Status Pill + Business Date + Bell + Avatar */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Quick POS Billing Button */}
        <Link
          to="/pos"
          className="flex items-center gap-1.5 rounded-xl bg-[#f0643b] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#d9532c] sm:text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Bill</span>
        </Link>


        {/* Business Date */}
        <div className="hidden items-center gap-2.5 border-l border-white/10 pl-4 lg:flex">
          <Calendar className="h-4 w-4 text-stone-400" />
          <div className="leading-tight">
            <p className="text-[11px] text-stone-400">Business date</p>
            <p className="text-xs font-semibold text-stone-100">
              {businessDate}
            </p>
          </div>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#1c1714] text-stone-300 transition hover:bg-white/5 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f0643b]" />
        </button>

        {/* User Avatar */}
        <div className="border-l border-white/10 pl-3 lg:pl-4">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5a3524] text-xs font-bold text-stone-100 ring-1 ring-white/10 transition hover:ring-[#f0643b]"
            title="Rahul • Store Manager"
          >
            RK
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;