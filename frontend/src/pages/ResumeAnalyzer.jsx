import React, { useState } from 'react';
import { PageWrapper, GlassCard, LoadingSpinner } from '../components/common/UIComponents';
import { api } from '../services/api';
import { TARGET_ROLES } from '../data/constants';

export function ResumeAnalyzer() {
  const [targetRole, setTargetRole] = useState('Data Scientist');
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setError('Please paste your resume text.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.analyzeResume({
        resume_text: resumeText,
        target_role: targetRole,
      });
      if (res.error) setError(res.error);
      else setResult(res.result);
    } catch (err) {
      setError('Failed to analyze resume. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="AI Resume Analyzer"
      subtitle="Benchmark your resume against live market requirements and get actionable feedback from LLM Llama 3.3 70B."
    >
      <div className="form-row">
        <GlassCard className="no-hover" style={{ flex: 1 }}>
          <h3 className="mb-md">📄 Submit Resume for Review</h3>
          <form onSubmit={handleAnalyze} className="flex flex-col gap-md">
            <div className="form-group">
              <label className="form-label">Target Role</label>
              <select className="form-select" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
                {TARGET_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Paste Resume Content</label>
              <textarea
                className="form-textarea"
                style={{ height: 260 }}
                placeholder="Paste your full resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            {error && <div className="badge badge-danger" style={{ padding: '8px 12px' }}>⚠️ {error}</div>}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Analyzing with AI...' : '🔍 Analyze Resume Match'}
            </button>
          </form>
        </GlassCard>

        <GlassCard className="no-hover" style={{ flex: 1 }}>
          <h3 className="mb-md">🤖 AI Feedback & Market Match</h3>
          {loading ? (
            <LoadingSpinner text="Evaluating skills against 115,000+ job postings..." />
          ) : result ? (
            <div className="ai-result">
              {result}
            </div>
          ) : (
            <div className="text-center text-muted" style={{ padding: '60px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
              <p>Paste your resume on the left and select your target role to receive instant AI evaluation.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
