import React, { useState } from "react";

const PORTALS = [
  {
    name: "Naukri",
    icon: "🔴",
    color: "#FF6B6B",
    getUrl: (role, location) =>
      `https://www.naukri.com/${role.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-")}-jobs-in-${location.toLowerCase().replace(/\s+/g, "-")}`,
  },
  {
    name: "LinkedIn",
    icon: "🔵",
    color: "#0077B5",
    getUrl: (role, location) =>
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(role)}&location=${encodeURIComponent(location)}`,
  },
  {
    name: "Indeed",
    icon: "🟢",
    color: "#02C39A",
    getUrl: (role, location) =>
      `https://in.indeed.com/jobs?q=${encodeURIComponent(role)}&l=${encodeURIComponent(location)}`,
  },
  {
    name: "Unstop",
    icon: "🟣",
    color: "#8B5CF6",
    getUrl: (role) =>
      `https://unstop.com/jobs?search=${encodeURIComponent(role)}`,
  },
];

const LOCATIONS = [
  "India",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Mumbai",
  "Pune",
  "Delhi",
  "Coimbatore",
  "United States",
  "United Kingdom",
  "Remote",
];

export function JobSearchLinks({ defaultRole = "", compact = false }) {
  const [role, setRole] = useState(defaultRole);
  const [location, setLocation] = useState("India");

  if (compact) {
    return (
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginTop: "1rem",
        }}
      >
        <span
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            alignSelf: "center",
          }}
        >
          🔍 Find jobs:
        </span>
        {PORTALS.map((portal) => (
          <a
            key={portal.name}
            href={portal.getUrl(defaultRole || "data scientist", location)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.3rem 0.75rem",
              background: `${portal.color}20`,
              border: `1px solid ${portal.color}40`,
              borderRadius: "20px",
              color: portal.color,
              fontSize: "0.8rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            {portal.icon} {portal.name}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "1.5rem",
      }}
    >
      <h3 style={{ marginBottom: "1rem", color: "var(--accent)" }}>
        🔍 Find Jobs Now
      </h3>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <div style={{ flex: 1, minWidth: "180px" }}>
          <label className="form-label">🎯 Role</label>
          <input
            className="form-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Data Scientist"
          />
        </div>
        <div style={{ flex: 1, minWidth: "180px" }}>
          <label className="form-label">📍 Location</label>
          <select
            className="form-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {PORTALS.map((portal) => (
          <a
            key={portal.name}
            href={portal.getUrl(role || "data scientist", location)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.75rem",
              background: `${portal.color}15`,
              border: `1px solid ${portal.color}40`,
              borderRadius: "10px",
              color: portal.color,
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "0.95rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = `${portal.color}30`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = `${portal.color}15`)
            }
          >
            <span style={{ fontSize: "1.1rem" }}>{portal.icon}</span>
            {portal.name}
          </a>
        ))}
      </div>
    </div>
  );
}
