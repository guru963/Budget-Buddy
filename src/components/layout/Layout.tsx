import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useApp } from "../../context/AppContext";

export default function Layout() {
    const { darkMode } = useApp();

    return (
        <div
            className="min-h-screen"
            style={{
                background: darkMode ? "#0F1117" : "#F8F9FC",
                fontFamily: "Poppins, sans-serif",
            }}
        >
            <Sidebar />
            <Topbar />
            <main
                className="transition-all duration-300"
                style={{
                    marginLeft: "var(--sidebar-width, 220px)",
                    minHeight: "100vh",
                    paddingTop: "var(--topbar-height, 64px)",
                }}
            >
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}