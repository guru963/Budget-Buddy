import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  ArrowUpRight, ArrowDownRight, Calendar,
  LayoutGrid, Plus, ChevronDown, ChevronRight,
  PlaySquare, CreditCard, Coffee, Store, ShoppingBag,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useWidgets } from "../hooks/useWidget";
import ManageWidgetsModal from "../hooks/ManageWidgetsModal";
import AddWidgetModal from "../hooks/AddWidgetModal";
import {
  summaryCards, moneyFlowData, moneyFlowHistorical, budgetCategories,
  recentTransactions, savingGoals,
} from "../data/mockData";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.abs(n));

const PaymentIcon = ({ name }: { name: string }) => {
  if (name.includes("YouTube")) return <PlaySquare size={16} color="#DC2626" />;
  if (name.includes("Amazon")) return <ShoppingBag size={16} color="#F59E0B" />;
  if (name.includes("Canteen") || name.includes("Uber")) return <Coffee size={16} color="#F59E0B" />;
  if (name.includes("Allowance")) return <CreditCard size={16} color="#22C55E" />;
  return <Store size={16} color="#6B7280" />;
};

/* ── Summary Card ─────────────────────────────────────────────────────────── */
function SummaryCard({ label, value, change, positive, dark }: {
  label: string; value: number; change: number; positive: boolean; dark: boolean;
}) {
  return (
    <div
      className="rounded-[24px] p-6 flex flex-col gap-3 transition-all duration-200 hover:shadow-lg"
      style={{
        background: dark ? "#1A1D23" : "white",
        border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`,
        boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-bold" style={{ color: dark ? "#E5E7EB" : "#111827", fontFamily: "Poppins, sans-serif" }}>
          {label}
        </span>
        <button className="w-8 h-8 rounded-full flex items-center justify-center border transition hover:bg-gray-50"
          style={{ borderColor: dark ? "#374151" : "#E5E7EB" }}>
          <ArrowUpRight size={14} color={dark ? "#9CA3AF" : "#6B7280"} strokeWidth={2.5} />
        </button>
      </div>
      <p className="text-[32px] font-bold tracking-tighter" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: "Poppins, sans-serif" }}>
        ${fmt(value)}<span className="text-[24px] font-bold" style={{ color: dark ? "#6B7280" : "#9CA3AF" }}>.00</span>
      </p>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg"
          style={{ background: positive ? "#DCFCE7" : "#FEE2E2", color: positive ? "#16A34A" : "#EF4444" }}>
          {positive ? <ArrowUpRight size={11} strokeWidth={3} /> : <ArrowDownRight size={11} strokeWidth={3} />}
          {change}%
        </span>
        <span className="text-[12px] font-bold" style={{ color: dark ? "#6B7280" : "#9CA3AF", fontFamily: "Poppins, sans-serif" }}>
          vs last month
        </span>
      </div>
    </div>
  );
}

/* ── Money Flow ───────────────────────────────────────────────────────────── */
function MoneyFlowChart({ dark, timeRange, setTimeRange, account, setAccount, ranges, accounts }: { 
  dark: boolean; timeRange: string; setTimeRange: (s: string) => void;
  account: string; setAccount: (s: string) => void;
  ranges: string[]; accounts: string[];
}) {
  return (
    <div className="rounded-[24px] p-6 col-span-2"
      style={{ background: dark ? "#1A1D23" : "white", border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`, boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h3 className="text-[16px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: "Poppins, sans-serif" }}>
          Money flow
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-4 mr-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: dark ? "#E5E7EB" : "#111827", fontFamily: "Poppins, sans-serif" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "#6345ED" }} /> Income
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: dark ? "#E5E7EB" : "#111827", fontFamily: "Poppins, sans-serif" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "#C4B5FD" }} /> Expense
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative group/acc">
              <button className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition hover:bg-gray-50"
                style={{ borderColor: dark ? "#2D3139" : "#E5E7EB", color: dark ? "#D1D5DB" : "#374151", fontFamily: "Poppins, sans-serif" }}>
                {account} <ChevronDown size={13} />
              </button>
              <div className="absolute top-full left-0 mt-1 w-40 rounded-xl shadow-xl border hidden group-hover/acc:block z-50 animate-in fade-in slide-in-from-top-1 duration-200"
                style={{ background: dark ? "#121419" : "white", borderColor: dark ? "#2D3139" : "#E5E7EB" }}>
                {accounts.map(a => (
                  <button key={a} onClick={() => setAccount(a)} className="w-full text-left px-4 py-2.5 text-xs font-bold transition hover:bg-gray-50 dark:hover:bg-gray-800"
                    style={{ color: account === a ? "#6345ED" : dark ? "#9CA3AF" : "#4B5563" }}>{a}</button>
                ))}
              </div>
            </div>
            <div className="relative group/range">
              <button className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition hover:bg-gray-50"
                style={{ borderColor: dark ? "#2D3139" : "#E5E7EB", color: dark ? "#D1D5DB" : "#374151", fontFamily: "Poppins, sans-serif" }}>
                {timeRange} <ChevronDown size={13} />
              </button>
              <div className="absolute top-full left-0 mt-1 w-40 rounded-xl shadow-xl border hidden group-hover/range:block z-50 animate-in fade-in slide-in-from-top-1 duration-200"
                style={{ background: dark ? "#121419" : "white", borderColor: dark ? "#2D3139" : "#E5E7EB" }}>
                {ranges.map(r => (
                  <button key={r} onClick={() => setTimeRange(r)} className="w-full text-left px-4 py-2.5 text-xs font-bold transition hover:bg-gray-50 dark:hover:bg-gray-800"
                    style={{ color: timeRange === r ? "#6345ED" : dark ? "#9CA3AF" : "#4B5563" }}>{r}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeRange.includes("year") ? moneyFlowHistorical : moneyFlowData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barCategoryGap="30%">
            <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Poppins", fill: dark ? "#6B7280" : "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fontWeight: 700, fontFamily: "Poppins, sans-serif", fill: dark ? "#6B7280" : "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip cursor={{ fill: "transparent" }}
              contentStyle={{ background: dark ? "#22262F" : "white", border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`, borderRadius: "12px", fontFamily: "Poppins", fontSize: "12px", color: dark ? "#F3F4F6" : "#1A1D23" }}
              formatter={(v: any) => [`$${fmt(v)}`, ""]} />
            <Bar dataKey="income" fill="#6345ED" radius={[6, 6, 6, 6]} barSize={12} />
            <Bar dataKey="expense" fill="#C4B5FD" radius={[6, 6, 6, 6]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── Budget Donut ─────────────────────────────────────────────────────────── */
function BudgetDonut({ dark }: { dark: boolean }) {
  const total = budgetCategories.reduce((s, c) => s + c.value, 0);
  return (
    <div className="rounded-[24px] p-6"
      style={{ background: dark ? "#1A1D23" : "white", border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`, boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: "Poppins, sans-serif" }}>Budget</h3>
        <button className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ borderColor: dark ? "#374151" : "#E5E7EB" }}>
          <ArrowUpRight size={14} color={dark ? "#9CA3AF" : "#6B7280"} strokeWidth={2.5} />
        </button>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2.5">
          {budgetCategories.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
              <span className="text-[11px] font-bold" style={{ color: dark ? "#D1D5DB" : "#374151", fontFamily: "Poppins, sans-serif" }}>{c.name}</span>
            </div>
          ))}
        </div>
        <div className="relative w-[130px] h-[130px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={budgetCategories} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value" stroke="none" cornerRadius={8}>
                {budgetCategories.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[8px] font-medium uppercase tracking-wider text-center leading-tight" style={{ color: dark ? "#9CA3AF" : "#6B7280", fontFamily: "Poppins, sans-serif" }}>
              Total for<br />month
            </span>
            <span className="text-[15px] font-bold mt-0.5" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: "Poppins, sans-serif" }}>
              ${fmt(total)}<span className="text-[10px] font-medium" style={{ color: dark ? "#6B7280" : "#9CA3AF" }}>.00</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Recent Transactions ──────────────────────────────────────────────────── */
