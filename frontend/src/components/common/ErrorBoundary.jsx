import React from 'react';

/**
 * ErrorBoundary — catches any uncaught render/lifecycle errors in its subtree
 * and renders a friendly fallback UI instead of a blank screen.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production you'd pipe this to Sentry / LogRocket here
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { error, errorInfo } = this.state;
    const isDev = import.meta.env.DEV;

    return (
      <div style={styles.wrapper}>
        {/* Decorative background orbs */}
        <div style={{ ...styles.orb, ...styles.orb1 }} />
        <div style={{ ...styles.orb, ...styles.orb2 }} />

        <div style={styles.card}>
          {/* Icon */}
          <div style={styles.iconWrap}>
            <span style={styles.icon}>⚡</span>
          </div>

          <h2 style={styles.heading}>Something went wrong</h2>
          <p style={styles.sub}>
            An unexpected error occurred in this section of the app.
            Your other features and data are completely unaffected.
          </p>

          {/* Error message pill */}
          {error && (
            <div style={styles.errorPill}>
              <span style={styles.errorLabel}>Error:</span>{' '}
              {error.message || String(error)}
            </div>
          )}

          {/* Dev-only stack trace toggle */}
          {isDev && errorInfo && (
            <details style={styles.details}>
              <summary style={styles.summary}>🛠 Component stack (dev only)</summary>
              <pre style={styles.stack}>{errorInfo.componentStack}</pre>
            </details>
          )}

          <div style={styles.actions}>
            <button style={styles.btnPrimary} onClick={this.handleReset}>
              🔄 Try Again
            </button>
            <button
              style={styles.btnSecondary}
              onClick={() => window.location.assign('/dashboard')}
            >
              🏠 Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
}

/* ─── Inline styles ──────────────────────────────────────────────────────── */
const styles = {
  wrapper: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    position: 'relative',
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  orb1: {
    width: 300,
    height: 300,
    background: 'rgba(239,68,68,0.08)',
    top: '-60px',
    left: '-80px',
  },
  orb2: {
    width: 200,
    height: 200,
    background: 'rgba(6,90,130,0.1)',
    bottom: '-40px',
    right: '-40px',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 520,
    width: '100%',
    background: 'var(--gradient-card)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 20,
    padding: '40px 36px',
    textAlign: 'center',
    boxShadow: '0 8px 40px rgba(239,68,68,0.08)',
    backdropFilter: 'blur(12px)',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  icon: {
    fontSize: '2rem',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 12,
  },
  sub: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    marginBottom: 24,
  },
  errorPill: {
    display: 'inline-block',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: '0.8rem',
    color: '#FCA5A5',
    marginBottom: 24,
    wordBreak: 'break-word',
    textAlign: 'left',
    width: '100%',
  },
  errorLabel: {
    fontWeight: 700,
    color: '#F87171',
  },
  details: {
    marginBottom: 24,
    textAlign: 'left',
  },
  summary: {
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: 8,
    userSelect: 'none',
  },
  stack: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    padding: 12,
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    marginTop: 8,
    lineHeight: 1.6,
  },
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #065a82, #02c39a)',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'transform 150ms, box-shadow 150ms',
  },
  btnSecondary: {
    padding: '10px 24px',
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-default)',
    borderRadius: 10,
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
};
