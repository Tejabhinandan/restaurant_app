import { BarChart2, Box, CalendarCheck, ClipboardList, History, LayoutGrid, Monitor, Settings, Utensils, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {

    const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  { name: "POS Billing", path: "/pos", icon: Monitor },
  { name: "Orders", path: "/orders", icon: ClipboardList, badge: 1 },
  { name: "Menu Management", path: "/menu", icon: Utensils },
  { name: "Inventory", path: "/inventory", icon: Box },
  { name: "Expenses", path: "/expenses", icon: Wallet },
  { name: "Reports", path: "/reports", icon: BarChart2 },
  { name: "Bill History", path: "/bill-history", icon: History },
  { name: "Daily Closing", path: "/daily-closing", icon: CalendarCheck },
  { name: "Settings", path: "/settings", icon: Settings },
];
    
  return (
    <aside className="flex h-screen w-64 flex-col bg-[#161210] px-3 py-6 text-stone-300 select-none border-r border-white/5">
        <div className="flex border-b border-white/10 pb-5 items-center gap-3 px-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0643b] text-white">
                <Utensils className="h-4 w-5"/>
            </div>
              <h2 className="text-xl font0bold text-white">Restaurant<span className="text-[#f0643b]">Pro</span></h2>
        </div>
    
        <div className="mt-5 px-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
          Workspace
        </span>
      </div>
      <nav className="mt-2.5 flex-1 overflow-y-auto">
       <ul className="space-y-1">
        {navItems.map((item)=>{
            const Icon= item?.icon;
            return(
                <li key={item?.name}>
                    <NavLink
                    to={item?.path}
                    className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-[#4a2b1d] to-[#322018] text-white shadow-sm"
                        : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
                    }`
                  }
                    >
                        {({isActive})=>(
                            <>
                            <div className="flex items-center gap-3.5">
                                <Icon className={`h-[18px] w-[18px] ${
                            isActive ? "text-stone-200" : "text-stone-400"
                          }`}/>
                                <span>{item?.name}</span>
                            </div>
                            {item.badge && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-[#2c221e] px-1.5 text-xs font-semibold text-stone-200">
                          {item.badge}
                        </span>
                      )}
                            </>
                        )}
                    </NavLink>

                </li>
            )
        })}
       </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;