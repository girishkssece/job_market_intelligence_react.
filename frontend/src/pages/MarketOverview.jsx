import React, { useEffect, useState } from 'react';
import { PageWrapper, GlassCard, LoadingSpinner, Tabs } from '../components/common/UIComponents';
import { api } from '../services/api';
import { TARGET_ROLES } from '../data/constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

export function MarketOverview() {
  const [activeTab, setActiveTab] = useState('salary');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedRegion, setSelectedRegion] = useState('Global');
  const [salaryByRole, setSalaryByRole] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [expData, setExpData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMarketData() {
      setLoading(true);
      try {
        const [salRes, skillRes, expRes, compRes] = await Promise.all([
          api.getSalaryByRole(selectedRegion),
          api.getSkills(selectedRole, selectedRegion, 15),
          api.getExperienceAnalysis(selectedRole),
          api.getCompanies(selectedRole, selectedRegion, 15),
        ]);
        setSalaryByRole(salRes);
        setSkillsData(skillRes);
        setExpData(expRes);
        setCompanies(compRes);
      } catch (err) {
        console.error('Error fetching market overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMarketData();
  }, [selectedRole, selectedRegion]);

  return (
    <PageWrapper
      title="Global Job Market Intelligence"
      subtitle="Analyze compensation benchmarks, skill demand, and hiring trends across tech roles."
    >
      <GlassCard className="mb-lg no-hover">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Target Role</label>
            <select
              className="form-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="All Roles">All Roles</option>
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Region</label>
            <select
              className="form-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="Global">Global Market</option>
              <option value="India">India Market</option>
            </select>
          </div>
        </div>
      </GlassCard>

      <Tabs
        tabs={[
          { id: 'salary', label: '💰 Salary Benchmarks' },
          { id: 'skills', label: '🔥 Skills Demand' },
          { id: 'experience', label: '📈 Experience Impact' },
          { id: 'companies', label: '🏢 Top Employers' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {activeTab === 'salary' && (
            <div className="stagger-children">
              <GlassCard noHover className="mb-lg">
                <h3 className="mb-md">Median Salary by Role Category ({selectedRegion})</h3>
                <div style={{ height: 420 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salaryByRole} layout="vertical" margin={{ left: 80, right: 30, top: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E3055" />
                      <XAxis type="number" stroke="#94A3B8" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <YAxis dataKey="role" type="category" stroke="#94A3B8" width={140} />
                      <Tooltip
                        formatter={(val) => [`$${val.toLocaleString()} (${(val/1200).toFixed(1)} LPA)`, 'Median Salary']}
                        contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      />
                      <Bar dataKey="median" fill="#065A82" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard noHover>
                <h3 className="mb-md">📋 Detailed Salary Breakdown</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Role Category</th>
                        <th>25th Percentile</th>
                        <th>Median Salary</th>
                        <th>75th Percentile</th>
                        <th>India Equivalent (LPA)</th>
                        <th>Job Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaryByRole.map((row) => (
                        <tr key={row.role}>
                          <td><strong>{row.role}</strong></td>
                          <td>${row.p25?.toLocaleString()}</td>
                          <td><span className="badge badge-accent">${row.median?.toLocaleString()}</span></td>
                          <td>${row.p75?.toLocaleString()}</td>
                          <td>₹{(row.median / 1200).toFixed(1)} LPA</td>
                          <td>{row.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === 'skills' && (
            <GlassCard noHover>
              <h3 className="mb-md">Most Demanded Skills for {selectedRole} ({selectedRegion})</h3>
              <div style={{ height: 450 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsData} margin={{ left: 20, right: 20, top: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E3055" />
                    <XAxis dataKey="skill" stroke="#94A3B8" angle={-45} textAnchor="end" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="#02C39A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          )}

          {activeTab === 'experience' && (
            <GlassCard noHover>
              <h3 className="mb-md">Salary Growth vs Years of Experience</h3>
              {expData.length === 0 ? (
                <p className="text-muted">Insufficient data for this role selection.</p>
              ) : (
                <div style={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={expData} margin={{ left: 20, right: 30, top: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E3055" />
                      <XAxis dataKey="experience" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(val) => [`$${val.toLocaleString()} (${(val/1200).toFixed(1)} LPA)`, 'Median Salary']}
                        contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      />
                      <Line type="monotone" dataKey="median" stroke="#02C39A" strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </GlassCard>
          )}

          {activeTab === 'companies' && (
            <GlassCard noHover>
              <h3 className="mb-md">Top Companies Hiring for {selectedRole}</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Company Name</th>
                      <th>Open Postings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((c, i) => (
                      <tr key={c.company}>
                        <td>#{i + 1}</td>
                        <td><strong>{c.company}</strong></td>
                        <td><span className="badge badge-primary">{c.openings} openings</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
        </>
      )}
    </PageWrapper>
  );
}
