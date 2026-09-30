import React, { useEffect, useState } from 'react';
import { PageWrapper, GlassCard, LoadingSpinner, ErrorBanner, MetricCard, Tabs } from '../components/common/UIComponents';
import { api } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

const COLORS = ['#065A82', '#02C39A', '#0A7EB5', '#04E4B4', '#1E3055', '#38BDF8'];

export function CompanyIntelligence() {
  const [topCompanies, setTopCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [companyDetail, setCompanyDetail] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('top');

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getCompanies(null, null, 25);
      setTopCompanies(res);
      if (res.length > 0) setSelectedCompany(res[0].company);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCompanies(); }, []);

  useEffect(() => {
    async function loadDetail() {
      if (!selectedCompany) return;
      try {
        const res = await api.getCompanyDetail(selectedCompany);
        setCompanyDetail(res);
        setAiInsights(null);
      } catch (err) {
        console.error(err);
      }
    }
    loadDetail();
  }, [selectedCompany]);

  const handleGetAiInsights = async () => {
    if (!selectedCompany) return;
    setAiLoading(true);
    try {
      const res = await api.getCompanyInsights(selectedCompany);
      setAiInsights(res.result || res.error);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching company hiring data..." />;
  if (error) return (
    <div style={{ padding: '40px' }}>
      <ErrorBanner error={error} onRetry={loadCompanies} />
    </div>
  );

  const roleChartData = companyDetail?.roles
    ? Object.entries(companyDetail.roles).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <PageWrapper
      title="🏢 Company Intelligence"
      subtitle="Research hiring trends, salary distribution, and skills demanded by top employers."
    >
      <Tabs
        tabs={[
          { id: 'top', label: '🏆 Top Hiring Companies' },
          { id: 'deepdive', label: '🔍 Company Deep Dive' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'top' && (
        <GlassCard noHover>
          <h3 className="mb-md">Top 25 Companies by Job Postings</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Company Name</th>
                  <th>Job Postings</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {topCompanies.map((c, i) => (
                  <tr key={c.company}>
                    <td>#{i + 1}</td>
                    <td><strong>{c.company}</strong></td>
                    <td><span className="badge badge-primary">{c.openings} postings</span></td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedCompany(c.company);
                          setActiveTab('deepdive');
                        }}
                      >
                        Deep Dive →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {activeTab === 'deepdive' && (
        <div>
          <GlassCard className="no-hover mb-lg">
            <div className="form-group">
              <label className="form-label">Select Company</label>
              <select
                className="form-select"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                {topCompanies.map((c) => (
                  <option key={c.company} value={c.company}>{c.company}</option>
                ))}
              </select>
            </div>
          </GlassCard>

          {companyDetail && (
            <div className="flex flex-col gap-lg">
              <div className="metrics-grid">
                <MetricCard icon="🏢" value={companyDetail.name} label="Selected Employer" />
                <MetricCard icon="📊" value={companyDetail.total_jobs} label="Total Job Postings" />
                <MetricCard icon="🎯" value={Object.keys(companyDetail.roles || {}).length} label="Active Roles Hiring" />
                <MetricCard
                  icon="💰"
                  value={companyDetail.salary?.median ? `$${companyDetail.salary.median.toLocaleString()}` : 'N/A'}
                  label="Median Salary"
                />
              </div>

              <div className="charts-grid">
                <GlassCard noHover>
                  <h3 className="mb-md">Roles Being Hired</h3>
                  <div style={{ height: 320 }}>
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie data={roleChartData} cx="40%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value">
                           {roleChartData.map((e, idx) => (
                             <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                           ))}
                         </Pie>
                         <Tooltip
                           formatter={(val, name) => [`${val} postings`, name]}
                           contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)' }}
                         />
                         <Legend
                           layout="vertical"
                           align="right"
                           verticalAlign="middle"
                           iconType="circle"
                           iconSize={9}
                           formatter={(value) => <span style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>{value}</span>}
                         />
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                </GlassCard>

                <GlassCard noHover>
                  <h3 className="mb-md">Skills Demanded by {companyDetail.name}</h3>
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={companyDetail.skills || []} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
                        <XAxis type="number" stroke="#94A3B8" />
                        <YAxis dataKey="skill" type="category" stroke="#94A3B8" width={120} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)' }} />
                        <Bar dataKey="count" fill="#02C39A" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </div>

              <GlassCard noHover>
                <div className="flex justify-between items-center mb-md">
                  <h3>🤖 AI Employer Culture & Interview Insights</h3>
                  <button className="btn btn-primary btn-sm" onClick={handleGetAiInsights} disabled={aiLoading}>
                    {aiLoading ? 'Generating...' : '✨ Generate AI Insights'}
                  </button>
                </div>
                {aiLoading ? (
                  <LoadingSpinner text="Analyzing hiring pattern data..." />
                ) : aiInsights ? (
                  <div className="ai-result">{aiInsights}</div>
                ) : (
                  <p className="text-muted">Click <strong>Generate AI Insights</strong> to get AI analysis on company culture, interview tips, and how to stand out.</p>
                )}
              </GlassCard>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}
