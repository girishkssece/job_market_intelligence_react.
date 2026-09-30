import React, { useState } from 'react';
import { PageWrapper, GlassCard, LoadingSpinner, Tabs, ErrorBanner } from '../components/common/UIComponents';
import { api } from '../services/api';
import { TARGET_ROLES, STATIC_PROJECTS } from '../data/constants';

export function PortfolioProjects() {
  const [activeTab, setActiveTab] = useState('curated');
  const [role, setRole] = useState('Data Scientist');
  const [experience, setExperience] = useState('Intermediate developer');
  const [interests, setInterests] = useState('');
  const [userSkills, setUserSkills] = useState('');
  const [aiProjects, setAiProjects] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleGenerateAiProjects = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiError(null);
    setAiProjects(null);
    try {
      const res = await api.getPortfolioProjects({
        role, experience, interests, skills: userSkills, count: 4,
      });
      if (res.error) setAiError(res.error);
      else setAiProjects(res.result);
    } catch (err) {
      setAiError(err.message || 'Failed to generate projects.');
    } finally {
      setLoading(false);
    }
  };

  const curatedList = STATIC_PROJECTS[role] || STATIC_PROJECTS['Data Scientist'];

  return (
    <PageWrapper
      title="🚀 Portfolio Project Generator"
      subtitle="Build resume-worthy projects tailored to your target role and market skill demands."
    >
      <Tabs
        tabs={[
          { id: 'curated', label: '📚 Curated Industry Projects' },
          { id: 'ai', label: '🤖 AI Custom Project Generator' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <GlassCard className="no-hover mb-lg">
        <div className="form-group">
          <label className="form-label">Target Role</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
            {TARGET_ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </GlassCard>

      {activeTab === 'curated' && (
        <div className="flex flex-col gap-lg stagger-children">
          {curatedList.map((p, idx) => (
            <GlassCard key={idx} noHover>
              <div className="flex justify-between items-center mb-sm">
                <h3 className="text-accent">{p.title}</h3>
                <span className="badge badge-accent">{p.difficulty} • {p.duration}</span>
              </div>
              <p className="mb-md">{p.description}</p>
              <div className="flex gap-sm mb-md flex-wrap">
                {p.skills.map((s) => (
                  <span key={s} className="badge badge-neutral">{s}</span>
                ))}
              </div>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                📦 <strong>Dataset:</strong> {p.dataset} | 💡 <strong>Impact:</strong> {p.impact}
              </p>
              <div className="flex gap-sm mt-md">
                <a href={`https://www.kaggle.com/search?q=${encodeURIComponent(p.title)}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  📦 Kaggle Dataset
                </a>
                <a href={`https://github.com/search?q=${encodeURIComponent(p.title)}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                  💻 GitHub Examples
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="form-row">
          <GlassCard className="no-hover" style={{ flex: 1 }}>
            <h3 className="mb-md">⚙️ Customize Project Parameters</h3>
            <form onSubmit={handleGenerateAiProjects} className="flex flex-col gap-md">
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select className="form-select" value={experience} onChange={(e) => setExperience(e.target.value)}>
                  <option value="Beginner">Complete Beginner</option>
                  <option value="Intermediate developer">Intermediate developer</option>
                  <option value="Experienced developer">Experienced developer</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Interests (e.g. Finance, Healthcare)</label>
                <input
                  type="text"
                  className="form-input"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. Healthcare, E-commerce, Sports"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Current Skills</label>
                <input
                  type="text"
                  className="form-input"
                  value={userSkills}
                  onChange={(e) => setUserSkills(e.target.value)}
                  placeholder="e.g. Python, SQL, Pandas"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Generating...' : '✨ Generate Custom Projects'}
              </button>
            </form>
          </GlassCard>

          <GlassCard className="no-hover" style={{ flex: 1 }}>
            <h3 className="mb-md">🚀 Custom AI Project Blueprint</h3>
            {loading ? (
              <LoadingSpinner text="Building tailor-made portfolio project specs..." />
            ) : aiError ? (
              <ErrorBanner error={aiError} />
            ) : aiProjects ? (
              <div className="ai-result">{aiProjects}</div>
            ) : (
              <div className="text-center text-muted" style={{ padding: '60px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💡</div>
                <p>Configure parameters on the left to generate customized project specifications.</p>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </PageWrapper>
  );
}
