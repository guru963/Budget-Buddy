import {
  Search, Plus, Download, RotateCcw, ChevronDown,
  ChevronUp, ChevronsUpDown, MoreHorizontal, X,
  Calendar, CheckSquare, Square, MinusSquare,
  Filter,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { transactionsData } from "../data/mockData";

/* ── constants ────────────────────────────────────────────────────────────── */
const P = "Poppins, sans-serif";

type Tx = typeof transactionsData[0];
type SortKey = "date" | "amount" | "status";
type SortDir = "asc" | "desc" | null;

const TYPES = ["All", "income", "expense"];
const CATEGORIES = ["All", ...Array.from(new Set(transactionsData.map((t) => t.category))).sort()];
const METHODS = ["All", ...Array.from(new Set(transactionsData.map((t) => t.method))).sort()];
const STATUSES = ["All", "Successful", "Pending", "Failed"];
const CURRENCIES = ["All", "USD", "INR"];

export const savingGoals = [
  { label: "Laptop", target: 8000, saved: 4800, color: "#5439D4" },
  { label: "Trip to Goa", target: 1800, saved: 756, color: "#7B5EF5" },
  { label: "Emergency Fund", target: 5000, saved: 1500, color: "#4C42A5" },
];

const AMT_RANGES = [
  { label: "All", test: () => true },
  { label: "Under $100", test: (n: number) => Math.abs(n) < 100 },
  { label: "$100–$500", test: (n: number) => Math.abs(n) >= 100 && Math.abs(n) < 500 },
  { label: "$500–$1,000", test: (n: number) => Math.abs(n) >= 500 && Math.abs(n) < 1000 },
  { label: "Over $1,000", test: (n: number) => Math.abs(n) >= 1000 },
];

// Purple-themed color palette for category avatars
const PURPLE_SHADES = [
  "#8B5CF6", // violet-500
  "#7C3AED", // violet-600
  "#6D28D9", // violet-700
  "#5B21B6", // violet-800
  "#A78BFA", // violet-400
  "#C4B5FD", // violet-300
  "#9F67FF", // custom purple
  "#B794F4", // custom lighter purple
  "#805AD5", // custom deep purple
  "#9F7AEA", // custom medium purple
];

/* ── helpers ──────────────────────────────────────────────────────────────── */
const fmtAmt = (n: number) => `${n > 0 ? "+" : "-"} $${Math.abs(n).toLocaleString("en-US")}`;

function categoryInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

// Get consistent purple shade based on category name
function getPurpleColor(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = ((hash << 5) - hash) + category.charCodeAt(i);
    hash |= 0;
  }
  return PURPLE_SHADES[Math.abs(hash) % PURPLE_SHADES.length];
}

