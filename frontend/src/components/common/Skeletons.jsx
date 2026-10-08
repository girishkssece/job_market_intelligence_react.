import React from 'react';

/* ─── Base shimmer block ─────────────────────────────────────────────────── */
function Shimmer({ style = {} }) {
  return <div className="skeleton-shimmer" style={style} />;
}

/* ─── MetricsGrid skeleton — 4 metric cards ─────────────────────────────── */
export function MetricsGridSkeleton({ count = 4 }) {
  return (
    <div className="metrics-grid" style={{ marginBottom: 'var(--space-xl)' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-metric-card">
          <Shimmer style={{ width: 36, height: 36, borderRadius: 8, marginBottom: 12 }} />
          <Shimmer style={{ width: '60%', height: 28, borderRadius: 6, marginBottom: 8 }} />
          <Shimmer style={{ width: '80%', height: 14, borderRadius: 4, marginBottom: 6 }} />
          <Shimmer style={{ width: '50%', height: 12, borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
}

/* ─── GlassCard skeleton — generic card placeholder ─────────────────────── */
export function CardSkeleton({ height = 200, rows = 3, hasTitle = true, style = {} }) {
  return (
    <div className="skeleton-card" style={style}>
      {hasTitle && (
        <Shimmer style={{ width: '45%', height: 20, borderRadius: 6, marginBottom: 20 }} />
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <Shimmer
          key={i}
          style={{
            width: i % 3 === 2 ? '70%' : '100%',
            height: 14,
            borderRadius: 4,
            marginBottom: 12,
          }}
        />
      ))}
      <Shimmer
        style={{ width: '100%', height: height - rows * 26 - (hasTitle ? 40 : 0), borderRadius: 8, marginTop: 8 }}
      />
    </div>
  );
}

/* ─── Chart skeleton — chart area placeholder ────────────────────────────── */
export function ChartSkeleton({ height = 340, title }) {
  return (
    <div className="skeleton-card">
      {title
        ? <Shimmer style={{ width: '55%', height: 20, borderRadius: 6, marginBottom: 20 }} />
        : null
      }
      {/* Y-axis labels */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '90%', paddingTop: 10 }}>
          {[...Array(5)].map((_, i) => (
            <Shimmer key={i} style={{ width: 36, height: 10, borderRadius: 4 }} />
          ))}
        </div>
        {/* Bars */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 10, height: '90%' }}>
          {[70, 45, 85, 60, 90, 55, 75, 40, 80, 65].map((h, i) => (
            <Shimmer
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                borderRadius: '4px 4px 0 0',
                minWidth: 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Table skeleton ─────────────────────────────────────────────────────── */
export function TableSkeleton({ rows = 8, cols = 4, hasTitle = true }) {
  const widths = ['55%', '100%', '70%', '80%', '40%'];
  return (
    <div className="skeleton-card">
      {hasTitle && (
        <Shimmer style={{ width: '40%', height: 20, borderRadius: 6, marginBottom: 20 }} />
      )}
      {/* Header row */}
      <div className="skeleton-table-row skeleton-table-header">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer key={i} style={{ height: 14, borderRadius: 4, flex: 1 }} />
        ))}
      </div>
      {/* Body rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-table-row">
          {Array.from({ length: cols }).map((_, j) => (
            <Shimmer
              key={j}
              style={{ height: 13, borderRadius: 4, flex: 1, width: widths[(i + j) % widths.length] }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Two-column charts grid skeleton ────────────────────────────────────── */
export function ChartsGridSkeleton() {
  return (
    <div className="charts-grid" style={{ marginBottom: 'var(--space-xl)' }}>
      <ChartSkeleton height={320} title />
      <ChartSkeleton height={320} title />
    </div>
  );
}

/* ─── Dashboard-specific skeleton layout ────────────────────────────────── */
export function DashboardSkeleton() {
  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <Shimmer style={{ width: '50%', height: 32, borderRadius: 8, marginBottom: 12 }} />
        <Shimmer style={{ width: '70%', height: 16, borderRadius: 6 }} />
      </div>
      {/* Hero CTA area */}
      <div className="skeleton-card" style={{ marginBottom: 32, padding: 40, textAlign: 'center' }}>
        <Shimmer style={{ width: '60%', height: 36, borderRadius: 8, margin: '0 auto 16px' }} />
        <Shimmer style={{ width: '80%', height: 16, borderRadius: 6, margin: '0 auto 24px' }} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Shimmer style={{ width: 140, height: 44, borderRadius: 10 }} />
          <Shimmer style={{ width: 140, height: 44, borderRadius: 10 }} />
        </div>
      </div>
      <MetricsGridSkeleton count={4} />
      <ChartsGridSkeleton />
    </div>
  );
}

/* ─── Page-level skeleton with header + metrics + chart ─────────────────── */
export function PageSkeleton({ hasMetrics = true, hasChart = true, hasTable = false }) {
  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <Shimmer style={{ width: '45%', height: 32, borderRadius: 8, marginBottom: 10 }} />
        <Shimmer style={{ width: '65%', height: 16, borderRadius: 6 }} />
      </div>
      {/* Filter card */}
      <div className="skeleton-card" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Shimmer style={{ width: '40%', height: 12, borderRadius: 4, marginBottom: 10 }} />
            <Shimmer style={{ width: '100%', height: 40, borderRadius: 8 }} />
          </div>
          <div style={{ flex: 1 }}>
            <Shimmer style={{ width: '40%', height: 12, borderRadius: 4, marginBottom: 10 }} />
            <Shimmer style={{ width: '100%', height: 40, borderRadius: 8 }} />
          </div>
        </div>
      </div>
      {hasMetrics && <MetricsGridSkeleton count={3} />}
      {hasChart && <ChartsGridSkeleton />}
      {hasTable && <TableSkeleton rows={7} cols={4} />}
    </div>
  );
}

/* ─── AI result skeleton — long text output placeholder ──────────────────── */
export function AISkeleton({ lines = 8 }) {
  const widths = ['100%', '95%', '88%', '100%', '92%', '75%', '100%', '85%'];
  return (
    <div className="skeleton-card">
      <Shimmer style={{ width: 100, height: 12, borderRadius: 4, marginBottom: 20 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          style={{
            width: widths[i % widths.length],
            height: 13,
            borderRadius: 4,
            marginBottom: i % 4 === 3 ? 20 : 10,
          }}
        />
      ))}
    </div>
  );
}
