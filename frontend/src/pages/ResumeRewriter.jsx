import React, { useState } from 'react';
import { PageWrapper, GlassCard, LoadingSpinner } from '../components/common/UIComponents';
import { api } from '../services/api';
import { TARGET_ROLES } from '../data/constants';

export function ResumeRewriter() {
  const [targetRole, setTargetRole] = useState('Data Scientist');
  const [expLevel, setExpLevel] = useState('Mid-level (3-6 years)');
  const [company, setCompany] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRewrite = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const res = await api.rewriteResume({
        resume_text: resumeText,
        target_role: targetRole,
        experience_level: expLevel,
        target_company: company,
        job_desc: jobDesc,
      });
      setResult(res.result || res.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="✍️ AI Resume Rewriter"
      subtitle="Transform your bullet points with high-impact action verbs, quantitative metrics, and ATS keywords."
    >
      <div className="form-row">
        <GlassCard className="no-hover" style={{ flex: 1 }}>
          <h3 className="mb-md">⚙️ Rewrite Options</h3>
          <form onSubmit={handleRewrite} className="flex flex-col gap-md">
            <div className="form-group">
              <label className="form-label">Target Role</label>
              <select className="form-select" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
                {TARGET_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select className="form-select" value={expLevel} onChange={(e) => setExpLevel(e.target.value)}>
                  <option value="Fresher (0-1 year)">Fresher (0-1 year)</option>
                  <option value="Junior (1-3 years)">Junior (1-3 years)</option>
                  <option value="Mid-level (3-6 years)">Mid-level (3-6 years)</option>
                  <option value="Senior (6+ years)">Senior (6+ years)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Target Company</label>
                <input
                  type="text"
                  className="form-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Amazon"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Existing Resume Content</label>
              <textarea
                className="form-textarea"
                style={{ height: 160 }}
                placeholder="Paste your current resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Description (Optional)</label>
              <textarea
                className="form-textarea"
                style={{ height: 90 }}
                placeholder="Paste job description to tailor keywords..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading || !resumeText.trim()}>
              {loading ? 'Rewriting...' : '✍️ Rewrite & Optimize Resume'}
            </button>
          </form>
        </GlassCard>

        <GlassCard className="no-hover" style={{ flex: 1 }}>
          <h3 className="mb-md">✨ Rewritten Resume & ATS Enhancements</h3>
          {loading ? (
            <LoadingSpinner text="Optimizing action verbs, metrics, and ATS keywords..." />
          ) : result ? (
            <div className="ai-result">{result}</div>
          ) : (
            <div className="text-center text-muted" style={{ padding: '60px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✍️</div>
              <p>Paste your resume on the left to generate an optimized version.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
