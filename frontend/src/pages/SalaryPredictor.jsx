import React, { useState } from 'react';
import { PageWrapper, GlassCard, LoadingSpinner, ErrorBanner } from '../components/common/UIComponents';
import { api } from '../services/api';
import { TARGET_ROLES } from '../data/constants';

// Map display role names → model's snake_case keys
const ROLE_TO_MODEL_KEY = {
  'Data Scientist':              'data_scientist',
  'Data Analyst':                'data_analyst',
  'Data Engineer':               'data_engineer',
  'ML Engineer':                 'ml_engineer',
  'AI Engineer':                 'ai_engineer',
  'Software Engineer':           'software_engineer',
  'Business Analyst':            'business_analyst',
  'DevOps/MLOps Engineer':       'devops_mlops_engineer',
  'Cloud Engineer':              'cloud_engineer',
  'Frontend Developer':          'frontend_developer',
  'Full Stack Developer':        'full_stack_developer',
  'Data Science Intern':         'data_science_intern',
  'Software Engineering Intern': 'software_engineering_intern',
  'Business Analyst Intern':     'business_analyst_intern',
};

const INDIA_CITIES = [
  'Bengaluru / Bangalore',
  'Hyderabad',
  'Pune',
  'Gurgaon / Delhi NCR',
  'Mumbai',
  'Noida',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Other Indian City',
];

const GLOBAL_CITIES = [
  'San Francisco, CA',
  'New York, NY',
  'Seattle, WA',
  'Austin, TX',
  'Boston, MA',
  'Chicago, IL',
  'Los Angeles, CA',
  'London, UK',
  'Remote / Other',
];

const COMMON_SKILLS = [
  'python', 'sql', 'aws', 'java', 'javascript', 'tableau',
  'excel', 'mongodb', 'mysql', 'gcp', 'agile', 'jira',
  'project management', 'machine learning', 'docker', 'git',
  'react', 'spark', 'tensorflow', 'pytorch',
];

