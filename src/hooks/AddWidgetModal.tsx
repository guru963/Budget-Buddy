import { X, Plus, BarChart2, PieChart, List, Target } from "lucide-react";
import { useState } from "react";
import { useWidgets, type WidgetKey, WIDGET_LABELS } from "./useWidget";

interface Props {
    onClose: () => void;
    dark: boolean;
}

const WIDGET_ICONS: Record<WidgetKey, React.ReactNode> = {
    summaryCards: <BarChart2 size={20} color="#6345ED" />,
    moneyFlow: <BarChart2 size={20} color="#6345ED" />,
    budget: <PieChart size={20} color="#6345ED" />,
    recentTransactions: <List size={20} color="#6345ED" />,
    savingGoals: <Target size={20} color="#6345ED" />,
};

export default function AddWidgetModal({ onClose, dark }: Props) {
    const { widgets, toggleWidget } = useWidgets();
    const [added, setAdded] = useState<WidgetKey | null>(null);

    const handleAdd = (key: WidgetKey) => {
        if (!widgets[key]) {
            toggleWidget(key);
        }
        setAdded(key);
        setTimeout(() => setAdded(null), 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className="relative w-full max-w-sm rounded-3xl p-6 shadow-2xl z-10"
                style={{
                    background: dark ? "#1A1D23" : "white",
                    border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`,
                    fontFamily: "Poppins, sans-serif",
                }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2
                            className="text-lg font-bold"
                            style={{ color: dark ? "#F3F4F6" : "#111827" }}
                        >
                            Add Widget
                        </h2>
                        <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                            Add hidden widgets back to your dashboard
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}` }}
                    >
                        <X size={14} color={dark ? "#9CA3AF" : "#6B7280"} />
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    {(Object.keys(WIDGET_LABELS) as WidgetKey[]).map((key) => (
                        <div
                            key={key}
                            className="flex items-center justify-between px-4 py-3 rounded-2xl"
                            style={{
                                background: dark ? "#22262F" : "#F8F9FC",
                                border: `1px solid ${dark ? "#2D3139" : "#F0EEF8"}`,
                            }}
                        >
                            <div className="flex items-center gap-3">
                                {WIDGET_ICONS[key]}
                                <span
                                    className="text-sm font-semibold"
                                    style={{ color: dark ? "#D1D5DB" : "#374151" }}
                                >
                                    {WIDGET_LABELS[key]}
                                </span>
                            </div>
                            <button
                                onClick={() => handleAdd(key)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                                style={{
                                    background:
                                        added === key
                                            ? "#DCFCE7"
                                            : widgets[key]
                                                ? dark ? "#2D3139" : "#F3F4F6"
                                                : "#EDE9FE",
                                    color:
                                        added === key
                                            ? "#16A34A"
                                            : widgets[key]
                                                ? "#9CA3AF"
                                                : "#6345ED",
                                }}
                            >
                                {added === key ? (
                                    "✓ Added"
                                ) : widgets[key] ? (
                                    "Visible"
                                ) : (
                                    <>
                                        <Plus size={11} /> Add
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                    style={{ background: "#6345ED" }}
                >
                    Close
                </button>
            </div>
        </div>
    );
}