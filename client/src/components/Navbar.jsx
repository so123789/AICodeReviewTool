import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Icons } from "./Icons";

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
        { label: "Code Review", path: "/dashboard", icon: Icons.Code },
        { label: "History", path: "/history", icon: Icons.History },
      ]
    : [
        { label: "Features", path: "/#features" },
        { label: "How It Works", path: "/#how" },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={s.nav} className="glass-nav">
      <div style={s.inner}>
        {/* Brand Logo */}
        <div style={s.logo} onClick={() => navigate("/")}>
          <Icons.Logo size={24} />
          <span style={s.logoText}>
            CodeReview<span style={{ color: "var(--primary)" }}>.AI</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div style={s.links}>
          {navLinks.map((l) => {
            const IconComp = l.icon;
            const active = isActive(l.path);
            return (
              <button
                key={l.label}
                onClick={() => navigate(l.path)}
                style={{
                  ...s.link,
                  ...(active ? s.linkActive : {}),
                }}
              >
                {IconComp && <IconComp size={16} color={active ? "var(--primary)" : "var(--text3)"} />}
                {l.label}
              </button>
            );
          })}
        </div>

        {/* Right side controls */}
        <div style={s.right}>
          {/* Theme Switcher */}
          <button onClick={toggleTheme} style={s.themeBtn} title="Toggle theme">
            {theme === "dark" ? <Icons.Sun size={17} color="var(--text2)" /> : <Icons.Moon size={17} color="var(--text2)" />}
          </button>

          {isLoggedIn ? (
            <div style={s.userMenu}>
              <div style={s.avatarWrap}>
                <span style={s.avatar}>{name ? name.charAt(0).toUpperCase() : "U"}</span>
              </div>
              <span style={s.userName}>{name}</span>
              <button onClick={handleLogout} style={s.logoutBtn} title="Sign Out">
                <Icons.LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={s.authBtns}>
              <button onClick={() => navigate("/login")} style={s.ghostBtn}>
                Sign In
              </button>
              <button onClick={() => navigate("/register")} style={s.primaryBtn}>
                Get Started <Icons.ArrowRight size={15} color="#fff" />
              </button>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={s.hamburger}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile drawer menu */}
      {menuOpen && (
        <div style={s.mobileMenu} className="fade-in">
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => {
                navigate(l.path);
                setMenuOpen(false);
              }}
              style={s.mobileLink}
            >
              {l.label}
            </button>
          ))}
          <div style={s.mobileDivider} />
          {isLoggedIn ? (
            <button onClick={handleLogout} style={{ ...s.mobileLink, color: "var(--error)" }}>
              <Icons.LogOut size={16} color="var(--error)" /> Sign Out
            </button>
          ) : (
            <>
              <button onClick={() => { navigate("/login"); setMenuOpen(false); }} style={s.mobileLink}>
                Sign In
              </button>
              <button onClick={() => { navigate("/register"); setMenuOpen(false); }} style={{ ...s.mobileLink, color: "var(--primary)", fontWeight: 700 }}>
                Get Started →
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const s = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    borderBottom: "1px solid var(--border)",
  },
  inner: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "0 24px",
    height: 62,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    userSelect: "none",
  },
  logoText: {
    fontSize: 18,
    fontWeight: 800,
    color: "var(--text)",
    letterSpacing: "-0.4px",
  },
  links: {
    display: "flex",
    gap: 6,
    alignItems: "center",
  },
  link: {
    background: "transparent",
    color: "var(--text2)",
    padding: "7px 14px",
    borderRadius: 8,
    fontSize: 13.5,
    fontWeight: 500,
    transition: "all 0.15s ease",
  },
  linkActive: {
    background: "var(--primary-dim)",
    color: "var(--primary)",
    fontWeight: 600,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  themeBtn: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    padding: "7px 10px",
    borderRadius: 8,
  },
  authBtns: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  ghostBtn: {
    background: "transparent",
    color: "var(--text)",
    padding: "8px 16px",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 13.5,
  },
  primaryBtn: {
    background: "var(--primary)",
    color: "#fff",
    padding: "8px 18px",
    borderRadius: 8,
    fontSize: 13.5,
    boxShadow: "0 2px 10px var(--primary-glow)",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--primary), #a855f7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "var(--bg2)",
    color: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
  },
  userName: {
    fontSize: 13.5,
    color: "var(--text)",
    fontWeight: 600,
  },
  logoutBtn: {
    background: "var(--error-dim)",
    color: "var(--error)",
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 13,
    border: "1px solid rgba(239,68,68,0.2)",
  },
  hamburger: {
    display: "none",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    padding: "6px 10px",
    borderRadius: 8,
  },
  mobileMenu: {
    background: "var(--bg2)",
    borderTop: "1px solid var(--border)",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  mobileLink: {
    background: "none",
    color: "var(--text2)",
    padding: "10px 14px",
    borderRadius: 8,
    textAlign: "left",
    fontSize: 14.5,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  mobileDivider: {
    height: 1,
    background: "var(--border)",
    margin: "6px 0",
  },
};
