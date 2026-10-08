import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";
import {
  PageWrapper,
  GlassCard,
  MetricCard,
  LoadingSpinner,
  Tabs,
} from "../components/common/UIComponents";
import { ChartsGridSkeleton, MetricsGridSkeleton } from '../components/common/Skeletons';
import { JobSearchLinks } from '../components/common/JobSearchLinks';
import { api } from "../services/api";

const ROLES = [
  "All Roles",
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
];

const TREND_COLORS = {
  rising: "#02C39A",
  stable: "#065A82",
  declining: "#FF6B6B",
};

const TREND_ICONS = {
  rising: "📈",
  stable: "➡️",
  declining: "📉",
};

export function SkillForecasting() {
  const [role, setRole] = useState("All Roles");
  const [region, setRegion] = useState("Global");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getSkillTrends(
        role === "All Roles" ? null : role,
        region === "Global" ? null : region,
      );
      setData(result);
    } catch (err) {
      setError("Failed to load skill trends.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, region]);

  return (
    <PageWrapper
      title="📈 Skill Demand Forecasting"
      subtitle="Track which skills are rising, stable, or declining in the job market"
    >
      {/* ── FILTERS ── */}
      <GlassCard style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <label className="form-label">🎯 Role</label>
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
          <div style={{ alignSelf: "flex-end" }}>
            <button className="btn btn-primary" onClick={fetchData}>
              🔄 Refresh
            </button>
          </div>
        </div>
      </GlassCard>

      {loading && (
        <>
          <MetricsGridSkeleton count={4} />
          <ChartsGridSkeleton />
        </>
      )}
      {error && <div className="error-banner">❌ {error}</div>}

      {data && !loading && (
        <>
          {/* ── SUMMARY METRICS ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <MetricCard
              icon="📊"
              value={data.total_skills}
              label="Skills Tracked"
            />
            <MetricCard
              icon="📈"
              value={data.rising.length}
              label="Rising Skills"
            />
            <MetricCard
              icon="📉"
              value={data.declining.length}
              label="Declining Skills"
            />
            <MetricCard
              icon="➡️"
              value={data.trends.filter((t) => t.trend === "stable").length}
              label="Stable Skills"
            />
          </div>

          {/* ── RISING vs DECLINING ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* Rising skills */}
            <GlassCard>
              <h3 style={{ color: "#02C39A", marginBottom: "1rem" }}>
                📈 Fastest Rising Skills
              </h3>
              {data.rising.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {data.rising.map((skill, i) => (
                    <div
                      key={skill.skill}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem",
                        background: "rgba(2,195,154,0.08)",
                        border: "1px solid rgba(2,195,154,0.2)",
                        borderRadius: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.2rem",
                          minWidth: "28px",
                          textAlign: "center",
                        }}
                      >
                        #{i + 1}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        >
                          {skill.skill}
                        </div>
                        <div
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.8rem",
                          }}
                        >
                          {skill.newer_count} recent postings
                        </div>
                      </div>
                      <div
                        style={{
                          color: "#02C39A",
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                      >
                        +{skill.growth_pct}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)" }}>
                  No strongly rising skills found for this filter.
                </p>
              )}
            </GlassCard>

            {/* Declining skills */}
            <GlassCard>
              <h3 style={{ color: "#FF6B6B", marginBottom: "1rem" }}>
                📉 Declining Skills
              </h3>
              {data.declining.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {data.declining.map((skill, i) => (
                    <div
                      key={skill.skill}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem",
                        background: "rgba(255,107,107,0.08)",
                        border: "1px solid rgba(255,107,107,0.2)",
                        borderRadius: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.2rem",
                          minWidth: "28px",
                          textAlign: "center",
                        }}
                      >
                        #{i + 1}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        >
                          {skill.skill}
                        </div>
                        <div
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.8rem",
                          }}
                        >
                          {skill.older_count} → {skill.newer_count} postings
                        </div>
                      </div>
                      <div
                        style={{
                          color: "#FF6B6B",
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                      >
                        {skill.growth_pct}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)" }}>
                  No significantly declining skills found.
                </p>
              )}
            </GlassCard>
          </div>

          {/* ── FULL TREND CHART ── */}
          <GlassCard style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>
              📊 All Skills — Demand Overview
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={data.trends}
                layout="vertical"
                margin={{ left: 120, right: 60 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                  horizontal={false}
                />
                <XAxis type="number" stroke="var(--text-muted)" />
                <YAxis
                  type="category"
                  dataKey="skill"
                  stroke="var(--text-muted)"
                  tick={{ fontSize: 11, textTransform: "capitalize" }}
                  width={115}
                />
                <Tooltip
                  formatter={(val, name) => [
                    val,
                    name === "newer_count" ? "Recent" : "Older",
                  ]}
                  contentStyle={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--border)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="older_count"
                  name="Older Postings"
                  fill="#065A82"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="newer_count"
                  name="Recent Postings"
                  fill="#02C39A"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* ── SKILL CARDS GRID ── */}
          <GlassCard>
            <h3 style={{ marginBottom: "1rem" }}>🗂️ All Tracked Skills</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {data.trends.map((skill) => (
                <div
                  key={skill.skill}
                  style={{
                    padding: "0.75rem",
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${TREND_COLORS[skill.trend]}40`,
                    borderRadius: "8px",
                    borderLeft: `3px solid ${TREND_COLORS[skill.trend]}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.3rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        textTransform: "capitalize",
                        fontSize: "0.9rem",
                      }}
                    >
                      {skill.skill}
                    </span>
                    <span>{TREND_ICONS[skill.trend]}</span>
                  </div>
                  <div
                    style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}
                  >
                    {skill.total} total postings
                  </div>
                  <div
                    style={{
                      color: TREND_COLORS[skill.trend],
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {skill.growth_pct > 0 ? "+" : ""}
                    {skill.growth_pct}%
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <JobSearchLinks defaultRole={role === 'All Roles' ? 'Data Scientist' : role} />

          {/* ── HONEST DISCLAIMER ── */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "rgba(255,179,71,0.08)",
              border: "1px solid rgba(255,179,71,0.3)",
              borderRadius: "8px",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            ⚠️ <strong>Note:</strong> Trend analysis is based on the position of
            job postings within our dataset (115K records), not real-time data.
            It approximates older vs newer demand but should not be treated as a
            precise time-series forecast. For production-grade forecasting, a
            live daily data pipeline is needed.
          </div>
        </>
      )}
    </PageWrapper>
  );
}
