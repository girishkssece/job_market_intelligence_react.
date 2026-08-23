import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { group: 'Overview', items: [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/market-overview', label: 'Market Overview', icon: '📊' },
    { path: '/india-market', label: 'India Market', icon: '🇮🇳' },
    { path: '/global-market', label: 'Global Market', icon: '🌐' },
  ]},
  { group: 'Analytics & ML', items: [
    { path: '/salary-predictor', label: 'Salary Predictor', icon: '💰' },
    { path: '/company-intelligence', label: 'Company Intelligence', icon: '🏢' },
    { path: '/career-path', label: 'Career Path Explorer', icon: '🗺️' },
  ]},
  { group: 'AI Career Tools', items: [
    { path: '/resume-analyzer', label: 'Resume Analyzer', icon: '🔍' },
    { path: '/resume-rewriter', label: 'Resume Rewriter', icon: '✍️' },
    { path: '/salary-negotiation', label: 'Salary Negotiation', icon: '🤝' },
    { path: '/interview-prep', label: 'Interview Prep', icon: '🎯' },
    { path: '/market-chatbot', label: 'Market Chatbot', icon: '🤖' },
  ]},
  { group: 'Growth & Resources', items: [
    { path: '/course-recommendations', label: 'Course Recommendations', icon: '📚' },
    { path: '/portfolio-projects', label: 'Portfolio Projects', icon: '🚀' },
    { path: '/export-report', label: 'Export PDF Report', icon: '📊' },
  ]}
];

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div className={`mobile-overlay ${isOpen ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">🧠</div>
          <div>
            <h1>CareerLens</h1>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '-4px' }}>
              Job Market Intelligence
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((section, idx) => (
            <React.Fragment key={idx}>
              <div className="sidebar-section-label">{section.group}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>CareerLens v2.0 • React</p>
          <p style={{ fontSize: '0.6rem', marginTop: '2px', color: 'var(--text-muted)' }}>
            115,000+ Job Postings
          </p>
        </div>
      </aside>
    </>
  );
}
