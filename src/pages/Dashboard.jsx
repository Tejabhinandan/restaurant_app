import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  FileText,
  Wallet,
  TrendingUp,
  ChevronRight,
  Utensils,
  ArrowUpRight,
  Calendar,
  ChevronDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import KpiCard from "../components/ui/KpiCard";
import MetricStrip from "../components/ui/MetricStrip";
import StatusBadge from "../components/ui/StatusBadge";
import DataTable from "../components/ui/DataTable";
import useOrders from "@/hooks/useOrders";

const hourlyRevenue = [
  { time: "10 AM", sales: 2100 },
  { time: "12 PM", sales: 4600 },
  { time: "2 PM", sales: 3200 },
  { time: "4 PM", sales: 6100 },
  { time: "6 PM", sales: 4100 },
  { time: "8 PM", sales: 6900 },
  { time: "10 PM", sales: 7440 },
];

const paymentData = [
  { name: "UPI", amount: "₹2,780", percent: "52%", value: 52, color: "#f0643b" },
  { name: "Cash", amount: "₹2,480", percent: "29%", value: 29, color: "#22c55e" },
  { name: "Card", amount: "₹2,180", percent: "19%", value: 19, color: "#9ca3af" },
];

const financialStripItems = [
  { label: "Discounts", value: "₹2,480" },
  { label: "Tax collected", value: "₹5,890" },
  { label: "Expenses", value: "₹11,240", highlight: "danger" },
  { label: "Cost of goods", value: "₹33,170" },
];

const bestSellingItems = [
  { rank: "01", name: "Mango Lassi", orders: "42 orders", revenue: "₹5,040", badgeBg: "bg-[#33271e] text-amber-400" },
  { rank: "02", name: "Tandoori Roti", orders: "36 orders", revenue: "₹1,260", badgeBg: "bg-[#1f2e24] text-emerald-400" },
  { rank: "03", name: "Gulab Jamun", orders: "28 orders", revenue: "₹2,520", badgeBg: "bg-[#33231d] text-[#f0643b]" },
  { rank: "04", name: "Masala Chai", orders: "24 orders", revenue: "₹1,080", badgeBg: "bg-[#33271e] text-amber-400" },
];

