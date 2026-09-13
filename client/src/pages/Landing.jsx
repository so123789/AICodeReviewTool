import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Icons } from "../components/Icons";

const LANGUAGES = [
  { name: "JavaScript", ext: "JS" },
  { name: "TypeScript", ext: "TS" },
  { name: "Python", ext: "PY" },
  { name: "Java", ext: "JAVA" },
  { name: "C++", ext: "CPP" },
  { name: "Go", ext: "GO" },
  { name: "Rust", ext: "RS" },
  { name: "PHP", ext: "PHP" },
  { name: "Ruby", ext: "RB" },
  { name: "Kotlin", ext: "KT" },
  { name: "Swift", ext: "SWIFT" },
  { name: "SQL", ext: "SQL" },
];

const FEATURES = [
  { icon: Icons.Bug, title: "AI Bug Detection", desc: "Identify off-by-one errors, null reference crashes, and unexpected runtime rejections before pushing code." },
  { icon: Icons.Shield, title: "Security Vulnerabilities", desc: "Detect SQL injection, XSS vectors, unescaped user inputs, and insecure cryptographic practices." },
  { icon: Icons.Zap, title: "Performance Profiling", desc: "Uncover un-indexed query scans, memory leaks, blocking loops, and unnecessary re-renders." },
  { icon: Icons.CheckCircle, title: "Best Practices", desc: "Get recommendations for modern syntax, functional immutability, clean code patterns, and typing." },
  { icon: Icons.FileText, title: "Structured Markdown Reports", desc: "Review findings grouped by severity with exact line references and instant diff code fixes." },
  { icon: Icons.History, title: "Review History & Metrics", desc: "Access all your past code reviews in a searchable, paginated developer workspace." },
];

