import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      addToast({ type: "error", title: "Validation Error", message: "Please fill in all fields." });
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      addToast({ type: "success", title: "Welcome Back!", message: `Signed in as ${data.name}.` });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid email or password.";
      addToast({ type: "error", title: "Login Failed", message: msg });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.logoRow}>
            <span style={s.logoIcon}>⬡</span>
            <span style={s.logoText}>CodeReview<span style={{ color: "var(--primary)" }}>AI</span></span>
          </div>
          <h2 style={s.title}>Welcome back</h2>
          <p style={s.sub}>Sign in to continue reviewing code</p>

          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input
              type="email" placeholder="you@example.com"
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
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={s.eyeBtn}>
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} style={s.btn}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <p style={s.link}>
            Don't have an account? <a href="/register">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 20px", minHeight: "calc(100vh - 64px)" },
  card: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 16, padding: "44px 40px",
    width: "100%", maxWidth: 440,
    boxShadow: "var(--card-shadow)",
  },
  logoRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 28 },
  logoIcon: { fontSize: 24, color: "var(--primary)" },
  logoText: { fontSize: 20, fontWeight: 800, color: "var(--text)" },
  title: { fontSize: 26, textAlign: "center", marginBottom: 6 },
  sub: { textAlign: "center", color: "var(--text3)", marginBottom: 32 },
  field: { marginBottom: 18 },
  label: { display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "var(--text2)" },
  pwWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
    background: "none", padding: "4px", fontSize: 16,
  },
  btn: {
    background: "var(--primary)", color: "#fff",
    width: "100%", padding: "13px 0", fontSize: 15, marginTop: 8,
    borderRadius: 10,
  },
  link: { textAlign: "center", marginTop: 22, color: "var(--text3)", fontSize: 14 },
};
