import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { LoadingSpinner } from "./components/common/UIComponents";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Sidebar } from "./components/layout/Sidebar";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { MarketOverview } from "./pages/MarketOverview";
import { IndiaMarket } from "./pages/IndiaMarket";
import { GlobalMarket } from "./pages/GlobalMarket";
import { SalaryPredictor } from "./pages/SalaryPredictor";
import { ResumeAnalyzer } from "./pages/ResumeAnalyzer";
import { CareerPath } from "./pages/CareerPath";
import { CourseRecommendations } from "./pages/CourseRecommendations";
import { SalaryNegotiation } from "./pages/SalaryNegotiation";
import { InterviewPrep } from "./pages/InterviewPrep";
import { CompanyIntelligence } from "./pages/CompanyIntelligence";
import { MarketChatbot } from "./pages/MarketChatbot";
import { PortfolioProjects } from "./pages/PortfolioProjects";
import { ResumeRewriter } from "./pages/ResumeRewriter";
import { ExportReport } from "./pages/ExportReport";
import { SalaryComparison } from "./pages/SalaryComparison";
import { SkillForecasting } from "./pages/SkillForecasting";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";

// Full-screen spinner shown during the initial auth token verification
function AuthLoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep, #0A0F1E)' }}>
      <LoadingSpinner text="Verifying session..." />
    </div>
  );
}

// Redirects logged-in users away from /login and /signup
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoadingScreen />;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

// Protects routes that require authentication
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <AuthLoadingScreen />;
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

// Separate component so we can use useLocation inside Router
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <div className={isLanding || isAuthPage ? "" : "app-layout"}>
      {/* Hide sidebar + toggle on landing page and auth pages */}
      {!isLanding && !isAuthPage && (
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

      <main className={isLanding || isAuthPage ? "" : "main-content"}>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth pages — redirect to dashboard if already logged in */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Protected app pages — each wrapped in its own ErrorBoundary */}
          <Route path="/dashboard" element={<PrivateRoute><ErrorBoundary><Dashboard /></ErrorBoundary></PrivateRoute>} />
          <Route path="/market-overview" element={<PrivateRoute><ErrorBoundary><MarketOverview /></ErrorBoundary></PrivateRoute>} />
          <Route path="/india-market" element={<PrivateRoute><ErrorBoundary><IndiaMarket /></ErrorBoundary></PrivateRoute>} />
          <Route path="/global-market" element={<PrivateRoute><ErrorBoundary><GlobalMarket /></ErrorBoundary></PrivateRoute>} />
          <Route path="/salary-predictor" element={<PrivateRoute><ErrorBoundary><SalaryPredictor /></ErrorBoundary></PrivateRoute>} />
          <Route path="/resume-analyzer" element={<PrivateRoute><ErrorBoundary><ResumeAnalyzer /></ErrorBoundary></PrivateRoute>} />
          <Route path="/career-path" element={<PrivateRoute><ErrorBoundary><CareerPath /></ErrorBoundary></PrivateRoute>} />
          <Route
            path="/course-recommendations"
            element={<PrivateRoute><ErrorBoundary><CourseRecommendations /></ErrorBoundary></PrivateRoute>}
          />
          <Route path="/salary-negotiation" element={<PrivateRoute><ErrorBoundary><SalaryNegotiation /></ErrorBoundary></PrivateRoute>} />
          <Route path="/interview-prep" element={<PrivateRoute><ErrorBoundary><InterviewPrep /></ErrorBoundary></PrivateRoute>} />
          <Route
            path="/company-intelligence"
            element={<PrivateRoute><ErrorBoundary><CompanyIntelligence /></ErrorBoundary></PrivateRoute>}
          />
          <Route path="/market-chatbot" element={<PrivateRoute><ErrorBoundary><MarketChatbot /></ErrorBoundary></PrivateRoute>} />
          <Route path="/portfolio-projects" element={<PrivateRoute><ErrorBoundary><PortfolioProjects /></ErrorBoundary></PrivateRoute>} />
          <Route path="/resume-rewriter" element={<PrivateRoute><ErrorBoundary><ResumeRewriter /></ErrorBoundary></PrivateRoute>} />
          <Route path="/export-report" element={<PrivateRoute><ErrorBoundary><ExportReport /></ErrorBoundary></PrivateRoute>} />
          <Route path="/salary-comparison" element={<PrivateRoute><ErrorBoundary><SalaryComparison /></ErrorBoundary></PrivateRoute>} />
          <Route path="/skill-forecasting" element={<PrivateRoute><ErrorBoundary><SkillForecasting /></ErrorBoundary></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}
