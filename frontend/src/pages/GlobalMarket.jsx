import React, { useEffect, useState } from 'react';
import { PageWrapper, MetricCard, GlassCard, LoadingSpinner, ErrorBanner, Tabs } from '../components/common/UIComponents';
import { PageSkeleton } from '../components/common/Skeletons';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#065A82', '#02C39A', '#0A7EB5', '#04E4B4', '#1E3055', '#38BDF8', '#818CF8', '#A7F3D0'];

export function GlobalMarket() {
  const [data, setData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [countryDetail, setCountryDetail] = useState(null);
  const [activeTab, setActiveTab] = useState('countries');
  const [excludeUS, setExcludeUS] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadGlobal = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getGlobalMarket();
      setData(res);
      if (res.country_counts && res.country_counts.length > 0) {
        setSelectedCountry(res.country_counts[0].country);
      }
    } catch (err) {
      console.error('Error loading global market data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGlobal(); }, []);

  useEffect(() => {
    async function loadCountryDetail() {
      if (!selectedCountry) return;
      setDetailLoading(true);
      try {
        const res = await api.getGlobalMarket(selectedCountry);
        setCountryDetail(res.selected_country_data);
      } catch (err) {
        console.error('Error loading country detail:', err);
      } finally {
        setDetailLoading(false);
      }
    }
    loadCountryDetail();
  }, [selectedCountry]);

  if (loading) return <PageSkeleton hasMetrics hasChart hasTable />;
  if (error) return (
    <div style={{ padding: '40px' }}>
      <ErrorBanner error={error} onRetry={loadGlobal} />
    </div>
  );

  const rawCountryList = data?.country_counts || [];
  const rawCountrySalaryList = data?.country_salary || [];
  const totalGlobalJobs = data?.country_counts?.reduce((acc, curr) => acc + curr.count, 0) || 1;

  // Filter list if Exclude US is toggled
  const countryList = excludeUS
    ? rawCountryList.filter((c) => c.country !== 'United States')
    : rawCountryList;

  const countrySalaryList = excludeUS
    ? rawCountrySalaryList.filter((c) => c.country !== 'United States')
    : rawCountrySalaryList;

  // Calculate percentages
  const countryListWithPct = countryList.map((c) => ({
    ...c,
    pct: ((c.count / totalGlobalJobs) * 100).toFixed(2),
  }));

  const rolesData = countryDetail?.roles
    ? Object.entries(countryDetail.roles).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <PageWrapper
      title="🌐 Global Market — Country Breakdown"
      subtitle="Analyze tech job opportunities, median compensation, skill demand, and hiring volume country-by-country across the world."
    >
      <div className="metrics-grid">
        <MetricCard icon="🌐" value={data?.total_countries || '50+'} label="Countries Analyzed" delta="LinkedIn + Global Postings" />
        <MetricCard
          icon="🥇"
          value={rawCountryList[0]?.country || 'United States'}
          label="Top Hiring Country"
          delta={`${rawCountryList[0]?.count?.toLocaleString() || ''} postings (${(((rawCountryList[0]?.count || 0) / totalGlobalJobs) * 100).toFixed(1)}% share)`}
        />
        <MetricCard
          icon="💰"
          value={rawCountrySalaryList[0] ? `$${rawCountrySalaryList[0].median_usd?.toLocaleString()}` : '$125,000'}
          label="Highest Median Country"
          delta={rawCountrySalaryList[0]?.country || ''}
        />
      </div>

      <GlassCard className="no-hover mb-lg" style={{ padding: '12px 20px' }}>
        <div className="flex justify-between items-center flex-wrap gap-md">
          <div className="flex items-center gap-sm">
            <span className="badge badge-accent">💡 Note on Dataset Scaling:</span>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              US job postings make up the largest portion of the LinkedIn dataset. Use the toggle to zoom in on non-US countries.
            </span>
          </div>

          <div className="flex items-center gap-md">
            <label className="form-label" style={{ margin: 0, textTransform: 'none' }}>
              Zoom Mode:
            </label>
            <button
              className={`btn btn-sm ${!excludeUS ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setExcludeUS(false)}
            >
              All Countries
            </button>
            <button
              className={`btn btn-sm ${excludeUS ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setExcludeUS(true)}
            >
              🔍 Exclude US (Zoom Rest of World)
            </button>
          </div>
        </div>
      </GlassCard>

      <Tabs
        tabs={[
          { id: 'countries', label: '🌐 Top Countries by Volume' },
          { id: 'salary', label: '💰 Median Salary by Country' },
          { id: 'deepdive', label: '🔍 Country Deep Dive' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'countries' && (
        <div className="charts-grid">
          <GlassCard noHover>
            <div className="flex justify-between items-center mb-md">
              <h3>Job Volume by Country {excludeUS ? '(Excluding US)' : ''}</h3>
              <span className="badge badge-neutral">{countryList.length} Countries</span>
            </div>
            <div style={{ height: 420 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryListWithPct} layout="vertical" margin={{ left: 80, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E3055" />
                  <XAxis type="number" stroke="#94A3B8" />
                  <YAxis dataKey="country" type="category" stroke="#94A3B8" width={110} />
                  <Tooltip
                    formatter={(val, name, item) => [
                      `${val.toLocaleString()} jobs (${item.payload.pct}% of global)`,
                      'Postings',
                    ]}
                    contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="#065A82" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard noHover>
            <div className="flex justify-between items-center mb-md">
              <h3>Country Market Share Table</h3>
              <span className="badge badge-primary">Total: {totalGlobalJobs.toLocaleString()} jobs</span>
            </div>
            <div style={{ overflowX: 'auto', maxHeight: 420 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Country</th>
                    <th>Postings</th>
                    <th>Global Share</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {countryListWithPct.map((c, i) => (
                    <tr key={c.country}>
                      <td>#{i + 1}</td>
                      <td><strong>{c.country}</strong></td>
                      <td><span className="badge badge-accent">{c.count?.toLocaleString()} jobs</span></td>
                      <td><strong>{c.pct}%</strong></td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedCountry(c.country);
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
        </div>
      )}

      {activeTab === 'salary' && (
        <GlassCard noHover>
          <h3 className="mb-md">Median Salary by Country (USD / Year)</h3>
          <div style={{ height: 440 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countrySalaryList} layout="vertical" margin={{ left: 80, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3055" />
                <XAxis type="number" stroke="#94A3B8" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis dataKey="country" type="category" stroke="#94A3B8" width={120} />
                <Tooltip
                  formatter={(val) => [`$${val.toLocaleString()}/yr`, 'Median Salary']}
                  contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Bar dataKey="median_usd" fill="#02C39A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {activeTab === 'deepdive' && (
        <div>
          <GlassCard className="no-hover mb-lg">
            <div className="form-group">
              <label className="form-label">Select Country for Deep Dive</label>
              <select
                className="form-select"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                {rawCountryList.map((c) => (
                  <option key={c.country} value={c.country}>
                    {c.country} ({c.count.toLocaleString()} jobs)
                  </option>
                ))}
              </select>
            </div>
          </GlassCard>

          {detailLoading ? (
            <LoadingSpinner text={`Analyzing ${selectedCountry} market data...`} />
          ) : countryDetail ? (
            <div className="flex flex-col gap-lg">
              <div className="metrics-grid">
                <MetricCard icon="📍" value={countryDetail.country} label="Selected Country" />
                <MetricCard icon="📊" value={countryDetail.total_jobs?.toLocaleString()} label="Total Job Records" />
                <MetricCard
                  icon="💰"
                  value={countryDetail.median_salary_usd ? `$${countryDetail.median_salary_usd.toLocaleString()}/yr` : 'N/A'}
                  label="Median Country Salary"
                />
              </div>

              <div className="charts-grid">
                <GlassCard noHover>
                  <h3 className="mb-md">Top Roles in {countryDetail.country}</h3>
                  {rolesData.length === 0 ? (
                    <p className="text-muted">No specific role breakdown available for this country.</p>
                  ) : (
                    <div style={{ height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={rolesData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value">
                            {rolesData.map((e, idx) => (
                              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </GlassCard>

                <GlassCard noHover>
                  <h3 className="mb-md">Skills Demanded in {countryDetail.country}</h3>
                  {(!countryDetail.skills || countryDetail.skills.length === 0) ? (
                    <p className="text-muted">No skill breakdown data for this country.</p>
                  ) : (
                    <div style={{ height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={countryDetail.skills || []} layout="vertical">
                          <XAxis type="number" stroke="#94A3B8" />
                          <YAxis dataKey="skill" type="category" stroke="#94A3B8" width={90} />
                          <Tooltip contentStyle={{ background: '#162040', border: '1px solid rgba(255,255,255,0.1)' }} />
                          <Bar dataKey="count" fill="#02C39A" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </GlassCard>
              </div>

              <GlassCard noHover>
                <h3 className="mb-md">Top Hiring Companies in {countryDetail.country}</h3>
                {(!countryDetail.top_companies || countryDetail.top_companies.length === 0) ? (
                  <p className="text-muted">No top company records found for this country.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Company Name</th>
                          <th>Openings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {countryDetail.top_companies.map((c, i) => (
                          <tr key={c.company}>
                            <td>#{i + 1}</td>
                            <td><strong>{c.company}</strong></td>
                            <td><span className="badge badge-accent">{c.openings} openings</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </GlassCard>

              <div className="flex gap-md mt-md">
                <a
                  href={`https://www.linkedin.com/jobs/search/?location=${encodeURIComponent(selectedCountry)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  🔵 Search Jobs in {selectedCountry} on LinkedIn
                </a>
                <a
                  href={`https://www.indeed.com/jobs?l=${encodeURIComponent(selectedCountry)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  🟢 Search Jobs in {selectedCountry} on Indeed
                </a>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </PageWrapper>
  );
}
