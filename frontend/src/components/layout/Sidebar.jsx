import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DataFreshnessBadge } from '../common/DataFreshness';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  {
    group: "Overview",
    items: [
      { path: "/dashboard", label: "Dashboard", icon: "🏠" },
      { path: "/market-overview", label: "Market Overview", icon: "📊" },
      { path: "/india-market", label: "India Market", icon: "🇮🇳" },
      { path: "/global-market", label: "Global Market", icon: "🌐" },
    ],
  },
  {
    group: "Analytics & ML",
    items: [
      { path: "/salary-predictor", label: "Salary Predictor", icon: "💰" },
      {
        path: "/company-intelligence",
        label: "Company Intelligence",
        icon: "🏢",
      },
      { path: "/skill-forecasting", label: "Skill Forecasting", icon: "📈" },
      { path: "/career-path", label: "Career Path Explorer", icon: "🗺️" },
      { path: "/salary-comparison", label: "Salary Comparison", icon: "⚖️" },
    ],
  },
  {
    group: "AI Career Tools",
    items: [
      { path: "/resume-analyzer", label: "Resume Analyzer", icon: "🔍" },
      { path: "/resume-rewriter", label: "Resume Rewriter", icon: "✍️" },
      { path: "/salary-negotiation", label: "Salary Negotiation", icon: "🤝" },
      { path: "/interview-prep", label: "Interview Prep", icon: "🎯" },
      { path: "/market-chatbot", label: "Market Chatbot", icon: "🤖" },
    ],
  },
  {
    group: "Growth & Resources",
    items: [
      {
        path: "/course-recommendations",
        label: "Course Recommendations",
        icon: "📚",
      },
      { path: "/portfolio-projects", label: "Portfolio Projects", icon: "🚀" },
      { path: "/export-report", label: "Export PDF Report", icon: "📊" },
    ],
  },
];

export function Sidebar({ isOpen, onClose }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <div
        className={`mobile-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div
          className="sidebar-logo flex justify-between items-center"
          style={{ paddingRight: "16px" }}
        >
          <div className="flex items-center gap-sm">
            <div className="logo-icon">🧠</div>
            <div>
              <h1>CareerLens</h1>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  display: "block",
                  marginTop: "-4px",
                }}
              >
                Job Market Intelligence
              </span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((section, idx) => (
            <React.Fragment key={idx}>
              <div className="sidebar-section-label">{section.group}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={onClose}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className="sidebar-footer">
          <DataFreshnessBadge />

          <button
            onClick={toggleTheme}
            style={{
              width: "100%",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "0.8rem",
              cursor: "pointer",
              marginTop: "0.75rem",
              marginBottom: "10px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            {theme === "dark"
              ? "☀️ Switch to Light Mode"
              : "🌙 Switch to Dark Mode"}
          </button>

          <NavLink
            to="/"
            onClick={onClose}
            style={{
              display: "block",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              marginBottom: "10px",
              textDecoration: "none",
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            ← Back to Home Page
          </NavLink>

          {user && (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px', textAlign: 'center' }}>
                👤 {user.name || user.email}
              </div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                  navigate('/login');
                }}
                style={{
                  width: '100%',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#F87171',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                🚪 Sign Out
              </button>
            </div>
          )}

          <p style={{ fontSize: '0.65rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
            CareerLens v2.0 · React + FastAPI
          </p>
        </div>
      </aside>
    </>
  );
}
