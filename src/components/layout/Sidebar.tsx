import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ArrowLeftRight,
    Wallet,
    Target,
    PieChart,
    Lightbulb,
    Settings,
    HelpCircle,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useEffect } from "react";
import Logo from "../../assets/logo.png";

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/" },
    { label: "Transactions", icon: ArrowLeftRight, to: "/transactions" },
    { label: "Wallet", icon: Wallet, to: "/wallet" },
    { label: "Goals", icon: Target, to: "/goals" },
    { label: "Budget", icon: PieChart, to: "/budget" },
    { label: "Insights", icon: Lightbulb, to: "/insights" },
];

const bottomItems = [
    { label: "Settings", icon: Settings, to: "/settings" },
    { label: "Help", icon: HelpCircle, to: "/help" },
];

export default function Sidebar() {
    const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useApp();
    const navigate = useNavigate();

    // Set a CSS variable for the sidebar width to help with global layout
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--sidebar-width",
            collapsed ? "72px" : "220px"
        );
    }, [collapsed]);

    return (
        <aside
            className="fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out"
            style={{
                width: collapsed ? "72px" : "220px",
                background: "linear-gradient(180deg, #6345ED 0%, #4A30C2 100%)",
                boxShadow: "4px 0 24px rgba(0, 0, 0, 0.15)",
            }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-6 mb-2">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center overflow-hidden">
                    <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                {!collapsed && (
                    <span
                        className="text-white font-bold text-lg tracking-tight"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                        BudgetBuddy
                    </span>
                )}
            </div>


            {/* Main Nav */}
            <nav className="flex-1 flex flex-col gap-1 px-2">
                {navItems.map(({ label, icon: Icon, to }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive
                                ? "bg-white text-[#6345ED] shadow-md font-medium"
                                : "text-white hover:bg-white/15 hover:text-white"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon
                                    size={18}
                                    className="shrink-0"
                                    color={isActive ? "#6345ED" : "currentColor"}
                                />
                                {!collapsed && (
                                    <span className="text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                                        {label}
                                    </span>
                                )}
                                {collapsed && (
                                    <div
                                        className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50"
                                        style={{ background: "#1A1D23" }}
                                    >
                                        {label}
                                    </div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Nav */}
            <div className="flex flex-col gap-1 px-2 mb-4">
                {bottomItems.map(({ label, icon: Icon, to }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive
                                ? "bg-white text-[#6345ED] shadow-md font-medium"
                                : "text-white hover:bg-white/15 hover:text-white"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon
                                    size={18}
                                    className="shrink-0"
                                    color={isActive ? "#6345ED" : "currentColor"}
                                />
                                {!collapsed && (
                                    <span className="text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                                        {label}
                                    </span>
                                )}
                                {collapsed && (
                                    <div
                                        className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50"
                                        style={{ background: "#1A1D23" }}
                                    >
                                        {label}
                                    </div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Logout */}
                <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white hover:bg-white/15 hover:text-white transition-all duration-200 group relative w-full"
                >
                    <LogOut size={18} className="shrink-0" />
                    {!collapsed && (
                        <span className="text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                            Log out
                        </span>
                    )}
                    {collapsed && (
                        <div
                            className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50"
                            style={{ background: "#1A1D23" }}
                        >
                            Log out
                        </div>
                    )}
                </button>
            </div>

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-8 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
                style={{ background: "white", border: "2px solid #E5E7EB" }}
            >
                {collapsed ? (
                    <ChevronRight size={12} color="#7C5CFC" />
                ) : (
                    <ChevronLeft size={12} color="#7C5CFC" />
                )}
            </button>
        </aside>
    );
}