export function SalaryPredictor() {
  const [marketRegion, setMarketRegion] = useState('India');
  const [role, setRole] = useState('Data Scientist');
  const [experience, setExperience] = useState(2);
  const [city, setCity] = useState('Bengaluru / Bangalore');
  const [selectedSkills, setSelectedSkills] = useState(['python', 'sql', 'aws']);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleMarketChange = (newMarket) => {
    setMarketRegion(newMarket);
    if (newMarket === 'India') {
      setCity('Bengaluru / Bangalore');
    } else {
      setCity('San Francisco, CA');
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const modelRole = ROLE_TO_MODEL_KEY[role] || 'other';
      const res = await api.predictSalary({
        role: modelRole,
        experience: parseFloat(experience),
        skills: selectedSkills,
        city: city,
        market: marketRegion,
      });
      if (res.error) {
        setError(res.error);
      } else {
        setResult(res);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
      setError(err.message || 'Prediction failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const cityOptions = marketRegion === 'India' ? INDIA_CITIES : GLOBAL_CITIES;

  return (
    <PageWrapper
      title="💰 ML Salary Predictor"
      subtitle="Estimate your market compensation for Indian and Global job markets based on verified salary intelligence."
    >
      {/* ── Market Toggle ── */}
      <div className="tabs mb-lg flex justify-center" style={{ maxWidth: '480px', margin: '0 auto 24px' }}>
        <button
          className={`tab-btn ${marketRegion === 'India' ? 'active' : ''}`}
          onClick={() => handleMarketChange('India')}
          style={{ flex: 1, textAlign: 'center', fontSize: '0.95rem' }}
        >
          🇮🇳 Indian Job Market (INR / LPA)
        </button>
        <button
          className={`tab-btn ${marketRegion === 'Global' ? 'active' : ''}`}
          onClick={() => handleMarketChange('Global')}
          style={{ flex: 1, textAlign: 'center', fontSize: '0.95rem' }}
        >
          🌐 Global / US Market (USD)
        </button>
      </div>

      <div className="form-row">
        {/* ── Left: Form ── */}
        <GlassCard className="no-hover" style={{ flex: 1 }}>
          <h3 className="mb-md">⚙️ Configure Your Profile</h3>
          <form onSubmit={handlePredict} className="flex flex-col gap-md">

            <div className="form-group">
              <label className="form-label">Target Role</label>
              <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                {TARGET_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Years of Experience ({experience} yrs)</label>
              <input
                type="range" min="0" max="15" step="0.5"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
              <div className="flex justify-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>0 yrs (Fresher)</span><span>15 yrs (Senior)</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location / City ({marketRegion})</label>
              <select
                className="form-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {cityOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Skills You Possess ({selectedSkills.length} selected)</label>
              <div className="suggested-chips">
                {COMMON_SKILLS.map((sk) => {
                  const active = selectedSkills.includes(sk);
                  return (
                    <button
                      type="button"
                      key={sk}
                      className={`chip ${active ? 'badge-accent' : ''}`}
                      onClick={() => toggleSkill(sk)}
                      style={{ border: active ? '1px solid var(--accent)' : '1px solid var(--border-default)' }}
                    >
                      {active ? '✓ ' : '+ '}{sk}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg mt-md" disabled={loading}>
              {loading ? 'Running ML Predictor...' : `💰 Calculate ${marketRegion === 'India' ? 'Indian LPA' : 'Global Salary'}`}
            </button>
          </form>
        </GlassCard>

        {/* ── Right: Result ── */}
        <GlassCard className="no-hover" style={{ flex: 1 }}>
          <h3 className="mb-md">📊 Predicted Compensation</h3>

          {loading ? (
            <LoadingSpinner text="Analyzing market benchmarks and gradient boosted decision trees..." />
          ) : error ? (
            <div style={{ padding: '20px 0' }}>
              <ErrorBanner error={error} />
              <p className="text-muted mt-md" style={{ fontSize: '0.85rem' }}>
                Ensure the backend is running on port 8000.
              </p>
            </div>
          ) : result ? (
            <div className="animate-fade-in text-center flex flex-col items-center" style={{ padding: '20px 0', gap: '14px' }}>
              <span className="badge badge-accent">
                {marketRegion === 'India' ? '🇮🇳 Indian Market Prediction' : '🌐 Global Market Prediction'} · {role} · {experience} yrs · {city}
              </span>

              {marketRegion === 'India' || result.market === 'India' ? (
                <>
                  {/* Primary LPA display for India */}
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Annual CTC (Indian Market)</p>
                    <h1 style={{ fontSize: '3rem', color: 'var(--accent)', margin: 0, fontWeight: 800 }}>
                      ₹{result.predicted_lpa} <span style={{ fontSize: '1.4rem' }}>LPA</span>
                    </h1>
                  </div>

                  {/* Monthly take home */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', width: '100%' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Estimated Monthly Net Take-Home</p>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: 0 }}>
                      ₹{result.monthly_inr ? result.monthly_inr.toLocaleString() : ((result.predicted_lpa * 100000) / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/mo</span>
                    </h2>
                  </div>

                  {/* Equivalent USD */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', width: '100%' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                      Global Equivalent: <strong>${result.predicted_salary ? result.predicted_salary.toLocaleString() : 0}/yr</strong> (at ₹83/$)
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Primary USD display for Global */}
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Annual Compensation (USD)</p>
                    <h1 style={{ fontSize: '3rem', color: 'var(--accent)', margin: 0, fontWeight: 800 }}>
                      ${result.predicted_salary ? result.predicted_salary.toLocaleString() : 0}<span style={{ fontSize: '1.2rem' }}>/yr</span>
                    </h1>
                  </div>

                  {/* Monthly USD */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', width: '100%' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Monthly Compensation</p>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: 0 }}>
                      ${result.monthly_usd ? result.monthly_usd.toLocaleString() : 0}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/mo</span>
                    </h2>
                  </div>

                  {/* Equivalent LPA */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', width: '100%' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                      Converted INR Equivalent: <strong>₹{result.predicted_lpa} LPA</strong> (at ₹83/$)
                    </p>
                  </div>
                </>
              )}

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted)', width: '100%' }}>
                <p>💡 {result.confidence_note || 'Data-driven salary benchmark'}</p>
                <p style={{ marginTop: '4px' }}>
                  Factors used: {experience} yrs exp · {selectedSkills.length} skills selected · {city} market tier
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted" style={{ padding: '60px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔮</div>
              <p>Select your market (Indian or Global), role, city & skills, then click <strong>Calculate Salary</strong>.</p>
              <p style={{ marginTop: '12px', fontSize: '0.82rem' }}>
                Supports Indian Cities (Bengaluru, Hyderabad, Pune, Mumbai, Delhi NCR) & Global Tech Hubs.
              </p>
            </div>
          )}
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
