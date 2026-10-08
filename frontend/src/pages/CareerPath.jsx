import React, { useState } from 'react';
import { PageWrapper, GlassCard, LoadingSpinner, ErrorBanner } from '../components/common/UIComponents';
import { JobSearchLinks } from '../components/common/JobSearchLinks';
import { api } from '../services/api';
import { TARGET_ROLES } from '../data/constants';

export function CareerPath() {
  const [currentRole, setCurrentRole] = useState('Data Analyst');
  const [targetRole, setTargetRole] = useState('Data Scientist');
  const [skills, setSkills] = useState('SQL, Python, Excel, Tableau');
  const [experience, setExperience] = useState(2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExplore = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.getCareerPath({
        current_role: currentRole, target_role: targetRole,
        skills, experience: parseInt(experience),
      });
      if (res.error) setError(res.error);
      else setResult(res.result);
    } catch (err) {
      setError(err.message || 'Failed to generate career path. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="Career Path Explorer"
      subtitle="Map your progression from your current role to your target dream job."
    >
      <GlassCard className="no-hover mb-lg">
        <h3 className="mb-md">🗺️ Define Your Transition Goal</h3>
        <form onSubmit={handleExplore} className="form-row">
          <div className="form-group">
            <label className="form-label">Current Role</label>
            <select className="form-select" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)}>
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Target Goal Role</label>
            <select className="form-select" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Years of Experience ({experience} yrs)</label>
            <input
              type="number"
              className="form-input"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              min="0"
              max="20"
            />
          </div>

          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Current Skills</label>
            <input
              type="text"
              className="form-input"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Python, SQL, Docker"
            />
          </div>

          <div className="form-group" style={{ alignSelf: 'flex-end' }}>
            {currentRole === targetRole && (
              <p style={{ fontSize: '0.8rem', color: '#F59E0B', marginBottom: '6px' }}>
                ⚠️ Current and target roles must be different.
              </p>
            )}
            <button type="submit" className="btn btn-primary btn-block" disabled={loading || currentRole === targetRole}>
              {loading ? 'Mapping Path...' : '🚀 Generate Path'}
            </button>
          </div>
        </form>
      </GlassCard>

      {loading ? (
        <LoadingSpinner text="Building personalized career transition roadmap..." />
      ) : error ? (
        <GlassCard noHover>
          <ErrorBanner error={error} />
        </GlassCard>
      ) : result ? (
        <>
          <GlassCard noHover>
            <div className="ai-result">{result}</div>
          </GlassCard>
          <JobSearchLinks defaultRole={targetRole} />
        </>
      ) : (
        <>
          <GlassCard noHover className="text-center" style={{ padding: '40px' }}>
            <h3>🎯 Ready to Plan Your Progression?</h3>
            <p className="text-muted mt-md">Select your starting role and goal role above to receive a step-by-step transition roadmap.</p>
          </GlassCard>
          <JobSearchLinks defaultRole={targetRole} />
        </>
      )}
    </PageWrapper>
  );
}
