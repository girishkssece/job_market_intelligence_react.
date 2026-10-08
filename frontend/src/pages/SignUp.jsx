import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "", general: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "At least 6 characters.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      await login(form.email, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setErrors({
        general: err.response?.data?.detail || "Could not create account.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: "Full name",
      name: "name",
      type: "text",
      ph: "Girish K S",
      ac: "name",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      ph: "you@example.com",
      ac: "email",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      ph: "Min. 6 characters",
      ac: "new-password",
    },
    {
      label: "Confirm password",
      name: "confirm",
      type: "password",
      ph: "••••••••",
      ac: "new-password",
    },
  ];

  return (
    <div style={s.page}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #4A5568; }
        input:focus { outline: none; border-color: #3B82F6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        @keyframes mesh { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,20px) scale(1.05); } }
      `}</style>

      <div style={s.left}>
        <div style={s.mesh} />
        <div style={s.leftInner}>
          <div style={s.logo}>
            <div style={s.logoMark}>CL</div>
            <span style={s.logoText}>CareerLens</span>
          </div>
          <h2 style={s.tagline}>
            Start making
            <br />
            smarter moves.
          </h2>
          <p style={s.sub}>
            Free account. Instant access to salary predictions, live skill
            trends, and your AI career advisor.
          </p>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {[
              "Salary prediction across 18 role categories",
              "Real-time skill demand from 115K+ job posts",
              "AI career advisor powered by Llama 3.3 70B",
              "Live job search with Naukri integration",
            ].map((f) => (
              <li
                key={f}
                style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
              >
                <span
                  style={{
                    color: "#3B82F6",
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.5 }}
                >
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={s.right}>
        <div style={s.card}>
          <h1 style={s.title}>Create account</h1>
          <p style={s.sub2}>
            Already have one?{" "}
            <Link to="/login" style={s.link}>
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {fields.map(({ label, name, type, ph, ac }) => (
              <div key={name} style={{ marginBottom: 16 }}>
                <label style={s.label}>{label}</label>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={ph}
                  autoComplete={ac}
                  style={{
                    ...s.input,
                    borderColor: errors[name]
                      ? "rgba(248,113,113,0.5)"
                      : undefined,
                  }}
                />
                {errors[name] && <p style={s.fieldErr}>{errors[name]}</p>}
              </div>
            ))}

            {errors.general && <p style={s.error}>{errors.general}</p>}

            <button
              type="submit"
              style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account"}
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
    marginBottom: 40,
    maxWidth: 320,
  },
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
  sub2: { fontSize: 14, color: "#64748B", marginBottom: 32 },
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
  fieldErr: { fontSize: 12, color: "#F87171", marginTop: 4 },
  error: {
    fontSize: 13,
    color: "#F87171",
    background: "rgba(248,113,113,0.08)",
    border: "1px solid rgba(248,113,113,0.2)",
    borderRadius: 6,
    padding: "8px 12px",
    margin: "8px 0",
  },
  btn: {
    width: "100%",
    marginTop: 8,
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
