import React, { useState } from 'react';
import { PageWrapper, GlassCard, LoadingSpinner } from '../components/common/UIComponents';
import { api } from '../services/api';
import { TARGET_ROLES } from '../data/constants';

const COMMON_SKILLS = [
  'python', 'sql', 'machine learning', 'deep learning', 'aws', 'spark',
  'pandas', 'scikit-learn', 'docker', 'tableau', 'power bi', 'react',
  'javascript', 'git', 'fastapi', 'xgboost', 'tensorflow', 'pytorch'
];

export function SalaryPredictor() {
  const [role, setRole] = useState('Data Scientist');
  const [experience, setExperience] = useState(2);
  const [city, setCity] = useState('bangalore');
  const [selectedSkills, setSelectedSkills] = useState(['python', 'sql', 'machine learning']);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.predictSalary({
        role,
        experience: parseFloat(experience),
        skills: selectedSkills,
        city,
      });
      setResult(res);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="ML Salary Predictor"
      subtitle="Estimate your market value using an XGBoost / LightGBM regression model trained on verified global job data."
    >
      <div className="form-row">
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
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary City / Location</label>
              <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="bangalore">Bangalore / Bengaluru</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="pune">Pune</option>
                <option value="mumbai">Mumbai</option>
                <option value="chennai">Chennai</option>
                <option value="delhi">Delhi NCR</option>
                <option value="san francisco">San Francisco / US</option>
                <option value="london">London / UK</option>
                <option value="other">Other / Remote</option>
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
              {loading ? 'Running ML Model...' : '💰 Calculate Market Value'}
            </button>
          </form>
        </GlassCard>

        <GlassCard className="no-hover" style={{ flex: 1 }}>
          <h3 className="mb-md">📊 Predicted Compensation</h3>

          {loading ? (
            <LoadingSpinner text="Running gradient boosted decision trees..." />
          ) : result ? (
            <div className="animate-fade-in text-center flex flex-col items-center justify-between" style={{ height: '100%', padding: '24px 0' }}>
              <div>
                <span className="badge badge-accent mb-sm">ML Model Prediction</span>
                <h1 style={{ fontSize: '3rem', color: 'var(--accent)', margin: '16px 0 4px' }}>
                  ${result.predicted_salary?.toLocaleString()}/yr
                </h1>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>
                  ₹{result.predicted_lpa} LPA
                </h2>
                <p className="text-muted mt-md">
                  Monthly in INR: <strong>₹{((result.predicted_lpa * 100000) / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</strong>
                </p>
              </div>

              <div className="w-full mt-lg text-muted" style={{ fontSize: '0.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <p>💡 Model uses 31 features including experience squared polynomial terms & skill binary indicators.</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted" style={{ padding: '60px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔮</div>
              <p>Configure your role and skills on the left and click <strong>Calculate Market Value</strong>.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
