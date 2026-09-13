import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";
import { Icons } from "../components/Icons";

const LANGUAGES = [
  "javascript", "typescript", "python", "java", "cpp", "c", "go", "rust",
  "php", "ruby", "kotlin", "swift", "sql", "html", "css",
];

const SEVERITY_CONFIG = {
  critical: {
    color: "var(--error)",
    bg: "var(--error-dim)",
    border: "rgba(239, 68, 68, 0.3)",
    icon: Icons.AlertOctagon,
    label: "Critical",
  },
  high: {
    color: "var(--warning)",
    bg: "var(--warning-dim)",
    border: "rgba(245, 158, 11, 0.3)",
    icon: Icons.AlertTriangle,
    label: "High",
  },
  medium: {
    color: "var(--info)",
    bg: "var(--info-dim)",
    border: "rgba(6, 182, 212, 0.3)",
    icon: Icons.Info,
    label: "Medium",
  },
  low: {
    color: "var(--primary)",
    bg: "var(--primary-dim)",
    border: "rgba(99, 102, 241, 0.3)",
    icon: Icons.CheckCircle,
    label: "Low",
  },
  good: {
    color: "var(--success)",
    bg: "var(--success-dim)",
    border: "rgba(34, 197, 94, 0.3)",
    icon: Icons.CheckCircle,
    label: "Good",
  },
};

