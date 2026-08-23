import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";

const LANGUAGES = ["javascript","typescript","python","java","cpp","c","go","rust","php","ruby","kotlin","swift","sql","html","css"];

const SEVERITY_CONFIG = {
  critical: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", dot: "🔴", label: "Critical" },
  high:     { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  dot: "🟠", label: "High" },
  medium:   { color: "#facc15", bg: "rgba(250,204,21,0.1)",  border: "rgba(250,204,21,0.3)",  dot: "🟡", label: "Medium" },
  low:      { color: "#38bdf8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.3)",  dot: "🔵", label: "Low" },
  good:     { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)",   dot: "🟢", label: "Good" },
};

function parseFindings(markdown) {
  // Extract structured findings from Claude's markdown response
  const sections = markdown.split(/(?=^#{1,3}\s)/m).filter(Boolean);
  const findings = [];
  let summary = "";

  const severityMap = {
    bug: "critical", error: "critical", critical: "critical",
    security: "high", vulnerability: "high", warning: "high",
    performance: "medium", quality: "medium", medium: "medium",
    suggestion: "low", low: "low", practice: "low",
    good: "good", excellent: "good", positive: "good",
  };

  sections.forEach((section, i) => {
    const lines = section.trim().split("\n");
    const heading = lines[0].replace(/^#+\s*/, "").trim();
    const body = lines.slice(1).join("\n").trim();

    if (heading.toLowerCase().includes("summary") || heading.match(/\d+\s*\/\s*10/)) {
      summary = section;
      return;
    }

    let severity = "medium";
    const headingLower = heading.toLowerCase();
    for (const [key, val] of Object.entries(severityMap)) {
      if (headingLower.includes(key)) { severity = val; break; }
    }

    if (heading && body) {
      findings.push({ id: i, title: heading, body, severity });
    }
  });

  return { findings, summary, raw: markdown };
}

export default function Dashboard() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("structured"); // structured | raw
  const [severityFilter, setSeverityFilter] = useState("all");
  const [copied, setCopied] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "Developer";

  const handleReview = async () => {
    if (!code.trim()) {
      addToast({ type: "warning", title: "No Code", message: "Paste some code first!" });
      return;
    }
    setLoading(true);
    setResult(null);
    setSelected(null);
    setSeverityFilter("all");
    try {
      const { data } = await API.post("/review", { code, language });
      const parsed = parseFindings(data.feedback);
      setResult(parsed);
      if (parsed.findings.length > 0) setSelected(parsed.findings[0]);
      addToast({ type: "success", title: "Review Complete", message: `Found ${parsed.findings.length} finding(s).` });
    } catch (err) {
      addToast({ type: "error", title: "Review Failed", message: err.response?.data?.error || "Check your server connection." });
    }
    setLoading(false);
  };

  const handleFilterChange = (filter) => {
    if (!result) return;
    setSeverityFilter(filter);
    const newFiltered = filter === "all"
      ? result.findings
      : result.findings.filter((f) => f.severity === filter);
    if (newFiltered.length > 0) {
      setSelected(newFiltered[0]);
    } else {
      setSelected(null);
    }
  };

  const handleCopyRawReport = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.raw);
    setCopied(true);
    addToast({ type: "success", title: "Copied", message: "Full report copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const severityCounts = result
    ? Object.keys(SEVERITY_CONFIG).reduce((acc, k) => {
        acc[k] = result.findings.filter((f) => f.severity === k).length;
        return acc;
      }, {})
    : null;

  const filteredFindings = result
    ? (severityFilter === "all"
        ? result.findings
        : result.findings.filter((f) => f.severity === severityFilter))
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div style={s.page}>
        {/* Left panel — code input */}
        <div style={s.leftPanel}>
          <div style={s.panelHeader}>
            <h2 style={s.panelTitle}>Code Editor</h2>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={s.select}>
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          <div style={s.editorWrap}>
            <div style={s.editorBar}>
              <span style={s.editorDot} />
              <span style={s.editorDot} />
              <span style={s.editorDot} />
              <span style={{ fontSize: 11, color: "var(--text3)", marginLeft: 8 }}>{language}</span>
            </div>
            <textarea
              style={s.editor}
              rows={20}
              placeholder={`// Paste your ${language} code here...\n// Claude AI will analyze it for:\n// • Bugs & errors\n// • Security issues\n// • Performance problems\n// • Best practices`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div style={s.editorActions}>
            <button onClick={() => { setCode(""); setResult(null); setSelected(null); }} style={s.clearBtn}>
              Clear
            </button>
            <button onClick={handleReview} disabled={loading} style={s.reviewBtn}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={s.spinner} />Analyzing...
                </span>
              ) : "🔍 Review Code"}
            </button>
          </div>
        </div>

        {/* Right panel — results */}
        <div style={s.rightPanel}>
          {/* Empty state */}
          {!result && !loading && (
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>🔍</div>
              <h3 style={{ marginBottom: 8 }}>Ready to Review</h3>
              <p style={{ color: "var(--text3)", fontSize: 14, maxWidth: 280, textAlign: "center" }}>
                Paste your code on the left and click Review Code to get AI feedback.
              </p>
              <div style={s.emptyHints}>
                {["Bug detection", "Security analysis", "Performance insights", "Best practices"].map((h) => (
                  <span key={h} style={s.emptyHint}>✓ {h}</span>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={s.emptyState}>
              <div style={{ ...s.spinner, width: 36, height: 36, borderWidth: 3, marginBottom: 16 }} />
              <h3 style={{ marginBottom: 8 }}>Analyzing Your Code</h3>
              <p style={{ color: "var(--text3)", fontSize: 14 }}>Claude AI is reviewing for bugs, security, and quality...</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div style={s.results}>
              {/* Summary bar */}
              <div style={s.summaryBar}>
                {/* All filter item */}
                <div
                  onClick={() => handleFilterChange("all")}
                  style={{
                    ...s.summaryItem,
                    background: severityFilter === "all" ? "var(--bg4)" : "var(--bg3)",
                    border: severityFilter === "all" ? "1.5px solid var(--primary)" : "1.5px solid var(--border)",
                    cursor: "pointer",
                    opacity: 1,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 13 }}>📊</span>
                  <span style={{ color: "var(--text)", fontWeight: 700 }}>{result.findings.length}</span>
                  <span style={{ fontSize: 11, color: "var(--text2)" }}>All</span>
                </div>

                {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => {
                  const isActive = severityFilter === key;
                  return (
                    <div
                      key={key}
                      onClick={() => handleFilterChange(key)}
                      style={{
                        ...s.summaryItem,
                        background: cfg.bg,
                        border: isActive ? `1.5px solid ${cfg.color}` : `1.5px solid ${cfg.border}`,
                        cursor: "pointer",
                        opacity: isActive || severityFilter === "all" ? 1 : 0.5,
                        transform: isActive ? "scale(1.05)" : "scale(1)",
                        transition: "all 0.2s",
                      }}
                    >
                      <span>{cfg.dot}</span>
                      <span style={{ color: cfg.color, fontWeight: 700 }}>{severityCounts[key]}</span>
                      <span style={{ fontSize: 11, color: "var(--text3)" }}>{cfg.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Tab switcher */}
              <div style={s.tabs}>
                <button onClick={() => setTab("structured")} style={{ ...s.tab, ...(tab === "structured" ? s.tabActive : {}) }}>
                  Findings
                </button>
                <button onClick={() => setTab("raw")} style={{ ...s.tab, ...(tab === "raw" ? s.tabActive : {}) }}>
                  Full Report
                </button>
              </div>

              {tab === "structured" && (
                <div style={s.splitView}>
                  {/* Finding list */}
                  <div style={s.findingList}>
                    {filteredFindings.length === 0 && (
                      <div style={{ padding: 20, color: "var(--text3)", fontSize: 13, textAlign: "center" }}>
                        🟢 No {severityFilter !== "all" ? severityFilter : ""} findings.
                      </div>
                    )}
                    {filteredFindings.map((f) => {
                      const cfg = SEVERITY_CONFIG[f.severity];
                      return (
                        <div
                          key={f.id}
                          onClick={() => setSelected(f)}
                          style={{
                            ...s.findingItem,
                            borderLeft: `3px solid ${cfg.color}`,
                            background: selected?.id === f.id ? cfg.bg : "var(--bg2)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <span style={{ fontSize: 10 }}>{cfg.dot}</span>
                            <span style={{ ...s.severityBadge, color: cfg.color, background: cfg.bg }}>
                              {cfg.label}
                            </span>
                          </div>
                          <div style={s.findingTitle}>{f.title}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Finding detail */}
                  <div style={s.findingDetail}>
                    {!selected && (
                      <p style={{ color: "var(--text3)", fontSize: 14, textAlign: "center", marginTop: 20 }}>
                        Select a finding from the left
                      </p>
                    )}
                    {selected && (() => {
                      const cfg = SEVERITY_CONFIG[selected.severity];
                      return (
                        <div className="fade-in">
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <span style={{ ...s.severityBadge, color: cfg.color, background: cfg.bg, padding: "4px 10px", fontSize: 12 }}>
                              {cfg.dot} {cfg.label}
                            </span>
                            <h3 style={{ fontSize: 16 }}>{selected.title}</h3>
                          </div>
                          <div className="md-content">
                            <ReactMarkdown>{selected.body}</ReactMarkdown>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {tab === "raw" && (
                <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                  <div style={s.rawReportHeader}>
                    <button onClick={handleCopyRawReport} style={s.copyBtn}>
                      {copied ? "✅ Copied!" : "📋 Copy Report"}
                    </button>
                  </div>
                  <div style={s.rawReport}>
                    <div className="md-content">
                      <ReactMarkdown>{result.raw}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    flex: 1, display: "flex", gap: 16,
    maxWidth: 1400, margin: "0 auto", width: "100%",
    padding: 20,
    flexWrap: "wrap",
  },
  leftPanel: {
    flex: "0 0 420px", minWidth: 300,
    display: "flex", flexDirection: "column", gap: 12,
  },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  panelTitle: { fontSize: 15, fontWeight: 700 },
  select: { width: "auto", padding: "6px 10px", fontSize: 13 },
  editorWrap: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 10, overflow: "hidden",
    boxShadow: "var(--card-shadow)",
  },
  editorBar: {
    background: "var(--bg3)", padding: "8px 14px",
    display: "flex", alignItems: "center", gap: 5,
    borderBottom: "1px solid var(--border)",
  },
  editorDot: {
    width: 9, height: 9, borderRadius: "50%",
    background: "var(--border2)", display: "inline-block",
  },
  editor: {
    fontFamily: "'Fira Code', 'Courier New', monospace",
    fontSize: 13, lineHeight: 1.65,
    resize: "vertical", background: "var(--bg2)",
    border: "none", color: "var(--text)",
    padding: 16, width: "100%",
    minHeight: 360,
  },
  editorActions: { display: "flex", gap: 10 },
  clearBtn: {
    background: "var(--bg3)", color: "var(--text2)",
    border: "1px solid var(--border)", padding: "10px 20px",
    flex: "0 0 auto",
  },
  reviewBtn: {
    background: "var(--primary)", color: "#fff",
    padding: "10px 0", flex: 1, fontSize: 15,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  spinner: {
    width: 16, height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
  rightPanel: {
    flex: 1, minWidth: 300,
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 10, overflow: "hidden",
    boxShadow: "var(--card-shadow)",
    display: "flex", flexDirection: "column",
    height: 580, // fixed height to ensure internal scrolling works
  },
  emptyState: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: 40, gap: 8,
  },
  emptyIcon: { fontSize: 48, marginBottom: 8, opacity: 0.4 },
  emptyHints: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, justifyContent: "center" },
  emptyHint: {
    background: "var(--bg3)", border: "1px solid var(--border)",
    borderRadius: 20, padding: "4px 12px",
    fontSize: 12, color: "var(--text3)",
  },
  results: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  summaryBar: {
    display: "flex", gap: 8, padding: "14px 16px",
    borderBottom: "1px solid var(--border)",
    flexWrap: "wrap",
  },
  summaryItem: {
    display: "flex", alignItems: "center", gap: 5,
    padding: "5px 10px", borderRadius: 8, fontSize: 12,
  },
  tabs: {
    display: "flex", borderBottom: "1px solid var(--border)",
    padding: "0 16px",
  },
  tab: {
    background: "none", color: "var(--text3)",
    padding: "10px 16px", borderRadius: 0, fontSize: 13,
    borderBottom: "2px solid transparent",
  },
  tabActive: { color: "var(--primary)", borderBottomColor: "var(--primary)" },
  splitView: {
    flex: 1, display: "flex", overflow: "hidden",
  },
  findingList: {
    width: 220, flexShrink: 0,
    borderRight: "1px solid var(--border)",
    overflowY: "auto",
    display: "flex", flexDirection: "column",
  },
  findingItem: {
    padding: "12px 14px", cursor: "pointer",
    borderBottom: "1px solid var(--border)",
    transition: "background 0.15s",
  },
  findingTitle: { fontSize: 12, color: "var(--text2)", fontWeight: 500, lineHeight: 1.4 },
  severityBadge: {
    fontSize: 10, fontWeight: 700, padding: "2px 6px",
    borderRadius: 4, textTransform: "uppercase", letterSpacing: 0.5,
  },
  findingDetail: {
    flex: 1, padding: 20, overflowY: "auto",
  },
  rawReportHeader: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "8px 16px",
    background: "var(--bg3)",
    borderBottom: "1px solid var(--border)",
  },
  copyBtn: {
    background: "var(--bg2)",
    color: "var(--text2)",
    border: "1.5px solid var(--border)",
    padding: "5px 12px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  },
  rawReport: {
    flex: 1, padding: 24, overflowY: "auto",
  },
};
