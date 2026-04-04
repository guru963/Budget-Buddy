import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Calendar, Plus, ArrowUpDown, ChevronDown, RotateCcw,
  Edit2, CheckCircle2, AlertCircle, MoreHorizontal,
  ArrowLeftRight, Coffee, Home, GraduationCap,
  ShoppingBag, Plane, Heart, X,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { budgetItemsData, detailedMonthlyBudget, mostExpensesData } from "../data/mockData";

/* ── constants ────────────────────────────────────────────────────────────── */
const P = "Poppins, sans-serif";

const MONTHS = ["Jul", "Jun"];
const SORTS = ["Default", "Name A–Z", "Name Z–A", "Spent: High–Low", "Spent: Low–High", "Remaining: High–Low"];
const STATUSES = ["All", "on track", "need attention"];
const AMT_RANGES = ["All", "Under $200", "$200–$500", "$500–$1,000", "Over $1,000"];

const IconMap: Record<string, React.ElementType> = {
  ArrowLeftRight, Coffee, Home, GraduationCap, ShoppingBag, Plane, Heart,
};

const fmtLeft = (n: number) => {
  const abs = Math.abs(n);
  const whole = Math.floor(abs);
  const dec = Math.round((abs - whole) * 100).toString().padStart(2, "0");
  return { whole: whole.toLocaleString("en-US"), dec };
};

