import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";
import { Icons } from "../components/Icons";

export default function History() {
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("feedback");
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    API.get("/review/history")
      .then(({ data }) => {
        const list = data.reviews || [];
        setReviews(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(() => addToast({ type: "error", title: "Error", message: "Failed to load review history." }))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (iso) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div style={s.layout}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={s.sideHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icons.History size={16} color="var(--primary)" />
              <h2 style={{ fontSize: 14, fontWeight: 700 }}>Review History</h2>
            </div>
            <span style={s.count}>{reviews.length}</span>
          </div>

          {loading && (
            <div style={s.sideEmpty}>
              <span style={{ ...s.spinner, marginBottom: 8 }} />
              <div>Loading past reviews...</div>
            </div>
          )}

          {!loading && reviews.length === 0 && (
            <div style={s.sideEmpty}>
              <Icons.FileText size={24} color="var(--text3)" style={{ marginBottom: 8 }} />
              <div>No reviews recorded yet.</div>
              <a href="/dashboard" style={{ marginTop: 8, fontSize: 13, fontWeight: 600 }}>Run your first review →</a>
            </div>
          )}

          {reviews.map((r) => {
            const isActive = selected?._id === r._id;
            return (
              <div
                key={r._id}
                onClick={() => setSelected(r)}
                style={{
                  ...s.sideItem,
                  background: isActive ? "var(--primary-dim)" : "transparent",
                  borderLeftColor: isActive ? "var(--primary)" : "transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={s.langBadge}>{r.language.toUpperCase()}</span>
                  <span style={{ fontSize: 11, color: "var(--text3)", marginLeft: "auto" }}>{fmt(r.createdAt)}</span>
                </div>
                <p style={s.snippet}>{r.code.slice(0, 60)}…</p>
              </div>
            );
          })}
        </div>

        {/* Main detail view */}
        <div style={s.main}>
          {!selected && !loading && (
            <div style={s.empty}>
              <Icons.History size={40} color="var(--text3)" style={{ opacity: 0.4 }} />
              <h3 style={{ marginTop: 12, marginBottom: 4 }}>No Review Selected</h3>
              <p style={{ color: "var(--text3)", fontSize: 13.5 }}>Pick a past review session from the sidebar</p>
            </div>
          )}

          {selected && (
            <div className="fade-in" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              {/* Detail Header Bar */}
              <div style={s.detailHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={s.activeLangBadge}>{selected.language.toUpperCase()}</span>
                  <span style={{ fontSize: 13, color: "var(--text3)" }}>Audited on {fmt(selected.createdAt)}</span>
                </div>
                
                <div style={s.viewTabs}>
                  <button
                    onClick={() => setView("feedback")}
                    style={{ ...s.viewTab, ...(view === "feedback" ? s.viewTabActive : {}) }}
                  >
                    <Icons.Sparkles size={14} /> AI Feedback
                  </button>
                  <button
                    onClick={() => setView("code")}
                    style={{ ...s.viewTab, ...(view === "code" ? s.viewTabActive : {}) }}
                  >
                    <Icons.Code size={14} /> Submitted Code
                  </button>
                </div>
              </div>

              {/* Detail Body Content */}
              <div style={s.detailBody}>
                {view === "feedback" && (
                  <div className="md-content">
                    <ReactMarkdown>{selected.feedback}</ReactMarkdown>
                  </div>
                )}

                {view === "code" && (
                  <div style={s.codeContainer}>
                    <pre style={s.codeBlock}>{selected.code}</pre>
                  </div>
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
  layout: { flex: 1, display: "flex", overflow: "hidden", height: "calc(100vh - 62px)" },
  sidebar: {
    width: 320,
    flexShrink: 0,
    background: "var(--bg2)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  sideHeader: {
    padding: "14px 16px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    background: "var(--bg2)",
    zIndex: 1,
  },
  count: {
    background: "var(--primary-dim)",
    color: "var(--primary)",
    borderRadius: 20,
    padding: "2px 8px",
    fontSize: 11.5,
    fontWeight: 700,
    border: "1px solid rgba(99,102,241,0.2)",
  },
  sideEmpty: {
    padding: 30,
    color: "var(--text3)",
    fontSize: 13.5,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  sideItem: {
    padding: "12px 16px",
    cursor: "pointer",
    borderBottom: "1px solid var(--border)",
    borderLeft: "3.5px solid transparent",
    transition: "all 0.15s ease",
  },
  langBadge: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "var(--primary)",
    background: "var(--primary-dim)",
    padding: "2px 6px",
    borderRadius: 4,
    fontFamily: "'JetBrains Mono', monospace",
  },
  activeLangBadge: {
    fontSize: 11.5,
    fontWeight: 800,
    color: "var(--primary)",
    background: "var(--primary-dim)",
    padding: "3px 8px",
    borderRadius: 6,
    border: "1px solid rgba(99,102,241,0.25)",
    fontFamily: "'JetBrains Mono', monospace",
  },
  snippet: {
    fontSize: 12,
    color: "var(--text2)",
    fontFamily: "'JetBrains Mono', monospace",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  main: { flex: 1, overflowY: "auto", background: "var(--bg)" },
  empty: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  detailHeader: {
    padding: "14px 24px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    position: "sticky",
    top: 0,
    background: "var(--glass-bg)",
    backdropFilter: "blur(12px)",
    zIndex: 1,
  },
  viewTabs: { display: "flex", gap: 6 },
  viewTab: {
    background: "var(--bg3)",
    color: "var(--text2)",
    border: "1px solid var(--border)",
    padding: "6px 14px",
    fontSize: 12.5,
    fontWeight: 600,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  viewTabActive: {
    background: "var(--primary-dim)",
    color: "var(--primary)",
    borderColor: "var(--primary)",
  },
  detailBody: { padding: 24 },
  codeContainer: {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: 20,
    overflowX: "auto",
  },
  codeBlock: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    whiteSpace: "pre-wrap",
    color: "var(--text)",
    lineHeight: 1.65,
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid var(--border2)",
    borderTopColor: "var(--primary)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
};
