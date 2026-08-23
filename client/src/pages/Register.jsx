import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      addToast({ type: "error", title: "Validation Error", message: "All fields are required." });
      return;
    }
    if (form.password !== form.confirm) {
      addToast({ type: "error", title: "Password Mismatch", message: "Passwords do not match." });
      return;
    }
    if (form.password.length < 6) {
      addToast({ type: "warning", title: "Weak Password", message: "Password must be at least 6 characters." });
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register", { name: form.name, email: form.email, password: form.password });
      addToast({ type: "success", title: "Account Created!", message: "You can now sign in." });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed. Try again.";
      addToast({ type: "error", title: "Registration Failed", message: msg });
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
            <span style={{ fontSize: 24, color: "var(--primary)" }}>⬡</span>
            <span style={s.logoText}>CodeReview<span style={{ color: "var(--primary)" }}>AI</span></span>
          </div>
          <h2 style={s.title}>Create your account</h2>
          <p style={s.sub}>Start reviewing code with AI today</p>

          <div style={s.field}>
            <label style={s.label}>Full Name</label>
            <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={s.eyeBtn}>{showPw ? "🙈" : "👁"}</button>
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>Confirm Password</label>
            <input
              type="password" placeholder="Repeat password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <button onClick={handleSubmit} disabled={loading} style={s.btn}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
          <p style={s.link}>Already have an account? <a href="/login">Sign in</a></p>
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
  logoRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 },
  logoText: { fontSize: 20, fontWeight: 800, color: "var(--text)" },
  title: { fontSize: 26, textAlign: "center", marginBottom: 6 },
  sub: { textAlign: "center", color: "var(--text3)", marginBottom: 28 },
  field: { marginBottom: 16 },
  label: { display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "var(--text2)" },
  eyeBtn: {
    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
    background: "none", padding: "4px", fontSize: 16,
  },
  btn: { background: "var(--primary)", color: "#fff", width: "100%", padding: "13px 0", fontSize: 15, marginTop: 8, borderRadius: 10 },
  link: { textAlign: "center", marginTop: 22, color: "var(--text3)", fontSize: 14 },
};