export default function Dashboard() {
  const { orders } = useOrders();
  const [timeframe, setTimeframe] = useState("Today");
  const navigate = useNavigate();

  const recentOrderColumns = [
    {
      key: "id",
      header: "ORDER ID",
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
      key: "amount",
      header: "AMOUNT",
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
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "action",
      header: "",
      className: "text-right",
      render: () => <ChevronRight className="ml-auto h-4 w-4 text-stone-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Title Row (Without New Bill Button) */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-stone-100">
              Dashboard overview
            </h1>
            <span className="rounded-full bg-[#3a2218] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#f0643b]">
              Owner Overview
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-400">
            Here&apos;s what&apos;s happening at The Spice Kitchen today.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-[#161210] px-4 py-2 text-sm font-medium text-stone-200 hover:bg-white/5 sm:self-auto"
        >
          <Calendar className="h-4 w-4 text-stone-400" />
          <span>This month</span>
          <ChevronDown className="h-4 w-4 text-stone-400" />
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Today's sales"
          value="₹7,440"
          change="12.8%"
          subtitle="vs. yesterday"
          icon={ShoppingBag}
        />
        <KpiCard
          title="Total orders"
          value="7"
          change="8.2%"
          subtitle="vs. yesterday"
          icon={FileText}
        />
        <KpiCard
          title="Today's expenses"
          value="₹4,350"
          change="4.3%"
          subtitle="vs. yesterday"
          icon={Wallet}
        />
        <KpiCard
          title="Estimated profit"
          value="₹3,090"
          change="18.6%"
          subtitle="vs. yesterday"
          icon={TrendingUp}
        />
      </div>

      {/* Middle 3-Column Row: Smooth Area Graph + Kitchen Spotlight + Payment Breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Smooth Coral Area Chart (Screenshot 3 style) */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#161210] p-5 lg:col-span-5">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-stone-100">
                  Total revenue
                </h3>
                <p className="text-xs text-stone-400">
                  A little perspective on your daily performance
                </p>
              </div>

              <div className="flex rounded-xl border border-white/10 bg-[#100d0c] p-1 text-xs">
                {["Today", "Week", "Month"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setTimeframe(tab)}
                    className={`rounded-lg px-2.5 py-1 font-medium transition ${
                      timeframe === tab
                        ? "bg-[#3a2218] text-stone-100"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums text-stone-100">
                ₹7,440
              </span>
              <span className="inline-flex items-center text-xs font-medium text-emerald-400">
                <ArrowUpRight className="h-3.5 w-3.5" />
                12.8%
              </span>
            </div>
          </div>

          <div className="mt-4 h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={hourlyRevenue}
                margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="coralGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f0643b" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#f0643b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#26201d"
                  strokeDasharray="0"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  stroke="#78716c"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1c1714",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "#f5f5f4",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [
                    `₹${value.toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#f0643b"
                  strokeWidth={3}
                  fill="url(#coralGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* The Kitchen Spotlight */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#161210] p-5 lg:col-span-4">
          <div>
            <h3 className="text-base font-semibold text-stone-100">
              The kitchen spotlight
            </h3>
            <p className="text-xs text-stone-400">Made for memorable meals</p>
          </div>

          <div className="relative my-4 h-56 overflow-hidden rounded-xl border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80"
              alt="Signature Indian Curry"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3.5 right-3.5">
              <p className="text-sm font-semibold text-stone-100">
                A little inspiration, every day.
              </p>
              <Link
                to="/menu"
                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#f0643b] hover:underline"
              >
                Explore your menu
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Breakdown Donut */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#161210] p-5 lg:col-span-3">
          <div>
            <h3 className="text-base font-semibold text-stone-100">
              Payment breakdown
            </h3>
            <p className="text-xs text-stone-400">The ways your customers pay</p>
          </div>

          <div className="relative mx-auto my-2 h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  dataKey="value"
                  innerRadius={56}
                  outerRadius={74}
                  paddingAngle={4}
                  stroke="none"
                >
                  {paymentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-stone-400">Total received</span>
              <span className="text-base font-bold tabular-nums text-stone-100">
                ₹7,440
              </span>
              <span className="text-[9px] text-stone-500">
                Across all payments
              </span>
            </div>
          </div>

          <div className="space-y-2 border-t border-white/5 pt-3 text-xs">
            {paymentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-stone-300">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="font-semibold text-stone-100">
                    {item.amount}
                  </span>
                  <span className="w-8 text-right text-stone-500">
                    {item.percent}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2nd Screenshot Component: 4-Metric Horizontal Strip */}
      <MetricStrip items={financialStripItems} />

      {/* Bottom Row: Recent Orders (with View all orders link) + Best-selling items */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#161210] lg:col-span-8">
          <div className="flex items-center justify-between p-5">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-semibold text-stone-100">
                  Recent orders
                </h3>
                <span className="rounded-md bg-[#261f1b] px-2 py-0.5 text-xs font-semibold text-stone-300">
                  {orders?.length}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-stone-400">
                Fresh from your restaurant floor
              </p>
            </div>

            <Link
              to="/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#f0643b] hover:underline"
            >
              View all orders
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <DataTable
            columns={recentOrderColumns}
            data={orders?.slice(0, 5)}
            onRowClick={() => navigate("/orders")}
          />
        </div>

        {/* Best-Selling Items */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#161210] p-5 lg:col-span-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-stone-100">
                Best-selling items
              </h3>
              <span className="text-xs text-stone-500">Today</span>
            </div>
            <p className="mt-0.5 text-xs text-stone-400">
              The dishes your customers love
            </p>

            <div className="mt-5 space-y-4">
              {bestSellingItems.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-xs font-semibold text-stone-500">
                      {item.rank}
                    </span>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.badgeBg}`}
                    >
                      <Utensils className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-500">{item.orders}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-stone-100">
                    {item.revenue}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-white/5 pt-3 text-center">
            <Link
              to="/reports"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#f0643b] hover:underline"
            >
              View item performance
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}