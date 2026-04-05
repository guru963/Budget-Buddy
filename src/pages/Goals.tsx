import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Plus, Laptop, Plane, Shield, Smartphone,
  TrendingUp, TrendingDown, Target, Trash2,
  X, CheckCircle2, AlertCircle, Info, BarChart3,
  Wallet, Sparkles, Zap, Award,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip,
  ResponsiveContainer, Cell, BarChart, Bar,
} from "recharts";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  DESIGN TOKENS — ALL SHADES OF PRIMARY PURPLE                              */
/* ─────────────────────────────────────────────────────────────────────────── */
const PRIMARY = "#5439D4";
const PRIMARY_L = "#7B5EF5";
const PRIMARY_D = "#3B2A8C";
const PRIMARY_GLOW = "#5439D440";
const PRIMARY_ULTRA_LIGHT = "#EDE9FF";
const PRIMARY_MUTED = "#9B87F5";
const SUCCESS = "#5439D4";       // use primary for success states       // lighter purple for "warning" tone
const INFO = "#8B77E5";          // soft purple for info
const DANGER = "#C084FC";        // muted purple-red for delete (still purple-ish)
const P = "Poppins, sans-serif";

const fmtUSD = (n: number) =>
  "$" + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.abs(n));

/* ─────────────────────────────────────────────────────────────────────────── */
/*  DATA                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
const GOALS_DATA = [
  {
    id: 1,
    label: "MacBook Pro",
    icon: Laptop,
    target: 2400,
    saved: 600,
    color: PRIMARY,
    accent: PRIMARY_ULTRA_LIGHT,
    months: "4 months left",
    status: "on track",
    tip: "Add $75/week to finish by November.",
  },
  {
    id: 2,
    label: "Trip to Bali",
    icon: Plane,
    target: 1800,
    saved: 756,
    color: PRIMARY_L,
    accent: PRIMARY_ULTRA_LIGHT,
    months: "2 months left",
    status: "behind",
    tip: "You're $200 behind pace. Boost by cutting dining.",
  },
  {
    id: 3,
    label: "Emergency Fund",
    icon: Shield,
    target: 5000,
    saved: 1500,
    color: PRIMARY_D,
    accent: PRIMARY_ULTRA_LIGHT,
    months: "12 months left",
    status: "on track",
    tip: "Consistent savings! Great safety net progress.",
  },
];

const MONTHLY = [
  { month: "Jan", amount: 320 },
  { month: "Feb", amount: 210 },
  { month: "Mar", amount: 480 },
  { month: "Apr", amount: 290 },
  { month: "May", amount: 560 },
  { month: "Jun", amount: 410 },
];

const INSIGHTS = [
  {
    Icon: TrendingUp,
    title: "Consistent Saver",
    desc: "Emergency Fund funded for 4 consecutive months.",
  },
  {
    Icon: TrendingDown,
    title: "Savings Dipped",
    desc: "June contributions were 15% below your monthly average.",
  },
  {
    Icon: Target,
    title: "Boost Strategy",
    desc: "Add $50/mo to reach Bali trip goal 3 weeks earlier.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  ADD GOAL MODAL                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
function AddGoalModal({ onClose, dark, onAdd }: {
  onClose: () => void; dark: boolean;
  onAdd: (g: { label: string; target: number }) => void;
}) {
  const [label, setLabel] = useState("");
  const [target, setTarget] = useState("");
  const [err, setErr] = useState("");

  const inp: React.CSSProperties = {
    background: dark ? "#1A1D26" : "#F8F7FF",
    border: `1px solid ${dark ? "#2A2D3A" : PRIMARY_ULTRA_LIGHT}`,
    color: dark ? "#F3F4F6" : "#111827",
    borderRadius: 12, padding: "12px 14px",
    fontFamily: P, fontSize: 13, outline: "none", width: "100%",
  };

  const submit = () => {
    if (!label.trim()) { setErr("Goal name is required."); return; }
    if (!target || +target <= 0) { setErr("Enter a valid target amount."); return; }
    onAdd({ label: label.trim(), target: +target });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-[24px] p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200"
        style={{ background: dark ? "#12141A" : "white", border: `1px solid ${dark ? "#1F2230" : PRIMARY_ULTRA_LIGHT}`, fontFamily: P }}>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>New Savings Goal</h2>
            <p className="text-[13px] mt-1" style={{ color: "#9CA3AF" }}>Set a target to work toward</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: dark ? "#2A2D3A" : "#E5E7EB" }}>
            <X size={14} color="#9CA3AF" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "#9CA3AF" }}>
              Goal Name
            </label>
            <input style={inp} placeholder="e.g. New Laptop" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "#9CA3AF" }}>
              Target Amount (USD)
            </label>
            <input style={inp} type="number" placeholder="0.00" value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
          {err && <p className="text-[11px] font-medium" style={{ color: DANGER }}>{err}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-medium border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            style={{ borderColor: dark ? "#2A2D3A" : "#E5E7EB", color: dark ? "#D1D5DB" : "#374151", background: "transparent" }}>
            Cancel
          </button>
          <button onClick={submit}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
            style={{ background: PRIMARY, boxShadow: `0 4px 14px ${PRIMARY_GLOW}` }}>
            Create Goal
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  ADD MONEY MODAL                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */
function AddMoneyModal({ goal, onClose, dark, onSave }: {
  goal: typeof GOALS_DATA[0]; onClose: () => void; dark: boolean;
  onSave: (id: number, amount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);

  const inp: React.CSSProperties = {
    background: dark ? "#1A1D26" : "#F8F7FF",
    border: `1px solid ${dark ? "#2A2D3A" : PRIMARY_ULTRA_LIGHT}`,
    color: dark ? "#F3F4F6" : "#111827",
    borderRadius: 12, padding: "12px 14px",
    fontFamily: P, fontSize: 13, outline: "none", width: "100%",
  };

  const submit = () => {
    if (!amount || +amount <= 0) return;
    onSave(goal.id, +amount);
    setDone(true);
    setTimeout(onClose, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-[24px] p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200"
        style={{ background: dark ? "#12141A" : "white", border: `1px solid ${dark ? "#1F2230" : PRIMARY_ULTRA_LIGHT}`, fontFamily: P }}>

        {done ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `${PRIMARY}15` }}>
              <CheckCircle2 size={28} color={PRIMARY} />
            </div>
            <p className="text-[16px] font-semibold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>Funds Added!</p>
            <p className="text-[12px]" style={{ color: "#9CA3AF" }}>{fmtUSD(+amount)} added to {goal.label}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[20px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
                  Add to {goal.label}
                </h2>
                <p className="text-[13px] mt-1" style={{ color: "#9CA3AF" }}>
                  {fmtUSD(goal.saved)} of {fmtUSD(goal.target)} saved
                </p>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ borderColor: dark ? "#2A2D3A" : "#E5E7EB" }}>
                <X size={14} color="#9CA3AF" />
              </button>
            </div>

            <div className="mb-5">
              <label className="text-[11px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "#9CA3AF" }}>Amount (USD)</label>
              <input style={inp} type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {["25", "50", "100", "200"].map((a) => (
                <button key={a} onClick={() => setAmount(a)}
                  className="py-2 rounded-xl text-[12px] font-medium transition-all duration-200"
                  style={{
                    background: amount === a ? PRIMARY : dark ? "#1A1D26" : "#F8F7FF",
                    color: amount === a ? "white" : PRIMARY,
                    border: `1px solid ${amount === a ? PRIMARY : dark ? "#2A2D3A" : PRIMARY_ULTRA_LIGHT}`,
                  }}>
                  ${a}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                style={{ borderColor: dark ? "#2A2D3A" : "#E5E7EB", color: dark ? "#D1D5DB" : "#374151", background: "transparent" }}>
                Cancel
              </button>
              <button onClick={submit}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ background: goal.color, boxShadow: `0 4px 12px ${goal.color}40` }}>
                Add {amount ? fmtUSD(+amount) : "$0"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CIRCULAR PROGRESS SVG                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
function CircleProgress({ pct, color, size = 96 }: { pct: number; color: string; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-gray-200 dark:text-gray-800"
        strokeWidth={7}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  GOAL CARD                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */
function GoalCard({ goal, dark, role, onAddMoney, onDelete }: {
  goal: typeof GOALS_DATA[0];
  dark: boolean;
  role: string;
  onAddMoney: (g: typeof GOALS_DATA[0]) => void;
  onDelete: (id: number) => void;
}) {
  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const isDone = pct >= 100;
  const Icon = goal.icon;

  const StatusIcon = isDone ? CheckCircle2 : goal.status === "behind" ? AlertCircle : Info;
  const statusColor = isDone ? SUCCESS : goal.status === "behind" ? DANGER : PRIMARY;

  return (
    <div
      className="rounded-[24px] p-5 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{
        background: dark ? "#12141A" : "#FFFFFF",
        border: `1px solid ${dark ? "#1F2230" : PRIMARY_ULTRA_LIGHT}`,
        fontFamily: P,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
            style={{ background: dark ? `${goal.color}18` : `${goal.color}10` }}
          >
            <Icon size={20} color={goal.color} />
          </div>
          <div>
            <h3 className="text-[16px] font-bold leading-tight" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
              {goal.label}
            </h3>
            <p className="text-[12px] font-semibold mt-1" style={{ color: "#9CA3AF" }}>
              {isDone ? "Completed" : goal.months}
            </p>
          </div>
        </div>
        <span
          className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: isDone ? `${SUCCESS}15` : dark ? `${goal.color}15` : `${goal.color}10`,
            color: isDone ? SUCCESS : goal.color,
          }}
        >
          {pct}%
        </span>
      </div>

      {/* Progress Ring & Amounts */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative shrink-0">
          <CircleProgress pct={pct} color={isDone ? SUCCESS : goal.color} size={88} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-bold" style={{ color: isDone ? SUCCESS : goal.color }}>
              {pct}%
            </span>
            <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "#9CA3AF" }}>
              saved
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#9CA3AF" }}>Saved</p>
            <p className="text-[24px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
              {fmtUSD(goal.saved)}
            </p>
          </div>
          <div className="w-full h-px" style={{ background: dark ? "#1F2230" : PRIMARY_ULTRA_LIGHT }} />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#9CA3AF" }}>Target</p>
            <p className="text-[18px] font-bold" style={{ color: goal.color }}>{fmtUSD(goal.target)}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: dark ? "#1F2230" : PRIMARY_ULTRA_LIGHT }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: isDone ? SUCCESS : goal.color }}
        />
      </div>

      {/* Insight Tip */}
      <div
        className="rounded-xl p-3 mb-4"
        style={{
          background: dark ? "#1A1D26" : "#FAF9FF",
          borderLeft: `3px solid ${statusColor}`,
        }}
      >
        <div className="flex items-start gap-2">
          <StatusIcon size={14} color={statusColor} className="shrink-0 mt-0.5" />
          <p className="text-[12px] font-medium leading-relaxed" style={{ color: dark ? "#D1D5DB" : "#4B5563" }}>
            {goal.tip}
          </p>
        </div>
      </div>

      {/* Actions */}
      {isDone ? (
        <div
          className="py-2.5 rounded-xl text-center font-semibold text-[12px] flex items-center justify-center gap-2"
          style={{ background: `${SUCCESS}12`, color: SUCCESS }}
        >
          <CheckCircle2 size={14} /> Goal Achieved
        </div>
      ) : role === "admin" ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddMoney(goal)}
            className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: goal.color, boxShadow: `0 2px 8px ${goal.color}40` }}
          >
            Add Funds
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: dark ? "#2A1F30" : PRIMARY_ULTRA_LIGHT }}
          >
            <Trash2 size={14} color={DANGER} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-1 py-2">
          <span className="text-[12px] font-semibold" style={{ color: "#9CA3AF" }}>View only mode</span>
          <span className="text-[13px] font-bold" style={{ color: goal.color }}>
            {fmtUSD(goal.target - goal.saved)} left
          </span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MAIN GOALS PAGE                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function Goals() {
  const { darkMode: dark, role } = useApp();

  const [goals, setGoals] = useState(GOALS_DATA);
  const [showAdd, setShowAdd] = useState(false);
  const [addMoney, setAddMoney] = useState<typeof GOALS_DATA[0] | null>(null);

  const handleAddGoal = ({ label, target }: { label: string; target: number }) => {
    const icons = [Laptop, Plane, Shield, Smartphone, Target, Award];
    const colors = [PRIMARY, PRIMARY_L, PRIMARY_D, INFO, PRIMARY_MUTED, PRIMARY];
    const i = goals.length % icons.length;
    setGoals((p) => [...p, {
      id: Date.now(),
      label,
      icon: icons[i],
      target,
      saved: 0,
      color: colors[i],
      accent: PRIMARY_ULTRA_LIGHT,
      months: "New goal",
      status: "on track",
      tip: "Start contributing to reach your goal!",
    }]);
  };

  const handleAddMoney = (id: number, amount: number) => {
    setGoals((p) => p.map((g) => {
      if (g.id !== id) return g;
      const saved = Math.min(g.target, g.saved + amount);
      return { ...g, saved };
    }));
  };

  const handleDelete = (id: number) => setGoals((p) => p.filter((g) => g.id !== id));

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const overallPct = Math.round((totalSaved / totalTarget) * 100) || 0;
  const completed = goals.filter((g) => g.saved >= g.target).length;

  const cardStyle = {
    background: dark ? "#12141A" : "#FFFFFF",
    border: `1px solid ${dark ? "#1F2230" : PRIMARY_ULTRA_LIGHT}`,
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12 pt-2 max-w-[1400px] mx-auto px-4 md:px-6" style={{ fontFamily: P }}>

      {/* Modals */}
      {showAdd && <AddGoalModal onClose={() => setShowAdd(false)} dark={dark} onAdd={handleAddGoal} />}
      {addMoney && (
        <AddMoneyModal
          goal={addMoney}
          onClose={() => setAddMoney(null)}
          dark={dark}
          onSave={handleAddMoney}
        />
      )}

      {/* ━━━━━━━━ HEADER ━━━━━━━━ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-bold tracking-tight" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
            Savings Goals
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "#9CA3AF" }}>
            Track progress toward your financial targets
          </p>
        </div>
        {role === "admin" && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
            style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_L})`, boxShadow: `0 4px 14px ${PRIMARY_GLOW}` }}
          >
            <Plus size={14} strokeWidth={2} /> New Goal
          </button>
        )}
      </div>

      {/* ━━━━━━━━ STATS ROW ━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Saved — Smaller card (col-span-1) */}
        <div className="rounded-[20px] p-5 transition-all duration-200 hover:shadow-md col-span-1" style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: dark ? "#fff" : "#000" }}>Total Saved</p>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${PRIMARY}12` }}>
              <Wallet size={14} color={PRIMARY} />
            </div>
          </div>
          <p className="text-[30px] font-bold" style={{ color: dark ? "#fff" : "#000" }}>{fmtUSD(totalSaved)}</p>
        </div>

        {/* Total Target — Smaller card (col-span-1) */}
        <div className="rounded-[20px] p-5 transition-all duration-200 hover:shadow-md col-span-1" style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: dark ? "#fff" : "#000" }}>Total Target</p>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${PRIMARY_L}12` }}>
              <Target size={14} color={PRIMARY_L} />
            </div>
          </div>
          <p className="text-[30px] font-bold" style={{ color: dark ? "#fff" : "#000" }}>{fmtUSD(totalTarget)}</p>
        </div>

        {/* Overall Progress — Bigger card (col-span-1) */}
        <div className="rounded-[20px] p-5 transition-all duration-200 hover:shadow-md col-span-1" style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: dark ? "#fff" : "#000" }}>Overall Progress</p>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${SUCCESS}12` }}>
              <BarChart3 size={16} color={SUCCESS} />
            </div>
          </div>
          <p className="text-[32px] font-bold" style={{ color: dark ? "#fff" : "#000" }}>{overallPct}%</p>
        </div>

        {/* Goals Completed — Bigger card (col-span-1) */}
        <div className="rounded-[20px] p-5 transition-all duration-200 hover:shadow-md col-span-1" style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: dark ? "#fff" : "#000" }}>Completed</p>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${INFO}12` }}>
              <CheckCircle2 size={16} color={INFO} />
            </div>
          </div>
          <p className="text-[32px] font-bold" style={{ color: dark ? "#fff" : "#000" }}>{completed}/{goals.length}</p>
        </div>
      </div>


      {/* ━━━━━━━━ OVERALL PROGRESS ━━━━━━━━ */}
      <div className="rounded-[20px] p-6" style={cardStyle}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[18px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
              Combined Progress
            </h3>
            <p className="text-[13px] mt-1" style={{ color: "#9CA3AF" }}>
              {fmtUSD(totalSaved)} saved of {fmtUSD(totalTarget)} across all goals
            </p>
          </div>
          <span className="text-[15px] font-bold px-4 py-2 rounded-full" style={{ background: `${PRIMARY}12`, color: PRIMARY }}>
            {overallPct}% Complete
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full overflow-hidden flex gap-0.5" style={{ background: dark ? "#1F2230" : PRIMARY_ULTRA_LIGHT }}>
          {goals.map((g) => {
            const width = (g.saved / totalTarget) * 100;
            return width > 0 ? (
              <div
                key={g.id}
                className="h-full transition-all duration-700"
                style={{ width: `${width}%`, background: g.color }}
                title={`${g.label}: ${fmtUSD(g.saved)}`}
              />
            ) : null;
          })}
        </div>

        <div className="flex items-center gap-4 mt-3 flex-wrap">
          {goals.map((g) => (
            <div key={g.id} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: g.color }} />
              <span className="text-[11px] font-semibold" style={{ color: "#9CA3AF" }}>{g.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ━━━━━━━━ GOAL CARDS GRID ━━━━━━━━ */}
      {goals.length === 0 ? (
        <div className="rounded-[24px] p-12 flex flex-col items-center justify-center gap-4 text-center" style={{ ...cardStyle, border: `2px dashed ${dark ? "#1F2230" : PRIMARY_ULTRA_LIGHT}` }}>
          <div className="w-16 h-16 rounded-[20px] flex items-center justify-center" style={{ background: `${PRIMARY}12` }}>
            <Target size={28} color={PRIMARY} />
          </div>
          <p className="text-[16px] font-semibold" style={{ color: dark ? "#6B7280" : "#9CA3AF" }}>No savings goals yet</p>
          <p className="" style={{ color: dark ? "#4B5563" : "#D1D5DB" }}>Create your first goal to start saving toward what matters.</p>
          {role === "admin" && (
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold text-white" style={{ background: PRIMARY }}>
              <Plus size={13} /> Create Goal
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              dark={dark}
              role={role}
              onAddMoney={(goal) => setAddMoney(goal)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ━━━━━━━━ INSIGHTS & CHARTS ROW ━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Monthly Contributions */}
        <div className="rounded-[20px] p-6" style={cardStyle}>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h3 className="text-[18px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
                Monthly Contributions
              </h3>
              <p className="text-[13px] mt-1" style={{ color: "#9CA3AF" }}>
                Your savings history over 6 months
              </p>
            </div>
            <span className="text-[13px] font-bold px-4 py-2 rounded-full" style={{ background: `${PRIMARY}12`, color: PRIMARY }}>
              Avg $378/mo
            </span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 700, fontFamily: P, fill: dark ? "#6B7280" : "#9CA3AF" }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 700, fontFamily: P, fill: dark ? "#6B7280" : "#9CA3AF" }}
                tickFormatter={(v) => `$${v}`}
              />
              <RTooltip
                cursor={{ fill: dark ? "#1A1D26" : "#F8F7FF" }}
                contentStyle={{
                  background: dark ? "#1A1D26" : "white",
                  border: `1px solid ${dark ? "#2A2D3A" : PRIMARY_ULTRA_LIGHT}`,
                  borderRadius: 12,
                  fontFamily: P,
                  fontSize: 12,
                  padding: "8px 12px",
                }}
                formatter={(v: any) => [`$${v}`, "Contribution"]}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={32}>
                {MONTHLY.map((_, i) => (
                  <Cell key={i} fill={i === MONTHLY.length - 1 ? PRIMARY : dark ? "#2A2D3A" : PRIMARY_ULTRA_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Cumulative Area */}
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${dark ? "#1F2230" : PRIMARY_ULTRA_LIGHT}` }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>
              Cumulative Savings
            </p>
            <ResponsiveContainer width="100%" height={70}>
              <AreaChart
                data={MONTHLY.map((m, i) => ({
                  month: m.month,
                  cumulative: MONTHLY.slice(0, i + 1).reduce((s, x) => s + x.amount, 0),
                }))}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="cumulativeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} hide />
                <YAxis hide />
                <RTooltip
                  contentStyle={{
                    background: dark ? "#1A1D26" : "white",
                    border: `1px solid ${dark ? "#2A2D3A" : PRIMARY_ULTRA_LIGHT}`,
                    borderRadius: 10,
                    fontFamily: P,
                    fontSize: 11,
                  }}
                  formatter={(v: any) => [`$${v}`, "Total Saved"]}
                />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke={PRIMARY}
                  strokeWidth={2}
                  fill="url(#cumulativeGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Smart Insights Panel */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} color={PRIMARY} />
            <h3 className="text-[18px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
              AI Insights
            </h3>
          </div>

          {INSIGHTS.map(({ Icon, title, desc }, idx) => (
            <div
              key={idx}
              className="rounded-[20px] p-5 flex items-start gap-4 transition-all duration-200 hover:shadow-md"
              style={cardStyle}
            >
              <div
                className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                style={{ background: `${PRIMARY}12` }}
              >
                <Icon size={18} color={PRIMARY} />
              </div>
              <div>
                <h4 className="text-[16px] font-bold mb-1" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
                  {title}
                </h4>
                <p className="text-[13px] leading-relaxed font-medium" style={{ color: "#9CA3AF" }}>{desc}</p>
              </div>
            </div>
          ))}

          {/* Pro Tip Gradient Card */}
          <div
            className="rounded-[20px] p-5 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_L})` }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 80% 10%, rgba(255,255,255,0.12), transparent 60%)" }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-white/70" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">Pro Tip</span>
              </div>
              <p className="text-[13px] font-semibold text-white leading-relaxed">
                Automate a $50 transfer every payday — you'll barely notice it, but your goals will reach 40% faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}