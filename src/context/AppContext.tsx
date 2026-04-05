import { createContext, useContext, useState } from "react";

type Role = "viewer" | "admin";

interface AppContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
    role: Role;
    setRole: (role: Role) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);
    const [role, setRole] = useState<Role>("viewer");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return (
        <AppContext.Provider
            value={{
                darkMode,
                toggleDarkMode: () => setDarkMode((prev) => !prev),
                role,
                setRole,
                sidebarCollapsed,
                setSidebarCollapsed,
                mobileMenuOpen,
                setMobileMenuOpen,
                isAuthenticated,
                login,
                logout,
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