function parseFindings(markdown) {
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
  const [tab, setTab] = useState("structured");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [copied, setCopied] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const handleReview = async () => {
    if (!code.trim()) {
      addToast({ type: "warning", title: "No Code Entered", message: "Please paste code into the editor first." });
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
      addToast({ type: "success", title: "Review Complete", message: `Identified ${parsed.findings.length} findings.` });
    } catch (err) {
      addToast({ type: "error", title: "Review Failed", message: err.response?.data?.error || "Check backend connection." });
    }
    setLoading(false);
  };

  const handleFilterChange = (filter) => {
    if (!result) return;
    setSeverityFilter(filter);
    const newFiltered = filter === "all"
      ? result.findings
      : result.findings.filter((f) => f.severity === filter);
    setSelected(newFiltered.length > 0 ? newFiltered[0] : null);
  };

  const handleCopyRawReport = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.raw);
    setCopied(true);
    addToast({ type: "success", title: "Copied", message: "Full markdown report copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = code ? code.split("\n").length : 0;
  const charCount = code.length;

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

      <div style={s.container}>
        {/* Left Column — IDE Code Editor Panel */}
        <div style={s.editorPanel}>
          <div style={s.editorHeader}>
            <div style={s.editorTitleGroup}>
              <Icons.Code size={18} color="var(--primary)" />
              <h2 style={s.panelTitle}>Source Code</h2>
            </div>
            
            <div style={s.languageSelectorWrap}>
              <Icons.Terminal size={14} color="var(--text3)" />
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={s.select}>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={s.editorFrame}>
            <div style={s.editorWindowBar}>
              <div style={s.windowDots}>
                <span style={{ ...s.windowDot, background: "#ef4444" }} />
                <span style={{ ...s.windowDot, background: "#f59e0b" }} />
                <span style={{ ...s.windowDot, background: "#10b981" }} />
              </div>
              <span style={s.fileName}>snippet.{language}</span>
              <span style={s.editorStats}>{lineCount} lines · {charCount} chars</span>
            </div>

            <textarea
              style={s.textarea}
              rows={22}
              placeholder={`// Paste your ${language} code snippet here...\n// CodeReview.AI will analyze it across:\n// • Bugs & Runtime Exceptions\n// • Security Vulnerabilities\n// • Performance Bottlenecks\n// • Architectural Best Practices`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />

            {/* Sleek Bottom Action Toolbar */}
            <div style={s.editorFooterBar}>
              <button
                onClick={() => { setCode(""); setResult(null); setSelected(null); }}
                style={s.clearBtn}
                title="Clear code"
                disabled={!code && !result}
              >
                <Icons.Trash size={15} /> Clear
              </button>

              <button
                onClick={handleReview}
                disabled={loading || !code.trim()}
                style={s.submitReviewBtn}
              >
                {loading ? (
                  <>
                    <span style={s.spinner} />
                    <span>Analyzing Code...</span>
                  </>
                ) : (
                  <>
                    <Icons.Sparkles size={17} color="#fff" />
                    <span>Run AI Code Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column — AI Review Findings Dashboard */}
        <div style={s.resultsPanel}>
          {/* State 1: Empty state */}
          {!result && !loading && (
            <div style={s.emptyContainer}>
              <div style={s.emptyBadge}>
                <Icons.Sparkles size={20} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>Ready for Code Review</h3>
              <p style={{ color: "var(--text3)", fontSize: 13.5, maxWidth: 320, textAlign: "center", marginBottom: 20 }}>
                Paste your code snippet on the left and click <strong>Run AI Code Review</strong>.
              </p>
              <div style={s.featureGrid}>
                {[
                  { icon: Icons.Bug, label: "Bug Detection" },
                  { icon: Icons.Shield, label: "Security Analysis" },
                  { icon: Icons.Zap, label: "Performance" },
                  { icon: Icons.CheckCircle, label: "Best Practices" },
                ].map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={idx} style={s.featureCard}>
                      <ItemIcon size={16} color="var(--primary)" />
                      <span style={{ fontSize: 12.5, color: "var(--text2)", fontWeight: 500 }}>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* State 2: Loading animation */}
          {loading && (
            <div style={s.emptyContainer}>
              <div style={s.loadingPulse}>
                <Icons.Sparkles size={28} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: 17, marginTop: 16, marginBottom: 6 }}>Deep Code Analysis in Progress</h3>
              <p style={{ color: "var(--text3)", fontSize: 13.5 }}>Checking syntax, security, and performance patterns...</p>
            </div>
          )}

          {/* State 3: Analysis Results */}
          {result && !loading && (
            <div style={s.resultsLayout}>
              {/* Top Severity Filter Bar */}
              <div style={s.filterBar}>
                <div
                  onClick={() => handleFilterChange("all")}
                  style={{
                    ...s.filterChip,
                    background: severityFilter === "all" ? "var(--primary-dim)" : "var(--bg3)",
                    borderColor: severityFilter === "all" ? "var(--primary)" : "var(--border)",
                    color: severityFilter === "all" ? "var(--primary)" : "var(--text2)",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{result.findings.length}</span>
                  <span>All Findings</span>
                </div>

                {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => {
                  const isActive = severityFilter === key;
                  const count = severityCounts[key];
                  const IconComp = cfg.icon;
                  return (
                    <div
                      key={key}
                      onClick={() => handleFilterChange(key)}
                      style={{
                        ...s.filterChip,
                        background: isActive ? cfg.bg : "var(--bg3)",
                        borderColor: isActive ? cfg.color : "var(--border)",
                        opacity: isActive || severityFilter === "all" ? 1 : 0.45,
                      }}
                    >
                      <IconComp size={13} color={cfg.color} />
                      <span style={{ color: cfg.color, fontWeight: 700 }}>{count}</span>
                      <span style={{ fontSize: 12, color: "var(--text2)" }}>{cfg.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* View Switcher Tabs */}
              <div style={s.tabHeader}>
                <button
                  onClick={() => setTab("structured")}
                  style={{ ...s.tabButton, ...(tab === "structured" ? s.tabActive : {}) }}
                >
                  <Icons.Layers size={15} />
                  <span>Structured Findings</span>
                </button>
                <button
                  onClick={() => setTab("raw")}
                  style={{ ...s.tabButton, ...(tab === "raw" ? s.tabActive : {}) }}
                >
                  <Icons.FileText size={15} />
                  <span>Full Report</span>
                </button>
              </div>

              {/* View 1: Structured Findings Master-Detail Split */}
              {tab === "structured" && (
                <div style={s.splitBody}>
                  {/* Left findings list */}
                  <div style={s.findingsSidebar}>
                    {filteredFindings.length === 0 && (
                      <div style={{ padding: 24, textAlign: "center", color: "var(--text3)", fontSize: 13 }}>
                        No {severityFilter !== "all" ? severityFilter : ""} issues detected.
                      </div>
                    )}
                    {filteredFindings.map((f) => {
                      const cfg = SEVERITY_CONFIG[f.severity];
                      const IconComp = cfg.icon;
                      const isSel = selected?.id === f.id;
                      return (
                        <div
                          key={f.id}
                          onClick={() => setSelected(f)}
                          style={{
                            ...s.findingItem,
                            borderLeftColor: cfg.color,
                            background: isSel ? cfg.bg : "transparent",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <IconComp size={12} color={cfg.color} />
                            <span style={{ ...s.severityBadge, color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
                              {cfg.label}
                            </span>
                          </div>
                          <div style={s.findingTitle}>{f.title}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right finding details */}
                  <div style={s.findingDetailPane}>
                    {!selected && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text3)", fontSize: 13.5 }}>
                        Select a finding from the list on the left
                      </div>
                    )}

                    {selected && (() => {
                      const cfg = SEVERITY_CONFIG[selected.severity];
                      const IconComp = cfg.icon;
                      return (
                        <div className="fade-in">
                          <div style={s.detailTitleHeader}>
                            <span style={{ ...s.severityBadge, color: cfg.color, background: cfg.bg, borderColor: cfg.border, padding: "4px 10px", fontSize: 12 }}>
                              <IconComp size={14} color={cfg.color} />
                              {cfg.label} Issue
                            </span>
                            <h3 style={{ fontSize: 17, color: "var(--text)" }}>{selected.title}</h3>
                          </div>
                          <div className="md-content" style={{ marginTop: 16 }}>
                            <ReactMarkdown>{selected.body}</ReactMarkdown>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* View 2: Raw Full Report */}
              {tab === "raw" && (
                <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                  <div style={s.rawReportHeader}>
                    <span style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500 }}>Markdown Review Export</span>
                    <button onClick={handleCopyRawReport} style={s.copyReportBtn}>
                      {copied ? <Icons.Check size={14} color="var(--success)" /> : <Icons.Copy size={14} />}
                      <span>{copied ? "Copied Report" : "Copy Report"}</span>
                    </button>
                  </div>
                  <div style={s.rawReportScroll}>
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
  container: {
    flex: 1,
    display: "flex",
    gap: 16,
    maxWidth: 1500,
    margin: "0 auto",
    width: "100%",
    padding: 20,
    height: "calc(100vh - 62px)",
  },
  editorPanel: {
    flex: "0 0 520px",
    minWidth: 380,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  editorHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 4px",
  },
  editorTitleGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: 700,
  },
  languageSelectorWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "4px 10px",
  },
  select: {
    background: "none",
    border: "none",
    padding: 0,
    fontSize: 12.5,
    fontWeight: 700,
    color: "var(--text)",
    cursor: "pointer",
    width: "auto",
    outline: "none",
  },
  editorFrame: {
    flex: 1,
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "var(--card-shadow)",
  },
  editorWindowBar: {
    background: "var(--bg3)",
    padding: "9px 14px",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid var(--border)",
  },
  windowDots: {
    display: "flex",
    gap: 6,
    marginRight: 14,
  },
  windowDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    display: "inline-block",
  },
  fileName: {
    fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
    color: "var(--text2)",
  },
  editorStats: {
    marginLeft: "auto",
    fontSize: 11.5,
    color: "var(--text3)",
    fontFamily: "'JetBrains Mono', monospace",
  },
  textarea: {
    flex: 1,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    lineHeight: 1.65,
    resize: "none",
    background: "var(--bg2)",
    border: "none",
    color: "var(--text)",
    padding: 16,
    width: "100%",
    outline: "none",
  },
  editorFooterBar: {
    padding: "12px 16px",
    background: "var(--bg3)",
    borderTop: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  clearBtn: {
    background: "var(--bg2)",
    color: "var(--text2)",
    border: "1px solid var(--border)",
    padding: "9px 16px",
    fontSize: 13,
    borderRadius: 8,
  },
  submitReviewBtn: {
    flex: 1,
    background: "linear-gradient(135deg, var(--primary), #a855f7)",
    color: "#ffffff",
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 8,
    boxShadow: "0 4px 14px var(--primary-glow)",
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
  resultsPanel: {
    flex: 1,
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "var(--card-shadow)",
    display: "flex",
    flexDirection: "column",
  },
  emptyContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: "var(--primary-dim)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    border: "1px solid rgba(99,102,241,0.25)",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 10,
  },
  featureCard: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  loadingPulse: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "var(--primary-dim)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "spin 2s linear infinite",
    border: "2px dashed var(--primary)",
  },
  resultsLayout: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  filterBar: {
    display: "flex",
    gap: 8,
    padding: "12px 16px",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg3)",
    overflowX: "auto",
  },
  filterChip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 12.5,
    border: "1px solid var(--border)",
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
  },
  tabHeader: {
    display: "flex",
    borderBottom: "1px solid var(--border)",
    padding: "0 16px",
    background: "var(--bg2)",
  },
  tabButton: {
    background: "none",
    color: "var(--text3)",
    padding: "12px 18px",
    borderRadius: 0,
    fontSize: 13,
    fontWeight: 600,
    borderBottom: "2px solid transparent",
    gap: 8,
  },
  tabActive: {
    color: "var(--primary)",
    borderBottomColor: "var(--primary)",
  },
  splitBody: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },
  findingsSidebar: {
    width: 240,
    flexShrink: 0,
    borderRight: "1px solid var(--border)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    background: "var(--bg2)",
  },
  findingItem: {
    padding: "12px 14px",
    cursor: "pointer",
    borderBottom: "1px solid var(--border)",
    borderLeft: "3.5px solid transparent",
    transition: "background 0.15s ease",
  },
  findingTitle: {
    fontSize: 12.5,
    color: "var(--text)",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  severityBadge: {
    fontSize: 10.5,
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: 4,
    border: "1px solid transparent",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  findingDetailPane: {
    flex: 1,
    padding: 24,
    overflowY: "auto",
    background: "var(--bg)",
  },
  detailTitleHeader: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    borderBottom: "1px solid var(--border)",
    paddingBottom: 14,
  },
  rawReportHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "var(--bg3)",
    borderBottom: "1px solid var(--border)",
  },
  copyReportBtn: {
    background: "var(--bg2)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    padding: "6px 12px",
    borderRadius: 6,
    fontSize: 12.5,
  },
  rawReportScroll: {
    flex: 1,
    padding: 24,
    overflowY: "auto",
    background: "var(--bg)",
  },
};
