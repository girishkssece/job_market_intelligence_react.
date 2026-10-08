import React, { useState } from 'react';
import { PageWrapper, GlassCard, LoadingSpinner, ErrorBanner } from '../components/common/UIComponents';
import { api } from '../services/api';
import { TARGET_ROLES } from '../data/constants';
import { useAuth } from '../context/AuthContext';

export function ExportReport() {
  const { user } = useAuth();
  const [role, setRole] = useState('Data Scientist');
  const [region, setRegion] = useState('Global');
  const [userName, setUserName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      const blob = await api.exportReport({
        role,
        region,
        user_name: userName,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CareerLens_${role.replace(/\//g, '_')}_${region}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccess(true);
    } catch (err) {
      console.error('PDF export failed:', err);
      setError('Failed to generate PDF. Please ensure the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="📊 Export Market Intelligence PDF Report"
      subtitle="Download a complete, publication-quality PDF report with salary benchmarks, skill demand, and market trends."
    >
      <div className="form-row">
        <GlassCard className="no-hover" style={{ flex: 1 }}>
          <h3 className="mb-md">⚙️ Configure PDF Report</h3>
          <form onSubmit={handleDownload} className="flex flex-col gap-md">
            <div className="form-group">
              <label className="form-label">Target Role</label>
              <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                {TARGET_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Region Scope</label>
              <select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="Global">Global Market</option>
                <option value="India">India Market</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Prepared For (Name on PDF cover)</label>
              <input
                type="text"
                className="form-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Girish K S"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg mt-md" disabled={loading}>
              {loading ? 'Generating PDF...' : '📥 Generate & Download PDF'}
            </button>

            {error && <ErrorBanner error={error} />}

            {success && (
              <div className="badge badge-accent mt-sm" style={{ padding: '10px 14px' }}>
                ✅ PDF Report generated and download started!
              </div>
            )}
          </form>
        </GlassCard>

        <GlassCard className="no-hover" style={{ flex: 1 }}>
          <h3 className="mb-md">📄 Report Summary Contents</h3>
          <div className="flex flex-col gap-md">
            <div className="flex items-center gap-sm">
              <span className="badge badge-accent">1</span>
              <span><strong>Market Overview:</strong> 25th, 50th, 75th, 90th percentile salary benchmarks (USD + INR).</span>
            </div>
            <div className="flex items-center gap-sm">
              <span className="badge badge-accent">2</span>
              <span><strong>Skills Analysis:</strong> Top 15 in-demand skills ranked by employer demand.</span>
            </div>
            <div className="flex items-center gap-sm">
              <span className="badge badge-accent">3</span>
              <span><strong>Top Employers:</strong> Leading hiring companies for {role}.</span>
            </div>
            <div className="flex items-center gap-sm">
              <span className="badge badge-accent">4</span>
              <span><strong>Negotiation Playbook:</strong> Key negotiation targets for entry, mid, and senior levels.</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
