import { Search, Bell, Sun, Moon, Shield, Eye } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useEffect, useState, useRef } from "react";

const NOTIFS = [
    { id: 1, title: "Budget Alert", text: "You've spent 85% of your food budget.", time: "2m ago", read: false },
    { id: 2, title: "New Feature", text: "Try the new 'Insights' tab for deep analysis.", time: "1h ago", read: false },
    { id: 3, title: "Payment Success", text: "Rent payment for July was successful.", time: "5h ago", read: true },
];

export default function Topbar() {
    const { darkMode, toggleDarkMode, role, setRole } = useApp();
    const [showNotifs, setShowNotifs] = useState(false);
    const [notifs, setNotifs] = useState(NOTIFS);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.documentElement.style.setProperty("--topbar-height", "64px");
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    const unreadCount = notifs.filter(n => !n.read).length;

    return (
        <header
            className="fixed top-0 right-0 z-30 flex items-center justify-between px-6 py-3"
            style={{
                left: "var(--sidebar-width, 220px)",
                height: "64px",
                background: darkMode ? "#1A1D23" : "#F8F9FC",
                borderBottom: `1px solid ${darkMode ? "#2D3139" : "#E5E7EB"}`,
                transition: "left 0.3s ease",
            }}
        >
            {/* Search */}
            <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl w-72"
                style={{
                    background: darkMode ? "#22262F" : "white",
                    border: `1px solid ${darkMode ? "#2D3139" : "#E5E7EB"}`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
            >
                <Search size={15} color="#9CA3AF" />
                <input
                    type="text"
                    placeholder="Search transactions..."
                    className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
                    style={{
                        color: darkMode ? "#E5E7EB" : "#1A1D23",
                        fontFamily: "Poppins, sans-serif",
                    }}
                />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Role Toggle */}
                <div
                    className="flex items-center gap-1 p-1 rounded-xl"
                    style={{
                        background: darkMode ? "#22262F" : "white",
                        border: `1px solid ${darkMode ? "#2D3139" : "#E5E7EB"}`,
                    }}
                >
                    <button
                        onClick={() => setRole("viewer")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${role === "viewer"
                            ? "bg-[#6345ED] text-white shadow-sm"
                            : darkMode
                                ? "text-gray-400 hover:text-gray-200"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                        style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                        <Eye size={12} />
                        Viewer
                    </button>
                    <button
                        onClick={() => setRole("admin")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${role === "admin"
                            ? "bg-[#6345ED] text-white shadow-sm"
                            : darkMode
                                ? "text-gray-400 hover:text-gray-200"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                        style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                        <Shield size={12} />
                        Admin
                    </button>
                </div>

                {/* Dark mode */}
                <button
                    onClick={toggleDarkMode}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                    style={{
                        background: darkMode ? "#22262F" : "white",
                        border: `1px solid ${darkMode ? "#2D3139" : "#E5E7EB"}`,
                    }}
                >
                    {darkMode ? (
                        <Sun size={16} color="#F59E0B" />
                    ) : (
                        <Moon size={16} color="#6345ED" />
                    )}
                </button>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifs(!showNotifs)}
                        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                        style={{
                            background: darkMode ? "#22262F" : "white",
                            border: `1px solid ${darkMode ? "#2D3139" : "#E5E7EB"}`,
                        }}
                    >
                        <Bell size={16} color={darkMode ? "#9CA3AF" : "#6B7280"} />
                        {unreadCount > 0 && (
                            <span
                                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                                style={{ background: "#EF4444" }}
                            />
                        )}
                    </button>

                    {showNotifs && (
                        <div className="absolute top-full right-0 mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden z-50 border animate-in fade-in slide-in-from-top-2 duration-200"
                            style={{
                                background: darkMode ? "#12141A" : "white",
                                borderColor: darkMode ? "#2D3139" : "#E5E7EB"
                            }}>
                            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: darkMode ? "#2D3139" : "#F3F4F6" }}>
                                <h4 className="text-sm font-bold" style={{ color: darkMode ? "#F3F4F6" : "#111827", fontFamily: "Poppins" }}>Notifications</h4>
                                <button onClick={markAllRead} className="text-[10px] font-bold text-[#6345ED] hover:underline uppercase tracking-wider">Mark all read</button>
                            </div>
                            <div className="max-h-[350px] overflow-y-auto">
                                {notifs.map(n => (
                                    <div key={n.id} className="px-4 py-3 border-b last:border-0 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
                                        style={{ borderColor: darkMode ? "#2D3139" : "#F3F4F6" }}>
                                        <div className="flex items-start justify-between mb-1">
                                            <span className="text-[12px] font-bold" style={{ color: darkMode ? "#E5E7EB" : "#111827", fontFamily: "Poppins" }}>{n.title}</span>
                                            {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-[#6345ED] mt-1" />}
                                        </div>
                                        <p className="text-[11px] leading-relaxed mb-1" style={{ color: "#9CA3AF", fontFamily: "Poppins" }}>{n.text}</p>
                                        <span className="text-[9px] font-medium text-gray-400">{n.time}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-2.5 text-[11px] font-bold text-center border-t transition hover:bg-gray-50"
                                style={{ borderColor: darkMode ? "#2D3139" : "#F3F4F6", color: "#9CA3AF" }}>
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-2.5 pl-2">
                    <div className="text-right hidden sm:block">
                        <p
                            className="text-sm font-semibold leading-none mb-0.5"
                            style={{
                                color: darkMode ? "#E5E7EB" : "#1A1D23",
                                fontFamily: "Poppins, sans-serif",
                            }}
                        >
                            Alex Kumar
                        </p>
                        <p
                            className="text-xs"
                            style={{ color: "#9CA3AF", fontFamily: "Poppins, sans-serif" }}
                        >
                            alex@college.edu
                        </p>
                    </div>
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-semibold shrink-0"
                        style={{ background: "linear-gradient(135deg, #6345ED, #9B85FD)" }}
                    >
                        AK
                    </div>
                </div>
            </div>
        </header>
    );
}
