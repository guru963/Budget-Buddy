import { createContext, useContext, useState } from "react";

type Role = "viewer" | "admin";

interface AppContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
    role: Role;
    setRole: (role: Role) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);
    const [role, setRole] = useState<Role>("viewer");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <AppContext.Provider
            value={{
                darkMode,
                toggleDarkMode: () => setDarkMode((prev) => !prev),
                role,
                setRole,
                sidebarCollapsed,
                setSidebarCollapsed,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}