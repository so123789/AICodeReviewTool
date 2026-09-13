import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";
import { Icons } from "../components/Icons";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      addToast({ type: "error", title: "Validation Error", message: "Please enter your email and password." });
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      addToast({ type: "success", title: "Welcome Back", message: `Signed in as ${data.name}.` });
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid email or password.";
      addToast({ type: "error", title: "Authentication Failed", message: msg });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div style={s.page}>
        <div style={s.card} className="fade-in">
          <div style={s.logoRow}>
            <Icons.Logo size={28} />
            <span style={s.logoText}>CodeReview<span style={{ color: "var(--primary)" }}>.AI</span></span>
          </div>

          <h2 style={s.title}>Welcome Back</h2>
          <p style={s.sub}>Sign in to your account to review code</p>

          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={s.pwWrap}>
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{ paddingRight: 40 }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={s.eyeBtn}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} style={s.submitBtn}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={s.spinner} /> Signing in...
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <Icons.ArrowRight size={16} color="#fff" />
              </>
            )}
          </button>

          <p style={s.linkText}>
            Don't have an account? <a href="/register">Create one for free</a>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
    minHeight: "calc(100vh - 62px)",
  },
  card: {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "var(--card-shadow)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 800,
    color: "var(--text)",
    letterSpacing: "-0.4px",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 6,
  },
  sub: {
    textAlign: "center",
    color: "var(--text3)",
    fontSize: 14,
    marginBottom: 28,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text2)",
  },
  pwWrap: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    padding: "4px 8px",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text3)",
  },
  submitBtn: {
    background: "linear-gradient(135deg, var(--primary), #a855f7)",
    color: "#fff",
    width: "100%",
    padding: "12px 0",
    fontSize: 14.5,
    fontWeight: 700,
    marginTop: 10,
    borderRadius: 10,
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
  linkText: {
    textAlign: "center",
    marginTop: 22,
    color: "var(--text3)",
    fontSize: 13.5,
  },
};
