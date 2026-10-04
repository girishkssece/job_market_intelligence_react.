import React, { useEffect, useState } from 'react';
import { PageWrapper, MetricCard, GlassCard, LoadingSpinner, ErrorBanner } from '../components/common/UIComponents';
import { JobSearchLinks } from '../components/common/JobSearchLinks';
import { api } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#065A82', '#02C39A', '#0A7EB5', '#04E4B4', '#1E3055', '#38BDF8', '#818CF8', '#A7F3D0'];

export function Dashboard() {
  const [data, setData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, skillsRes] = await Promise.all([
        api.getOverview(),
        api.getSkills(null, null, 10),
      ]);
      setData(overviewRes);
      setSkills(skillsRes);
    } catch (err) {
      console.error('Error loading overview:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <LoadingSpinner text="Analyzing 115,000+ job postings..." />;
  if (error) return (
    <div style={{ padding: '40px' }}>
      <ErrorBanner error={error} onRetry={loadData} />
    </div>
  );

  const roleData = data?.role_distribution
    ? Object.entries(data.role_distribution).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <PageWrapper
      title="Job Market Intelligence Platform"
      subtitle="Real-time insights from 115,000+ tech job postings across India and globally."
    >
      <div className="hero-section">
        <h1>
          Master Your Tech Career with <span className="text-gradient">Data & AI</span>
        </h1>
        <p>
          Predict salaries, analyze your resume, get AI interview prep, explore career paths, and benchmark compensation using live market data.
        </p>
        <div className="flex gap-md justify-between items-center" style={{ justifyContent: 'center', marginTop: '24px' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/salary-predictor')}>
            💰 Predict Salary
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/resume-analyzer')}>
            🔍 Analyze Resume
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          icon="📊"
          value={data?.total_jobs?.toLocaleString() || '115,000+'}
          label="Total Job Records"
          delta="Naukri + LinkedIn Data"
        />
        <MetricCard
          icon="💵"
          value={data?.total_with_salary ? data.total_with_salary.toLocaleString() : 'N/A'}
          label="Salary Data Records"
          delta="Verified compensation"
        />
        <MetricCard
          icon="💰"
          value={data?.median_salary_usd ? `$${data.median_salary_usd.toLocaleString()}` : '$85,000'}
          label="Median Global Salary"
          delta={`₹${((data?.median_salary_usd || 85000) / 1200).toFixed(1)} LPA equivalent`}
        />
        <MetricCard
          icon="🇮🇳"
          value={data?.india_jobs ? data.india_jobs.toLocaleString() : 'N/A'}
          label="India Tech Jobs"
          delta="Naukri live postings"
        />
      </div>

      <div className="charts-grid">
        <GlassCard noHover>
          <h3 className="mb-md">🔥 Job Openings by Role Category</h3>
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="40%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val.toLocaleString()} jobs`, name]}
                  contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  iconSize={10}
                  formatter={(value) => <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard noHover>
          <h3 className="mb-md">⚡ Top 10 In-Demand Tech Skills</h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skills} layout="vertical" margin={{ left: 0, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" stroke="#94A3B8" />
                <YAxis dataKey="skill" type="category" stroke="#94A3B8" width={110} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#02C39A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="section-divider" />

      <GlassCard noHover>
        <JobSearchLinks compact={true} defaultRole="Data Scientist" />
      </GlassCard>

      <h2 className="mb-lg">🚀 AI Career Intelligence Suite</h2>
      <div className="form-row stagger-children">
        <GlassCard style={{ cursor: 'pointer' }} onClick={() => navigate('/resume-analyzer')}>
          <h3>🔍 Resume Analyzer</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '8px' }}>
            Get AI feedback, ATS match score, and missing skill analysis for target roles.
          </p>
        </GlassCard>

        <GlassCard style={{ cursor: 'pointer' }} onClick={() => navigate('/salary-negotiation')}>
          <h3>🤝 Negotiation Coach</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '8px' }}>
            AI-generated scripts, strategies, and counter-offer email templates backed by data.
          </p>
        </GlassCard>

        <GlassCard style={{ cursor: 'pointer' }} onClick={() => navigate('/interview-prep')}>
          <h3>🎯 Interview Prep</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '8px' }}>
            Role-specific question bank, mock interviews, and AI answer review.
          </p>
        </GlassCard>

        <GlassCard style={{ cursor: 'pointer' }} onClick={() => navigate('/market-chatbot')}>
          <h3>🤖 Market Chatbot</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '8px' }}>
            Chat with CareerLens AI trained on 115,000+ job records and live market trends.
          </p>
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