const STEPS = [
  { num: "01", title: "Paste Your Code", desc: "Paste any code snippet into the editor and choose your language." },
  { num: "02", title: "AI Deep Scan", desc: "Claude AI analyzes your snippet across security, performance, and bugs." },
  { num: "03", title: "Review Findings", desc: "Inspect severity-ranked findings with line numbers and rationale." },
  { num: "04", title: "Apply Instant Fix", desc: "Copy corrected code snippets directly into your project codebase." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Hero Section */}
      <section style={s.hero}>
        <div style={s.heroContent}>
          <div style={s.heroBadge}>
            <Icons.Sparkles size={14} color="var(--primary)" />
            <span>Powered by Claude AI & MERN Stack</span>
          </div>

          <h1 style={s.heroTitle}>
            Instant AI Code Reviews.<br />
            <span style={s.heroGradient}>Ship Safer Code Faster.</span>
          </h1>

          <p style={s.heroSub}>
            Detect critical bugs, security vulnerabilities, and performance bottlenecks in seconds with automated, line-by-line AI analysis.
          </p>

          <div style={s.heroBtns}>
            <button onClick={() => navigate("/register")} style={s.primaryBtn}>
              <span>Start Reviewing Free</span>
              <Icons.ArrowRight size={16} color="#fff" />
            </button>
            <button onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })} style={s.ghostBtn}>
              Explore Features
            </button>
          </div>

          <div style={s.heroStats}>
            {[["15+", "Languages"], ["5", "Severity Tiers"], ["100%", "Automated"]].map(([val, label]) => (
              <div key={label} style={s.stat}>
                <span style={s.statVal}>{val}</span>
                <span style={s.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Code Card Preview */}
        <div style={s.heroMockup}>
          <div style={s.mockupBar}>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ ...s.dot, background: "#ef4444" }} />
              <span style={{ ...s.dot, background: "#f59e0b" }} />
              <span style={{ ...s.dot, background: "#10b981" }} />
            </div>
            <span style={s.mockupFile}>demo.js — AI Audit</span>
          </div>

          <pre style={s.mockupCode}>{`function getUserData(users, id) {
  for (var i = 0; i <= users.length; i++) {
    if (users[i].id == id) {
      return users[i]
    }
  }
}
var result = getUserData(null, 5)`}</pre>

          <div style={s.mockupFindings}>
            <div style={{ ...s.findingCard, borderColor: "rgba(239,68,68,0.3)", background: "var(--error-dim)" }}>
              <Icons.AlertOctagon size={14} color="var(--error)" />
              <span style={{ fontSize: 12, color: "var(--text)" }}><strong>Critical:</strong> Null reference error on <code style={s.inlineCode}>users.length</code></span>
            </div>
            <div style={{ ...s.findingCard, borderColor: "rgba(245,158,11,0.3)", background: "var(--warning-dim)" }}>
              <Icons.AlertTriangle size={14} color="var(--warning)" />
              <span style={{ fontSize: 12, color: "var(--text)" }}><strong>High:</strong> Array index out-of-bounds <code style={s.inlineCode}>i &lt;= users.length</code></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={s.section}>
        <div style={s.sectionInner}>
          <div style={s.sectionLabel}>Features</div>
          <h2 style={s.sectionTitle}>Built for Production Developer Workflows</h2>
          <p style={s.sectionSub}>Comprehensive code intelligence engineered for modern full-stack development.</p>

          <div style={s.featGrid}>
            {FEATURES.map((f) => {
              const IconComp = f.icon;
              return (
                <div key={f.title} style={s.featCard}>
                  <div style={s.featIconWrap}>
                    <IconComp size={22} color="var(--primary)" />
                  </div>
                  <h3 style={s.featTitle}>{f.title}</h3>
                  <p style={s.featDesc}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section style={{ ...s.section, background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={s.sectionInner}>
          <div style={s.sectionLabel}>Language Support</div>
          <h2 style={s.sectionTitle}>15+ Supported Languages</h2>
          <div style={s.langGrid}>
            {LANGUAGES.map((l) => (
              <div key={l.name} style={s.langCard}>
                <span style={s.langBadge}>{l.ext}</span>
                <span style={s.langName}>{l.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" style={s.section}>
        <div style={s.sectionInner}>
          <div style={s.sectionLabel}>Workflow</div>
          <h2 style={s.sectionTitle}>Four Steps to Flawless Code</h2>
          <div style={s.stepsRow}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={s.stepCard}>
                <div style={s.stepNum}>{step.num}</div>
                <h3 style={s.stepTitle}>{step.title}</h3>
                <p style={s.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section style={{ ...s.section, textAlign: "center" }}>
        <div style={s.ctaCard}>
          <Icons.Sparkles size={32} color="var(--primary)" />
          <h2 style={{ fontSize: 30, marginTop: 12, marginBottom: 10 }}>Start Reviewing Your Code Today</h2>
          <p style={{ fontSize: 15, color: "var(--text2)", marginBottom: 24, maxWidth: 460, margin: "0 auto 24px" }}>
            Join developers catching critical bugs and vulnerabilities before production deployments.
          </p>
          <button onClick={() => navigate("/register")} style={s.ctaBtn}>
            Get Started Free <Icons.ArrowRight size={16} color="#fff" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 16 }}>
            <Icons.Logo size={20} />
            <span>CodeReview<span style={{ color: "var(--primary)" }}>.AI</span></span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>
            © {new Date().getFullYear()} CodeReview.AI — Intelligent Full-Stack Code Auditing
          </p>
        </div>
      </footer>
    </div>
  );
}

const s = {
  hero: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "70px 24px 90px",
    display: "flex",
    alignItems: "center",
    gap: 50,
    flexWrap: "wrap",
  },
  heroContent: { flex: 1, minWidth: 320 },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "var(--primary-dim)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--primary)",
    marginBottom: 20,
  },
  heroTitle: { fontSize: 48, lineHeight: 1.15, marginBottom: 18, fontWeight: 800 },
  heroGradient: {
    background: "linear-gradient(135deg, var(--primary), #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: { fontSize: 17, color: "var(--text2)", marginBottom: 32, maxWidth: 520, lineHeight: 1.6 },
  heroBtns: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 },
  primaryBtn: {
    background: "linear-gradient(135deg, var(--primary), #a855f7)",
    color: "#fff",
    padding: "12px 28px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    boxShadow: "0 4px 16px var(--primary-glow)",
  },
  ghostBtn: {
    background: "var(--bg2)",
    color: "var(--text)",
    padding: "12px 24px",
    borderRadius: 10,
    fontSize: 15,
    border: "1px solid var(--border)",
  },
  heroStats: { display: "flex", gap: 32 },
  stat: { display: "flex", flexDirection: "column" },
  statVal: { fontSize: 24, fontWeight: 800, color: "var(--text)" },
  statLabel: { fontSize: 11.5, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 },
  heroMockup: {
    flex: 1,
    minWidth: 320,
    maxWidth: 520,
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "var(--card-shadow)",
  },
  mockupBar: {
    background: "var(--bg3)",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid var(--border)",
  },
  dot: { width: 10, height: 10, borderRadius: "50%" },
  mockupFile: { fontSize: 12, color: "var(--text3)", fontFamily: "'JetBrains Mono', monospace" },
  mockupCode: {
    padding: 18,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12.5,
    color: "var(--text2)",
    lineHeight: 1.65,
    whiteSpace: "pre-wrap",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg)",
  },
  mockupFindings: { padding: 14, display: "flex", flexDirection: "column", gap: 8 },
  findingCard: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid",
  },
  inlineCode: {
    background: "var(--bg4)",
    borderRadius: 4,
    padding: "1px 5px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
  },
  section: { padding: "80px 24px" },
  sectionInner: { maxWidth: 1200, margin: "0 auto" },
  sectionLabel: {
    color: "var(--primary)",
    fontSize: 12.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 34, marginBottom: 12 },
  sectionSub: { fontSize: 16, color: "var(--text2)", marginBottom: 44, maxWidth: 560 },
  featGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 20,
  },
  featCard: {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: 26,
    boxShadow: "var(--card-shadow)",
  },
  featIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: "var(--primary-dim)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    border: "1px solid rgba(99,102,241,0.2)",
  },
  featTitle: { fontSize: 17, marginBottom: 8 },
  featDesc: { fontSize: 14, color: "var(--text2)", lineHeight: 1.65 },
  langGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
    gap: 12,
  },
  langCard: {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  langBadge: {
    fontSize: 12,
    fontWeight: 800,
    color: "var(--primary)",
    background: "var(--primary-dim)",
    padding: "3px 8px",
    borderRadius: 6,
    fontFamily: "'JetBrains Mono', monospace",
  },
  langName: { fontSize: 13, fontWeight: 600, color: "var(--text)" },
  stepsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 20,
  },
  stepCard: {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: 24,
  },
  stepNum: {
    fontSize: 32,
    fontWeight: 900,
    color: "var(--primary)",
    marginBottom: 10,
    opacity: 0.8,
  },
  stepTitle: { fontSize: 16, marginBottom: 6 },
  stepDesc: { fontSize: 13.5, color: "var(--text2)", lineHeight: 1.6 },
  ctaCard: {
    maxWidth: 720,
    margin: "0 auto",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 20,
    padding: "50px 30px",
    boxShadow: "var(--card-shadow)",
  },
  ctaBtn: {
    background: "linear-gradient(135deg, var(--primary), #a855f7)",
    color: "#fff",
    padding: "13px 32px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
  },
  footer: {
    borderTop: "1px solid var(--border)",
    background: "var(--bg2)",
    padding: "24px",
  },
  footerInner: {
    maxWidth: 1400,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
};