/* ── Dropdown ─────────────────────────────────────────────────────────────── */
function FilterChip({
  label, options, value, onChange, dark, active,
}: {
  label: string; options: string[]; value: string;
  onChange: (v: string) => void; dark: boolean; active?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold border transition-all duration-200 hover:shadow-sm"
        style={{
          background: active ? "#EDE9FE" : dark ? "#1A1D23" : "white",
          borderColor: active ? "#C4B5FD" : dark ? "#2D3139" : "#E5E7EB",
          color: active ? "#6345ED" : dark ? "#D1D5DB" : "#374151",
          fontFamily: P,
        }}
      >
        {active ? value : label} <ChevronDown size={12} />
        {active && (
          <span
            onClick={(e) => { e.stopPropagation(); onChange("All"); }}
            className="ml-0.5 hover:opacity-60"
          >
            <X size={11} />
          </span>
        )}
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50 rounded-2xl shadow-xl py-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
          style={{
            background: dark ? "#22262F" : "white",
            border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`,
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-[12px] font-semibold transition-all duration-150 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              style={{
                background: value === opt ? (dark ? "#2D3139" : "#F3F0FF") : "transparent",
                color: value === opt ? "#6345ED" : dark ? "#D1D5DB" : "#374151",
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

/* ── Type chip ──────────────────────────────────────────────────────── */
function TypeChip({
  value, onChange, dark,
}: { value: string; onChange: (v: string) => void; dark: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const active = value !== "All";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold border transition-all duration-200 hover:shadow-sm"
        style={{
          background: active ? "#EDE9FE" : dark ? "#1A1D23" : "white",
          borderColor: active ? "#C4B5FD" : dark ? "#2D3139" : "#E5E7EB",
          color: active ? "#6345ED" : dark ? "#D1D5DB" : "#374151",
          fontFamily: P,
        }}
      >
        {active
          ? value.charAt(0).toUpperCase() + value.slice(1)
          : "Type"}
        {active ? (
          <span onClick={(e) => { e.stopPropagation(); onChange("All"); }} className="ml-0.5 hover:opacity-60">
            <X size={11} />
          </span>
        ) : (
          <ChevronDown size={12} />
        )}
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50 rounded-2xl shadow-xl py-1 min-w-[130px] animate-in fade-in zoom-in-95 duration-100"
          style={{ background: dark ? "#22262F" : "white", border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}` }}
        >
          {TYPES.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-[12px] font-semibold transition-all duration-150 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              style={{
                background: value === opt ? (dark ? "#2D3139" : "#F3F0FF") : "transparent",
                color: value === opt ? "#6345ED" : dark ? "#D1D5DB" : "#374151",
                fontFamily: P,
              }}
            >
              {opt === "All" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Add Transaction Modal ────────────────────────────────────────────────── */
function AddTransactionModal({ onClose, onAdd, dark, initialData }: {
  onClose: () => void;
  onAdd: (tx: Tx) => void;
  dark: boolean;
  initialData?: Tx;
}) {
  const [form, setForm] = useState({
    date: initialData?.date || "",
    name: initialData?.name || "",
    amount: initialData ? Math.abs(initialData.amount).toString() : "",
    type: initialData?.type || "income",
    method: initialData?.method || "VISA **3254",
    category: initialData?.category || "Salary",
    status: initialData?.status || "Successful",
    currency: initialData?.currency || "USD",
  });
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.date.trim()) { setErr("Date is required."); return; }
    if (!form.name.trim()) { setErr("Payment name is required."); return; }
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) { setErr("Enter a valid amount."); return; }
    const amt = form.type === "expense" ? -Math.abs(+form.amount) : Math.abs(+form.amount);
    onAdd({
      id: initialData?.id || Date.now(), date: form.date, amount: amt, name: form.name,
      method: form.method, category: form.category,
      status: form.status, type: form.type, currency: form.currency,
    });
    onClose();
  };

  const inputCls = {
    background: dark ? "#22262F" : "#F8F9FC",
    border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`,
    color: dark ? "#F3F4F6" : "#111827",
    borderRadius: 10, padding: "9px 13px",
    fontFamily: P, fontSize: 12, outline: "none", width: "100%",
    transition: "all 0.2s ease",
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[10px] font-bold uppercase tracking-widest mb-1 block" style={{ color: "#9CA3AF", fontFamily: P }}>
      {children}
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        style={{ background: dark ? "#1A1D23" : "white", border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}` }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>Add Transaction</h2>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF", fontFamily: P }}>Record a new transaction</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: dark ? "#2D3139" : "#E5E7EB" }}>
            <X size={14} color={dark ? "#9CA3AF" : "#6B7280"} />
          </button>
        </div>

        {/* Type toggle */}
        <div className="flex rounded-xl p-1 mb-4 gap-1" style={{ background: dark ? "#22262F" : "#F3F4F6" }}>
          {["income", "expense"].map((t) => (
            <button key={t} onClick={() => set("type", t)}
              className="flex-1 py-2 rounded-lg text-[12px] font-bold transition-all duration-200"
              style={{
                background: form.type === t ? (t === "income" ? "#22C55E" : "#EF4444") : "transparent",
                color: form.type === t ? "white" : dark ? "#9CA3AF" : "#6B7280",
                fontFamily: P,
              }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label>Date & Time</Label>
            <input style={inputCls} placeholder="e.g. 01 Jun 10:00" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Payment Name</Label>
            <input style={inputCls} placeholder="e.g. Freelance project" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <Label>Amount ($)</Label>
            <input style={inputCls} type="number" placeholder="0.00" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
          </div>
          <div>
            <Label>Currency</Label>
            <select style={inputCls} value={form.currency} onChange={(e) => set("currency", e.target.value)}>
              {["USD", "INR"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label>Category</Label>
            <select style={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label>Method</Label>
            <select style={inputCls} value={form.method} onChange={(e) => set("method", e.target.value)}>
              {METHODS.filter((m) => m !== "All").map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <Label>Status</Label>
            <select style={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
              {["Successful", "Pending", "Failed"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {err && <p className="text-xs font-semibold mt-3" style={{ color: "#EF4444", fontFamily: P }}>{err}</p>}

        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold border transition-all duration-200 hover:opacity-80"
            style={{ borderColor: dark ? "#2D3139" : "#E5E7EB", color: dark ? "#D1D5DB" : "#374151", background: dark ? "#22262F" : "#F8F9FC", fontFamily: P }}>
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
            style={{ background: "#6345ED", fontFamily: P, boxShadow: "0 4px 14px rgba(99,69,237,0.3)" }}>
            {initialData ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Actions Menu ────────────────────────────────────────────────────────── */
function TransactionActions({ tx, onEdit, onDelete, dark }: {
  tx: Tx; onEdit: (t: Tx) => void; onDelete: (id: number) => void; dark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="opacity-40 hover:opacity-100 transition-all duration-200 hover:scale-110 p-1"
      >
        <MoreHorizontal size={16} color={dark ? "#9CA3AF" : "#6B7280"} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-60 py-1.5 rounded-[16px] shadow-2xl border min-w-[120px] animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ background: dark ? "#1A1D23" : "white", borderColor: dark ? "#2D3139" : "#E5E7EB" }}
        >
          <button
            onClick={() => { onEdit(tx); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-[12px] font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
            style={{ color: "#6345ED", fontFamily: P }}
          >
            Edit
          </button>
          <button
            onClick={() => { onDelete(tx.id); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-[12px] font-bold transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
            style={{ color: "#EF4444", fontFamily: P }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Sort icon ────────────────────────────────────────────────────────────── */
function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc") return <ChevronUp size={12} color="#6345ED" />;
  if (dir === "desc") return <ChevronDown size={12} color="#6345ED" />;
  return <ChevronsUpDown size={12} color="#9CA3AF" />;
}

/* ── Transactions Page ────────────────────────────────────────────────────── */
export default function Transactions() {
  const { darkMode: dark, role } = useApp();

  // ── local data (supports add) ──
  const [data, setData] = useState<Tx[]>(transactionsData);
  const [showAdd, setShowAdd] = useState(false);
  const [editingTx, setEditingTx] = useState<Tx | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // ── filters ──
  const [search, setSearch] = useState("");
  const [typeF, setTypeF] = useState("All");
  const [amtF, setAmtF] = useState("All");
  const [curF, setCurF] = useState("All");
  const [methodF, setMethodF] = useState("All");
  const [catF, setCatF] = useState("All");
  const [statusF, setStatusF] = useState("All");

  // ── sort ──
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // ── selection ──
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // ── date range label (cosmetic) ──
  const dateLabel = "01 Jun - 01 Jul 2024";

  // ── derived ──
  const amtRange = AMT_RANGES.find((r) => r.label === amtF) ?? AMT_RANGES[0];

  const filtered = useMemo(() => {
    let list = [...data];
    if (typeF !== "All") list = list.filter((t) => t.type === typeF);
    if (curF !== "All") list = list.filter((t) => t.currency === curF);
    if (methodF !== "All") list = list.filter((t) => t.method === methodF);
    if (catF !== "All") list = list.filter((t) => t.category === catF);
    if (statusF !== "All") list = list.filter((t) => t.status === statusF);
    if (amtF !== "All") list = list.filter((t) => amtRange.test(t.amount));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.method.toLowerCase().includes(q)
      );
    }
    // sort
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") cmp = a.id - b.id;
      if (sortKey === "amount") cmp = Math.abs(a.amount) - Math.abs(b.amount);
      if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "desc" ? -cmp : cmp;
    });
    return list;
  }, [data, typeF, curF, methodF, catF, statusF, amtF, search, sortKey, sortDir]);

  const isFiltered = typeF !== "All" || amtF !== "All" || curF !== "All" ||
    methodF !== "All" || catF !== "All" || statusF !== "All";

  const handleReset = () => {
    setTypeF("All"); setAmtF("All"); setCurF("All");
    setMethodF("All"); setCatF("All"); setStatusF("All");
    setSearch("");
  };

  // sort toggle
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
      if (sortDir === null) setSortKey("date");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // selection
  const allSelected = filtered.length > 0 && filtered.every((t) => selected.has(t.id));
  const someSelected = filtered.some((t) => selected.has(t.id)) && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      setSelected((s) => { const n = new Set(s); filtered.forEach((t) => n.delete(t.id)); return n; });
    } else {
      setSelected((s) => { const n = new Set(s); filtered.forEach((t) => n.add(t.id)); return n; });
    }
  };

  const toggleOne = (id: number) => {
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const handleAddOrEdit = (tx: Tx) => {
    if (editingTx) {
      setData((p) => p.map((item) => (item.id === tx.id ? tx : item)));
      setToast("Transaction updated successfully!");
    } else {
      setData((p) => [tx, ...p]);
      setToast("Transaction created successfully!");
    }
    setEditingTx(null);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (id: number) => {
    setData((p) => p.filter((t) => t.id !== id));
    setSelected((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
    setToast("Transaction deleted successfully!");
    setTimeout(() => setToast(null), 3000);
  };

  const exportCSV = () => {
    const rows = [
      ["Date", "Amount", "Payment Name", "Method", "Category", "Status", "Type", "Currency"],
      ...filtered.map((t) => [t.date, t.amount, t.name, t.method, t.category, t.status, t.type, t.currency]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const card = {
    background: dark ? "#1A1D23" : "white",
    border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`,
    boxShadow: dark ? "none" : "0 4px 20px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.05)",
  };

  const colHead = (label: string, key?: SortKey) => (
    <th
      className="text-left py-3 px-2 select-none group"
      onClick={() => key && handleSort(key)}
      style={{ cursor: key ? "pointer" : "default" }}
    >
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#6345ED", fontFamily: P }}>
          {label}
        </span>
        {key && (
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <SortIcon dir={sortKey === key ? sortDir : null} />
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="flex flex-col gap-5 w-full pb-10 pt-2">

      {/* Modal */}
      {(showAdd || editingTx) && (
        <AddTransactionModal
          onClose={() => { setShowAdd(false); setEditingTx(null); }}
          onAdd={handleAddOrEdit}
          dark={dark}
          initialData={editingTx || undefined}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-100 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-purple-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-sm font-bold" style={{ fontFamily: P }}>{toast}</span>
            <button onClick={() => setToast(null)} className="hover:opacity-70">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[28px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>
            Transactions
          </h1>
          <p className="text-sm font-medium mt-0.5" style={{ color: "#9CA3AF", fontFamily: P }}>
            Overview of your activities
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold border transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800"
            style={{ background: dark ? "#1A1D23" : "white", borderColor: dark ? "#2D3139" : "#E5E7EB", color: dark ? "#D1D5DB" : "#374151", fontFamily: P }}
          >
            <Download size={15} /> Export CSV
          </button>

          {/* Add new — admin only */}
          {role === "admin" && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold text-white transition-all duration-200 hover:opacity-90 hover:shadow-xl transform hover:-translate-y-0.5"
              style={{ background: "#6345ED", fontFamily: P, boxShadow: "0 4px 14px rgba(99,69,237,0.35)" }}
            >
              <Plus size={15} strokeWidth={2.5} /> Add new
            </button>
          )}
        </div>
      </div>

      {/* ── Controls bar ── */}
      <div className="rounded-[24px] p-5 flex flex-col gap-4 transition-all duration-200" style={card}>

        {/* Row 1: date + search + filter icon */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date range */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-[12px] font-bold transition-all duration-200 hover:shadow-sm"
            style={{ background: dark ? "#22262F" : "#F8F9FC", borderColor: dark ? "#2D3139" : "#E5E7EB", color: dark ? "#D1D5DB" : "#374151", fontFamily: P }}
          >
            <Calendar size={14} color="#6345ED" />
            {dateLabel}
          </div>

          {/* Search */}
          <div
            className="flex items-center gap-2 px-3.5 py-2 rounded-full border flex-1 min-w-[180px] transition-all duration-200 focus-within:border-purple-300 focus-within:shadow-sm"
            style={{ background: dark ? "#22262F" : "#F8F9FC", borderColor: dark ? "#2D3139" : "#E5E7EB" }}
          >
            <Search size={13} color="#9CA3AF" />
            <input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-[12px] font-medium w-full placeholder:text-gray-400"
              style={{ color: dark ? "#D1D5DB" : "#374151", fontFamily: P }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="transition-opacity hover:opacity-70"><X size={12} color="#9CA3AF" /></button>
            )}
          </div>

          {/* Filter icon */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm"
            style={{ background: dark ? "#22262F" : "#F8F9FC", borderColor: dark ? "#2D3139" : "#E5E7EB" }}
          >
            <Filter size={14} color="#6B7280" />
          </button>
        </div>

        {/* Row 2: filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <TypeChip value={typeF} onChange={setTypeF} dark={dark} />
          <FilterChip label="Amount" options={AMT_RANGES.map((r) => r.label)} value={amtF} onChange={setAmtF} dark={dark} active={amtF !== "All"} />
          <FilterChip label="Currency" options={CURRENCIES} value={curF} onChange={setCurF} dark={dark} active={curF !== "All"} />
          <FilterChip label="Method" options={METHODS} value={methodF} onChange={setMethodF} dark={dark} active={methodF !== "All"} />
          <FilterChip label="Category" options={CATEGORIES} value={catF} onChange={setCatF} dark={dark} active={catF !== "All"} />
          <FilterChip label="Status" options={STATUSES} value={statusF} onChange={setStatusF} dark={dark} active={statusF !== "All"} />

          {(isFiltered || search) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold transition-all duration-200 hover:text-[#6345ED] hover:scale-105"
              style={{ color: "#9CA3AF", fontFamily: P }}
            >
              <RotateCcw size={12} /> Reset all
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-[24px] overflow-hidden transition-all duration-200" style={card}>

        {/* item count */}
        <div className="px-6 pt-5 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#9CA3AF", fontFamily: P }}>
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>
          {selected.size > 0 && (
            <span className="ml-3 text-[11px] font-bold animate-in fade-in slide-in-from-left-2 duration-200" style={{ color: "#6345ED", fontFamily: P }}>
              ({selected.size} selected)
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${dark ? "#2D3139" : "#F3F4F6"}` }}>
                <th className="py-3 pl-6 pr-2 w-10">
                  <button onClick={toggleAll} className="transition-all duration-200 hover:scale-105">
                    {allSelected
                      ? <CheckSquare size={16} color="#6345ED" />
                      : someSelected
                        ? <MinusSquare size={16} color="#6345ED" />
                        : <Square size={16} color="#D1D5DB" />}
                  </button>
                </th>
                {colHead("Date", "date")}
                {colHead("Amount", "amount")}
                <th className="text-left py-3 px-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#6345ED", fontFamily: P }}>
                    Payment Name
                  </span>
                </th>
                <th className="text-left py-3 px-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#6345ED", fontFamily: P }}>
                    Method
                  </span>
                </th>
                <th className="text-left py-3 px-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#6345ED", fontFamily: P }}>
                    Category
                  </span>
                </th>
                {colHead("Status", "status")}
                <th className="py-3 px-4 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <span className="text-3xl animate-bounce">📭</span>
                      <p className="text-sm font-bold" style={{ color: dark ? "#6B7280" : "#9CA3AF", fontFamily: P }}>
                        No transactions found
                      </p>
                      <button onClick={handleReset}
                        className="text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105"
                        style={{ background: "#EDE9FE", color: "#6345ED", fontFamily: P }}>
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((tx, idx) => {
                  const isSel = selected.has(tx.id);
                  const isIncome = tx.amount > 0;
                  const color = getPurpleColor(tx.category);

                  return (
                    <tr
                      key={tx.id}
                      className="group transition-all duration-200 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 cursor-pointer"
                      style={{
                        background: isSel
                          ? dark ? "rgba(99,69,237,0.08)" : "#FAF9FF"
                          : "transparent",
                        borderBottom: idx < filtered.length - 1
                          ? `1px solid ${dark ? "#2D3139" : "#F9F8FF"}`
                          : "none",
                      }}
                      onClick={() => toggleOne(tx.id)}
                    >
                      {/* checkbox */}
                      <td className="pl-6 pr-2 py-3.5">
                        <button className="transition-all duration-200 hover:scale-105">
                          {isSel
                            ? <CheckSquare size={16} color="#6345ED" />
                            : <Square size={16} color="#D1D5DB" />}
                        </button>
                      </td>

                      {/* date */}
                      <td className="py-3.5 px-2">
                        <span className="text-[12px] font-semibold" style={{ color: dark ? "#9CA3AF" : "#6B7280", fontFamily: P }}>
                          {tx.date}
                        </span>
                      </td>

                      {/* amount */}
                      <td className="py-3.5 px-2">
                        <span className="text-[13px] font-bold transition-all duration-200 group-hover:scale-105 inline-block" style={{ color: isIncome ? "#22C55E" : "#EF4444", fontFamily: P }}>
                          {fmtAmt(tx.amount)}
                        </span>
                      </td>

                      {/* name with avatar */}
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-[9px] font-bold text-white transition-all duration-200 group-hover:scale-110 group-hover:shadow-md"
                            style={{ background: color }}
                          >
                            {categoryInitials(tx.name)}
                          </div>
                          <span className="text-[12px] font-semibold truncate max-w-[160px] transition-colors duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400" style={{ color: dark ? "#D1D5DB" : "#111827", fontFamily: P }}>
                            {tx.name}
                          </span>
                        </div>
                      </td>

                      {/* method */}
                      <td className="py-3.5 px-2">
                        <span className="text-[12px] font-semibold" style={{ color: dark ? "#9CA3AF" : "#6B7280", fontFamily: P }}>
                          {tx.method}
                        </span>
                      </td>

                      {/* category */}
                      <td className="py-3.5 px-2">
                        <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" style={{ fontFamily: P }}>
                          {tx.category}
                        </span>
                      </td>

                      {/* status */}
                      <td className="py-3.5 px-2">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all duration-200 group-hover:shadow-sm"
                          style={{
                            background:
                              tx.status === "Successful" ? "#DCFCE7" :
                                tx.status === "Pending" ? "#FEF3C7" : "#FEE2E2",
                            color:
                              tx.status === "Successful" ? "#16A34A" :
                                tx.status === "Pending" ? "#D97706" : "#DC2626",
                            fontFamily: P,
                          }}
                        >
                          {tx.status}
                        </span>
                      </td>

                      {role === "admin" && (
                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <TransactionActions
                            tx={tx}
                            onEdit={setEditingTx}
                            onDelete={handleDelete}
                            dark={dark}
                          />
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}