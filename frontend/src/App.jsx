import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { MarketOverview } from './pages/MarketOverview';
import { IndiaMarket } from './pages/IndiaMarket';
import { GlobalMarket } from './pages/GlobalMarket';
import { SalaryPredictor } from './pages/SalaryPredictor';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { CareerPath } from './pages/CareerPath';
import { CourseRecommendations } from './pages/CourseRecommendations';
import { SalaryNegotiation } from './pages/SalaryNegotiation';
import { InterviewPrep } from './pages/InterviewPrep';
import { CompanyIntelligence } from './pages/CompanyIntelligence';
import { MarketChatbot } from './pages/MarketChatbot';
import { PortfolioProjects } from './pages/PortfolioProjects';
import { ResumeRewriter } from './pages/ResumeRewriter';
import { ExportReport } from './pages/ExportReport';

// Separate component so we can use useLocation inside Router
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <div className={isLanding ? '' : 'app-layout'}>
      {/* Hide sidebar + toggle on landing page */}
      {!isLanding && (
        <>
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
      )}

      <main className={isLanding ? '' : 'main-content'}>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* App pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/market-overview" element={<MarketOverview />} />
          <Route path="/india-market" element={<IndiaMarket />} />
          <Route path="/global-market" element={<GlobalMarket />} />
          <Route path="/salary-predictor" element={<SalaryPredictor />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/career-path" element={<CareerPath />} />
          <Route path="/course-recommendations" element={<CourseRecommendations />} />
          <Route path="/salary-negotiation" element={<SalaryNegotiation />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/company-intelligence" element={<CompanyIntelligence />} />
          <Route path="/market-chatbot" element={<MarketChatbot />} />
          <Route path="/portfolio-projects" element={<PortfolioProjects />} />
          <Route path="/resume-rewriter" element={<ResumeRewriter />} />
          <Route path="/export-report" element={<ExportReport />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
