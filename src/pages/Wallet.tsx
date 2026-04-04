import { useState, useMemo, useRef } from "react";
import { useApp } from "../context/AppContext";
import { LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer } from "recharts";
import {
  ArrowUpRight, ArrowDownLeft, Plus, Send, Eye, EyeOff,
  CreditCard, Smartphone, Banknote, ChevronLeft, ChevronRight,
  Zap, AlertCircle, ShoppingBag, Coffee, Film, Music,
  Shield, X, TrendingUp, Clock, Wifi, MoreHorizontal, CheckCircle2,
} from "lucide-react";
import {
  walletCards, walletStats, quickTransfers,
  recentTransactions, calendarTransactions,
} from "../data/mockData";

/* ─── Design Tokens ─── */
const PRIMARY = "#553AD5";
const PRIMARY_L = "#7B61FF";
const P = "Poppins, sans-serif";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const fmtUSD = (n: number) => "$" + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.abs(n));

function heatBg(total: number, dark: boolean): string {
  if (total === 0) return dark ? "#16181F" : "#F8F7FF";
  if (total < 100) return dark ? "#241B4A" : "#EDE9FF";
  if (total < 300) return dark ? "#3A2880" : "#C4B5FD";
  if (total < 600) return dark ? "#4F35B5" : "#7C5CF6";
  return dark ? "#553AD5" : "#553AD5";
}
function heatFg(total: number): string {
  if (total === 0) return "#9CA3AF";
  if (total < 100) return "#7C5CF6";
  if (total < 300) return "#553AD5";
  return "#FFFFFF";
}

