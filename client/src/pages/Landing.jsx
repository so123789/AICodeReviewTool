import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const LANGUAGES = [
  { name: "JavaScript", icon: "🟨" },
  { name: "TypeScript", icon: "🔷" },
  { name: "Python", icon: "🐍" },
  { name: "Java", icon: "☕" },
  { name: "C", icon: "©️" },
  { name: "C++", icon: "⚙️" },
  { name: "C#", icon: "🎵" },
  { name: "Go", icon: "🐹" },
  { name: "Rust", icon: "🦀" },
  { name: "PHP", icon: "🐘" },
  { name: "Ruby", icon: "💎" },
  { name: "Kotlin", icon: "🎯" },
  { name: "Swift", icon: "🦅" },
  { name: "SQL", icon: "🗄️" },
  { name: "HTML", icon: "🌐" },
  { name: "CSS", icon: "🎨" },
];

const FEATURES = [
  { icon: "🐛", title: "AI Bug Detection", desc: "Automatically identify potential bugs and logical errors before they reach production." },
  { icon: "🔐", title: "Security Analysis", desc: "Detect common vulnerabilities like SQL injection, XSS, and unsafe coding patterns." },
  { icon: "⚡", title: "Performance Insights", desc: "Spot inefficient algorithms, unnecessary loops, and redundant operations." },
  { icon: "📐", title: "Code Quality", desc: "Analyze readability, naming conventions, structure, and maintainability." },
  { icon: "♻️", title: "Refactoring Suggestions", desc: "Get cleaner, more idiomatic implementations suggested by AI." },
  { icon: "📋", title: "Structured Reports", desc: "Findings organized by severity with clear problem, explanation, and fix." },
];

