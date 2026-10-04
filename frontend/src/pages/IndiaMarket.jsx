import React, { useEffect, useState } from 'react';
import { PageWrapper, MetricCard, GlassCard, LoadingSpinner, ErrorBanner, Tabs } from '../components/common/UIComponents';
import { JobSearchLinks } from '../components/common/JobSearchLinks';
import { api } from '../services/api';
import { TARGET_ROLES } from '../data/constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function IndiaMarket() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('cities');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchRole, setSearchRole] = useState('Data Scientist');
  const [searchCity, setSearchCity] = useState('Bangalore');

  const loadIndia = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getIndiaMarket();
      setData(res);
    } catch (err) {
      console.error('Error fetching India market data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadIndia(); }, []);

  if (loading) return <LoadingSpinner text="Fetching India tech market data from Naukri..." />;
  if (error) return (
    <div style={{ padding: '40px' }}>
      <ErrorBanner error={error} onRetry={loadIndia} />
    </div>
  );

  const naukriSlug = searchRole.toLowerCase().replace(/ /g, '-').replace(/\//g, '-');
  const naukriLink = `https://www.naukri.com/${naukriSlug}-jobs-in-${searchCity.toLowerCase()}`;
  const linkedinLink = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchRole)}&location=${encodeURIComponent(searchCity + ', India')}`;


  return (
    <PageWrapper
      title="🇮🇳 India Tech Job Market Intelligence"
      subtitle="Dedicated benchmarks and hiring insights sourced from live Naukri.com data across Indian IT hubs."
    >
      <div className="metrics-grid">
        <MetricCard icon="🇮🇳" value={data?.total_jobs?.toLocaleString()} label="India Job Records" delta="Naukri Dataset" />
        <MetricCard icon="💵" value={data?.total_with_salary?.toLocaleString()} label="With Salary Data" delta="Verified INR" />
        <MetricCard icon="💰" value={`$${data?.median_salary_usd?.toLocaleString()}`} label="Median Salary (USD)" delta="Global Equiv" />
        <MetricCard icon="✨" value={`₹${data?.median_lpa} LPA`} label="Median Salary (INR)" delta="Annual Package" />
      </div>

      <Tabs
        tabs={[
          { id: 'cities', label: '🏙️ City Analysis' },
          { id: 'salary', label: '💰 Salary Benchmarks (LPA)' },
          { id: 'skills', label: '🔥 Skills in Demand' },
          { id: 'companies', label: '🏢 Top Companies' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'cities' && (
        <div className="charts-grid">
          <GlassCard noHover>
            <h3 className="mb-md">Top Cities by Job Openings</h3>
            <div style={{ height: 380 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.city_counts || []} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
                  <XAxis type="number" stroke="#94A3B8" />
                  <YAxis dataKey="city" type="category" stroke="#94A3B8" width={130} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <Bar dataKey="count" fill="#065A82" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard noHover>
            <h3 className="mb-md">Median Salary by City (INR LPA)</h3>
            <div style={{ height: 380 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.city_salary || []} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
                  <XAxis type="number" stroke="#94A3B8" tickFormatter={(v) => `₹${v}L`} />
                  <YAxis dataKey="city" type="category" stroke="#94A3B8" width={130} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(val) => [`₹${val} LPA`, 'Median Salary']}
                    contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="lpa" fill="#02C39A" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === 'salary' && (
        <GlassCard noHover>
          <h3 className="mb-md">Role Compensation in India (LPA)</h3>
          <div style={{ height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.role_salary || []} layout="vertical" margin={{ left: 80, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3055" />
                <XAxis type="number" stroke="#94A3B8" tickFormatter={(v) => `₹${v}L`} />
                <YAxis dataKey="role" type="category" stroke="#94A3B8" width={140} />
                <Tooltip
                  formatter={(val) => [`₹${val} LPA ($${(val * 1200).toLocaleString()})`, 'Median Salary']}
                  contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Bar dataKey="lpa" fill="#02C39A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {activeTab === 'skills' && (
        <GlassCard noHover>
          <h3 className="mb-md">Top Skills Demanded in Indian Tech Roles</h3>
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.top_skills || []} margin={{ left: 10, right: 10, bottom: 50 }}>
                <XAxis dataKey="skill" stroke="#94A3B8" angle={-45} textAnchor="end" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Bar dataKey="count" fill="#065A82" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {activeTab === 'companies' && (
        <GlassCard noHover>
          <h3 className="mb-md">Top Hiring Companies in India</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Company</th>
                  <th>Openings in India</th>
                </tr>
              </thead>
              <tbody>
                {(data?.top_companies || []).map((c, i) => (
                  <tr key={c.company}>
                    <td>#{i + 1}</td>
                    <td><strong>{c.company}</strong></td>
                    <td><span className="badge badge-accent">{c.openings} openings</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      <div className="section-divider" />

      <GlassCard className="no-hover">
        <h3 className="mb-md">🔍 Find Jobs in India</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select" value={searchRole} onChange={(e) => setSearchRole(e.target.value)}>
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <select className="form-select" value={searchCity} onChange={(e) => setSearchCity(e.target.value)}>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
              <option value="Delhi">Delhi NCR</option>
            </select>
          </div>
        </div>

        <div className="flex gap-md mt-md">
          <a href={naukriLink} target="_blank" rel="noreferrer" className="btn btn-primary">
            🔴 Search on Naukri.com
          </a>
          <a href={linkedinLink} target="_blank" rel="noreferrer" className="btn btn-secondary">
            🔵 Search on LinkedIn
          </a>
        </div>
      </GlassCard>

      <JobSearchLinks defaultRole="Data Scientist" />
    </PageWrapper>
  );
}
