import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { ToastContainer, useToast } from "../components/Toast";
import { Icons } from "../components/Icons";

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
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed. Please try again.";
      addToast({ type: "error", title: "Registration Failed", message: msg });
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

          <h2 style={s.title}>Create Your Account</h2>
          <p style={s.sub}>Start reviewing code with AI intelligence</p>

          <div style={s.field}>
            <label style={s.label}>Full Name</label>
            <input
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

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
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingRight: 40 }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={s.eyeBtn}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <button onClick={handleSubmit} disabled={loading} style={s.submitBtn}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={s.spinner} /> Creating Account...
              </span>
            ) : (
              <>
                <span>Create Free Account</span>
                <Icons.ArrowRight size={16} color="#fff" />
              </>
            )}
          </button>

          <p style={s.linkText}>
            Already have an account? <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign in</Link>
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
    maxWidth: 440,
    boxShadow: "var(--card-shadow)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 18,
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
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
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
