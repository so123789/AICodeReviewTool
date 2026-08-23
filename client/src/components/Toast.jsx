import { useEffect } from "react";

export default function Toast({ type = "success", title, message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const config = {
    success: { icon: "✓", color: "var(--success)", bg: "var(--success-dim)", border: "var(--success)" },
    error:   { icon: "✕", color: "var(--error)",   bg: "var(--error-dim)",   border: "var(--error)"   },
    warning: { icon: "⚠", color: "var(--warning)", bg: "var(--warning-dim)", border: "var(--warning)" },
    info:    { icon: "ℹ", color: "var(--info)",    bg: "var(--info-dim)",    border: "var(--info)"    },
  }[type];

  return (
    <div style={{ ...s.toast, background: config.bg, borderLeft: `4px solid ${config.border}` }}>
      <span style={{ ...s.icon, color: config.color }}>{config.icon}</span>
      <div style={s.body}>
        {title && <div style={{ ...s.title, color: config.color }}>{title}</div>}
        {message && <div style={s.msg}>{message}</div>}
      </div>
      <button onClick={onClose} style={s.close}>✕</button>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div style={s.container}>
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={() => onClose(t.id)} />
      ))}
    </div>
  );
}

// Hook
import { useState, useCallback } from "react";
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, addToast, removeToast };
}

const s = {
  container: {
    position: "fixed", top: 20, right: 20,
    zIndex: 9999, display: "flex", flexDirection: "column", gap: 10,
    maxWidth: 380,
  },
  toast: {
    display: "flex", alignItems: "flex-start", gap: 12,
    padding: "14px 16px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    boxShadow: "var(--card-shadow)",
    animation: "slideDown 0.25s ease",
    minWidth: 300,
  },
  icon: { fontSize: 16, fontWeight: 700, marginTop: 1, flexShrink: 0 },
  body: { flex: 1 },
  title: { fontWeight: 700, fontSize: 14, marginBottom: 2 },
  msg: { fontSize: 13, color: "var(--text2)" },
  close: {
    background: "none", color: "var(--text3)",
    padding: "0 4px", fontSize: 12, flexShrink: 0,
  },
};
