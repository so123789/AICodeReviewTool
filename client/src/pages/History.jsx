import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";

export default function History() {
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("feedback"); // feedback | code
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    API.get("/review/history")
      .then(({ data }) => {
        setReviews(data);
        if (data.length > 0) setSelected(data[0]);
      })
      .catch(() => addToast({ type: "error", title: "Error", message: "Failed to load review history." }))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (iso) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  const LANG_COLORS = {
    javascript: "#f0db4f", typescript: "#3178c6", python: "#3572a5",
    java: "#b07219", go: "#00add8", rust: "#dea584",
    php: "#4f5d95", ruby: "#701516", cpp: "#f34b7d",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div style={s.layout}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={s.sideHeader}>
            <h2 style={{ fontSize: 15, fontWeight: 700 }}>Review History</h2>
            <span style={s.count}>{reviews.length}</span>
          </div>

          {loading && <div style={s.sideEmpty}>Loading...</div>}
          {!loading && reviews.length === 0 && (
            <div style={s.sideEmpty}>No reviews yet.<br /><a href="/dashboard">Start reviewing →</a></div>
          )}

          {reviews.map((r) => {
            const langColor = LANG_COLORS[r.language] || "var(--primary)";
            const isActive = selected?._id === r._id;
            return (
              <div
                key={r._id}
                onClick={() => setSelected(r)}
                style={{
                  ...s.sideItem,
                  background: isActive ? "var(--primary-dim)" : "transparent",
                  borderLeft: isActive ? "3px solid var(--primary)" : "3px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ ...s.langDot, background: langColor }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{r.language}</span>
                  <span style={{ fontSize: 11, color: "var(--text3)", marginLeft: "auto" }}>{fmt(r.createdAt)}</span>
                </div>
                <p style={s.snippet}>{r.code.slice(0, 70)}…</p>
              </div>
            );
          })}
        </div>

        {/* Main */}
        <div style={s.main}>
          {!selected && !loading && (
            <div style={s.empty}>
              <div style={{ fontSize: 48, opacity: 0.3, marginBottom: 12 }}>📋</div>
              <h3>No Review Selected</h3>
              <p style={{ color: "var(--text3)" }}>Pick a review from the sidebar</p>
            </div>
          )}

          {selected && (
            <div className="fade-in" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              {/* Header */}
              <div style={s.detailHeader}>
                <div>
                  <span style={s.langBadge}>{selected.language}</span>
                  <span style={{ fontSize: 13, color: "var(--text3)", marginLeft: 10 }}>{fmt(selected.createdAt)}</span>
                </div>
                <div style={s.viewTabs}>
                  {["feedback", "code"].map((v) => (
                    <button key={v} onClick={() => setView(v)} style={{ ...s.viewTab, ...(view === v ? s.viewTabActive : {}) }}>
                      {v === "feedback" ? "AI Feedback" : "Submitted Code"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div style={s.detailBody}>
                {view === "feedback" && (
                  <div className="md-content">
                    <ReactMarkdown>{selected.feedback}</ReactMarkdown>
                  </div>
                )}
                {view === "code" && (
                  <pre style={s.codeBlock}>{selected.code}</pre>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  layout: { flex: 1, display: "flex", overflow: "hidden", height: "calc(100vh - 64px)" },
  sidebar: {
    width: 300, flexShrink: 0,
    background: "var(--bg2)", borderRight: "1px solid var(--border)",
    display: "flex", flexDirection: "column",
    overflowY: "auto",
  },
  sideHeader: {
    padding: "16px 16px 12px",
    borderBottom: "1px solid var(--border)",
    display: "flex", alignItems: "center", gap: 8,
    position: "sticky", top: 0, background: "var(--bg2)", zIndex: 1,
  },
  count: {
    background: "var(--primary-dim)", color: "var(--primary)",
    borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700,
  },
  sideEmpty: { padding: 20, color: "var(--text3)", fontSize: 14, textAlign: "center", marginTop: 20 },
  sideItem: {
    padding: "12px 16px", cursor: "pointer",
    borderBottom: "1px solid var(--border)",
    transition: "background 0.15s",
  },
  langDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  snippet: { fontSize: 11, color: "var(--text3)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  main: { flex: 1, overflowY: "auto" },
  empty: { height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 },
  detailHeader: {
    padding: "16px 24px",
    borderBottom: "1px solid var(--border)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 12,
    position: "sticky", top: 0, background: "var(--bg)", zIndex: 1,
  },
  langBadge: {
    background: "var(--primary-dim)", color: "var(--primary)",
    padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700,
  },
  viewTabs: { display: "flex", gap: 4 },
  viewTab: {
    background: "var(--bg3)", color: "var(--text2)",
    border: "1px solid var(--border)", padding: "6px 14px",
    fontSize: 13, borderRadius: 8,
  },
  viewTabActive: { background: "var(--primary-dim)", color: "var(--primary)", borderColor: "var(--primary)" },
  detailBody: { padding: 24 },
  codeBlock: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 10, padding: 20,
    fontFamily: "monospace", fontSize: 13,
    whiteSpace: "pre-wrap", color: "var(--text)",
    lineHeight: 1.65,
  },
};
