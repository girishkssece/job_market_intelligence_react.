const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';


async function fetchJson(endpoint, options = {}) {
  try {
    // Attach JWT token if present (no-op until auth is added)
    const token = localStorage.getItem('token');
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    });


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP Error ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Data endpoints
  getOverview: () => fetchJson('/overview'),
  getSalaryData: (role, region, city) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (region) params.append('region', region);
    if (city) params.append('city', city);
    return fetchJson(`/salary-data?${params.toString()}`);
  },
  getSalaryByRole: (region) => fetchJson(`/salary-by-role${region ? `?region=${region}` : ''}`),
  getSkills: (role, region, topN = 20) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (region) params.append('region', region);
    params.append('top_n', topN);
    return fetchJson(`/skills?${params.toString()}`);
  },
  getCompanies: (role, region, topN = 20) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (region) params.append('region', region);
    params.append('top_n', topN);
    return fetchJson(`/companies?${params.toString()}`);
  },
  getCompanyDetail: (name) => fetchJson(`/company/${encodeURIComponent(name)}`),
  getIndiaMarket: () => fetchJson('/india-market'),
  getGlobalMarket: (country) => fetchJson(`/global-market${country ? `?country=${encodeURIComponent(country)}` : ''}`),
  getExperienceAnalysis: (role) => fetchJson(`/experience-analysis${role ? `?role=${role}` : ''}`),
  getRoles: () => fetchJson('/roles'),

  // ML endpoint
  predictSalary: (data) => fetchJson('/predict-salary', { method: 'POST', body: JSON.stringify(data) }),

  // AI endpoints
  parseResumeFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/parse-resume`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('File parse failed');
    return await response.json();
  },
  analyzeResume: (data) => fetchJson('/resume-analyze', { method: 'POST', body: JSON.stringify(data) }),
  rewriteResume: (data) => fetchJson('/resume-rewrite', { method: 'POST', body: JSON.stringify(data) }),
  generateNegotiationScript: (data) => fetchJson('/negotiate-script', { method: 'POST', body: JSON.stringify(data) }),
  generateNegotiationEmail: (data) => fetchJson('/negotiate-email', { method: 'POST', body: JSON.stringify(data) }),
  getInterviewQuestions: (data) => fetchJson('/interview-questions', { method: 'POST', body: JSON.stringify(data) }),
  reviewInterviewAnswer: (data) => fetchJson('/interview-review', { method: 'POST', body: JSON.stringify(data) }),
  sendChatMessage: (messages) => fetchJson('/chat', { method: 'POST', body: JSON.stringify({ messages }) }),
  getCompanyInsights: (companyName) => fetchJson('/company-insights', { method: 'POST', body: JSON.stringify({ company_name: companyName }) }),
  getPortfolioProjects: (data) => fetchJson('/portfolio-projects', { method: 'POST', body: JSON.stringify(data) }),
  getCareerPath: (data) => fetchJson('/career-path', { method: 'POST', body: JSON.stringify(data) }),

  // PDF Export
  exportReport: async (data) => {
    const response = await fetch(`${API_BASE_URL}/export-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('PDF Generation failed');
    return await response.blob();
  },
  getSalaryComparison: (role, experience, currentSalary, region) => {
    const params = new URLSearchParams({
      role,
      experience,
      current_salary: currentSalary,
      region: region || 'Global'
    });
    return fetchJson(`/salary-comparison?${params.toString()}`);
  },
};