function RecentTransactions({ dark }: { dark: boolean }) {
  return (
    <div className="rounded-[24px] p-6 col-span-2"
      style={{ background: dark ? "#1A1D23" : "white", border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`, boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h3 className="text-[16px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: "Poppins, sans-serif" }}>Recent transactions</h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-full border transition hover:bg-gray-50"
            style={{ borderColor: dark ? "#2D3139" : "#E5E7EB", color: dark ? "#D1D5DB" : "#374151", fontFamily: "Poppins, sans-serif" }}>
            All accounts <ChevronDown size={13} />
          </button>
          <button className="flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-full border transition hover:bg-gray-50"
            style={{ borderColor: dark ? "#2D3139" : "#E5E7EB", color: dark ? "#D1D5DB" : "#374151", fontFamily: "Poppins, sans-serif" }}>
            See all <ChevronRight size={13} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[540px]">
          <div className="grid grid-cols-5 pb-3 px-1" style={{ borderBottom: `1px solid ${dark ? "#2D3139" : "#F3F4F6"}` }}>
            {["DATE", "AMOUNT", "PAYMENT NAME", "METHOD", "CATEGORY"].map((h) => (
              <span key={h} className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#6345ED", fontFamily: "Poppins, sans-serif" }}>{h}</span>
            ))}
          </div>
          <div className="flex flex-col">
            {recentTransactions.map((tx, idx) => (
              <div key={tx.id} className="grid grid-cols-5 py-3.5 px-1 items-center"
                style={{ borderBottom: idx < recentTransactions.length - 1 ? `1px solid ${dark ? "#2D3139" : "#F9F8FF"}` : "none" }}>
                <span className="text-[12px] font-semibold" style={{ color: dark ? "#9CA3AF" : "#6B7280", fontFamily: "Poppins, sans-serif" }}>{tx.date}</span>
                <span className="text-[13px] font-bold" style={{ color: dark ? "#E5E7EB" : "#111827", fontFamily: "Poppins, sans-serif" }}>
                  {tx.amount > 0 ? "" : "- "}${fmt(Math.abs(tx.amount))}
                </span>
                <div className="flex items-center gap-2">
                  <PaymentIcon name={tx.name} />
                  <span className="text-[12px] font-semibold truncate" style={{ color: dark ? "#D1D5DB" : "#111827", fontFamily: "Poppins, sans-serif" }}>{tx.name}</span>
                </div>
                <span className="text-[12px] font-semibold" style={{ color: dark ? "#9CA3AF" : "#6B7280", fontFamily: "Poppins, sans-serif" }}>{tx.method}</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg w-fit"
                  style={{ background: tx.category === "Income" ? "#DCFCE7" : dark ? "#22262F" : "#EDE9FE", color: tx.category === "Income" ? "#16A34A" : "#6345ED", fontFamily: "Poppins, sans-serif" }}>
                  {tx.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Saving Goals ─────────────────────────────────────────────────────────── */
function SavingGoals({ dark }: { dark: boolean }) {
  return (
    <div className="rounded-[24px] p-6"
      style={{ background: dark ? "#1A1D23" : "white", border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`, boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: "Poppins, sans-serif" }}>Saving goals</h3>
        <button className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ borderColor: dark ? "#374151" : "#E5E7EB" }}>
          <ArrowUpRight size={14} color={dark ? "#9CA3AF" : "#6B7280"} strokeWidth={2.5} />
        </button>
      </div>
      <div className="flex flex-col gap-6">
        {savingGoals.map((goal) => {
          const pct = Math.round((goal.saved / goal.target) * 100);
          return (
            <div key={goal.label}>
              <div className="flex justify-between mb-2.5">
                <span className="text-[13px] font-bold" style={{ color: dark ? "#E5E7EB" : "#111827", fontFamily: "Poppins, sans-serif" }}>{goal.label}</span>
                <span className="text-[13px] font-bold" style={{ color: "#6345ED", fontFamily: "Poppins, sans-serif" }}>${fmt(goal.target)}</span>
              </div>
              <div className="w-full h-7 rounded-full overflow-hidden relative flex items-center px-3"
                style={{ background: dark ? "#2D3139" : "#EDE9FE" }}>
                <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: goal.color }} />
                <span className="relative text-[11px] font-bold text-white z-10" style={{ fontFamily: "Poppins, sans-serif" }}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Empty Widget Placeholder ─────────────────────────────────────────────── */
function EmptyWidget({ label, dark }: { label: string; dark: boolean }) {
  return (
    <div className="rounded-[24px] p-6 flex flex-col items-center justify-center gap-3 min-h-[120px]"
      style={{ background: dark ? "#1A1D23" : "white", border: `2px dashed ${dark ? "#2D3139" : "#E5E7EB"}` }}>
      <span className="text-2xl">📦</span>
      <p className="text-sm font-semibold" style={{ color: dark ? "#6B7280" : "#9CA3AF", fontFamily: "Poppins, sans-serif" }}>
        {label} is hidden
      </p>
      <p className="text-xs" style={{ color: dark ? "#4B5563" : "#D1D5DB", fontFamily: "Poppins, sans-serif" }}>
        Use "Manage Widgets" to restore
      </p>
    </div>
  );
}

/* ── Dashboard ────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { darkMode, role } = useApp();
  const { widgets } = useWidgets();
  const [showManage, setShowManage] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [timeRange, setTimeRange] = useState("This month");
  const [account, setAccount] = useState("All accounts");
  const [refreshKey, setRefreshKey] = useState(0);

  // Re-render when widgets change to ensure layout is fresh
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [widgets]);

  const ranges = ["This month", "Last month", "This year", "Last year"];
  const accounts = ["All accounts", "Primary Card", "Savings Card", "UPI Wallet"];

  return (
    <div className="flex flex-col gap-6 pb-10 pt-2 w-full">

      {/* Modals */}
      {showManage && <ManageWidgetsModal onClose={() => setShowManage(false)} dark={darkMode} />}
      {showAdd && <AddWidgetModal onClose={() => setShowAdd(false)} dark={darkMode} />}

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight" style={{ color: darkMode ? "#F3F4F6" : "#111827", fontFamily: "Poppins, sans-serif" }}>
            Welcome back, Alex!
          </h1>
          <p className="text-[14px] font-medium mt-0.5" style={{ color: "#9CA3AF", fontFamily: "Poppins, sans-serif" }}>
            It is the best time to manage your finances
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative group/range">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition hover:opacity-80"
              style={{ background: darkMode ? "#1A1D23" : "white", border: `1px solid ${darkMode ? "#2D3139" : "#E5E7EB"}`, color: darkMode ? "#D1D5DB" : "#111827", fontFamily: "Poppins, sans-serif", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <Calendar size={15} /> {timeRange}
            </button>
            <div className="absolute top-full left-0 mt-1 w-40 rounded-xl shadow-xl border hidden group-hover/range:block z-50 animate-in fade-in slide-in-from-top-1 duration-200"
              style={{ background: darkMode ? "#121419" : "white", borderColor: darkMode ? "#2D3139" : "#E5E7EB" }}>
              {ranges.map(r => (
                <button key={r} onClick={() => setTimeRange(r)} className="w-full text-left px-4 py-2.5 text-xs font-bold transition hover:bg-gray-50 dark:hover:bg-gray-800"
                  style={{ color: timeRange === r ? "#6345ED" : darkMode ? "#9CA3AF" : "#4B5563" }}>{r}</button>
              ))}
            </div>
          </div>
          
          {role === "admin" && (
            <>
              <button
                onClick={() => setShowManage(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition hover:opacity-80"
                style={{ background: darkMode ? "#1A1D23" : "white", border: `1px solid ${darkMode ? "#2D3139" : "#E5E7EB"}`, color: darkMode ? "#D1D5DB" : "#111827", fontFamily: "Poppins, sans-serif", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <LayoutGrid size={15} /> Manage widgets
              </button>
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold text-white transition hover:opacity-90"
                style={{ background: "#6345ED", fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 14px rgba(99,69,237,0.35)" }}>
                <Plus size={15} strokeWidth={2.5} /> Add new widget
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Summary Cards ── */}
      {widgets.summaryCards ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {summaryCards.map((card) => <SummaryCard key={card.label} {...card} dark={darkMode} />)}
        </div>
      ) : (
        <EmptyWidget label="Summary Cards" dark={darkMode} />
      )}

      {/* ── Middle row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5" key={refreshKey}>
        {widgets.moneyFlow
          ? <MoneyFlowChart dark={darkMode} timeRange={timeRange} setTimeRange={setTimeRange} account={account} setAccount={setAccount} ranges={ranges} accounts={accounts} />
          : <EmptyWidget label="Money Flow" dark={darkMode} />}
        {widgets.budget
          ? <BudgetDonut dark={darkMode} />
          : <EmptyWidget label="Budget" dark={darkMode} />}
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {widgets.recentTransactions
          ? <RecentTransactions dark={darkMode} />
          : <EmptyWidget label="Recent Transactions" dark={darkMode} />}
        {widgets.savingGoals
          ? <SavingGoals dark={darkMode} />
          : <EmptyWidget label="Saving Goals" dark={darkMode} />}
      </div>
    </div>
  );
}