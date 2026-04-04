import { useApp } from "../context/AppContext";
import {
  HelpCircle,
  Search,
  Book,
  MessageSquare,
  Mail,
  Smartphone,
  ChevronRight,
  Target,
  ShieldCheck,
  Zap,
  CreditCard,
  FileText,
  Video,
  ExternalLink,
  LifeBuoy,
} from "lucide-react";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  DESIGN TOKENS (Synchronized with Wallet/Sidebar)                           */
/* ─────────────────────────────────────────────────────────────────────────── */
const PRIMARY = "#553AD5";
const PRIMARY_L = "#7B61FF";
const P = "Poppins, sans-serif";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  HELP PAGE COMPONENTS                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
function ArticleCard({
  icon: Icon,
  title,
  sub,
  dark,
  onClick,
}: {
  icon: any;
  title: string;
  sub: string;
  dark: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group p-6 rounded-[24px] transition-all duration-300 ${onClick ? "cursor-pointer active:scale-[0.98]" : ""
        }`}
      style={{
        background: dark ? "#12141A" : "#FFFFFF",
        border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
        boxShadow: dark ? "none" : "0 2px 12px rgba(85,58,213,0.05)",
      }}
    >
      <div
        className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
        style={{ background: dark ? `${PRIMARY}22` : "#F3F0FF" }}
      >
        <Icon size={20} color={PRIMARY} />
      </div>
      <h3 className="text-[18px] font-bold mb-1.5" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>
        {title}
      </h3>
      <p className="text-[13px] leading-relaxed mb-5 font-medium" style={{ color: "#9CA3AF", fontFamily: P }}>
        {sub}
      </p>
      <div className="flex items-center gap-1.5 text-[14px] font-bold" style={{ color: PRIMARY }}>
        View Articles <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

function ContactPill({
  icon: Icon,
  label,
  dark,
  onClick,
}: {
  icon: any;
  label: string;
  dark: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 active:scale-95 text-left w-full"
      style={{
        background: dark ? "#12141A" : "#FFFFFF",
        border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
        color: dark ? "#D1D5DB" : "#4B5563",
        fontFamily: P,
        fontSize: "13px",
        fontWeight: 700,
      }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: dark ? "#1C1640" : "#EDE9FF" }}>
        <Icon size={14} color={PRIMARY} />
      </div>
      <span className="flex-1">{label}</span>
      <ChevronRight size={12} color="#9CA3AF" />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MAIN HELP PAGE                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function Help() {
  const { darkMode: dark } = useApp();
  const [search, setSearch] = useState("");

  const FAQS = [
    { q: "How do I sync my bank accounts?", a: "Go to your 'Wallet' page and click on 'Add Card'. Follow the instructions to link your bank account via your secure bank portal." },
    { q: "Can I export my financial data?", a: "Yes, you can export your data in JSON or CSV format from the Settings page under 'Data & Privacy'." },
    { q: "What is the 'Survival Meter'?", a: "The Survival Meter tracks your daily spending speed and projects how long your current balance will last based on your budget targets." },
    { q: "Is my data secure?", a: "Absolutely. We use bank-grade AES 256-bit encryption for all your financial data and never store your actual bank login credentials." },
  ];

  return (
    <div className="flex flex-col gap-8 w-full pb-12 pt-2" style={{ fontFamily: P }}>

      {/* ━━━━━━━━ HEADER & SEARCH ━━━━━━━━ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[30px] font-bold tracking-tight" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
            Help Center
          </h1>
          <p className="text-[14px] font-bold mt-1" style={{ color: "#9CA3AF" }}>
            Find answers and support for your financial journey
          </p>
        </div>

        <div className="relative w-full max-w-md group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:scale-110 transition-transform">
            <Search size={18} color={PRIMARY} />
          </div>
          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full h-[48px] pl-12 pr-4 rounded-full outline-none transition-all duration-300 text-[14px]"
            style={{
              background: dark ? "#12141A" : "#FFFFFF",
              border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
              fontFamily: P,
              color: dark ? "white" : "#111827",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ━━━━━━━━ HERO BOX ━━━━━━━━ */}
      <div
        className="rounded-[28px] p-8 md:p-10 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_L})`,
          boxShadow: `0 20px 48px ${PRIMARY}40`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.18), transparent 60%)",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-[24px] bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <LifeBuoy size={40} color="white" />
          </div>
          <div>
            <h2 className="text-[32px] font-bold text-white mb-3 leading-tight">
              Hello! How can we assist you today?
            </h2>
            <p className="text-[15px] text-white font-medium max-w-xl opacity-90">
              Explore our guides, FAQs, and documentation to get the most out of your finance dashboard. Our team is also available for direct support.
            </p>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━ POPULAR CATEGORIES ━━━━━━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ArticleCard
          icon={Zap}
          title="Quick Start"
          sub="Everything you need to know about setting up your dashboard."
          dark={dark}
          onClick={() => { }}
        />
        <ArticleCard
          icon={CreditCard}
          title="Wallet Guide"
          sub="Learn how to link bank accounts, UPI IDs, and manage cards."
          dark={dark}
          onClick={() => { }}
        />
        <ArticleCard
          icon={Target}
          title="Savings Tips"
          sub="How to set smart goals and reach them faster with AI insights."
          dark={dark}
          onClick={() => { }}
        />
        <ArticleCard
          icon={ShieldCheck}
          title="Data Security"
          sub="How we protect your financial data with bank-grade encryption."
          dark={dark}
          onClick={() => { }}
        />
      </div>

      {/* ━━━━━━━━ FAQ SECTION ━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5 mb-2">
            <HelpCircle size={22} color={PRIMARY} />
            <h3 className="text-[18px] font-bold" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
              Common Questions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-[24px] transition-all duration-300"
                style={{
                  background: dark ? "#12141A" : "#FFFFFF",
                  border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
                  boxShadow: dark ? "none" : "0 2px 10px rgba(0,0,0,0.02)",
                }}
              >
                <h4 className="text-[16px] font-bold mb-3 leading-snug" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
                  {faq.q}
                </h4>
                <p className="text-[13px] leading-relaxed font-medium" style={{ color: "#9CA3AF" }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Sidebar */}
        <div className="flex flex-col gap-6">
          <div
            className="p-6 rounded-[28px]"
            style={{
              background: dark ? "#12141A" : "#FFFFFF",
              border: `1px solid ${dark ? "#1F2230" : "#EDECF5"}`,
            }}
          >
            <h3 className="text-[18px] font-bold mb-2" style={{ color: dark ? "#F3F4F6" : "#111827" }}>
              Direct Support
            </h3>
            <p className="text-[13px] font-semibold mb-6 leading-relaxed" style={{ color: "#9CA3AF" }}>
              Can't find what you're looking for? Reach out to our experts.
            </p>
            <div className="flex flex-col gap-3">
              <ContactPill icon={MessageSquare} label="Start Live Chat" dark={dark} />
              <ContactPill icon={Mail} label="Email Support team" dark={dark} />
              <ContactPill icon={Smartphone} label="Call Support line" dark={dark} />
            </div>
          </div>

          <div className="px-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "#9CA3AF" }}>
              Other Resources
            </h4>
            <div className="space-y-3">
              {[
                { label: "Community Forum", icon: Book },
                { label: "Video Tutorials", icon: Video },
                { label: "API Documentation", icon: FileText },
                { label: "Updates & Changes", icon: Zap },
              ].map((res, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center justify-between group transition-colors"
                  style={{ color: "#9CA3AF" }}
                >
                  <div className="flex items-center gap-2.5">
                    <res.icon size={16} className="group-hover:text-[#553AD5]" />
                    <span className="text-[14px] font-bold group-hover:text-[#553AD5]">{res.label}</span>
                  </div>
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
