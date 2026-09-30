import React, { useState } from 'react';
import { PageWrapper, GlassCard, LoadingSpinner, ErrorBanner } from '../components/common/UIComponents';
import { api } from '../services/api';
import { TARGET_ROLES } from '../data/constants';

export function ResumeRewriter() {
  const [targetRole, setTargetRole] = useState('Data Scientist');
  const [expLevel, setExpLevel] = useState('Mid-level (3-6 years)');
  const [company, setCompany] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const res = await api.parseResumeFile(file);
      if (res.error) {
        setError(res.error);
      } else {
        setResumeText(res.text);
        setFileInfo({
          name: res.filename,
          words: res.word_count,
        });
      }
    } catch (err) {
      setError('Failed to extract text from file. Please paste text manually.');
    } finally {
      setUploading(false);
    }
  };

  const handleRewrite = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setError('Please upload or paste your resume text first.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.rewriteResume({
        resume_text: resumeText,
        target_role: targetRole,
        experience_level: expLevel,
        target_company: company,
        job_desc: jobDesc,
      });
      if (res.error) setError(res.error);
      else setResult(res.result);
    } catch (err) {
      setError(err.message || 'Failed to rewrite resume. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageWrapper
      title="✍️ AI Resume Rewriter & Enhancer"
      subtitle="Upload or paste your resume to transform weak bullet points into quantifiable, high-impact ATS optimized content."
    >
      <div className="form-row">
        {/* ── Left Column: Config & Source ── */}
        <GlassCard className="no-hover" style={{ flex: 1 }}>
          <h3 className="mb-md">⚙️ Options & Source Resume</h3>
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
                <label className="form-label">Target Company (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Amazon, Swiggy"
                />
              </div>
            </div>

            {/* File Upload Box */}
            <div className="form-group">
              <label className="form-label">Upload Existing Resume (.pdf, .docx, .txt)</label>
              <div style={{
                border: '2px dashed var(--border-default)',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center',
                background: 'var(--bg-deep)',
                cursor: 'pointer',
              }}>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="rewriter-file-input"
                />
                <label htmlFor="rewriter-file-input" style={{ cursor: 'pointer', display: 'block' }}>
                  {uploading ? (
                    <span className="text-muted">⏳ Parsing file...</span>
                  ) : (
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                        📂 Upload PDF/Word File to Extract Resume
                      </span>
                    </div>
                  )}
                </label>
              </div>
              {fileInfo && (
                <div className="badge badge-accent" style={{ marginTop: '6px', alignSelf: 'flex-start' }}>
                  ✓ Loaded: {fileInfo.name} ({fileInfo.words} words)
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Editable Resume Content</label>
              <textarea
                className="form-textarea"
                style={{ height: 160, fontFamily: 'monospace', fontSize: '0.85rem' }}
                placeholder="Paste or upload your current resume bullet points..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Job Description (Optional)</label>
              <textarea
                className="form-textarea"
                style={{ height: 80 }}
                placeholder="Paste specific job description to tailor ATS keywords..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>

            {error && <ErrorBanner error={error} />}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading || uploading || !resumeText.trim()}>
              {loading ? 'Optimizing & Rewriting...' : '✍️ Rewrite & Optimize Resume'}
            </button>
          </form>
        </GlassCard>

        {/* ── Right Column: Result & Copy ── */}
        <GlassCard className="no-hover" style={{ flex: 1 }}>
          <div className="flex justify-between items-center mb-md">
            <h3 style={{ margin: 0 }}>✨ Rewritten Resume Output</h3>
            {result && (
              <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                {copied ? '✓ Copied!' : '📋 Copy Text'}
              </button>
            )}
          </div>

          {loading ? (
            <LoadingSpinner text="Optimizing action verbs, metrics, and ATS keywords..." />
          ) : error ? (
            <ErrorBanner error={error} />
          ) : result ? (
            <div className="ai-result" style={{ marginTop: 0 }}>
              {result}
            </div>
          ) : (
            <div className="text-center text-muted" style={{ padding: '60px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✍️</div>
              <p>Upload or paste your resume on the left, then click <strong>Rewrite & Optimize</strong>.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
