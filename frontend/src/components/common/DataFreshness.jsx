import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

export function DataFreshnessBadge() {
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    api
      .getDataFreshness()
      .then(setData)
      .catch(() => null);
  }, []);

  if (!data) return null;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.3rem 0.75rem",
          background: "rgba(2,195,154,0.1)",
          border: "1px solid rgba(2,195,154,0.3)",
          borderRadius: "20px",
          color: "#02C39A",
          fontSize: "0.8rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            background: "#02C39A",
            borderRadius: "50%",
            display: "inline-block",
            animation: "pulse 2s infinite",
          }}
        />
        {data.total_records.toLocaleString()} records · Updated{" "}
        {data.last_updated}
        <span>{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            right: 0,
            background: "var(--glass-bg)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "1rem",
            minWidth: "280px",
            zIndex: 100,
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <h4 style={{ marginBottom: "0.75rem", color: "var(--accent)" }}>
            📦 Data Sources
          </h4>

          {data.sources.map((source) => (
            <div
              key={source.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                  {source.icon} {source.name}
                </div>
                <div
                  style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}
                >
                  {source.type} · {source.coverage}
                </div>
              </div>
              <div
                style={{
                  color: "#02C39A",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                {source.records.toLocaleString()}
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: "0.75rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
            }}
          >
            {[
              {
                label: "With Salary",
                value: data.salary_records.toLocaleString(),
              },
              {
                label: "Companies",
                value: data.unique_companies.toLocaleString(),
              },
              {
                label: "India Jobs",
                value: data.india_records.toLocaleString(),
              },
              {
                label: "Global Jobs",
                value: data.global_records.toLocaleString(),
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "8px",
                  padding: "0.5rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: "#02C39A",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.5rem",
              background: "rgba(255,179,71,0.08)",
              border: "1px solid rgba(255,179,71,0.2)",
              borderRadius: "8px",
              fontSize: "0.75rem",
              color: "#FFB347",
            }}
          >
            ⚠️ Data is updated periodically.
          </div>
        </div>
      )}
    </div>
  );
}
