import { useApp } from "../context/AppContext";
import {
  Bell,
  Shield,
  Smartphone,
  Moon,
  Sun,
  Globe,
  CreditCard,
  Lock,
  Eye,
  LogOut,
  ChevronRight,
  Database,
  Check,
} from "lucide-react";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  DESIGN TOKENS                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
const PRIMARY = "#553AD5";
const P = "Poppins, sans-serif";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  COMPONENTS                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
function SettingItem({
  icon: Icon,
  label,
  sub,
  action,
  dark,
  onClick,
}: {
  icon: any;
  label: string;
  sub: string;
  action?: React.ReactNode;
  dark: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${onClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.99]" : ""
        }`}
      style={{
        border: `1px solid ${dark ? "#1F2230" : "#F3F4F6"}`,
        background: dark ? "#1A1D26" : "#FFFFFF",
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: dark ? `${PRIMARY}15` : "#F3F0FF" }}
        >
          <Icon size={18} color={PRIMARY} />
        </div>
        <div>
          <p className="text-[14px] font-semibold" style={{ color: dark ? "#F3F4F6" : "#111827", fontFamily: P }}>
            {label}
          </p>
          <p className="text-[11px]" style={{ color: "#9CA3AF", fontFamily: P }}>
            {sub}
          </p>
        </div>
      </div>
      {action || (onClick && <ChevronRight size={16} color="#9CA3AF" />)}
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h3
      className="text-[11px] font-bold uppercase tracking-widest mb-4 mt-2"
      style={{ color: "#9CA3AF", fontFamily: P }}
    >
      {title}
    </h3>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MAIN SETTINGS PAGE                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function Settings() {
  const { darkMode, toggleDarkMode, role } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(true);

  return (
    <div className="flex flex-col gap-6 w-full pb-12 pt-2 max-w-[900px] mx-auto px-4 md:px-6">
      {/* ━━━━━━━━ HEADER ━━━━━━━━ */}
      <div>
        <h1
          className="text-[30px] font-bold tracking-tight"
          style={{ color: darkMode ? "#F3F4F6" : "#111827", fontFamily: P }}
        >
          Settings
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "#9CA3AF", fontFamily: P }}>
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Card */}
        <div
          className="rounded-[28px] p-6 relative overflow-hidden"
          style={{
            background: darkMode ? "#12141A" : "#FFFFFF",
            border: `1px solid ${darkMode ? "#1F2230" : "#EDECF5"}`,
            boxShadow: darkMode ? "none" : "0 8px 32px rgba(85, 92, 213, 0.05)",
          }}
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #553AD5, #7B61FF)" }}
              >
                AK
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-emerald-500 border-2 border-white dark:border-[#12141A] flex items-center justify-center">
                <Check size={10} color="white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex-1">
              <h2
                className="text-[20px] font-bold"
                style={{ color: darkMode ? "#F3F4F6" : "#111827", fontFamily: P }}
              >
                Alex Kumar
              </h2>
              <p className="text-[12px]" style={{ color: "#9CA3AF", fontFamily: P }}>
                alex@college.edu
              </p>
              <div className="flex gap-2 mt-3">
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: darkMode ? "#553AD522" : "#F3F0FF", color: "#553AD5" }}
                >
                  {role === "admin" ? "Premium User" : "Standard User"}
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: darkMode ? "#10B98115" : "#DCFCE7", color: "#10B981" }}
                >
                  Verified
                </span>
              </div>
            </div>
            <button
              className="hidden sm:block px-5 py-2.5 rounded-full text-[12px] font-bold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
              style={{
                background: "#553AD5",
                fontFamily: P,
                boxShadow: `0 4px 12px rgba(85, 58, 213, 0.3)`
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* App Settings */}
          <div>
            <SectionHeading title="Application" />
            <div className="flex flex-col gap-3">
              <SettingItem
                icon={darkMode ? Moon : Sun}
                label="Appearance"
                sub={darkMode ? "Dark mode active" : "Light mode active"}
                dark={darkMode}
                action={
                  <button
                    onClick={toggleDarkMode}
                    className="w-12 h-6 rounded-full relative transition-colors duration-300"
                    style={{
                      background: darkMode ? PRIMARY : "#E5E7EB",
                    }}
                  >
                    <div
                      className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300"
                      style={{
                        transform: darkMode ? "translateX(24px)" : "translateX(0)",
                      }}
                    />
                  </button>
                }
              />
              <SettingItem
                icon={Bell}
                label="Notifications"
                sub="Receive updates and alerts"
                dark={darkMode}
                action={
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className="w-12 h-6 rounded-full relative transition-colors duration-300"
                    style={{
                      background: notifications ? PRIMARY : "#E5E7EB",
                    }}
                  >
                    <div
                      className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300"
                      style={{
                        transform: notifications ? "translateX(24px)" : "translateX(0)",
                      }}
                    />
                  </button>
                }
              />
              <SettingItem
                icon={Globe}
                label="Language"
                sub="English (US)"
                dark={darkMode}
                onClick={() => { }}
              />
            </div>
          </div>

          {/* Security */}
          <div>
            <SectionHeading title="Security" />
            <div className="flex flex-col gap-3">
              <SettingItem
                icon={Lock}
                label="Change Password"
                sub="Last updated 2 months ago"
                dark={darkMode}
                onClick={() => { }}
              />
              <SettingItem
                icon={Smartphone}
                label="Two-Factor Auth"
                sub="Highly recommended"
                dark={darkMode}
                action={
                  <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                }
              />
              <SettingItem
                icon={Eye}
                label="Biometrics"
                sub="Fingerprint or Face ID"
                dark={darkMode}
                action={
                  <button
                    onClick={() => setBiometrics(!biometrics)}
                    className="w-12 h-6 rounded-full relative transition-colors duration-300"
                    style={{
                      background: biometrics ? PRIMARY : "#E5E7EB",
                    }}
                  >
                    <div
                      className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300"
                      style={{
                        transform: biometrics ? "translateX(24px)" : "translateX(0)",
                      }}
                    />
                  </button>
                }
              />
            </div>
          </div>

          {/* Finance & Data */}
          <div>
            <SectionHeading title="Data & Privacy" />
            <div className="flex flex-col gap-3">
              <SettingItem
                icon={CreditCard}
                label="Subscription Plan"
                sub={role === "admin" ? "Premium Plan (₹499/mo)" : "Free Explorer"}
                dark={darkMode}
                onClick={() => { }}
              />
              <SettingItem
                icon={Database}
                label="Export Financial Data"
                sub="JSON, CSV or Excel format"
                dark={darkMode}
                onClick={() => { }}
              />
              <SettingItem
                icon={Shield}
                label="Privacy Policy"
                sub="How we handle your data"
                dark={darkMode}
                onClick={() => { }}
              />
            </div>
          </div>

          {/* Support & Logout */}
          <div className="pt-4 space-y-3">
            <button
              className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-200"
              style={{
                background: darkMode ? "rgba(239, 68, 68, 0.08)" : "#FEF2F2",
                border: `1px solid ${darkMode ? "rgba(239, 68, 68, 0.15)" : "#FEE2E2"}`,
                color: "#EF4444",
                fontFamily: P,
                fontSize: "14px",
                fontWeight: 700
              }}
            >
              <LogOut size={18} /> Log Out Account
            </button>
            <div className="flex justify-center gap-4 py-2">
              <button className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-purple-500 transition-colors">Privacy</button>
              <span className="text-gray-300">•</span>
              <button className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-purple-500 transition-colors">Terms of Service</button>
              <span className="text-gray-300">•</span>
              <button className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-purple-500 transition-colors">App v2.4.1</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
