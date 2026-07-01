import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  ShoppingBag,
  Users,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
// import { getDashboardStats, getRecentOrders, getTopBooks } from "../../Redux/slices/dashboardSlice"; // adjust to your actual slice

const STATUS_STYLES = {
  delivered: "bg-green-50 text-green-700",
  shipped: "bg-blue-50 text-blue-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-600",
};

const FALLBACK_SALES = [
  { day: "Mon", revenue: 4200 },
  { day: "Tue", revenue: 5100 },
  { day: "Wed", revenue: 3800 },
  { day: "Thu", revenue: 6400 },
  { day: "Fri", revenue: 7200 },
  { day: "Sat", revenue: 8900 },
  { day: "Sun", revenue: 6100 },
];

function StatCard({ icon: Icon, label, value, delta, deltaPositive, index }) {
  return (
    <div
      className="dash-card bg-white rounded-2xl border border-gray-100 p-5"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
          <Icon size={18} className="text-purple-700" />
        </div>
        {delta != null && (
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full
              ${deltaPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
          >
            {deltaPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {delta}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = useSelector((state) => state.dashboard?.status);
  const stats = useSelector((state) => state.dashboard?.stats);
  const salesData = useSelector((state) => state.dashboard?.salesTrend ?? []);
  const recentOrders = useSelector((state) => state.dashboard?.recentOrders ?? []);
  const topBooks = useSelector((state) => state.dashboard?.topBooks ?? []);

  const [range, setRange] = useState("7d");

  useEffect(() => {
    // if (status === 'idle') {
    //   dispatch(getDashboardStats(range));
    //   dispatch(getRecentOrders());
    //   dispatch(getTopBooks());
    // }
  }, [dispatch, status, range]);

  const isLoading = status === "loading" || status === "idle";
  const chartData = salesData.length > 0 ? salesData : FALLBACK_SALES;

  const summary = useMemo(
    () => ({
      revenue: stats?.revenue ?? 214300,
      revenueDelta: stats?.revenueDelta ?? 12.4,
      orders: stats?.orders ?? 386,
      ordersDelta: stats?.ordersDelta ?? 8.1,
      customers: stats?.customers ?? 1042,
      customersDelta: stats?.customersDelta ?? -2.3,
      booksSold: stats?.booksSold ?? 512,
      booksSoldDelta: stats?.booksSoldDelta ?? 5.6,
    }),
    [stats]
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 dash-header">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors duration-150"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Here's how your store is doing</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            {["7d", "30d", "90d"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150
                  ${range === r ? "bg-purple-700 text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-28 animate-pulse" />
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-72 animate-pulse" />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                index={0}
                icon={IndianRupee}
                label="Total Revenue"
                value={`₹${summary.revenue.toLocaleString("en-IN")}`}
                delta={Math.abs(summary.revenueDelta)}
                deltaPositive={summary.revenueDelta >= 0}
              />
              <StatCard
                index={1}
                icon={ShoppingBag}
                label="Orders"
                value={summary.orders.toLocaleString("en-IN")}
                delta={Math.abs(summary.ordersDelta)}
                deltaPositive={summary.ordersDelta >= 0}
              />
              <StatCard
                index={2}
                icon={Users}
                label="Customers"
                value={summary.customers.toLocaleString("en-IN")}
                delta={Math.abs(summary.customersDelta)}
                deltaPositive={summary.customersDelta >= 0}
              />
              <StatCard
                index={3}
                icon={BookOpen}
                label="Books Sold"
                value={summary.booksSold.toLocaleString("en-IN")}
                delta={Math.abs(summary.booksSoldDelta)}
                deltaPositive={summary.booksSoldDelta >= 0}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 dash-chart">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Revenue Trend</h3>
                  <span className="text-xs text-gray-400">Last {range === "7d" ? "7 days" : range === "30d" ? "30 days" : "90 days"}</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6d28d9" stopOpacity={0.28} />
                          <stop offset="100%" stopColor="#6d28d9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f4" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #f1f1f4",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                          fontSize: 13,
                        }}
                        formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6d28d9"
                        strokeWidth={2.5}
                        fill="url(#revenueFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top books */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 dash-chart" style={{ animationDelay: "80ms" }}>
                <h3 className="font-semibold text-gray-900 mb-4">Top Selling Books</h3>
                <div className="space-y-4">
                  {(topBooks.length > 0
                    ? topBooks
                    : [
                        { id: 1, book_name: "The Silent Patient", units: 84, bg: "#EEEDFE", color: "#26215C" },
                        { id: 2, book_name: "Atomic Habits", units: 71, bg: "#FDEDEE", color: "#7A2731" },
                        { id: 3, book_name: "Educated", units: 58, bg: "#EAF7EE", color: "#1F5C33" },
                        { id: 4, book_name: "Project Hail Mary", units: 47, bg: "#FEF6E7", color: "#7A5A16" },
                      ]
                  ).map((book, i) => (
                    <div key={book.id} className="flex items-center gap-3">
                      <div
                        className="w-9 h-11 rounded-lg shrink-0 flex items-center justify-center text-[8px] font-semibold text-center p-1"
                        style={{ backgroundColor: book.bg || "#EEEDFE", color: book.color || "#26215C" }}
                      >
                        {book.book_name?.slice(0, 10)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{book.book_name}</p>
                        <p className="text-xs text-gray-400">{book.units} sold</p>
                      </div>
                      <span className="text-xs font-semibold text-gray-300">#{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 dash-chart" style={{ animationDelay: "140ms" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                <Link to="/admin/orders" className="text-sm text-purple-700 font-medium hover:text-purple-800">
                  View all
                </Link>
              </div>

              {(recentOrders.length > 0 ? recentOrders : DEFAULT_ORDERS).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-3">
                    <AlertTriangle size={24} className="text-purple-300" />
                  </div>
                  <p className="text-sm text-gray-400">No recent orders yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                        <th className="pb-3 font-medium">Order</th>
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(recentOrders.length > 0 ? recentOrders : DEFAULT_ORDERS).map((order) => (
                        <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors duration-150">
                          <td className="py-3 font-medium text-gray-800">#{order.id}</td>
                          <td className="py-3 text-gray-600">{order.customer}</td>
                          <td className="py-3 text-gray-400">{order.date}</td>
                          <td className="py-3 font-semibold text-purple-800">₹{order.amount}</td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                                ${STATUS_STYLES[order.status] ?? "bg-gray-50 text-gray-500"}`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes dashFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dash-header {
          animation: dashFadeUp 0.4s ease-out both;
        }
        .dash-card {
          animation: dashFadeUp 0.45s ease-out both;
        }
        .dash-chart {
          animation: dashFadeUp 0.45s ease-out 0.15s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .dash-header, .dash-card, .dash-chart {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

const DEFAULT_ORDERS = [
  { id: "10482", customer: "Aarav Mehta", date: "Jun 28", amount: "1,240", status: "delivered" },
  { id: "10481", customer: "Priya Nair", date: "Jun 28", amount: "890", status: "shipped" },
  { id: "10480", customer: "Rohan Iyer", date: "Jun 27", amount: "2,150", status: "pending" },
  { id: "10479", customer: "Sneha Rao", date: "Jun 27", amount: "560", status: "cancelled" },
  { id: "10478", customer: "Kabir Shah", date: "Jun 26", amount: "1,780", status: "delivered" },
];