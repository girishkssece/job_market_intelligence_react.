import React, { useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  PageWrapper,
  GlassCard,
  MetricCard,
  LoadingSpinner,
} from "../components/common/ui";
import { api } from "../services/api";

const ROLES = [
  "Data Scientist",
  "Data Analyst",
  "Data Engineer",
  "ML Engineer",
  "AI Engineer",
  "Software Engineer",
  "Business Analyst",
  "DevOps/MLOps Engineer",
  "Cloud Engineer",
  "Frontend Developer",
  "Full Stack Developer",
  "Data Science Intern",
  "Software Engineering Intern",
  "Business Analyst Intern",
];

const POSITION_CONFIG = {
  underpaid: { label: "Underpaid", color: "#FF6B6B", emoji: "⚠️" },
  below_median: { label: "Below Market", color: "#FFB347", emoji: "📊" },
  above_median: { label: "Above Median", color: "#02C39A", emoji: "✅" },
  top_25: { label: "Top 25%", color: "#065A82", emoji: "🌟" },
  top_10: { label: "Top 10%", color: "#028090", emoji: "🏆" },
  fresher: { label: "Fresher", color: "#A0B4C0", emoji: "🎓" },
};

export function SalaryComparison() {
  const [role, setRole] = useState("Data Scientist");
  const [currency, setCurrency] = useState("USD");
  const [currentSal, setCurrentSal] = useState("");
  const [experience, setExperience] = useState(2);
  const [region, setRegion] = useState("Global");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toUSD = (val) => (currency === "INR" ? val * 1200 : val);
  const toDisplay = (usdVal) =>
    currency === "INR"
      ? `₹${(usdVal / 1200).toFixed(1)}L`
      : `$${usdVal.toLocaleString()}`;

  const handleAnalyze = async () => {
    if (!currentSal) return;
    setLoading(true);
    setError(null);
    try {
      const salUSD = toUSD(parseFloat(currentSal));
      const data = await api.getSalaryComparison(
        role,
        experience,
        salUSD,
        region,
      );
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to fetch comparison data.");
    } finally {
      setLoading(false);
    }
  };

  const posConfig = result
    ? POSITION_CONFIG[result.position] || POSITION_CONFIG.above_median
    : null;

  return (
    <PageWrapper
      title="💰 Salary Comparison Tool"
      subtitle="Find out if you're being paid fairly — backed by real market data"
    >
      {/* ── INPUT SECTION ── */}
      <GlassCard style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem", color: "var(--accent)" }}>
          📝 Enter Your Details
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <div>
            <label className="form-label">🎯 Your Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">📍 Region</label>
            <select
              className="form-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="Global">Global</option>
              <option value="India">India</option>
            </select>
          </div>

          <div>
            <label className="form-label">💱 Currency</label>
            <select
              className="form-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (LPA)</option>
            </select>
          </div>

          <div>
            <label className="form-label">📅 Years of Experience</label>
            <input
              type="number"
              className="form-input"
              value={experience}
              min={0}
              max={30}
              step={0.5}
              onChange={(e) => setExperience(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label className="form-label">
              💵 Your Current Salary ({currency === "INR" ? "LPA" : "USD/year"})
            </label>
            <input
              type="number"
              className="form-input"
              value={currentSal}
              placeholder={currency === "INR" ? "e.g. 12.5" : "e.g. 85000"}
              onChange={(e) => setCurrentSal(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              className="btn-primary"
              onClick={handleAnalyze}
              disabled={loading || !currentSal}
              style={{ width: "100%" }}
            >
              {loading ? "⏳ Analyzing..." : "🔍 Compare My Salary"}
            </button>
          </div>
        </div>
      </GlassCard>

      {loading && <LoadingSpinner text="Analyzing your market position..." />}
      {error && <div className="error-banner">❌ {error}</div>}

      {result && posConfig && (
        <>
          {/* ── RESULT BANNER ── */}
          <GlassCard
            style={{
              marginBottom: "1.5rem",
              borderLeft: `4px solid ${posConfig.color}`,
              background: `linear-gradient(135deg, ${posConfig.color}15, transparent)`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "3rem" }}>{posConfig.emoji}</span>
              <div>
                <h2 style={{ color: posConfig.color, margin: 0 }}>
                  You are {posConfig.label}
                </h2>
                <p style={{ color: "var(--text-muted)", margin: "0.3rem 0 0" }}>
                  You're in approximately the{" "}
                  <strong style={{ color: posConfig.color }}>
                    {result.percentile}th percentile
                  </strong>{" "}
                  of {result.role} salaries in {result.region}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* ── KEY METRICS ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <MetricCard
              icon="💵"
              value={toDisplay(result.current_salary)}
              label="Your Salary"
            />
            <MetricCard
              icon="📊"
              value={toDisplay(result.market.p25)}
              label="25th Percentile"
            />
            <MetricCard
              icon="⚖️"
              value={toDisplay(result.market.median)}
              label="Market Median"
            />
            <MetricCard
              icon="🌟"
              value={toDisplay(result.market.p75)}
              label="75th Percentile"
            />
            <MetricCard
              icon="🏆"
              value={toDisplay(result.market.p90)}
              label="90th Percentile"
            />
          </div>

          {/* ── CHARTS ROW ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* Bar chart comparison */}
            <GlassCard>
              <h3 style={{ marginBottom: "1rem" }}>📊 Your Salary vs Market</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={[
                    {
                      name: "You",
                      value: result.current_salary,
                      fill: posConfig.color,
                    },
                    { name: "P25", value: result.market.p25, fill: "#A0B4C0" },
                    {
                      name: "Median",
                      value: result.market.median,
                      fill: "#065A82",
                    },
                    { name: "P75", value: result.market.p75, fill: "#02C39A" },
                    { name: "P90", value: result.market.p90, fill: "#028090" },
                  ]}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="name" stroke="var(--text-muted)" />
                  <YAxis
                    stroke="var(--text-muted)"
                    tickFormatter={(v) =>
                      currency === "INR"
                        ? `₹${(v / 1200).toFixed(0)}L`
                        : `$${(v / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip
                    formatter={(v) => [toDisplay(v), "Salary"]}
                    contentStyle={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <ReferenceLine
                    y={result.current_salary}
                    stroke={posConfig.color}
                    strokeDasharray="5 5"
                    label={{
                      value: "You",
                      fill: posConfig.color,
                      fontSize: 11,
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {[
                      posConfig.color,
                      "#A0B4C0",
                      "#065A82",
                      "#02C39A",
                      "#028090",
                    ].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Gap analysis */}
            <GlassCard>
              <h3 style={{ marginBottom: "1rem" }}>🎯 Gap Analysis</h3>

              {result.gap_to_median > 0 ? (
                <div>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Gap to Market Median
                    </p>
                    <div
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: 700,
                        color: "#FFB347",
                      }}
                    >
                      {toDisplay(result.gap_to_median)}
                    </div>
                    <div
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.85rem",
                      }}
                    >
                      You need a{" "}
                      <strong style={{ color: "#FFB347" }}>
                        {result.increase_pct.toFixed(0)}% raise
                      </strong>{" "}
                      to reach market median
                    </div>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Gap to Top 25%
                    </p>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "#02C39A",
                      }}
                    >
                      {toDisplay(Math.max(0, result.gap_to_p75))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                    🎉
                  </div>
                  <p
                    style={{
                      color: "#02C39A",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    You're earning above the market median!
                  </p>
                  <p style={{ color: "var(--text-muted)" }}>
                    You earn{" "}
                    <strong style={{ color: "#02C39A" }}>
                      {toDisplay(Math.abs(result.gap_to_median))}
                    </strong>{" "}
                    more than the median
                  </p>
                </div>
              )}

              {/* Percentile bar */}
              <div style={{ marginTop: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.3rem",
                  }}
                >
                  <span
                    style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
                  >
                    Your Percentile
                  </span>
                  <span style={{ color: posConfig.color, fontWeight: 600 }}>
                    ~{result.percentile}th
                  </span>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "99px",
                    height: "12px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${result.percentile}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, #065A82, ${posConfig.color})`,
                      borderRadius: "99px",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.3rem",
                  }}
                >
                  <span
                    style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}
                  >
                    0th
                  </span>
                  <span
                    style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}
                  >
                    100th
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* ── NEGOTIATION ADVICE ── */}
          <GlassCard>
            <h3 style={{ marginBottom: "1rem" }}>
              💼 What Should You Do Next?
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              {result.position === "underpaid" && (
                <>
                  <div className="advice-card advice-urgent">
                    <strong>🚨 Immediate Action Required</strong>
                    <p>
                      You're significantly below market rate. Start job hunting
                      or negotiate immediately.
                    </p>
                  </div>
                  <div className="advice-card">
                    <strong>📧 Request a Meeting</strong>
                    <p>
                      Schedule a salary review with your manager. Use our
                      Negotiation Coach for a script.
                    </p>
                  </div>
                  <div className="advice-card">
                    <strong>🔍 Explore Market</strong>
                    <p>
                      Apply to 5 companies this week. External offers are the
                      strongest negotiation tool.
                    </p>
                  </div>
                </>
              )}
              {result.position === "below_median" && (
                <>
                  <div className="advice-card">
                    <strong>📊 You Have Room to Grow</strong>
                    <p>
                      Target a {result.increase_pct.toFixed(0)}% raise in your
                      next review cycle.
                    </p>
                  </div>
                  <div className="advice-card">
                    <strong>🛠️ Upskill Strategically</strong>
                    <p>
                      Adding high-demand skills can justify a raise. Check our
                      Skill Trends page.
                    </p>
                  </div>
                  <div className="advice-card">
                    <strong>💬 Negotiate Now</strong>
                    <p>
                      Annual review coming? Use this data to back your ask.
                      Visit Negotiation Coach.
                    </p>
                  </div>
                </>
              )}
              {(result.position === "above_median" ||
                result.position === "top_25") && (
                <>
                  <div className="advice-card advice-success">
                    <strong>✅ You're Well Compensated</strong>
                    <p>
                      Your salary is above the market median. Focus on career
                      growth now.
                    </p>
                  </div>
                  <div className="advice-card">
                    <strong>🚀 Target Top 10%</strong>
                    <p>
                      To reach the 90th percentile, focus on senior roles and
                      leadership skills.
                    </p>
                  </div>
                  <div className="advice-card">
                    <strong>📈 Think Total Comp</strong>
                    <p>
                      At your level, negotiate equity, bonuses, and benefits —
                      not just base salary.
                    </p>
                  </div>
                </>
              )}
              {result.position === "top_10" && (
                <>
                  <div className="advice-card advice-success">
                    <strong>🏆 Top 10% Earner!</strong>
                    <p>
                      You're in the elite tier. Focus on equity, leadership, and
                      long-term wealth building.
                    </p>
                  </div>
                </>
              )}
              {result.position === "fresher" && (
                <>
                  <div className="advice-card">
                    <strong>🎓 Starting Your Journey</strong>
                    <p>
                      Target the 25th percentile as your first salary goal:{" "}
                      {toDisplay(result.market.p25)}
                    </p>
                  </div>
                  <div className="advice-card">
                    <strong>🛠️ Build Your Skills</strong>
                    <p>
                      Check our Course Recommendations and Portfolio Projects
                      pages.
                    </p>
                  </div>
                </>
              )}
            </div>
          </GlassCard>

          {/* ── EXPERIENCE TRAJECTORY ── */}
          {result.experience_data && result.experience_data.length > 0 && (
            <GlassCard style={{ marginTop: "1.5rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>
                📈 Salary Growth by Experience — {result.role}
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={result.experience_data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="experience" stroke="var(--text-muted)" />
                  <YAxis
                    stroke="var(--text-muted)"
                    tickFormatter={(v) =>
                      currency === "INR"
                        ? `₹${(v / 1200).toFixed(0)}L`
                        : `$${(v / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip
                    formatter={(v) => [toDisplay(v), "Median Salary"]}
                    contentStyle={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Bar dataKey="median" fill="#065A82" radius={[4, 4, 0, 0]} />
                  <ReferenceLine
                    y={result.current_salary}
                    stroke={posConfig.color}
                    strokeDasharray="5 5"
                    label={{
                      value: "You",
                      fill: posConfig.color,
                      fontSize: 11,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          )}
        </>
      )}
    </PageWrapper>
  );
}