const STEPS = [
  { num: "01", title: "Paste Your Code", desc: "Copy any code snippet into the editor and select your language." },
  { num: "02", title: "AI Analyzes It", desc: "Claude AI reviews your code across bugs, security, performance, and quality." },
  { num: "03", title: "Review Findings", desc: "See structured findings with severity levels and detailed explanations." },
  { num: "04", title: "Improve Your Code", desc: "Apply suggested fixes and ship better, safer code to production." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroContent}>
          <div style={s.heroBadge}>✦ Powered by Claude AI</div>
          <h1 style={s.heroTitle}>
            AI-Powered Code Reviews.<br />
            <span style={{ color: "var(--primary)" }}>Better Code.</span> Faster Development.
          </h1>
          <p style={s.heroSub}>
            Review your code with AI — identify bugs, security issues, performance
            problems, and best-practice violations before they reach production.
          </p>
          <div style={s.heroBtns}>
            <button onClick={() => navigate("/register")} style={s.primaryBtn}>
              Start Reviewing Code →
            </button>
            <button onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })} style={s.ghostBtn}>
              Explore Features
            </button>
          </div>
          <div style={s.heroStats}>
            {[["10+", "Languages"], ["5", "Review Categories"], ["Free", "To Use"]].map(([v, l]) => (
              <div key={l} style={s.stat}>
                <span style={s.statVal}>{v}</span>
                <span style={s.statLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code mockup */}
        <div style={s.heroMockup}>
          <div style={s.mockupBar}>
            <span style={{ ...s.dot, background: "#f87171" }} />
            <span style={{ ...s.dot, background: "#f59e0b" }} />
            <span style={{ ...s.dot, background: "#22c55e" }} />
            <span style={s.mockupFile}>review.js</span>
          </div>
          <pre style={s.mockupCode}>{`function getUserData(users, id) {
  for (var i = 0; i <= users.length; i++) {
    if (users[i].id == id) {
      return users[i]
    }
  }
}

var result = getUserData(null, 5)
console.log(result.name)`}</pre>
          <div style={s.mockupFindings}>
            <div style={s.finding}>
              <span style={{ ...s.findingDot, background: "#f87171" }} />
              <span style={s.findingText}>Off-by-one error: <code style={s.inlineCode}>i &lt;= users.length</code></span>
            </div>
            <div style={s.finding}>
              <span style={{ ...s.findingDot, background: "#f87171" }} />
              <span style={s.findingText}>Null reference: <code style={s.inlineCode}>getUserData(null, 5)</code> will crash</span>
            </div>
            <div style={s.finding}>
              <span style={{ ...s.findingDot, background: "#f59e0b" }} />
              <span style={s.findingText}>Use <code style={s.inlineCode}>===</code> instead of <code style={s.inlineCode}>==</code></span>
            </div>
            <div style={s.finding}>
              <span style={{ ...s.findingDot, background: "#f59e0b" }} />
              <span style={s.findingText}>Use <code style={s.inlineCode}>const</code>/<code style={s.inlineCode}>let</code> instead of <code style={s.inlineCode}>var</code></span>
            </div>
            <div style={s.mockupScore}>
              <span style={{ color: "var(--text3)", fontSize: 12 }}>AI Score</span>
              <span style={{ color: "#f59e0b", fontWeight: 700 }}>3 / 10</span>
            </div>
          </div>
        </div>
      </section>

      {/* What It Reviews */}
      <section id="features" style={s.section}>
        <div style={s.sectionInner}>
          <div style={s.sectionLabel}>Your AI Code Reviewer</div>
          <h2 style={s.sectionTitle}>What Claude Reviews in Your Code</h2>
          <p style={s.sectionSub}>Comprehensive analysis across every dimension that matters for production-ready code.</p>
          <div style={s.capGrid}>
            {[
              "Detect bugs and logical errors",
              "Identify security vulnerabilities",
              "Find performance bottlenecks",
              "Detect code smells",
              "Suggest refactoring",
              "Identify unused variables/imports",
              "Recommend best practices",
              "Improve readability",
              "Explain why code is problematic",
              "Provide corrected code examples",
            ].map((cap) => (
              <div key={cap} style={s.capItem}>
                <span style={{ color: "var(--success)", fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: 14, color: "var(--text2)" }}>{cap}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section style={{ ...s.section, background: "var(--bg2)" }}>
        <div style={s.sectionInner}>
          <div style={s.sectionLabel}>Language Support</div>
          <h2 style={s.sectionTitle}>Review Code in Your Favorite Language</h2>
          <div style={s.langGrid}>
            {LANGUAGES.map((l) => (
              <div key={l.name} style={s.langCard}>
                <span style={s.langIcon}>{l.icon}</span>
                <span style={s.langName}>{l.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={s.section}>
        <div style={s.sectionInner}>
          <div style={s.sectionLabel}>Features</div>
          <h2 style={s.sectionTitle}>Everything You Need for Better Code</h2>
          <div style={s.featGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} style={s.featCard}>
                <div style={s.featIcon}>{f.icon}</div>
                <h3 style={s.featTitle}>{f.title}</h3>
                <p style={s.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" style={{ ...s.section, background: "var(--bg2)" }}>
        <div style={s.sectionInner}>
          <div style={s.sectionLabel}>How It Works</div>
          <h2 style={s.sectionTitle}>From Code to Insight in Seconds</h2>
          <div style={s.stepsRow}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={s.stepWrap}>
                <div style={s.stepCard}>
                  <div style={s.stepNum}>{step.num}</div>
                  <h3 style={s.stepTitle}>{step.title}</h3>
                  <p style={s.stepDesc}>{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && <div style={s.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ ...s.section, textAlign: "center" }}>
        <div style={s.ctaCard}>
          <h2 style={{ fontSize: 32, marginBottom: 12 }}>Ready to Write Better Code?</h2>
          <p style={{ fontSize: 16, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
            Join developers who use AI to catch issues before they become production bugs.
          </p>
          <button onClick={() => navigate("/register")} style={{ ...s.primaryBtn, fontSize: 16, padding: "14px 36px" }}>
            Start for Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerLogo}>
            <span style={{ color: "var(--primary)" }}>⬡</span> CodeReviewAI
          </div>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>
            AI-powered code reviews using Claude. Built with MERN stack.
          </p>
        </div>
      </footer>
    </div>
  );
}

const s = {
  hero: {
    maxWidth: 1200, margin: "0 auto",
    padding: "80px 24px 100px",
    display: "flex", alignItems: "center",
    gap: 60, flexWrap: "wrap",
  },
  heroContent: { flex: 1, minWidth: 300 },
  heroBadge: {
    display: "inline-block",
    background: "var(--primary-dim)", color: "var(--primary)",
    border: "1px solid var(--primary)", borderRadius: 20,
    padding: "4px 14px", fontSize: 13, fontWeight: 600,
    marginBottom: 20,
  },
  heroTitle: { fontSize: 48, lineHeight: 1.15, marginBottom: 18, fontWeight: 800 },
  heroSub: { fontSize: 18, color: "var(--text2)", marginBottom: 32, maxWidth: 500, lineHeight: 1.7 },
  heroBtns: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 },
  primaryBtn: {
    background: "var(--primary)", color: "#fff",
    padding: "12px 28px", borderRadius: 10, fontSize: 15,
  },
  ghostBtn: {
    background: "var(--bg3)", color: "var(--text)",
    padding: "12px 28px", borderRadius: 10, fontSize: 15,
    border: "1px solid var(--border)",
  },
  heroStats: { display: "flex", gap: 32 },
  stat: { display: "flex", flexDirection: "column" },
  statVal: { fontSize: 24, fontWeight: 800, color: "var(--text)" },
  statLabel: { fontSize: 12, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 },
  heroMockup: {
    flex: 1, minWidth: 300, maxWidth: 480,
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 14, overflow: "hidden",
    boxShadow: "var(--card-shadow)",
  },
  mockupBar: {
    background: "var(--bg3)", padding: "10px 16px",
    display: "flex", alignItems: "center", gap: 6,
    borderBottom: "1px solid var(--border)",
  },
  dot: { width: 10, height: 10, borderRadius: "50%" },
  mockupFile: { marginLeft: 8, fontSize: 12, color: "var(--text3)" },
  mockupCode: {
    padding: 16, fontFamily: "monospace", fontSize: 12,
    color: "var(--text2)", lineHeight: 1.7, whiteSpace: "pre",
    borderBottom: "1px solid var(--border)", overflowX: "auto",
  },
  mockupFindings: { padding: 14, display: "flex", flexDirection: "column", gap: 8 },
  finding: { display: "flex", alignItems: "center", gap: 8 },
  findingDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  findingText: { fontSize: 12, color: "var(--text2)" },
  inlineCode: {
    background: "var(--bg4)", border: "1px solid var(--border)",
    borderRadius: 3, padding: "0 4px", fontSize: 11,
    fontFamily: "monospace", color: "var(--primary)",
  },
  mockupScore: {
    display: "flex", justifyContent: "space-between",
    padding: "8px 0 0", borderTop: "1px solid var(--border)", marginTop: 4,
  },
  section: { padding: "80px 24px" },
  sectionInner: { maxWidth: 1100, margin: "0 auto" },
  sectionLabel: {
    color: "var(--primary)", fontSize: 13, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: 2, marginBottom: 12,
  },
  sectionTitle: { fontSize: 36, marginBottom: 14 },
  sectionSub: { fontSize: 16, color: "var(--text2)", marginBottom: 48, maxWidth: 560 },
  capGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 14,
  },
  capItem: {
    display: "flex", gap: 10, alignItems: "flex-start",
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "12px 14px",
  },
  langGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: 12, marginTop: 40,
  },
  langCard: {
    background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 10, padding: "14px 10px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    transition: "border-color 0.2s, transform 0.2s",
    cursor: "default",
  },
  langIcon: { fontSize: 24 },
  langName: { fontSize: 12, fontWeight: 600, color: "var(--text2)" },
  featGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20, marginTop: 40,
  },
  featCard: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 12, padding: 24,
    boxShadow: "var(--card-shadow)",
  },
  featIcon: { fontSize: 28, marginBottom: 12 },
  featTitle: { fontSize: 17, marginBottom: 8 },
  featDesc: { fontSize: 14, color: "var(--text2)", lineHeight: 1.7 },
  stepsRow: {
    display: "flex", alignItems: "flex-start",
    gap: 0, marginTop: 48, flexWrap: "wrap",
  },
  stepWrap: { display: "flex", alignItems: "center", flex: 1, minWidth: 200 },
  stepCard: {
    flex: 1, background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 12, padding: 24,
  },
  stepNum: {
    fontSize: 36, fontWeight: 900, color: "var(--primary-dim)",
    marginBottom: 10, fontVariantNumeric: "tabular-nums",
  },
  stepTitle: { fontSize: 16, marginBottom: 8 },
  stepDesc: { fontSize: 14, color: "var(--text2)", lineHeight: 1.6 },
  stepArrow: {
    fontSize: 24, color: "var(--border2)", padding: "0 8px",
    flexShrink: 0,
  },
  ctaCard: {
    maxWidth: 700, margin: "0 auto",
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 20, padding: "60px 40px",
    boxShadow: "var(--card-shadow)", textAlign: "center",
  },
  footer: {
    borderTop: "1px solid var(--border)",
    background: "var(--bg2)", padding: "24px",
  },
  footerInner: {
    maxWidth: 1200, margin: "0 auto",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 12,
  },
  footerLogo: { fontSize: 16, fontWeight: 700, color: "var(--text)", display: "flex", gap: 6 },
};
