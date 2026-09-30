import React, { useState } from 'react';
import { PageWrapper, GlassCard, LoadingSpinner, Tabs, ErrorBanner } from '../components/common/UIComponents';
import { api } from '../services/api';
import { TARGET_ROLES } from '../data/constants';

export function SalaryNegotiation() {
  const [activeTab, setActiveTab] = useState('script');
  const [role, setRole] = useState('Data Scientist');
  const [currentSal, setCurrentSal] = useState(60000);
  const [targetSal, setTargetSal] = useState(85000);
  const [company, setCompany] = useState('');
  const [experience, setExperience] = useState(2);
  const [strengths, setStrengths] = useState('');
  const [negType, setNegType] = useState('Job Offer Negotiation');
  const [emailName, setEmailName] = useState('');
  const [emailType, setEmailType] = useState('Counter Offer Email');

  const [scriptResult, setScriptResult] = useState(null);
  const [emailResult, setEmailResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scriptError, setScriptError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const handleGenerateScript = async (e) => {
    e.preventDefault();
    setLoading(true);
    setScriptError(null);
    setScriptResult(null);
    try {
      const res = await api.generateNegotiationScript({
        role, current_salary: parseFloat(currentSal), target_salary: parseFloat(targetSal),
        company, experience: parseInt(experience), strengths, negotiation_type: negType,
      });
      if (res.error) setScriptError(res.error);
      else setScriptResult(res.result);
    } catch (err) {
      setScriptError(err.message || 'Failed to generate script.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError(null);
    setEmailResult(null);
    try {
      const res = await api.generateNegotiationEmail({
        role, current_salary: parseFloat(currentSal), target_salary: parseFloat(targetSal),
        company, name: emailName, email_type: emailType,
      });
      if (res.error) setEmailError(res.error);
      else setEmailResult(res.result);
    } catch (err) {
      setEmailError(err.message || 'Failed to generate email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="💼 Salary Negotiation Coach"
      subtitle="AI-powered negotiation scripts and email templates backed by real market data."
    >
      <Tabs
        tabs={[
          { id: 'script', label: '🤝 Negotiation Script' },
          { id: 'email', label: '📧 Counter-Offer Email' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'script' ? (
        <div className="form-row">
          <GlassCard className="no-hover" style={{ flex: 1 }}>
            <h3 className="mb-md">⚙️ Configure Negotiation Context</h3>
            <form onSubmit={handleGenerateScript} className="flex flex-col gap-md">
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  {TARGET_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Current / Offered ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={currentSal}
                    onChange={(e) => setCurrentSal(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Salary ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={targetSal}
                    onChange={(e) => setTargetSal(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Infosys"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Negotiation Type</label>
                  <select className="form-select" value={negType} onChange={(e) => setNegType(e.target.value)}>
                    <option value="Job Offer Negotiation">Job Offer Negotiation</option>
                    <option value="Annual Raise Request">Annual Raise Request</option>
                    <option value="Promotion Negotiation">Promotion Negotiation</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Key Strengths & Achievements</label>
                <textarea
                  className="form-textarea"
                  style={{ height: 90 }}
                  placeholder="e.g. Led ML deployment, reduced pipeline cost by 25%"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Generating Script...' : '🤝 Generate AI Script'}
              </button>
            </form>
          </GlassCard>

          <GlassCard className="no-hover" style={{ flex: 1 }}>
            <h3 className="mb-md">📜 Personalized AI Negotiation Script</h3>
            {loading ? (
              <LoadingSpinner text="Drafting custom negotiation playbook..." />
            ) : scriptError ? (
              <ErrorBanner error={scriptError} />
            ) : scriptResult ? (
              <div className="ai-result">{scriptResult}</div>
            ) : (
              <div className="text-center text-muted" style={{ padding: '60px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💬</div>
                <p>Fill in your compensation details on the left to generate your custom talk track.</p>
              </div>
            )}
          </GlassCard>
        </div>
      ) : (
        <div className="form-row">
          <GlassCard className="no-hover" style={{ flex: 1 }}>
            <h3 className="mb-md">✉️ Draft Counter-Offer Email</h3>
            <form onSubmit={handleGenerateEmail} className="flex flex-col gap-md">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={emailName}
                  onChange={(e) => setEmailName(e.target.value)}
                  placeholder="Your Full Name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Type</label>
                <select className="form-select" value={emailType} onChange={(e) => setEmailType(e.target.value)}>
                  <option value="Counter Offer Email">Counter Offer Email</option>
                  <option value="Raise Request Email">Raise Request Email</option>
                  <option value="Promotion Request Email">Promotion Request Email</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Offered Salary ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={currentSal}
                    onChange={(e) => setCurrentSal(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Salary ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={targetSal}
                    onChange={(e) => setTargetSal(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Drafting Email...' : '📧 Generate Email'}
              </button>
            </form>
          </GlassCard>

          <GlassCard className="no-hover" style={{ flex: 1 }}>
            <h3 className="mb-md">📬 Generated Negotiation Email</h3>
            {loading ? (
              <LoadingSpinner text="Writing professional email..." />
            ) : emailError ? (
              <ErrorBanner error={emailError} />
            ) : emailResult ? (
              <div className="ai-result">{emailResult}</div>
            ) : (
              <div className="text-center text-muted" style={{ padding: '60px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📧</div>
                <p>Fill out the form on the left to generate an email template.</p>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </PageWrapper>
  );
}
