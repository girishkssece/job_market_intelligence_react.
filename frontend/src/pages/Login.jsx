import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #4A5568; }
        input:focus { outline: none; border-color: #3B82F6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        @keyframes mesh { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,20px) scale(1.05); } }
      `}</style>

      {/* Left panel */}
      <div style={s.left}>
        <div style={s.mesh} />
        <div style={s.leftInner}>
          <div style={s.logo}>
            <div style={s.logoMark}>CL</div>
            <span style={s.logoText}>CareerLens</span>
          </div>
          <h2 style={s.tagline}>
            The job market,
            <br />
            decoded.
          </h2>
          <p style={s.sub}>
            Salary benchmarks, skill trends, and AI-powered career guidance —
            all in one place.
          </p>
          <div style={s.stats}>
            {[
              ["115K+", "job records"],
              ["18", "role categories"],
              ["Llama 3.3", "AI advisor"],
            ].map(([v, l]) => (
              <div key={l} style={s.stat}>
                <span style={s.statVal}>{v}</span>
                <span style={s.statLbl}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={s.right}>
        <div style={s.card}>
          <h1 style={s.title}>Sign in</h1>
          <p style={s.sub2}>
            Don't have an account?{" "}
            <Link to="/signup" style={s.link}>
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                style={s.input}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={s.label}>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                style={s.input}
              />
            </div>

            {error && <p style={s.error}>{error}</p>}

            <button
              type="submit"
              style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter',-apple-system,sans-serif",
    background: "#0A0F1E",
  },
  left: {
    flex: "0 0 46%",
    background: "#0D1526",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    padding: "48px 56px",
  },
  mesh: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse 80% 60% at 20% 30%,rgba(59,130,246,0.13) 0%,transparent 70%),radial-gradient(ellipse 60% 80% at 80% 70%,rgba(99,102,241,0.10) 0%,transparent 70%)",
    animation: "mesh 12s ease-in-out infinite",
  },
  leftInner: { position: "relative", zIndex: 1, maxWidth: 380 },
  logo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 48 },
  logoMark: {
    width: 36,
    height: 36,
    background: "#3B82F6",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    color: "#fff",
  },
  logoText: {
    fontSize: 18,
    fontWeight: 600,
    color: "#F1F5F9",
    letterSpacing: "-0.3px",
  },
  tagline: {
    fontSize: 38,
    fontWeight: 700,
    color: "#F1F5F9",
    lineHeight: 1.15,
    letterSpacing: "-1px",
    marginBottom: 16,
  },
  sub: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 1.65,
    marginBottom: 48,
    maxWidth: 320,
  },
  stats: { display: "flex", gap: 32 },
  stat: { display: "flex", flexDirection: "column", gap: 2 },
  statVal: {
    fontSize: 22,
    fontWeight: 700,
    color: "#3B82F6",
    letterSpacing: "-0.5px",
  },
  statLbl: { fontSize: 12, color: "#475569", fontWeight: 500 },
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 32px",
  },
  card: { width: "100%", maxWidth: 400 },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#F1F5F9",
    letterSpacing: "-0.6px",
    marginBottom: 8,
  },
  sub2: { fontSize: 14, color: "#64748B", marginBottom: 36 },
  link: { color: "#3B82F6", fontWeight: 500 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "#94A3B8",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    background: "#111827",
    border: "1px solid #1E293B",
    borderRadius: 8,
    fontSize: 14,
    color: "#F1F5F9",
    transition: "border-color 0.15s",
  },
  error: {
    fontSize: 13,
    color: "#F87171",
    background: "rgba(248,113,113,0.08)",
    border: "1px solid rgba(248,113,113,0.2)",
    borderRadius: 6,
    padding: "8px 12px",
    margin: "12px 0",
  },
  btn: {
    width: "100%",
    marginTop: 20,
    padding: "12px 0",
    background: "#3B82F6",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    cursor: "pointer",
  },
};
