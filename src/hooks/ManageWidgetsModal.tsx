import { X, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useWidgets, WIDGET_LABELS, type WidgetKey } from "./useWidget";

interface Props {
    onClose: () => void;
    dark: boolean;
}

export default function ManageWidgetsModal({ onClose, dark }: Props) {
    const { widgets, toggleWidget, resetWidgets } = useWidgets();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-sm rounded-3xl p-6 shadow-2xl z-10"
                style={{
                    background: dark ? "#1A1D23" : "white",
                    border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`,
                    fontFamily: "Poppins, sans-serif",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2
                            className="text-lg font-bold"
                            style={{ color: dark ? "#F3F4F6" : "#111827" }}
                        >
                            Manage Widgets
                        </h2>
                        <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                            Toggle widgets to show or hide them
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-gray-100 dark:hover:bg-gray-800"
                        style={{ border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}` }}
                    >
                        <X size={14} color={dark ? "#9CA3AF" : "#6B7280"} />
                    </button>
                </div>

                {/* Widget list */}
                <div className="flex flex-col gap-3">
                    {(Object.keys(WIDGET_LABELS) as WidgetKey[]).map((key) => (
                        <div
                            key={key}
                            className="flex items-center justify-between px-4 py-3 rounded-2xl transition cursor-pointer hover:opacity-80"
                            style={{
                                background: dark ? "#22262F" : "#F8F9FC",
                                border: `1px solid ${dark ? "#2D3139" : "#F0EEF8"}`,
                            }}
                            onClick={() => toggleWidget(key)}
                        >
                            <span
                                className="text-sm font-semibold"
                                style={{ color: dark ? "#D1D5DB" : "#374151" }}
                            >
                                {WIDGET_LABELS[key]}
                            </span>
                            <div
                                className="flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold"
                                style={{
                                    background: widgets[key]
                                        ? "#EDE9FE"
                                        : dark
                                            ? "#2D3139"
                                            : "#F3F4F6",
                                    color: widgets[key] ? "#6345ED" : "#9CA3AF",
                                }}
                            >
                                {widgets[key] ? (
                                    <Eye size={12} />
                                ) : (
                                    <EyeOff size={12} />
                                )}
                                {widgets[key] ? "Visible" : "Hidden"}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={resetWidgets}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition hover:opacity-80 flex-1 justify-center"
                        style={{
                            background: dark ? "#22262F" : "#F8F9FC",
                            border: `1px solid ${dark ? "#2D3139" : "#E5E7EB"}`,
                            color: dark ? "#D1D5DB" : "#374151",
                        }}
                    >
                        <RotateCcw size={12} /> Reset all
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition hover:opacity-90 flex-1 justify-center"
                        style={{ background: "#6345ED" }}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}