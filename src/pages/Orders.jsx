import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import useOrders from "@/hooks/useOrders";
import { ArrowUpDown, PlayCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const statusTabs = ["All", "Pending", "Preparing", "Completed", "Cancelled"]

export default function Orders() {
const { orders, loadOrderIntoCart, updateOrderStatus } = useOrders();
const navigate = useNavigate()

const [selectedStatus, setSelectedStatus] = useState("All");
const [searchQuery, setSearchQuery] = useState("");
const [sortConfig, setSortConfig] = useState({key:"id", direction:"desc"});

const handleSort=(key)=>{
    setSortConfig((prev)=>({
        key,
        direction: prev.key === key && prev.direction === "asc" ?"desc":"asc",
    }));
};

const handleResumeOrder =(order)=>{
  loadOrderIntoCart(order);
  navigate("/pos")
};

const filteredAndSortedOrders= useMemo(()=>{
    return orders?.filter((order)=>{
        const matchesStatus = selectedStatus === "All" || order?.status === selectedStatus;
        const matchesQuery = order?.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order?.customer.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        order?.table.toLowerCase().includes(searchQuery?.toLowerCase());
        return matchesStatus && matchesQuery;
    }).sort((a,b)=>{
        const dir = sortConfig.direction ==="asc" ? 1 : -1;
        if(sortConfig.key === "amount"){
            return (a?.amount -b?.amount) *dir
        }
        return a[sortConfig.key].localeCompare(b[sortConfig.key]) * dir
    })
},[ orders,selectedStatus,searchQuery,sortConfig ])

const columns = [
    {
      key: "id",
      header: (
        <button
          type="button"
          onClick={() => handleSort("id")}
          className="inline-flex items-center gap-1 hover:text-stone-200"
        >
          ORDER ID <ArrowUpDown className="h-3.5 w-3.5" />
        </button>
      ),
      render: (row) => (
        <span className="font-semibold text-stone-100">{row.id}</span>
      ),
    },
    {
      key: "customer",
      header: "CUSTOMER / TABLE",
      render: (row) => (
        <div>
          <p className="font-medium text-stone-200">{row.customer}</p>
          <p className="text-xs text-stone-500">{row.table}</p>
        </div>
      ),
    },
    {
      key: "time",
      header: "TIME",
      render: (row) => <span className="text-stone-400">{row.time}</span>,
    },
    {
      key: "amount",
      header: (
        <button
          type="button"
          onClick={() => handleSort("amount")}
          className="inline-flex items-center gap-1 hover:text-stone-200"
        >
          AMOUNT <ArrowUpDown className="h-3.5 w-3.5" />
        </button>
      ),
      render: (row) => (
        <span className="font-semibold tabular-nums text-stone-100">
          ₹{row.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "payment",
      header: "PAYMENT",
      render: (row) => <span className="text-stone-300">{row.payment}</span>,
    },
    {
      key: "status",
      header: "STATUS",
      render: (row) => (
      <div className="flex flex-wrap items-center gap-2">
      <StatusBadge status={row.status} />

      {/* Kitchen progression buttons */}
      {row.status === "Pending" && (
        <button
          type="button"
          onClick={() => updateOrderStatus(row.id, "Preparing")}
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 transition hover:bg-amber-500/20"
        >
          Start Prep
        </button>
      )}

      {row.status === "Preparing" && row.payment !== "Pending" && (
        <button
          type="button"
          onClick={() => updateOrderStatus(row.id, "Completed")}
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
        >
          Mark Completed
        </button>
      )}

      {/* Resume / Collect Payment whenever payment is still Pending */}
      {row.payment === "Pending" && row.status !== "Cancelled" && (
        <button
          type="button"
          onClick={() => handleResumeOrder(row)}
          className="inline-flex items-center gap-1 rounded-lg border border-[#f0643b]/40 bg-[#f0643b]/10 px-2.5 py-1 text-[11px] font-semibold text-[#f0643b] transition hover:bg-[#f0643b] hover:text-white"
        >
          <PlayCircle className="h-3 w-3" />
          <span>Resume / Pay</span>
        </button>
      )}
    </div>
        ),
    },
  ];
  return (
   <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-100">Orders</h1>
        <p className="mt-1 text-sm text-stone-400">
          Filter and track all restaurant floor &amp; takeaway orders
        </p>
      </div>

      {/* Filter Tabs + Table Search */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => {
            const count =
              tab === "All"
                ? orders.length
                : orders.filter((o) => o.status === tab).length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedStatus(tab)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  selectedStatus === tab
                    ? "bg-[#3a2218] text-white ring-1 ring-[#f0643b]/50"
                    : "border border-white/10 bg-[#161210] text-stone-400 hover:text-stone-200"
                }`}
              >
                <span>{tab}</span>
                <span className="rounded-md bg-black/30 px-1.5 py-0.5 text-[11px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by ID, guest, table..."
            className="w-full rounded-xl border border-white/10 bg-[#161210] py-2 pl-9 pr-4 text-sm text-stone-200 placeholder-stone-500 focus:border-[#f0643b] focus:outline-none sm:w-64"
          />
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#161210]">
        <DataTable columns={columns} data={filteredAndSortedOrders} />
      </div>
    </div>
  )
}
