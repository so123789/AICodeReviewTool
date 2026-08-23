import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");
  const name = localStorage.getItem("name") || "";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setMenuOpen(false);
  };

  const navLinks = isLoggedIn
    ? [
        { label: "Dashboard", path: "/dashboard" },
        { label: "History", path: "/history" },
      ]
    : [
        { label: "Features", path: "/#features" },
        { label: "How It Works", path: "/#how" },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        {/* Logo */}
        <div style={s.logo} onClick={() => navigate("/")}>
          <span style={s.logoIcon}>⬡</span>
          <span style={s.logoText}>CodeReview<span style={{ color: "var(--primary)" }}>AI</span></span>
        </div>

        {/* Desktop links */}
        <div style={s.links}>
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => navigate(l.path)}
              style={{ ...s.link, ...(isActive(l.path) ? s.linkActive : {}) }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={s.right}>
          {/* Theme toggle */}
          <button onClick={toggleTheme} style={s.themeBtn} title="Toggle theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {isLoggedIn ? (
            <div style={s.userMenu}>
              <div style={s.avatar}>{name.charAt(0).toUpperCase()}</div>
              <span style={s.userName}>{name}</span>
              <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
            </div>
          ) : (
            <div style={s.authBtns}>
              <button onClick={() => navigate("/login")} style={s.ghostBtn}>Login</button>
              <button onClick={() => navigate("/register")} style={s.primaryBtn}>Get Started</button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={s.hamburger}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={s.mobileMenu}>
          {navLinks.map((l) => (
            <button key={l.label} onClick={() => { navigate(l.path); setMenuOpen(false); }} style={s.mobileLink}>
              {l.label}
            </button>
          ))}
          <div style={s.mobileDivider} />
          {isLoggedIn ? (
            <button onClick={handleLogout} style={{ ...s.mobileLink, color: "var(--error)" }}>Logout</button>
          ) : (
            <>
              <button onClick={() => { navigate("/login"); setMenuOpen(false); }} style={s.mobileLink}>Login</button>
              <button onClick={() => { navigate("/register"); setMenuOpen(false); }} style={{ ...s.mobileLink, color: "var(--primary)" }}>Get Started</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const s = {
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    background: "var(--bg2)",
    borderBottom: "1px solid var(--border)",
    boxShadow: "0 1px 12px rgba(0,0,0,0.08)",
  },
  inner: {
    maxWidth: 1200, margin: "0 auto",
    padding: "0 24px",
    height: 64,
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  logo: {
    display: "flex", alignItems: "center", gap: 8,
    cursor: "pointer", userSelect: "none",
  },
  logoIcon: { fontSize: 22, color: "var(--primary)" },
  logoText: { fontSize: 18, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.3px" },
  links: { display: "flex", gap: 4, alignItems: "center" },
  link: {
    background: "none", color: "var(--text2)",
    padding: "6px 14px", borderRadius: 6,
    fontSize: 14, fontWeight: 500,
  },
  linkActive: { background: "var(--primary-dim)", color: "var(--primary)" },
  right: { display: "flex", alignItems: "center", gap: 10 },
  themeBtn: {
    background: "var(--bg3)", border: "1px solid var(--border)",
    padding: "6px 10px", borderRadius: 8, fontSize: 16,
  },
  authBtns: { display: "flex", gap: 8, alignItems: "center" },
  ghostBtn: {
    background: "none", color: "var(--text2)",
    padding: "7px 16px", border: "1px solid var(--border)", borderRadius: 8,
  },
  primaryBtn: {
    background: "var(--primary)", color: "#fff",
    padding: "7px 16px", borderRadius: 8,
  },
  userMenu: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 34, height: 34, borderRadius: "50%",
    background: "var(--primary)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700,
  },
  userName: { fontSize: 14, color: "var(--text2)", fontWeight: 500 },
  logoutBtn: {
    background: "var(--error-dim)", color: "var(--error)",
    padding: "6px 14px", borderRadius: 8, fontSize: 13,
  },
  hamburger: {
    display: "none",
    background: "var(--bg3)", border: "1px solid var(--border)",
    padding: "6px 10px", borderRadius: 8, fontSize: 16,
    "@media(max-width:768px)": { display: "flex" },
  },
  mobileMenu: {
    background: "var(--bg2)", borderTop: "1px solid var(--border)",
    padding: 16, display: "flex", flexDirection: "column", gap: 4,
  },
  mobileLink: {
    background: "none", color: "var(--text2)",
    padding: "10px 14px", borderRadius: 8,
    textAlign: "left", fontSize: 15,
  },
  mobileDivider: { height: 1, background: "var(--border)", margin: "4px 0" },
};
