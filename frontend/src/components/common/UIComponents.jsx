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

export function ErrorBanner({ error, onRetry }) {
  if (!error) return null;
  return (
    <div style={{
      background: 'rgba(239, 68, 68, 0.12)',
      border: '1px solid rgba(239, 68, 68, 0.35)',
      borderRadius: '12px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      margin: '16px 0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '1.4rem' }}>⚠️</span>
        <div>
          <div style={{ fontWeight: 600, color: '#FCA5A5', marginBottom: '2px' }}>
            Failed to load data
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            {typeof error === 'string' ? error : error?.message || 'An unexpected error occurred.'}
          </div>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: 'rgba(239,68,68,0.2)',
            border: '1px solid rgba(239,68,68,0.4)',
            color: '#FCA5A5',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          🔄 Retry
        </button>
      )}
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