/* ─── Card Shell ─── */
function Card({ children, dark, className = "", style = {}, noPad = false }: {
  children: React.ReactNode; dark: boolean; className?: string; style?: React.CSSProperties; noPad?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] ${noPad ? "" : "p-6"} ${className}`}
      style={{
        background: dark ? "#12141A" : "#FFFFFF",
        border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
        boxShadow: dark ? "none" : "0 2px 16px rgba(85,58,213,0.06)",
        fontFamily: P,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ label, dark, action, sub }: { label: string; dark: boolean; action?: React.ReactNode; sub?: string }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="text-[16px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>{label}</h3>
        {sub && <p className="text-[12px] mt-0.5" style={{ color: "#9CA3AF", fontFamily: P }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return <span className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0" style={{ color, background: bg, fontFamily: P }}>{label}</span>;
}

/* ─── Premium Bank Card (Redesigned for Swiper) ─── */
function BankCard({ card, active, onClick, hide }: {
  card: typeof walletCards[0]; active: boolean; onClick: () => void; hide: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className="relative rounded-[24px] p-5 cursor-pointer overflow-hidden select-none transition-all duration-300 flex flex-col justify-between"
      style={{
        background: `linear-gradient(135deg, ${card.color[0]}, ${card.color[1]})`,
        boxShadow: active ? `0 20px 48px ${card.color[0]}60` : "0 4px 16px rgba(0,0,0,0.15)",
        transform: active ? "translateY(-4px) scale(1.02)" : "scale(1)",
        minHeight: 200,
        width: "100%",
        fontFamily: P,
        outline: active ? `2px solid rgba(255,255,255,0.3)` : "none",
        outlineOffset: 2,
      }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 15% 10%, rgba(255,255,255,0.2) 0%, transparent 55%)" }} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-0.5">{card.bank}</p>
          <p className="text-[14px] font-bold text-white">{card.label}</p>
        </div>
        <div className="flex items-center gap-2">
          <Wifi size={13} color="rgba(255,255,255,0.45)" />
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/15">
            {card.type === "UPI" ? <Smartphone size={12} color="white" /> : <CreditCard size={12} color="white" />}
          </div>
        </div>
      </div>

      <div>
        <p className="text-[32px] font-bold text-white tracking-tight leading-none mb-3">
          {hide ? "$ ••••••" : fmtUSD(card.balance)}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-mono text-white/55 tracking-[0.15em] shrink-0">{card.number}</p>
          <div className="flex items-center gap-2">
            {card.expiry && <p className="text-[10px] text-white/40 font-mono shrink-0">{card.expiry}</p>}
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 bg-white/10 px-2 py-0.5 rounded-md shrink-0">{card.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Send Money Modal ─── */
function SendModal({ onClose, dark, to: defaultTo = "" }: { onClose: () => void; dark: boolean; to?: string }) {
  const [amt, setAmt] = useState("");
  const [to, setTo] = useState(defaultTo);
  const [done, setDone] = useState(false);

  const inp: React.CSSProperties = {
    background: dark ? "#1A1D26" : "#F6F5FF",
    border: `1px solid ${dark ? "#2A2D3A" : "#E2DEFF"}`,
    color: dark ? "#F3F4F6" : "#111827",
    borderRadius: 12, padding: "11px 14px",
    fontFamily: P, fontSize: 13, outline: "none", width: "100%",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-[28px] p-7 shadow-2xl z-10"
        style={{ background: dark ? "#12141A" : "white", border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}` }}>

        {done ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#DCFCE7" }}>
              <CheckCircle2 size={40} color="#22C55E" />
            </div>
            <p className="text-[20px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>Transfer Sent!</p>
            <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: P }}>{fmtUSD(+amt)} → {to}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[20px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>Send Money</h2>
                <p className="text-[12px] mt-0.5" style={{ color: "#9CA3AF", fontFamily: P }}>Instant peer-to-peer transfer</p>
              </div>
              <button onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center border transition hover:opacity-70"
                style={{ borderColor: dark ? "#2A2D3A" : "#E5E7EB" }}>
                <X size={15} color="#9CA3AF" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "#9CA3AF", fontFamily: P }}>Recipient</label>
                <input style={inp} placeholder="Name, UPI ID or email" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "#9CA3AF", fontFamily: P }}>Amount ($)</label>
                <input style={inp} type="number" placeholder="0.00" value={amt} onChange={(e) => setAmt(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["50", "200", "500", "1000"].map((a) => (
                  <button key={a} onClick={() => setAmt(a)}
                    className="py-2 rounded-xl text-[12px] font-bold transition"
                    style={{
                      background: amt === a ? PRIMARY : dark ? "#1A1D26" : "#F6F5FF",
                      color: amt === a ? "white" : PRIMARY,
                      border: `1px solid ${amt === a ? PRIMARY : dark ? "#2A2D3A" : "#E2DEFF"}`,
                      fontFamily: P,
                    }}>
                    ${a}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onClose}
                className="flex-1 py-3 rounded-xl text-[13px] font-bold border transition"
                style={{ borderColor: dark ? "#2A2D3A" : "#E5E7EB", color: dark ? "#D1D5DB" : "#374151", background: "transparent", fontFamily: P }}>
                Cancel
              </button>
              <button
                onClick={() => { if (amt && to) { setDone(true); setTimeout(onClose, 2000); } }}
                className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white transition hover:opacity-90"
                style={{ background: PRIMARY, fontFamily: P, boxShadow: `0 6px 20px ${PRIMARY}55` }}>
                Send {amt ? fmtUSD(+amt) : "$0"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Day Popup ─── */
function DayPopup({ dateKey, onClose, dark }: { dateKey: string; onClose: () => void; dark: boolean }) {
  const txs = calendarTransactions[dateKey] ?? [];
  const [y, m, d] = dateKey.split("-").map(Number);
  const label = `${d} ${MONTH_NAMES[m - 1]} ${y}`;
  const net = txs.reduce((s, t) => s + t.amount, 0);
  const spent = txs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const income = txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl z-10"
        style={{ background: dark ? "#12141A" : "white", border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}` }}>
        <div className="px-6 py-5" style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_L})` }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-0.5" style={{ fontFamily: P }}>Daily Summary</p>
              <h3 className="text-[22px] font-bold text-white" style={{ fontFamily: P }}>{label}</h3>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20">
              <X size={15} color="white" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Spent", value: fmtUSD(spent), color: "#FCA5A5" },
              { label: "Income", value: `+${fmtUSD(income)}`, color: "#6EE7B7" },
              { label: "Net", value: `${net >= 0 ? "+" : "-"}${fmtUSD(net)}`, color: net >= 0 ? "#6EE7B7" : "#FCA5A5" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-[14px] p-3 text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/50 mb-1" style={{ fontFamily: P }}>{label}</p>
                <p className="text-[16px] font-bold" style={{ color, fontFamily: P }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 max-h-[300px] overflow-y-auto">
          {txs.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-3 opacity-40">
              <Coffee size={28} strokeWidth={1.5} />
              <p className="text-sm font-medium" style={{ fontFamily: P }}>No transactions this day</p>
            </div>
          ) : txs.map((tx, idx) => (
            <div key={tx.id}
              className="flex items-center justify-between py-3.5"
              style={{ borderBottom: idx < txs.length - 1 ? `1px solid ${dark ? "#1F2230" : "#F3F0FF"}` : "none" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[12px] flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                  style={{ background: tx.amount > 0 ? "#22C55E" : PRIMARY }}>
                  {tx.amount > 0 ? "IN" : "OUT"}
                </div>
                <div>
                  <p className="text-[13px] font-bold" style={{ color: dark ? "#E5E7EB" : "#111827", fontFamily: P }}>{tx.name}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9CA3AF", fontFamily: P }}>{tx.category}</p>
                </div>
              </div>
              <span className="text-[14px] font-bold" style={{ color: tx.amount > 0 ? "#22C55E" : "#EF4444", fontFamily: P }}>
                {tx.amount > 0 ? "+" : "-"}{fmtUSD(Math.abs(tx.amount))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Spending Calendar ─── */
function SpendingCalendar({ dark }: { dark: boolean }) {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(5);
  const [selected, setSel] = useState<string | null>(null);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSel(null); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); setSel(null); };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const dayTotals = useMemo(() => {
    const map: Record<number, { total: number; key: string; hasTx: boolean }> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const txs = calendarTransactions[key] ?? [];
      const total = txs.reduce((s, t) => s + Math.abs(t.amount), 0);
      map[d] = { total, key, hasTx: txs.length > 0 };
    }
    return map;
  }, [year, month, daysInMonth]);

  const stats = useMemo(() => {
    let spent = 0, income = 0, count = 0;
    Object.values(dayTotals).forEach(({ key }) => {
      (calendarTransactions[key] ?? []).forEach((t) => {
        if (t.amount < 0) spent += Math.abs(t.amount); else income += t.amount;
        count++;
      });
    });
    return { spent, income, count };
  }, [dayTotals]);

  const isToday = (d: number) => year === today.getFullYear() && month === today.getMonth() && d === today.getDate();

  return (
    <>
      {selected && <DayPopup dateKey={selected} onClose={() => setSel(null)} dark={dark} />}
      <Card dark={dark} noPad className="overflow-hidden">
        <div className="px-6 pt-6 pb-5" style={{ borderBottom: `1px solid ${dark ? "#1F2230" : "#F0EEFF"}` }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[17px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>Monthly Spending Map</h3>
              <p className="text-[12px] mt-0.5" style={{ color: "#9CA3AF", fontFamily: P }}>Tap any highlighted day to see transactions</p>
            </div>
            <div className="flex items-center gap-1 rounded-[14px] p-1"
              style={{ background: dark ? "#1A1D26" : "#F6F5FF", border: `1px solid ${dark ? "#2A2D3A" : "#E2DEFF"}` }}>
              <button onClick={prev}
                className="w-8 h-8 rounded-[10px] flex items-center justify-center transition hover:opacity-70"
                style={{ background: dark ? "#242636" : "white" }}>
                <ChevronLeft size={15} color={dark ? "#9CA3AF" : PRIMARY} />
              </button>
              <span className="text-[13px] font-bold px-3" style={{ color: dark ? "#E5E7EB" : "#111827", fontFamily: P, minWidth: 140, textAlign: "center" }}>
                {MONTH_NAMES[month]} {year}
              </span>
              <button onClick={next}
                className="w-8 h-8 rounded-[10px] flex items-center justify-center transition hover:opacity-70"
                style={{ background: dark ? "#242636" : "white" }}>
                <ChevronRight size={15} color={dark ? "#9CA3AF" : PRIMARY} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Spent", value: fmtUSD(stats.spent), color: "#EF4444", bg: dark ? "#2A1515" : "#FEE2E2" },
              { label: "Income", value: fmtUSD(stats.income), color: "#22C55E", bg: dark ? "#132513" : "#DCFCE7" },
              { label: "Transactions", value: `${stats.count}`, color: PRIMARY, bg: dark ? "#1C1640" : "#EDE9FF" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="rounded-[14px] px-4 py-3" style={{ background: bg }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color, fontFamily: P, opacity: 0.75 }}>{label}</p>
                <p className="text-[20px] font-bold" style={{ color, fontFamily: P }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-7 mb-2">
            {DAY_LABELS.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest py-1.5" style={{ color: "#9CA3AF", fontFamily: P }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`b${i}`} className="aspect-square" />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
              const { total, key, hasTx } = dayTotals[d];
              const bg = heatBg(total, dark);
              const fg = heatFg(total);
              const tod = isToday(d);
              return (
                <button
                  key={d}
                  onClick={() => hasTx && setSel(key)}
                  className="aspect-square rounded-[12px] flex flex-col items-center justify-center relative transition-all duration-200"
                  style={{
                    background: bg,
                    border: tod ? `2px solid ${PRIMARY}` : `1px solid ${dark ? "#1F2230" : "transparent"}`,
                    cursor: hasTx ? "pointer" : "default",
                    boxShadow: hasTx && total > 300 ? `0 2px 8px ${PRIMARY}30` : "none",
                  }}
                  title={hasTx ? `${key}: ${fmtUSD(total)}` : ""}
                >
                  <span className="text-[11px] font-bold leading-none"
                    style={{ color: total === 0 ? (dark ? "#3A3D4A" : "#D1D5DB") : fg, fontFamily: P }}>
                    {d}
                  </span>
                  {hasTx && total > 0 && (
                    <span className="text-[8px] font-bold mt-0.5 leading-none"
                      style={{ color: fg, fontFamily: P, opacity: 0.85 }}>
                      {total >= 1000 ? `$${(total / 1000).toFixed(1)}k` : `$${Math.round(total)}`}
                    </span>
                  )}
                  {hasTx && (
                    <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full"
                      style={{ background: total >= 300 ? "rgba(255,255,255,0.65)" : PRIMARY }} />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-5 pt-4"
            style={{ borderTop: `1px solid ${dark ? "#1F2230" : "#F0EEFF"}` }}>
            <p className="text-[11px] font-medium" style={{ color: "#9CA3AF", fontFamily: P }}>Darker = higher spending</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium" style={{ color: "#9CA3AF", fontFamily: P }}>Low</span>
              {(dark ? ["#241B4A", "#3A2880", "#4F35B5", "#553AD5"] : ["#EDE9FF", "#C4B5FD", "#7C5CF6", "#553AD5"]).map((c) => (
                <div key={c} className="w-5 h-5 rounded-[6px]" style={{ background: c, border: `1px solid ${dark ? "#2A2D3A" : "#E2DEFF"}` }} />
              ))}
              <span className="text-[10px] font-medium" style={{ color: "#9CA3AF", fontFamily: P }}>High</span>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

/* ─── Local data ─── */
const velocityData = [
  { day: "Mon", spent: 45 }, { day: "Tue", spent: 120 }, { day: "Wed", spent: 85 },
  { day: "Thu", spent: 310 }, { day: "Fri", spent: 110 }, { day: "Sat", spent: 430 }, { day: "Sun", spent: 40 },
];
const PAY_METHODS = [
  { id: 1, name: "Visa Gold", mask: "•••• 3254", Icon: CreditCard, color: "#553AD5" },
  { id: 2, name: "AlexPay UPI", mask: "alex@upi", Icon: Smartphone, color: "#22C55E" },
  { id: 3, name: "Cash Wallet", mask: "$200 available", Icon: Banknote, color: "#F59E0B" },
];
const SUBS = [
  { id: 1, name: "Netflix", price: "$19.99/mo", Icon: Film, color: "#EF4444", date: "25 Jul" },
  { id: 2, name: "Spotify", price: "$14.99/mo", Icon: Music, color: "#22C55E", date: "01 Jun" },
  { id: 3, name: "Amazon Prime", price: "$12.99/mo", Icon: ShoppingBag, color: "#F59E0B", date: "28 Jul" },
];

/* ════════════════════════════════════════════════════════════════
   WALLET PAGE
════════════════════════════════════════════════════════════════ */
export default function Wallet() {
  const { darkMode: dark, role } = useApp();
  const [activeCard, setActiveCard] = useState(0);
  const [hideBalance, setHideBalance] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [sendTo, setSendTo] = useState("");
  const [showAddCard, setShowAddCard] = useState(false);
  const [showManagePayment, setShowManagePayment] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showAllContacts, setShowAllContacts] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const cs = {
    background: dark ? "#12141A" : "#FFFFFF",
    border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
    boxShadow: dark ? "none" : "0 2px 12px rgba(85,58,213,0.05)",
  };

  const sel = walletCards[activeCard];

  const openSendTo = (name: string) => {
    setSendTo(name);
    setShowSend(true);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Budget survival values derived from mockData
  const monthBudget = 8500;
  const monthSpent = 6222;
  const pctUsed = Math.round((monthSpent / monthBudget) * 100);
  const remaining = monthBudget - monthSpent;
  const daysLeft = 15;
  const dailySafe = Math.round(remaining / daysLeft);

  return (
    <div className="flex flex-col gap-7 w-full pb-12 pt-2">
      {showSend && <SendModal onClose={() => { setShowSend(false); setSendTo(""); }} dark={dark} to={sendTo} />}

      {/* Modals for other actions */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddCard(false)} />
          <div className="relative w-full max-w-sm rounded-[28px] p-7 shadow-2xl z-10" style={{ background: dark ? "#12141A" : "white", border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}` }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>Add New Card</h2>
              <button onClick={() => setShowAddCard(false)} className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ borderColor: dark ? "#2A2D3A" : "#E5E7EB" }}>
                <X size={15} color="#9CA3AF" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <input type="text" placeholder="Card Number" className="w-full p-3 rounded-xl" style={{ background: dark ? "#1A1D26" : "#F6F5FF", border: `1px solid ${dark ? "#2A2D3A" : "#E2DEFF"}`, color: dark ? "#F3F4F6" : "#111827" }} />
              <input type="text" placeholder="Cardholder Name" className="w-full p-3 rounded-xl" style={{ background: dark ? "#1A1D26" : "#F6F5FF", border: `1px solid ${dark ? "#2A2D3A" : "#E2DEFF"}`, color: dark ? "#F3F4F6" : "#111827" }} />
              <div className="flex gap-3">
                <input type="text" placeholder="MM/YY" className="w-1/2 p-3 rounded-xl" style={{ background: dark ? "#1A1D26" : "#F6F5FF", border: `1px solid ${dark ? "#2A2D3A" : "#E2DEFF"}`, color: dark ? "#F3F4F6" : "#111827" }} />
                <input type="text" placeholder="CVV" className="w-1/2 p-3 rounded-xl" style={{ background: dark ? "#1A1D26" : "#F6F5FF", border: `1px solid ${dark ? "#2A2D3A" : "#E2DEFF"}`, color: dark ? "#F3F4F6" : "#111827" }} />
              </div>
              <button className="py-3 rounded-xl text-[13px] font-bold text-white transition hover:opacity-90" style={{ background: PRIMARY, fontFamily: P }} onClick={() => setShowAddCard(false)}>Add Card</button>
            </div>
          </div>
        </div>
      )}

      {showManagePayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowManagePayment(false)} />
          <div className="relative w-full max-w-sm rounded-[28px] p-7 shadow-2xl z-10" style={{ background: dark ? "#12141A" : "white", border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}` }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>Manage Payments</h2>
              <button onClick={() => setShowManagePayment(false)} className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ borderColor: dark ? "#2A2D3A" : "#E5E7EB" }}>
                <X size={15} color="#9CA3AF" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {PAY_METHODS.map(method => (
                <div key={method.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: dark ? "#1A1D26" : "#F6F5FF" }}>
                  <div className="flex items-center gap-3">
                    <method.Icon size={18} color={method.color} />
                    <span className="text-[13px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>{method.name}</span>
                  </div>
                  <button className="text-[11px] font-bold px-3 py-1 rounded-full" style={{ background: "#EF444420", color: "#EF4444" }}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAllTransactions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAllTransactions(false)} />
          <div className="relative w-full max-w-2xl rounded-[28px] p-7 shadow-2xl z-10 max-h-[80vh] overflow-y-auto" style={{ background: dark ? "#12141A" : "white", border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}` }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>All Transactions</h2>
              <button onClick={() => setShowAllTransactions(false)} className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ borderColor: dark ? "#2A2D3A" : "#E5E7EB" }}>
                <X size={15} color="#9CA3AF" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: dark ? "#1A1D26" : "#F6F5FF" }}>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>{tx.name}</p>
                    <p className="text-[10px]" style={{ color: "#9CA3AF" }}>{tx.date} • {tx.category}</p>
                  </div>
                  <span className="text-[14px] font-bold" style={{ color: tx.amount > 0 ? "#22C55E" : "#EF4444" }}>{tx.amount > 0 ? "+" : "-"}{fmtUSD(Math.abs(tx.amount))}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAllContacts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAllContacts(false)} />
          <div className="relative w-full max-w-sm rounded-[28px] p-7 shadow-2xl z-10" style={{ background: dark ? "#12141A" : "white", border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}` }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>All Contacts</h2>
              <button onClick={() => setShowAllContacts(false)} className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ borderColor: dark ? "#2A2D3A" : "#E5E7EB" }}>
                <X size={15} color="#9CA3AF" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {quickTransfers.map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: dark ? "#1A1D26" : "#F6F5FF" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold" style={{ background: `${contact.color}20`, color: contact.color }}>{contact.initials}</div>
                    <span className="text-[13px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>{contact.name}</span>
                  </div>
                  <button onClick={() => { openSendTo(contact.name); setShowAllContacts(false); }} className="text-[11px] font-bold px-3 py-1.5 rounded-full" style={{ background: PRIMARY, color: "white" }}>Send</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ HEADER ══ */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[30px] font-bold tracking-tight" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>My Wallet</h1>
          <p className="text-[13px] font-medium mt-0.5" style={{ color: "#9CA3AF", fontFamily: P }}>Manage your cards, payments & spending</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setHideBalance(!hideBalance)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[12px] font-bold border transition hover:opacity-80"
            style={{ background: dark ? "#12141A" : "white", borderColor: dark ? "#1F2230" : "#EDECF5", color: dark ? "#D1D5DB" : "#374151", fontFamily: P }}>
            {hideBalance ? <Eye size={14} /> : <EyeOff size={14} />}
            {hideBalance ? "Show" : "Hide"} Balance
          </button>
          {role === "admin" && (
            <button onClick={() => setShowAddCard(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[12px] font-bold border transition hover:opacity-80"
              style={{ background: dark ? "#12141A" : "white", borderColor: dark ? "#1F2230" : "#EDECF5", color: dark ? "#D1D5DB" : "#374151", fontFamily: P }}>
              <Plus size={14} /> Add Card
            </button>
          )}
          <button onClick={() => setShowSend(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold text-white transition hover:opacity-90"
            style={{ background: PRIMARY, fontFamily: P, boxShadow: `0 4px 18px ${PRIMARY}55` }}>
            <Send size={14} /> Send Money
          </button>
        </div>
      </div>

      {/* ══ CARDS + STATS (Redesigned with Swiper and Smaller Net Worth) ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* LEFT: cards with horizontal swiper */}
        <Card dark={dark} noPad className="overflow-hidden">
          <div className="px-6 pt-6 pb-3">
            <SectionTitle label="My Cards" dark={dark} sub={`${walletCards.length} linked accounts`}
              action={
                role === "admin" && (
                  <button onClick={() => setShowAddCard(true)} className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-xl transition hover:opacity-80"
                    style={{ background: dark ? "#1C1640" : "#EDE9FF", color: PRIMARY, fontFamily: P }}>
                    <Plus size={12} /> Add Card
                  </button>
                )}
            />
          </div>

          {/* Swiper Container with Navigation Buttons */}
          <div className="relative px-2">
            <button
              onClick={scrollLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition hover:scale-110"
              style={{ background: dark ? "#1A1D26" : "white", border: `1px solid ${dark ? "#2A2D3A" : "#E2DEFF"}` }}
            >
              <ChevronLeft size={16} color={PRIMARY} />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition hover:scale-110"
              style={{ background: dark ? "#1A1D26" : "white", border: `1px solid ${dark ? "#2A2D3A" : "#E2DEFF"}` }}
            >
              <ChevronRight size={16} color={PRIMARY} />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scroll-smooth gap-5 px-6 pb-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {walletCards.map((c, i) => (
                <div key={c.id} className="min-w-[300px] shrink-0">
                  <BankCard card={c} active={activeCard === i} onClick={() => setActiveCard(i)} hide={hideBalance} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pb-6">
            {walletCards.map((_, i) => (
              <button key={i} onClick={() => {
                setActiveCard(i);
                if (scrollContainerRef.current) {
                  const cardWidth = 320;
                  scrollContainerRef.current.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                }
              }}
                className="rounded-full transition-all duration-300"
                style={{ width: activeCard === i ? 28 : 8, height: 8, background: activeCard === i ? PRIMARY : dark ? "#2A2D3A" : "#E2DEFF" }} />
            ))}
          </div>
        </Card>

        {/* RIGHT: net worth hero (smaller size) */}
        <div className="rounded-[24px] p-5 relative overflow-hidden flex flex-col justify-between"
          style={{ background: `linear-gradient(145deg, ${PRIMARY} 0%, #4B25CC 50%, ${PRIMARY_L} 100%)`, boxShadow: `0 20px 40px ${PRIMARY}40`, minHeight: 220 }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.18), transparent 60%)" }} />

          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1" style={{ fontFamily: P }}>Total Net Worth</p>
            <p className="text-[28px] font-bold text-white leading-none" style={{ fontFamily: P }}>
              {hideBalance ? "$••••••" : fmtUSD(walletStats.totalBalance)}
            </p>
            <span className="inline-block mt-2 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.25)", color: "white", fontFamily: P }}>
              ↑ {walletStats.savingsRate}% savings rate
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 relative z-10 mt-3">
            {[
              { label: "Income", val: walletStats.monthlyIncome, Icon: ArrowUpRight, color: "#6EE7B7" },
              { label: "Expense", val: walletStats.monthlyExpense, Icon: ArrowDownLeft, color: "#FCA5A5" },
            ].map(({ label, val, Icon, color }) => (
              <div key={label} className="rounded-[14px] p-2.5" style={{ background: "rgba(255,255,255,0.13)" }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <Icon size={11} color={color} />
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.7)", fontFamily: P }}>{label}</span>
                </div>
                <p className="text-[16px] font-bold text-white" style={{ fontFamily: P }}>
                  {hideBalance ? "$•••" : fmtUSD(val)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ BUDGET SURVIVAL METER (HERO) ══ */}
      <div className="rounded-[24px] overflow-hidden" style={{ ...cs }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] flex items-center justify-center" style={{ background: `${PRIMARY}18` }}>
                <Shield size={22} color={PRIMARY} />
              </div>
              <div>
                <h3 className="text-[18px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>Budget Survival Meter</h3>
                <p className="text-[12px]" style={{ color: "#9CA3AF", fontFamily: P }}>Track how your budget is holding up this month</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle size={14} color="#D97706" />
              <span className="text-[12px] font-bold" style={{ color: "#D97706", fontFamily: P }}>15 days left in July</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Monthly Budget", value: fmtUSD(monthBudget), color: dark ? "#E5E7EB" : "#111827", sub: "Jul 2024" },
              { label: "Spent So Far", value: fmtUSD(monthSpent), color: "#EF4444", sub: `${pctUsed}% of budget` },
              { label: "Remaining", value: fmtUSD(remaining), color: "#22C55E", sub: "available" },
              { label: "Safe Daily", value: `${fmtUSD(dailySafe)}/day`, color: PRIMARY, sub: "to stay on track" },
            ].map(({ label, value, color, sub }) => (
              <div key={label} className="rounded-[16px] p-4" style={{ background: dark ? "#1A1D26" : "#F8F7FF" }}>
                <p className="text-[12px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#9CA3AF", fontFamily: P }}>{label}</p>
                <p className="text-[24px] font-bold" style={{ color, fontFamily: P }}>{value}</p>
                <p className="text-[13px] font-semibold mt-1" style={{ color: "#9CA3AF", fontFamily: P }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold" style={{ color: "#9CA3AF", fontFamily: P }}>Budget used: {pctUsed}%</span>
              <span className="text-[12px] font-bold" style={{ color: pctUsed > 80 ? "#EF4444" : "#22C55E", fontFamily: P }}>
                {pctUsed > 80 ? "⚠ Caution" : "✓ On Track"}
              </span>
            </div>
            <div className="w-full h-8 rounded-full overflow-hidden relative"
              style={{ background: dark ? "#1A1D26" : "#F0EEFF" }}>
              <div className="h-full rounded-full relative overflow-hidden transition-all duration-700 flex items-center"
                style={{ width: `${pctUsed}%`, background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_L})` }}>
                <div className="absolute inset-0 h-1/2 top-0 bg-white/15" />
                <span className="absolute left-4 text-[12px] font-bold text-white whitespace-nowrap" style={{ fontFamily: P }}>
                  {fmtUSD(monthSpent)} spent
                </span>
              </div>
              <div className="absolute top-0 bottom-0 w-0.5 z-10" style={{ left: "50%", background: "rgba(255,255,255,0.5)" }}>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap text-white"
                  style={{ background: "#374151", fontFamily: P }}>50%</div>
              </div>
            </div>
          </div>

          {/* Day markers */}
          <div className="flex items-center gap-5 flex-wrap">
            {[
              { icon: Clock, label: `${daysLeft} days left`, color: "#D97706", bg: dark ? "#2A1E0A" : "#FEF3C7" },
              { icon: Zap, label: `${fmtUSD(dailySafe)}/day safe limit`, color: "#22C55E", bg: dark ? "#132513" : "#DCFCE7" },
              { icon: TrendingUp, label: "18% above last week", color: "#EF4444", bg: dark ? "#2A1515" : "#FEE2E2" },
            ].map(({ icon: Icon, label, color, bg }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: bg }}>
                <Icon size={12} color={color} />
                <span className="text-[11px] font-bold" style={{ color, fontFamily: P }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ QUICK TRANSFER ══ */}
      <Card dark={dark}>
        <SectionTitle label="Quick Transfer" dark={dark} sub="Send money to your contacts instantly"
          action={
            <button className="text-[12px] font-bold" style={{ color: PRIMARY, fontFamily: P }}
              onClick={() => setShowAllContacts(true)}>
              See all contacts →
            </button>
          }
        />
        <div className="grid grid-cols-5 gap-3">
          {quickTransfers.map((p) => (
            <button key={p.id}
              onClick={() => {
                p.name === "Add New" ? setShowSend(true) : openSendTo(p.name);
              }}
              className="flex flex-col items-center gap-3 py-4 rounded-[18px] border transition-all duration-200 hover:scale-105 hover:shadow-md"
              style={{
                background: p.name === "Add New" ? (dark ? "#1A1D26" : "#F8F7FF") : (dark ? "#1A1D26" : `${p.color}08`),
                borderColor: p.name === "Add New" ? (dark ? "#2A2D3A" : "#E2DEFF") : `${p.color}30`,
              }}>
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[14px] font-bold"
                style={{
                  background: p.name === "Add New" ? "transparent" : `${p.color}20`,
                  color: p.name === "Add New" ? "#9CA3AF" : p.color,
                  border: p.name === "Add New" ? `2px dashed ${dark ? "#2A2D3A" : "#D1D5DB"}` : "none",
                  fontFamily: P,
                }}>
                {p.initials}
              </div>
              <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: dark ? "#9CA3AF" : "#6B7280", fontFamily: P }}>{p.name}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* ══ CALENDAR ══ */}
      <SpendingCalendar dark={dark} />

      {/* ══ STATS MINI CARDS ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Daily Spend Limit", value: `${fmtUSD(dailySafe)}/day`, Icon: CheckCircle2, color: "#22C55E", bg: dark ? "#132513" : "#DCFCE7" },
          { label: "Spending Speed", value: "$147/day", Icon: TrendingUp, color: "#EF4444", bg: dark ? "#2A1515" : "#FEE2E2" },
          { label: "Savings Rate", value: `${walletStats.savingsRate}%`, Icon: Shield, color: PRIMARY, bg: dark ? "#1C1640" : "#EDE9FF" },
        ].map(({ label, value, Icon, color, bg }) => (
          <div key={label}
            className="rounded-[20px] p-5 flex items-center gap-4 border"
            style={cs}>
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0" style={{ background: bg }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#9CA3AF", fontFamily: P }}>{label}</p>
              <p className="text-[20px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ══ PAYMENT METHODS + SUBSCRIPTIONS ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card dark={dark}>
          <SectionTitle label="Payment Methods" dark={dark} sub="Your linked accounts"
            action={<button className="text-[12px] font-bold" style={{ color: PRIMARY, fontFamily: P }} onClick={() => setShowManagePayment(true)}>Manage</button>}
          />
          <div className="flex flex-col gap-3">
            {PAY_METHODS.map(({ id, name, mask, Icon, color }) => (
              <div key={id}
                className="flex items-center justify-between p-4 rounded-[16px] border transition-all hover:scale-[1.01]"
                style={{ background: dark ? "#1A1D26" : "#FAFAFA", borderColor: dark ? "#1F2230" : "#EDECF5" }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-[13px] flex items-center justify-center border shrink-0"
                    style={{ background: dark ? "#12141A" : "white", borderColor: dark ? "#2A2D3A" : "#EDECF5" }}>
                    <Icon size={18} color={color} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>{name}</p>
                    <p className="text-[11px] font-mono mt-0.5" style={{ color: "#9CA3AF" }}>{mask}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>Active</span>
                  <MoreHorizontal size={16} color="#9CA3AF" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card dark={dark}>
          <SectionTitle label="Active Subscriptions" dark={dark} sub="Monthly recurring charges"
            action={<Badge label="$47.97/mo" color="#EF4444" bg={dark ? "#2A1515" : "#FEE2E2"} />}
          />
          <div className="flex flex-col gap-3">
            {SUBS.map(({ id, name, price, Icon, color, date }) => (
              <div key={id}
                className="flex items-center justify-between p-4 rounded-[16px] border transition-all hover:scale-[1.01]"
                style={{ background: dark ? "#1A1D26" : "#FAFAFA", borderColor: dark ? "#1F2230" : "#EDECF5" }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-[13px] flex items-center justify-center relative overflow-hidden shrink-0"
                    style={{ background: color }}>
                    <div className="absolute inset-0 bg-black/10" />
                    <Icon size={17} color="white" className="relative z-10" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>{name}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF", fontFamily: P }}>Renews {date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-bold" style={{ color: dark ? "#E5E7EB" : "#111827", fontFamily: P }}>{price}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ══ VELOCITY CHART + CARD DETAIL ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <Card dark={dark}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[17px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>Spending Velocity</h3>
              <p className="text-[12px]" style={{ color: "#9CA3AF", fontFamily: P }}>Daily spend this week vs average</p>
            </div>
            <Badge label="↑ 40% this week" color={PRIMARY} bg={dark ? "#1C1640" : "#EDE9FF"} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={velocityData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fontFamily: "Poppins", fill: dark ? "#6B7280" : "#9CA3AF" }} dy={8} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fontFamily: "Poppins", fill: dark ? "#6B7280" : "#9CA3AF" }}
                tickFormatter={(v) => `$${v}`} />
              <RTooltip
                cursor={{ stroke: dark ? "#2A2D3A" : "#E2DEFF", strokeWidth: 1, strokeDasharray: "4 4" }}
                contentStyle={{ background: dark ? "#1A1D26" : "white", border: `1px solid ${dark ? "#2A2D3A" : "#E2DEFF"}`, borderRadius: 14, fontFamily: P, fontSize: 12, color: dark ? "#F3F4F6" : "#111827" }}
                formatter={(v: any) => [`$${v}`, "Spent"]}
              />
              <Line type="monotone" dataKey="spent" stroke={PRIMARY} strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2, fill: dark ? "#12141A" : "white", stroke: PRIMARY }}
                activeDot={{ r: 6, strokeWidth: 0, fill: PRIMARY }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card dark={dark}>
          <h3 className="text-[11px] font-bold uppercase tracking-widest mb-5"
            style={{ color: "#9CA3AF", fontFamily: P }}>Selected Card Details</h3>
          {[
            { k: "Name", v: sel.label },
            { k: "Bank", v: sel.bank },
            { k: "Type", v: sel.type },
            { k: "Number", v: sel.number },
            { k: "Balance", v: hideBalance ? "$••••••" : fmtUSD(sel.balance) },
            ...(sel.expiry ? [{ k: "Expires", v: sel.expiry }] : []),
          ].map(({ k, v }, idx, arr) => (
            <div key={k} className="flex items-center justify-between py-3"
              style={{ borderBottom: idx < arr.length - 1 ? `1px solid ${dark ? "#1F2230" : "#F0EEFF"}` : "none" }}>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#9CA3AF", fontFamily: P }}>{k}</span>
              <span className="text-[13px] font-bold" style={{ color: dark ? "#D1D5DB" : "#374151", fontFamily: P }}>{v}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* ══ RECENT ACTIVITY ══ */}
      <Card dark={dark}>
        <SectionTitle label="Recent Activity" dark={dark} sub="Your latest transactions"
          action={
            <button className="flex items-center gap-1 text-[12px] font-bold"
              style={{ color: PRIMARY, fontFamily: P }} onClick={() => setShowAllTransactions(true)}>
              View all <ChevronRight size={13} />
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${dark ? "#1F2230" : "#F3F0FF"}` }}>
                {["Date", "Name", "Category", "Amount"].map(h => (
                  <th key={h} className="text-left py-3 px-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: PRIMARY, fontFamily: P }}>{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx, idx) => (
                <tr key={tx.id}
                  className="transition-colors hover:bg-purple-50/50"
                  style={{ borderBottom: idx < recentTransactions.length - 1 ? `1px solid ${dark ? "#1F2230" : "#F9F8FF"}` : "none" }}>
                  <td className="py-3.5 px-2">
                    <span className="text-[12px] font-semibold" style={{ color: "#9CA3AF", fontFamily: P }}>{tx.date}</span>
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                        style={{ background: tx.amount > 0 ? "#22C55E" : PRIMARY }}>
                        {tx.amount > 0 ? "IN" : "OUT"}
                      </div>
                      <span className="text-[13px] font-bold" style={{ color: dark ? "#E5E7EB" : "#111827", fontFamily: P }}>{tx.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: dark ? "#1C1640" : "#EDE9FF", color: PRIMARY, fontFamily: P }}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-2">
                    <span className="text-[14px] font-bold" style={{ color: tx.amount > 0 ? "#22C55E" : "#EF4444", fontFamily: P }}>
                      {tx.amount > 0 ? "+" : "-"}{fmtUSD(Math.abs(tx.amount))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}