/* ── Dropdown ─────────────────────────────────────────────────────────────── */
function Dropdown({
  label, options, value, onChange, dark,
}: {
  label?: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  dark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold border transition hover:opacity-80"
        style={{
          background: dark ? "#1A1D23" : "white",
          borderColor: dark ? "#2D3139" : "#E5E7EB",
          color: dark ? "#D1D5DB" : "#374151",
          fontFamily: P,
        }}
      >
        {label ? `${label}` : value} <ChevronDown size={13} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50 rounded-2xl shadow-xl py-1 min-w-[160px]"
          style={{
            background: dark ? "#22262F" : "white",
            border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`,
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-[12px] font-semibold transition hover:opacity-70"
              style={{
                background: value === opt ? (dark ? "#2D3139" : "#F3F0FF") : "transparent",
                color: value === opt ? "#6345ED" : (dark ? "#D1D5DB" : "#374151"),
                fontFamily: P,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Month picker dropdown ────────────────────────────────────────────────── */
function MonthDropdown({
  value, onChange, dark,
}: { value: string; onChange: (v: string) => void; dark: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold border transition hover:opacity-80"
        style={{
          background: dark ? "#1A1D23" : "white",
          borderColor: dark ? "#2D3139" : "#E5E7EB",
          color: dark ? "#D1D5DB" : "#374151",
          fontFamily: P,
          boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <Calendar size={15} /> {value === "Jul" ? "This month" : `${value} 2024`} <ChevronDown size={13} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50 rounded-2xl shadow-xl py-1 min-w-[160px]"
          style={{
            background: dark ? "#22262F" : "white",
            border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`,
          }}
        >
          {MONTHS.map((m) => (
            <button
              key={m}
              onClick={() => { onChange(m); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-[12px] font-semibold transition hover:opacity-70"
              style={{
                background: value === m ? (dark ? "#2D3139" : "#F3F0FF") : "transparent",
                color: value === m ? "#6345ED" : (dark ? "#D1D5DB" : "#374151"),
                fontFamily: P,
              }}
            >
              {m === "Jul" ? "This month (Jul)" : `${m} 2024`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Add Budget Modal ─────────────────────────────────────────────────────── */
function AddBudgetModal({ onClose, onAdd, dark }: {
  onClose: () => void;
  onAdd: (item: { name: string; total: number }) => void;
  dark: boolean;
}) {
  const [name, setName] = useState("");
  const [total, setTotal] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) { setErr("Category name is required."); return; }
    if (!total || +total <= 0) { setErr("Please enter a valid amount."); return; }
    onAdd({ name: name.trim(), total: +total });
    onClose();
  };

  const inputStyle = {
    background: dark ? "#22262F" : "#F8F9FC",
    border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`,
    color: dark ? "#F3F4F6" : "#111827",
    borderRadius: 12,
    padding: "10px 14px",
    fontFamily: P,
    fontSize: 13,
    outline: "none",
    width: "100%",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-3xl p-6 shadow-2xl z-10"
        style={{ background: dark ? "#1A1D23" : "white", border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`, fontFamily: P }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>Add New Budget</h2>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Set a monthly spending limit</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center border"
            style={{ borderColor: dark ? "#2D3139" : "#E5E7EB" }}>
            <X size={14} color={dark ? "#9CA3AF" : "#6B7280"} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "#9CA3AF" }}>
              Category Name
            </label>
            <input
              style={inputStyle}
              placeholder="e.g. Food & Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "#9CA3AF" }}>
              Monthly Limit ($)
            </label>
            <input
              style={inputStyle}
              type="number"
              placeholder="e.g. 500"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
            />
          </div>
          {err && <p className="text-xs font-semibold" style={{ color: "#EF4444", fontFamily: P }}>{err}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold border transition hover:opacity-80"
            style={{ borderColor: dark ? "#2D3139" : "#E5E7EB", color: dark ? "#D1D5DB" : "#374151", background: dark ? "#22262F" : "#F8F9FC", fontFamily: P }}>
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white transition hover:opacity-90"
            style={{ background: "#6345ED", fontFamily: P, boxShadow: "0 4px 14px rgba(99,69,237,0.3)" }}>
            Add Budget
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Edit Budget Modal ────────────────────────────────────────────────────── */
function EditBudgetModal({ item, onClose, onSave, dark }: {
  item: { name: string; spent: number; total: number; status: string; month: string };
  onClose: () => void;
  onSave: (updated: { name: string; total: number }) => void;
  dark: boolean;
}) {
  const [name, setName] = useState(item.name);
  const [total, setTotal] = useState(String(item.total));

  const inputStyle = {
    background: dark ? "#22262F" : "#F8F9FC",
    border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`,
    color: dark ? "#F3F4F6" : "#111827",
    borderRadius: 12,
    padding: "10px 14px",
    fontFamily: P,
    fontSize: 13,
    outline: "none",
    width: "100%",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-3xl p-6 shadow-2xl z-10"
        style={{ background: dark ? "#1A1D23" : "white", border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`, fontFamily: P }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>Edit Budget</h2>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Update spending limit</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center border"
            style={{ borderColor: dark ? "#2D3139" : "#E5E7EB" }}>
            <X size={14} color={dark ? "#9CA3AF" : "#6B7280"} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "#9CA3AF" }}>
              Category Name
            </label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "#9CA3AF" }}>
              Monthly Limit ($)
            </label>
            <input style={inputStyle} type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold border transition hover:opacity-80"
            style={{ borderColor: dark ? "#2D3139" : "#E5E7EB", color: dark ? "#D1D5DB" : "#374151", background: dark ? "#22262F" : "#F8F9FC", fontFamily: P }}>
            Cancel
          </button>
          <button onClick={() => { onSave({ name: name.trim(), total: +total }); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white transition hover:opacity-90"
            style={{ background: "#6345ED", fontFamily: P, boxShadow: "0 4px 14px rgba(99,69,237,0.3)" }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Progress Ring ────────────────────────────────────────────────────────── */
function ProgressRing({ spent, total, dark }: { spent: number; total: number; dark: boolean }) {
  const pct = Math.min(100, Math.round((spent / total) * 100));
  const left = fmtLeft(spent);
  const data = [{ value: spent }, { value: Math.max(0, total - spent) }];
  return (
    <div className="relative w-[110px] h-[110px] shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={38} outerRadius={50}
            startAngle={90} endAngle={-270} dataKey="value" stroke="none">
            <Cell fill="#6345ED" />
            <Cell fill={dark ? "#2D3139" : "#EDE9FE"} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[11px] font-bold" style={{ color: "#9CA3AF", fontFamily: P }}>{pct}% spent</span>
        <span className="text-[14px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>
          ${left.whole}<span className="text-[11px] font-semibold" style={{ color: "#9CA3AF" }}>.{left.dec}</span>
        </span>
      </div>
    </div>
  );
}

/* ── Semi-circle ──────────────────────────────────────────────────────────── */
function SemiCircle({ spent, total, remaining, dark }: {
  spent: number; total: number; remaining: number; dark: boolean;
}) {
  const pct = Math.min(100, Math.round((spent / total) * 100));
  const data = [{ value: spent }, { value: Math.max(0, total - spent) }];
  const leftPct = Math.round((remaining / total) * 100);

  return (
    <div className="relative w-full" style={{ height: 140 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="100%" startAngle={180} endAngle={0}
            innerRadius={90} outerRadius={112} dataKey="value" stroke="none" cornerRadius={8}>
            <Cell fill="#6345ED" />
            <Cell fill={dark ? "#2D3139" : "#EDE9FE"} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 pointer-events-none">
        <span className="text-[11px] font-medium" style={{ color: "#9CA3AF", fontFamily: P }}>{pct}% spent</span>
        <span className="text-[26px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>
          ${spent.toLocaleString()}<span className="text-base font-medium" style={{ color: "#9CA3AF" }}>.00</span>
        </span>
      </div>
      <div className="absolute right-4 top-3 flex flex-col items-center px-3 py-2 rounded-xl shadow-lg"
        style={{ background: dark ? "#22262F" : "white", border: `1px solid ${dark ? "#2D3139" : "#F0EEF8"}` }}>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#9CA3AF", fontFamily: P }}>
          {leftPct}% left
        </span>
        <span className="text-[13px] font-bold" style={{ color: dark ? "#D1D5DB" : "#374151", fontFamily: P }}>
          ${remaining.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

/* ── Budget Card ──────────────────────────────────────────────────────────── */
function BudgetCard({ item, dark, onEdit }: {
  item: { name: string; spent: number; total: number; status: string; month: string };
  dark: boolean;
  onEdit?: () => void;
}) {
  const leftAmt = item.total - item.spent;
  const leftFmt = fmtLeft(leftAmt);
  const totalFmt = fmtLeft(item.total);
  const onTrack = item.status === "on track";

  return (
    <div className="p-6 rounded-[24px] flex flex-col gap-4 transition-all duration-200 hover:shadow-md"
      style={{
        background: dark ? "#1A1D23" : "white",
        border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`,
        boxShadow: dark ? "none" : "0 1px 4px rgba(0,0,0,0.04)",
      }}>
      <div className="flex items-center justify-between">
        <h3 className="text-[17px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>
          {item.name}
        </h3>
        {onEdit && (
          <button onClick={onEdit}
            className="w-8 h-8 rounded-full flex items-center justify-center border transition hover:bg-gray-50"
            style={{ borderColor: dark ? "#2D3139" : "#E5E7EB" }}>
            <Edit2 size={13} color="#9CA3AF" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-5">
        <ProgressRing spent={item.spent} total={item.total} dark={dark} />
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#9CA3AF", fontFamily: P }}>Left</span>
          <div className="flex items-baseline gap-0.5 flex-wrap">
            <span className="text-[26px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>
              ${leftFmt.whole}<span className="text-[16px] font-semibold">.{leftFmt.dec}</span>
            </span>
            <span className="text-[14px] font-bold ml-1" style={{ color: "#9CA3AF", fontFamily: P }}>
              /${totalFmt.whole}<span className="text-[12px]">.00</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full w-fit"
            style={{ background: onTrack ? "#DCFCE7" : "#FEF3C7", color: onTrack ? "#16A34A" : "#D97706" }}>
            {onTrack ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
            <span className="text-[12px] font-bold" style={{ fontFamily: P }}>{item.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Budget Page ──────────────────────────────────────────────────────────── */
export default function Budget() {
  const { darkMode: dark, role } = useApp();

  // ── state ──
  const [selectedMonth, setSelectedMonth] = useState("Jul");
  const [sortBy, setSortBy] = useState("Default");
  const [statusFilter, setStatusFilter] = useState("All");
  const [amtFilter, setAmtFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<null | number>(null);

  // local copy of budget items so edits + adds work
  const [items, setItems] = useState(budgetItemsData);

  // ── derived: filter + sort ──
  const filtered = useMemo(() => {
    let list = items.filter((i) => i.month === selectedMonth);

    if (statusFilter !== "All")
      list = list.filter((i) => i.status === statusFilter);

    if (amtFilter !== "All") {
      list = list.filter((i) => {
        const spent = i.spent;
        if (amtFilter === "Under $200") return spent < 200;
        if (amtFilter === "$200–$500") return spent >= 200 && spent < 500;
        if (amtFilter === "$500–$1,000") return spent >= 500 && spent < 1000;
        if (amtFilter === "Over $1,000") return spent >= 1000;
        return true;
      });
    }

    if (sortBy === "Name A–Z") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "Name Z–A") list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === "Spent: High–Low") list = [...list].sort((a, b) => b.spent - a.spent);
    if (sortBy === "Spent: Low–High") list = [...list].sort((a, b) => a.spent - b.spent);
    if (sortBy === "Remaining: High–Low") list = [...list].sort((a, b) => (b.total - b.spent) - (a.total - a.spent));

    return list;
  }, [items, selectedMonth, sortBy, statusFilter, amtFilter]);

  const monthBudget = detailedMonthlyBudget[selectedMonth] ?? detailedMonthlyBudget["Jul"];

  const isFiltered = statusFilter !== "All" || amtFilter !== "All" || sortBy !== "Default";

  const handleReset = () => {
    setStatusFilter("All");
    setAmtFilter("All");
    setSortBy("Default");
  };

  const handleAdd = ({ name, total }: { name: string; total: number }) => {
    setItems((prev) => [
      ...prev,
      { name, spent: 0, total, status: "on track", month: selectedMonth },
    ]);
  };

  const handleEdit = (idx: number, updated: { name: string; total: number }) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const newStatus = item.spent / updated.total >= 0.85 ? "need attention" : "on track";
        return { ...item, name: updated.name, total: updated.total, status: newStatus };
      })
    );
  };

  const card = {
    background: dark ? "#1A1D23" : "white",
    border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`,
    boxShadow: dark ? "none" : "0 1px 4px rgba(0,0,0,0.04)",
  };

  return (
    <div className="flex flex-col gap-5 w-full pb-10 pt-2">

      {/* Modals */}
      {showAdd && (
        <AddBudgetModal onClose={() => setShowAdd(false)} onAdd={handleAdd} dark={dark} />
      )}
      {editItem !== null && (
        <EditBudgetModal
          item={items[editItem]}
          onClose={() => setEditItem(null)}
          onSave={(updated) => handleEdit(editItem, updated)}
          dark={dark}
        />
      )}

      {/* ── Header ── */}
      <div>
        <h1 className="text-[28px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>Budget</h1>
        <p className="text-sm font-medium mt-0.5" style={{ color: "#9CA3AF", fontFamily: P }}>Create and track your budgets</p>
      </div>

      {/* ── Controls row 1 ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">

          {/* Month picker */}
          <MonthDropdown value={selectedMonth} onChange={setSelectedMonth} dark={dark} />

          {/* Sort toggle icon */}
          <button
            onClick={() => setSortBy(sortBy === "Default" ? "Spent: High–Low" : "Default")}
            className="w-9 h-9 rounded-full flex items-center justify-center border transition hover:opacity-80"
            style={{ background: sortBy !== "Default" ? "#EDE9FE" : dark ? "#1A1D23" : "white", borderColor: dark ? "#2D3139" : "#E5E7EB" }}
            title="Toggle sort"
          >
            <ArrowUpDown size={15} color={sortBy !== "Default" ? "#6345ED" : dark ? "#9CA3AF" : "#6B7280"} />
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            {(() => {
              const [open, setOpen] = useState(false);
              const ref = useRef<HTMLDivElement>(null);
              useEffect(() => {
                const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
                document.addEventListener("mousedown", h);
                return () => document.removeEventListener("mousedown", h);
              }, []);
              return (
                <div ref={ref}>
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold border transition hover:opacity-80"
                    style={{ background: sortBy !== "Default" ? "#EDE9FE" : dark ? "#1A1D23" : "white", borderColor: sortBy !== "Default" ? "#C4B5FD" : dark ? "#2D3139" : "#E5E7EB", color: sortBy !== "Default" ? "#6345ED" : dark ? "#D1D5DB" : "#374151", fontFamily: P }}
                  >
                    Sort by: {sortBy} <ChevronDown size={13} />
                  </button>
                  {open && (
                    <div className="absolute top-full left-0 mt-1 z-50 rounded-2xl shadow-xl py-1 min-w-[200px]"
                      style={{ background: dark ? "#22262F" : "white", border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}` }}>
                      {SORTS.map((opt) => (
                        <button key={opt} onClick={() => { setSortBy(opt); setOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-[12px] font-semibold transition hover:opacity-70"
                          style={{ background: sortBy === opt ? (dark ? "#2D3139" : "#F3F0FF") : "transparent", color: sortBy === opt ? "#6345ED" : dark ? "#D1D5DB" : "#374151", fontFamily: P }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Filter icon */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center border transition hover:opacity-80"
            style={{ background: dark ? "#1A1D23" : "white", borderColor: dark ? "#2D3139" : "#E5E7EB" }}
          >
            <MoreHorizontal size={15} color={dark ? "#9CA3AF" : "#6B7280"} />
          </button>
        </div>

        {/* Add new budget */}
        {role === "admin" && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold text-white transition hover:opacity-90"
            style={{ background: "#6345ED", fontFamily: P, boxShadow: "0 4px 14px rgba(99,69,237,0.35)" }}
          >
            <Plus size={15} strokeWidth={2.5} /> Add new budget
          </button>
        )}
      </div>

      {/* ── Controls row 2 ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <Dropdown label={statusFilter === "All" ? "Status" : statusFilter} options={STATUSES} value={statusFilter} onChange={setStatusFilter} dark={dark} />
        <Dropdown label={amtFilter === "All" ? "Amount" : amtFilter} options={AMT_RANGES} value={amtFilter} onChange={setAmtFilter} dark={dark} />
        {isFiltered && (
          <button onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold transition hover:text-[#6345ED]"
            style={{ color: "#9CA3AF", fontFamily: P }}>
            <RotateCcw size={13} /> Reset all
          </button>
        )}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT: budget cards */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "#9CA3AF", fontFamily: P }}>
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>

          {filtered.length === 0 ? (
            <div className="rounded-[24px] p-12 flex flex-col items-center justify-center gap-3"
              style={{ background: dark ? "#1A1D23" : "white", border: `2px dashed ${dark ? "#2D3139" : "#E5E7EB"}` }}>
              <span className="text-3xl">📭</span>
              <p className="text-sm font-bold" style={{ color: dark ? "#6B7280" : "#9CA3AF", fontFamily: P }}>No budgets match your filters</p>
              <button onClick={handleReset}
                className="text-xs font-bold px-4 py-2 rounded-xl transition hover:opacity-80"
                style={{ background: "#EDE9FE", color: "#6345ED", fontFamily: P }}>
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((item, i) => {
                const globalIdx = items.findIndex(
                  (it) => it.name === item.name && it.month === item.month
                );
                return (
                  <BudgetCard
                    key={i}
                    item={item}
                    dark={dark}
                    onEdit={role === "admin" ? () => setEditItem(globalIdx) : undefined}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-5">

          {/* Monthly budget */}
          <div className="rounded-[24px] p-6" style={card}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[16px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>Monthly budget</h3>
              <button><MoreHorizontal size={18} color="#9CA3AF" /></button>
            </div>
            <p className="text-[32px] font-bold mt-2 leading-none" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>
              ${monthBudget.total.toLocaleString()}<span className="text-[22px] font-bold" style={{ color: "#9CA3AF" }}>.00</span>
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <CheckCircle2 size={15} color="#22C55E" />
              <span className="text-[13px] font-bold" style={{ color: "#22C55E", fontFamily: P }}>on track</span>
            </div>
            <SemiCircle spent={monthBudget.spent} total={monthBudget.total} remaining={monthBudget.remaining} dark={dark} />
          </div>

          {/* Most expenses */}
          <div className="rounded-[24px] p-6" style={card}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>Most expenses</h3>
              <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold"
                style={{ borderColor: dark ? "#2D3139" : "#E5E7EB", color: "#9CA3AF", fontFamily: P }}>
                This month <ChevronDown size={11} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {mostExpensesData.map((item, i) => {
                const Icon = IconMap[item.icon] ?? ArrowLeftRight;
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: dark ? "#22262F" : "#EDE9FE" }}>
                        <Icon size={16} color="#6345ED" />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold leading-none" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>
                          ${item.amount.toLocaleString()}
                        </p>
                        <p className="text-[12px] font-semibold mt-1" style={{ color: "#9CA3AF", fontFamily: P }}>{item.name}</p>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold px-3 py-1 rounded-lg"
                      style={{ background: item.positive ? "#FEE2E2" : "#DCFCE7", color: item.positive ? "#EF4444" : "#16A34A", fontFamily: P }}>
                      {item.positive ? "↑" : "↓"} {item.change}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}