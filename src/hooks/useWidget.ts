import { useState, useEffect } from "react";

export type WidgetKey =
  | "summaryCards"
  | "moneyFlow"
  | "budget"
  | "recentTransactions"
  | "savingGoals";

export const WIDGET_LABELS: Record<WidgetKey, string> = {
  summaryCards: "Summary Cards",
  moneyFlow: "Money Flow",
  budget: "Budget",
  recentTransactions: "Recent Transactions",
  savingGoals: "Saving Goals",
};

const DEFAULT_WIDGETS: Record<WidgetKey, boolean> = {
  summaryCards: true,
  moneyFlow: true,
  budget: true,
  recentTransactions: true,
  savingGoals: true,
};

export function useWidgets() {
  const [widgets, setWidgets] = useState<Record<WidgetKey, boolean>>(() => {
    try {
      const stored = localStorage.getItem("dashboard_widgets");
      return stored ? JSON.parse(stored) : DEFAULT_WIDGETS;
    } catch {
      return DEFAULT_WIDGETS;
    }
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("dashboard_widgets", JSON.stringify(widgets));
    // Notify other instances in the same tab
    window.dispatchEvent(new Event("widgets-sync"));
  }, [widgets]);

  // Listen for changes from other instances
  useEffect(() => {
    const handleSync = () => {
      const stored = localStorage.getItem("dashboard_widgets");
      if (stored) {
        const parsed = JSON.parse(stored);
        setWidgets((prev) => {
          // Only update if actually different to avoid infinite loops
          if (JSON.stringify(prev) === stored) return prev;
          return parsed;
        });
      }
    };

    window.addEventListener("widgets-sync", handleSync);
    // Also sync across tabs
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("widgets-sync", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const toggleWidget = (key: WidgetKey) => {
    setWidgets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetWidgets = () => setWidgets(DEFAULT_WIDGETS);

  return { widgets, toggleWidget, resetWidgets };
}