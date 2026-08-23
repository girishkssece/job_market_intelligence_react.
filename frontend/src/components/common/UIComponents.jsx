import React from 'react';

export function PageWrapper({ title, subtitle, children }) {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function GlassCard({ children, className = '', noHover = false, style }) {
  return (
    <div className={`glass-card ${noHover ? 'no-hover' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function MetricCard({ icon, value, label, delta }) {
  return (
    <div className="metric-card">
      {icon && <div className="metric-icon">{icon}</div>}
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      {delta && <div className="metric-delta">{delta}</div>}
    </div>
  );
}

export function LoadingSpinner({ text = 'Loading market data...' }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <div className="loading-text">{text}</div>
    </div>
  );
}

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id || tab}
          className={`tab-btn ${activeTab === (tab.id || tab) ? 'active' : ''}`}
          onClick={() => onChange(tab.id || tab)}
        >
          {tab.label || tab}
        </button>
      ))}
    </div>
  );
}
