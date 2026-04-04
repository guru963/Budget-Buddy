import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  Lightbulb,
  Target,
  Sparkles,
  Zap,
  Shield,
  CreditCard,
  Coffee,
  ShoppingBag,
  MoreHorizontal,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  analyticsCategoryData,
  analyticsTrendData,
} from "../data/mockData";
import { useState } from "react";
import { Loader2, X as CloseIcon } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

/* ─────────────────────────────────────────────────────────────────────────── */
/*  DESIGN TOKENS                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
const PRIMARY = "#5439D4";
const PRIMARY_L = "#7B5EF5";
const PRIMARY_D = "#3B2A8C";
const P = "Poppins, sans-serif";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CUSTOM TOOLTIP                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label, dark }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-4 py-3 rounded-2xl shadow-xl"
        style={{
          background: dark ? "#1A1D26" : "#FFFFFF",
          border: `1px solid ${dark ? "#2A2D3A" : "#EDECF5"}`,
          fontFamily: P,
        }}
      >
        <p className="text-[13px] font-bold mb-2.5" style={{ color: "#9CA3AF" }}>
          {label}
        </p>
        {payload.map((p: any, idx: number) => (
          <div key={idx} className="flex items-center gap-3 text-[14px]">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            <span className="font-semibold" style={{ color: dark ? "#D1D5DB" : "#4B5563" }}>{p.name}:</span>
            <span className="text-[15px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
              {fmt(p.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  STAT CARDS                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
function StatCard({
  title, value, change, changeType, icon: Icon, iconBg, dark
}: {
  title: string; value: string; change: string; changeType: "up" | "down";
  icon: any; iconBg: string; dark: boolean;
}) {
  const isPositive = changeType === "up";
  return (
    <div
      className="rounded-[24px] p-6 transition-all duration-300 hover:translate-y-[-2px]"
      style={{
        background: dark ? "#12141A" : "#FFFFFF",
        border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
        boxShadow: dark ? "none" : "0 8px 32px rgba(124, 92, 252, 0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <Icon size={20} color={PRIMARY} />
        </div>
        <span className="text-[11px] font-medium" style={{ color: "#9CA3AF" }}>
          {title}
        </span>
      </div>
      <div className="text-[32px] font-bold tracking-tight" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
        {value}
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        {isPositive ? (
          <TrendingUp size={14} color="#EF4444" />
        ) : (
          <TrendingDown size={14} color="#10B981" />
        )}
        <span
          className="text-[12px] font-bold"
          style={{ color: isPositive ? "#EF4444" : "#10B981" }}
        >
          {change}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MAIN INSIGHTS PAGE                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function Insights() {
  const { darkMode: dark } = useApp();
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const COLORS = ["#7C5CFC", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"];

  const handleExport = () => {
    setIsExporting(true);

    // Simulate generation delay
    setTimeout(() => {
      try {
        const rows = [
          ["Category", "Value", "Color"],
          ...analyticsCategoryData.map(c => [c.name, c.value, c.color || ""]),
          [],
          ["Day", "Spent", "Income"],
          ...analyticsTrendData.map(t => [t.day, t.spent, t.income])
        ];

        const csvContent = rows.map(r => r.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setToast("Financial report exported successfully!");
      } catch (err) {
        setToast("Failed to export report. Please try again.");
      } finally {
        setIsExporting(false);
        setTimeout(() => setToast(null), 3500);
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12 pt-2 max-w-[1400px] mx-auto px-4 md:px-6">

      {/* ━━━━━━━━ HEADER ━━━━━━━━ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-[30px] font-bold tracking-tight"
            style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}
          >
            Financial Analytics
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "#9CA3AF", fontFamily: P }}>
            Deep insights into your spending patterns and financial health
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50"
            style={{
              background: dark ? "#1A1D26" : "#FFFFFF",
              border: `1px solid ${dark ? "#2A2D3A" : "#E5E7EB"}`,
              color: dark ? "#D1D5DB" : "#374151",
              fontFamily: P,
            }}
          >
            {isExporting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Download size={14} /> Export Report
              </>
            )}
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-medium text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_L})`,
              fontFamily: P,
              boxShadow: `0 4px 14px ${PRIMARY}40`,
            }}
          >
            <Calendar size={14} /> Last 30 Days
          </button>
        </div>
      </div>

      {/* ━━━━━━━━ STAT CARDS ━━━━━━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="PROJECTED SPEND"
          value="$6,222"
          change="2.4% higher than last month"
          changeType="up"
          icon={TrendingUp}
          iconBg={dark ? "#7C5CFC15" : "#F3E8FF"}
          dark={dark}
        />
        <StatCard
          title="EFFICIENCY SCORE"
          value="84 / 100"
          change="Optimized 3 subscriptions"
          changeType="down"
          icon={Target}
          iconBg={dark ? "#10B98115" : "#DCFCE7"}
          dark={dark}
        />
        <StatCard
          title="SAVINGS POTENTIAL"
          value="$1,200"
          change="Available to invest"
          changeType="down"
          icon={Lightbulb}
          iconBg={dark ? "#3B82F615" : "#DBEAFE"}
          dark={dark}
        />
      </div>

      {/* ━━━━━━━━ CHARTS ROW ━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category Breakdown - Donut Chart */}
        <div
          className="rounded-[24px] p-6 transition-all duration-300"
          style={{
            background: dark ? "#12141A" : "#FFFFFF",
            border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
            boxShadow: dark ? "none" : "0 8px 32px rgba(124, 92, 252, 0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className="text-[16px] font-semibold"
                style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}
              >
                Spending by Category
              </h3>
              <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>
                Where your money goes
              </p>
            </div>
            <button
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: dark ? "#1A1D26" : "#F8F9FC",
                color: "#9CA3AF",
              }}
            >
              <Filter size={14} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsCategoryData}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {analyticsCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 w-full space-y-3">
              {analyticsCategoryData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color || COLORS[idx % COLORS.length] }}
                    />
                    <span
                      className="text-[12px] font-medium"
                      style={{ color: dark ? "#D1D5DB" : "#4B5563" }}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span
                    className="text-[14px] font-bold"
                    style={{ color: dark ? "#F3F4F6" : "#111827" }}
                  >
                    {fmt(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Activity - Bar Chart */}
        <div
          className="rounded-[24px] p-6 transition-all duration-300"
          style={{
            background: dark ? "#12141A" : "#FFFFFF",
            border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
            boxShadow: dark ? "none" : "0 8px 32px rgba(124, 92, 252, 0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h3
                className="text-[16px] font-semibold"
                style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}
              >
                Daily Activity
              </h3>
              <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>
                Income vs expenses over time
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: PRIMARY }} />
                <span className="text-[10px] font-medium" style={{ color: "#9CA3AF" }}>
                  Expenses
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#10B981" }} />
                <span className="text-[10px] font-medium" style={{ color: "#9CA3AF" }}>
                  Income
                </span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 700, fontFamily: P, fill: "#9CA3AF" }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 700, fontFamily: P, fill: "#9CA3AF" }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip dark={dark} />} cursor={{ fill: dark ? "#1F2230" : "#F8F9FC" }} />
                <Bar dataKey="spent" fill={PRIMARY} radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━ TREND ANALYSIS ━━━━━━━━ */}
      <div
        className="rounded-[24px] p-6 transition-all duration-300"
        style={{
          background: dark ? "#12141A" : "#FFFFFF",
          border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
          boxShadow: dark ? "none" : "0 8px 32px rgba(124, 92, 252, 0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h3
              className="text-[16px] font-semibold"
              style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}
            >
              6-Month Trend Analysis
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>
              Monthly spending pattern visualization
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: PRIMARY }} />
              <span className="text-[10px] font-medium" style={{ color: "#9CA3AF" }}>
                Spending
              </span>
            </div>
            <div className="w-px h-4" style={{ background: dark ? "#2A2D3A" : "#E5E7EB" }} />
            <span className="text-[12px] font-bold" style={{ color: "#9CA3AF" }}>
              ↓ 8% from last quarter
            </span>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={[
                { month: "Jan", amount: 4200 },
                { month: "Feb", amount: 3800 },
                { month: "Mar", amount: 5100 },
                { month: "Apr", amount: 4500 },
                { month: "May", amount: 4900 },
                { month: "Jun", amount: 4300 },
              ]}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 700, fontFamily: P, fill: "#9CA3AF" }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 700, fontFamily: P, fill: "#9CA3AF" }}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip content={<CustomTooltip dark={dark} />} cursor={{ stroke: dark ? "#2A2D3A" : "#E2DEFF", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={PRIMARY}
                strokeWidth={2.5}
                fill="url(#spendingGradient)"
                dot={{ r: 4, strokeWidth: 2, fill: dark ? "#12141A" : "white", stroke: PRIMARY }}
                activeDot={{ r: 6, strokeWidth: 0, fill: PRIMARY }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ━━━━━━━━ SMART INSIGHTS SECTION ━━━━━━━━ */}
      <div
        className="rounded-[24px] p-6 overflow-hidden relative"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_D})`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.12), transparent 60%)",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Sparkles size={20} color="white" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-white" style={{ fontFamily: P }}>
                AI-Powered Insights
              </h3>
              <p className="text-[11px] text-white/70 mt-0.5">
                Personalized recommendations based on your spending patterns
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Coffee,
                title: "Food & Dining",
                description: "22% higher spend this week",
                action: "Consider meal prepping to save ~$120/month",
              },
              {
                icon: CreditCard,
                title: "Subscription Alert",
                description: "$15 increase detected",
                action: "Review your Netflix plan - was this intended?",
              },
              {
                icon: Target,
                title: "Goal Progress",
                description: "Laptop fund on track",
                action: "Extra $200 found in unused budget",
              },
              {
                icon: Calendar,
                title: "Weekend Pattern",
                description: "Highest spend on Saturdays",
                action: "Set a weekend budget to control expenses",
              },
            ].map((insight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  >
                    <insight.icon size={14} color="white" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
                    {insight.title}
                  </span>
                </div>
                <p className="text-[15px] font-bold text-white mb-1.5">{insight.description}</p>
                <p className="text-[11px] text-white/60 leading-relaxed">{insight.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ━━━━━━━━ RECOMMENDATIONS ━━━━━━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className="rounded-[24px] p-6 transition-all duration-300"
          style={{
            background: dark ? "#12141A" : "#FFFFFF",
            border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${PRIMARY}12` }}
            >
              <Shield size={18} color={PRIMARY} />
            </div>
            <div>
              <h4 className="text-[14px] font-semibold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
                Spending Anomaly Detected
              </h4>
              <p className="text-[11px]" style={{ color: "#9CA3AF" }}>
                Unusual pattern in your transactions
              </p>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: dark ? "#D1D5DB" : "#4B5563" }}>
            Your entertainment spending increased by <span style={{ color: PRIMARY, fontWeight: 700 }}>45%</span> this month
            compared to your 3-month average. This might be due to the new streaming service subscription
            added on June 5th.
          </p>
          <button
            className="mt-4 text-[12px] font-medium flex items-center gap-1.5 transition-colors hover:gap-2"
            style={{ color: PRIMARY }}
          >
            Review Details <MoreHorizontal size={12} />
          </button>
        </div>

        <div
          className="rounded-[24px] p-6 transition-all duration-300"
          style={{
            background: dark ? "#12141A" : "#FFFFFF",
            border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${PRIMARY}12` }}
            >
              <Zap size={18} color={PRIMARY} />
            </div>
            <div>
              <h4 className="text-[14px] font-semibold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
                Savings Opportunity
              </h4>
              <p className="text-[11px]" style={{ color: "#9CA3AF" }}>
                Optimize your monthly budget
              </p>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: dark ? "#D1D5DB" : "#4B5563" }}>
            By reducing dining out by just <span style={{ color: PRIMARY, fontWeight: 700 }}>one meal per week</span>,
            you could save approximately <span style={{ color: PRIMARY, fontWeight: 700 }}>$160 per month</span>.
            That's <span style={{ color: PRIMARY, fontWeight: 700 }}>$1,920</span> annually toward your Goa trip goal!
          </p>
          <button
            className="mt-4 text-[12px] font-medium flex items-center gap-1.5 transition-colors hover:gap-2"
            style={{ color: PRIMARY }}
          >
            Create Savings Plan <Target size={12} />
          </button>
        </div>
      </div>

      {/* ━━━━━━━━ TOP MERCHANTS ━━━━━━━━ */}
      <div
        className="rounded-[24px] p-6 transition-all duration-300"
        style={{
          background: dark ? "#12141A" : "#FFFFFF",
          border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[16px] font-semibold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
              Top Merchants
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>
              Where you spend the most
            </p>
          </div>
          <button className="text-[11px] font-medium" style={{ color: PRIMARY }}>
            View All →
          </button>
        </div>
        <div className="space-y-4">
          {[
            { name: "Amazon", amount: 845, icon: ShoppingBag, color: "#F59E0B" },
            { name: "Whole Foods", amount: 623, icon: ShoppingBag, color: "#10B981" },
            { name: "Netflix", amount: 45, icon: CreditCard, color: "#EF4444" },
            { name: "Starbucks", amount: 128, icon: Coffee, color: "#3B82F6" },
          ].map((merchant, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 border-b"
              style={{ borderColor: dark ? "#1F2230" : "#F0EEFF" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${merchant.color}12` }}
                >
                  <merchant.icon size={16} color={merchant.color} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
                    {merchant.name}
                  </p>
                  <p className="text-[12px] font-bold" style={{ color: "#9CA3AF" }}>
                    {idx === 0 ? "Most frequent" : `${Math.round((merchant.amount / 845) * 100)}% of top spend`}
                  </p>
                </div>
              </div>
              <span className="text-[16px] font-bold" style={{ color: dark ? "#E5E7EB" : "#374151" }}>
                {fmt(merchant.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-100 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className="text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]"
            style={{
              background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_L})`,
              boxShadow: `0 10px 30px ${PRIMARY}40`
            }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Download size={16} />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold" style={{ fontFamily: P }}>{toast}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}