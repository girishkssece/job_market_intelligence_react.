import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ── Intersection Observer hook ───────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Stats Section ────────────────────────────────────────────────────────────
function StatsSection() {
  const [ref, inView] = useInView();
  const jobs      = useCountUp(115000, 2000, inView);
  const companies = useCountUp(8400,   2000, inView);
  const roles     = useCountUp(14,     1200, inView);
  const features  = useCountUp(15,     1200, inView);

  const stats = [
    { value: jobs,      suffix: '+', label: 'Job Postings Analyzed', icon: '📊' },
    { value: companies, suffix: '+', label: 'Companies Tracked',      icon: '🏢' },
    { value: roles,     suffix: '',  label: 'Tech Roles Covered',      icon: '🎯' },
    { value: features,  suffix: '',  label: 'AI-Powered Features',     icon: '🤖' },
  ];

  return (
    <section ref={ref} style={styles.statsSection}>
      <div style={styles.container}>
        <div style={styles.statsGrid}>
          {stats.map((s, i) => (
            <div key={i} style={styles.statCard} className="stat-card-hover">
              <div style={styles.statIcon}>{s.icon}</div>
              <div style={styles.statValue}>
                {s.value.toLocaleString()}{s.suffix}
              </div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features Grid ────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '💰', title: 'ML Salary Predictor', desc: 'XGBoost model trained on 115K+ jobs predicts your exact market value by role, city, experience, and skills.', tag: 'ML Powered', path: '/salary-predictor', color: '#065A82' },
  { icon: '🔍', title: 'AI Resume Analyzer', desc: 'Get a match score, identify skill gaps, and receive ATS optimization tips in seconds.', tag: 'AI', path: '/resume-analyzer', color: '#02C39A' },
  { icon: '🇮🇳', title: 'India Market Deep Dive', desc: 'City-by-city salary benchmarks, top hiring companies, and in-demand skills for Indian tech jobs.', tag: 'India Focus', path: '/india-market', color: '#F59E0B' },
  { icon: '🤝', title: 'Negotiation Coach', desc: 'AI generates a personalized salary negotiation script and counter-offer email backed by real data.', tag: 'AI', path: '/salary-negotiation', color: '#8B5CF6' },
  { icon: '🎯', title: 'Interview Prep', desc: 'Question bank for 14 roles + AI mock interviews + answer reviewer that scores and improves your responses.', tag: 'AI', path: '/interview-prep', color: '#EF4444' },
  { icon: '🗺️', title: 'Career Path Explorer', desc: 'Map your transition from current role to dream role with a step-by-step skill roadmap and timeline.', tag: 'AI', path: '/career-path', color: '#06B6D4' },
  { icon: '🏢', title: 'Company Intelligence', desc: 'Research hiring trends, demanded skills, and compensation at any of the 8,400+ companies in our dataset.', tag: 'Data', path: '/company-intelligence', color: '#10B981' },
  { icon: '🤖', title: 'Market AI Chatbot', desc: 'Ask anything — salary ranges, skill recommendations, market trends — backed by real data from 115K+ postings.', tag: 'AI', path: '/market-chatbot', color: '#F97316' },
  { icon: '📄', title: 'Resume Rewriter', desc: 'Transform weak bullet points into impact statements with action verbs, metrics, and ATS keywords.', tag: 'AI', path: '/resume-rewriter', color: '#EC4899' },
  { icon: '🚀', title: 'Portfolio Projects', desc: 'Get curated project ideas and AI-generated custom blueprints that match your role and skill gaps.', tag: 'AI', path: '/portfolio-projects', color: '#6366F1' },
  { icon: '📚', title: 'Learning Paths', desc: 'Role-specific curated courses from Coursera, Udemy, and more — free and paid, for all 14 tech roles.', tag: 'Curated', path: '/course-recommendations', color: '#14B8A6' },
  { icon: '📊', title: 'PDF Intelligence Report', desc: 'Download a publication-quality report with salary benchmarks, top skills, companies, and negotiation targets.', tag: 'Export', path: '/export-report', color: '#F59E0B' },
];

function FeaturesSection() {
  const navigate = useNavigate();
  const [ref, inView] = useInView(0.1);

  return (
    <section ref={ref} style={styles.featuresSection}>
      <div style={styles.container}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>FEATURES</span>
          <h2 style={styles.sectionTitle}>Everything you need to win in the tech job market</h2>
          <p style={styles.sectionSub}>15 data-driven and AI-powered tools — all in one platform.</p>
        </div>

        <div style={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              style={{
                ...styles.featureCard,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.5s ease ${i * 0.06}s`,
              }}
              onClick={() => navigate(f.path)}
              className="feature-card-hover"
            >
              <div style={{ ...styles.featureIconWrap, background: `${f.color}22`, border: `1px solid ${f.color}44` }}>
                <span style={{ fontSize: '1.6rem' }}>{f.icon}</span>
              </div>
              <div style={{ ...styles.featureTag, color: f.color, background: `${f.color}18` }}>{f.tag}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
              <div style={{ ...styles.featureArrow, color: f.color }}>Try it →</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How it Works ─────────────────────────────────────────────────────────────
const STEPS = [
  { num: '01', icon: '🎯', title: 'Choose Your Role', desc: 'Select from 14 tech roles — Data Scientist, ML Engineer, Full Stack Dev, and more.' },
  { num: '02', icon: '📊', title: 'Get Real Data Insights', desc: 'Instantly see salary benchmarks, in-demand skills, and top hiring companies from 115K+ real job postings.' },
  { num: '03', icon: '🤖', title: 'Use AI to Take Action', desc: 'Analyze your resume, generate negotiation scripts, practice interviews, and plan your career path.' },
  { num: '04', icon: '🚀', title: 'Land Your Dream Job', desc: 'Walk into every interview and negotiation backed by real data and personalized AI-powered preparation.' },
];

function HowItWorks() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} style={styles.howSection}>
      <div style={styles.container}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>HOW IT WORKS</span>
          <h2 style={styles.sectionTitle}>From data to dream job in 4 steps</h2>
        </div>
        <div style={styles.stepsGrid}>
          {STEPS.map((s, i) => (
            <div
              key={i}
              style={{
                ...styles.stepCard,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.6s ease ${i * 0.15}s`,
              }}
            >
              <div style={styles.stepNum}>{s.num}</div>
              <div style={styles.stepIcon}>{s.icon}</div>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { quote: "Used the salary predictor before my Swiggy interview. Knew exactly what to ask for — got ₹28 LPA, up from ₹18 LPA at my previous company.", name: "Rahul M.", role: "Data Engineer, Bengaluru", avatar: "R" },
  { quote: "The AI resume analyzer told me I was missing 'dbt' and 'Airflow' from my resume. Added them to my projects — got 3x more callbacks.", name: "Priya K.", role: "Data Analyst, Hyderabad", avatar: "P" },
  { quote: "The negotiation script feature is insane. Generated a word-for-word counter-offer email for my Amazon offer. They increased by $15k.", name: "Arjun S.", role: "ML Engineer, Remote (US)", avatar: "A" },
  { quote: "Went from 0 interview calls to 5 in 2 weeks after using the resume rewriter and interview prep tools. Landed at Zomato.", name: "Divya R.", role: "Software Engineer, Pune", avatar: "D" },
  { quote: "As a fresher, having real data on what companies actually pay and what skills they want was a game-changer. Got my first job at Infosys.", name: "Sneha T.", role: "Data Science Intern, Chennai", avatar: "S" },
  { quote: "The career path feature mapped out exactly how to go from Data Analyst to Data Scientist in 18 months. I followed it — it worked.", name: "Karthik N.", role: "Data Scientist, Mumbai", avatar: "K" },
];

function Testimonials() {
  const [ref, inView] = useInView(0.1);
  return (
    <section ref={ref} style={styles.testimonialsSection}>
      <div style={styles.container}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>TESTIMONIALS</span>
          <h2 style={styles.sectionTitle}>Real results from real tech professionals</h2>
        </div>
        <div style={styles.testimonialsGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              style={{
                ...styles.testimonialCard,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.5s ease ${i * 0.1}s`,
              }}
            >
              <div style={styles.quoteIcon}>"</div>
              <p style={styles.quoteText}>{t.quote}</p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.testimonialAvatar}>{t.avatar}</div>
                <div>
                  <div style={styles.authorName}>{t.name}</div>
                  <div style={styles.authorRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Section ──────────────────────────────────────────────────────────────
function CTASection({ navigate }) {
  return (
    <section style={styles.ctaSection}>
      <div style={styles.ctaGlow} />
      <div style={styles.container}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>
            Ready to master your tech career<br />
            <span style={{ color: 'var(--accent)' }}>with real data?</span>
          </h2>
          <p style={styles.ctaSub}>
            Join thousands of Indian tech professionals who use CareerLens to negotiate better salaries,
            land top jobs, and build high-impact careers.
          </p>
          <div style={styles.ctaButtons}>
            <button
              style={styles.ctaPrimary}
              onClick={() => navigate('/dashboard')}
              className="cta-btn-hover"
            >
              🚀 Start for Free — No Signup Needed
            </button>
            <button
              style={styles.ctaSecondary}
              onClick={() => navigate('/salary-predictor')}
            >
              💰 Predict My Salary
            </button>
          </div>
          <p style={styles.ctaNote}>✓ Free to use &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ 115,000+ job records</p>
        </div>
      </div>
    </section>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  return (
    <nav style={{ ...styles.navbar, ...(scrolled ? styles.navbarScrolled : {}) }}>
      <div style={styles.navInner}>
        <div style={styles.navLogo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span style={styles.logoIcon}>🧠</span>
          <span style={styles.logoText}>CareerLens</span>
        </div>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#how-it-works" style={styles.navLink}>How it Works</a>
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button style={styles.navCta} onClick={() => navigate('/dashboard')}>
            Open App →
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function Hero({ navigate }) {
  return (
    <section style={styles.heroSection}>
      {/* Animated background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div style={styles.heroContent}>
        <div style={styles.heroBadge}>
          <span style={styles.heroBadgeDot} />
          115,000+ Real Job Postings · India & Global
        </div>

        <h1 style={styles.heroTitle}>
          The Job Market Intelligence Platform
          <br />
          <span style={styles.heroGradient}>Built for Indian Tech Professionals</span>
        </h1>

        <p style={styles.heroSub}>
          Predict salaries with ML, analyze your resume with AI, prep for interviews with real data,
          and negotiate like you have a data team behind you.
        </p>

        <div style={styles.heroButtons}>
          <button style={styles.heroPrimary} onClick={() => navigate('/dashboard')} className="cta-btn-hover">
            🚀 Explore the Platform — It's Free
          </button>
          <button style={styles.heroSecondary} onClick={() => navigate('/salary-predictor')}>
            💰 Predict My Salary
          </button>
        </div>

        <div style={styles.heroTrust}>
          <div style={styles.trustItem}>✓ No signup required</div>
          <div style={styles.trustDivider}>·</div>
          <div style={styles.trustItem}>✓ Real verified data</div>
          <div style={styles.trustDivider}>·</div>
          <div style={styles.trustItem}>✓ 15 AI-powered tools</div>
        </div>

        {/* Feature preview chips */}
        <div style={styles.heroChips}>
          {['💰 Salary Predictor', '🔍 Resume Analyzer', '🤝 Negotiation Coach', '🎯 Interview Prep', '🗺️ Career Path', '🤖 AI Chatbot'].map((c, i) => (
            <span key={i} style={styles.heroChip}>{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────────
export function LandingPage() {
  const navigate = useNavigate();

  // Inject landing-specific styles once
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'landing-styles';
    style.textContent = `
      .feature-card-hover { cursor: pointer; }
      .feature-card-hover:hover { transform: translateY(-6px) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important; }
      .stat-card-hover:hover { transform: translateY(-4px) !important; border-color: rgba(2,195,154,0.5) !important; }
      .cta-btn-hover:hover { transform: scale(1.03) !important; box-shadow: 0 0 30px rgba(2,195,154,0.5) !important; }
      a[href^="#"] { scroll-behavior: smooth; }
      html { scroll-behavior: smooth; }
    `;
    if (!document.getElementById('landing-styles')) document.head.appendChild(style);
    return () => {
      const el = document.getElementById('landing-styles');
      if (el) el.remove();
    };
  }, []);

  return (
    <div style={styles.page}>
      <Navbar navigate={navigate} />
      <Hero navigate={navigate} />
      <StatsSection />
      <div id="features"><FeaturesSection /></div>
      <div id="how-it-works"><HowItWorks /></div>
      <Testimonials />
      <CTASection navigate={navigate} />
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerInner}>
            <div style={styles.footerLogo}>
              <span>🧠</span> <strong>CareerLens</strong>
            </div>
            <div style={styles.footerLinks}>
              <span onClick={() => navigate('/dashboard')} style={styles.footerLink}>Dashboard</span>
              <span onClick={() => navigate('/salary-predictor')} style={styles.footerLink}>Salary Predictor</span>
              <span onClick={() => navigate('/resume-analyzer')} style={styles.footerLink}>Resume Analyzer</span>
              <span onClick={() => navigate('/market-chatbot')} style={styles.footerLink}>AI Chatbot</span>
            </div>
            <div style={styles.footerCopy}>
              © {new Date().getFullYear()} CareerLens · Data from Naukri & LinkedIn · Powered by Groq Llama
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: { background: '#0A0F1E', minHeight: '100vh', color: '#E2E8F0', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px' },

  // Navbar
  navbar: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '16px 32px', transition: 'all 0.3s ease', background: 'transparent' },
  navbarScrolled: { background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 30px rgba(0,0,0,0.3)' },
  navInner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navLogo: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  logoIcon: { fontSize: '1.5rem' },
  logoText: { fontSize: '1.3rem', fontWeight: 700, background: 'linear-gradient(135deg, #02C39A, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '32px' },
  navLink: { color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' },
  navCta: { background: 'linear-gradient(135deg, #065A82, #02C39A)', border: 'none', color: 'white', padding: '10px 22px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' },

  // Hero
  heroSection: { position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', paddingTop: '80px' },
  blob1: { position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,90,130,0.35) 0%, transparent 70%)', top: '-100px', left: '-200px', animation: 'blobFloat 6s ease-in-out infinite' },
  blob2: { position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(2,195,154,0.2) 0%, transparent 70%)', bottom: '0px', right: '-100px', animation: 'blobFloat 8s ease-in-out infinite reverse' },
  blob3: { position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)', top: '40%', left: '60%', animation: 'blobFloat 10s ease-in-out infinite' },
  heroContent: { position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '0 24px' },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(2,195,154,0.1)', border: '1px solid rgba(2,195,154,0.3)', borderRadius: '50px', padding: '6px 16px', fontSize: '0.82rem', color: '#02C39A', marginBottom: '28px', fontWeight: 500 },
  heroBadgeDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#02C39A', display: 'inline-block', animation: 'pulse 2s infinite' },
  heroTitle: { fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px', color: '#F1F5F9', letterSpacing: '-0.02em' },
  heroGradient: { background: 'linear-gradient(135deg, #02C39A, #38BDF8, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  heroSub: { fontSize: '1.1rem', color: '#94A3B8', lineHeight: 1.7, marginBottom: '36px', maxWidth: '680px', margin: '0 auto 36px' },
  heroButtons: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' },
  heroPrimary: { background: 'linear-gradient(135deg, #02C39A, #065A82)', border: 'none', color: 'white', padding: '16px 32px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 0 30px rgba(2,195,154,0.3)' },
  heroSecondary: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#E2E8F0', padding: '16px 32px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' },
  heroTrust: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', color: '#64748B', fontSize: '0.85rem', marginBottom: '36px' },
  trustItem: { color: '#94A3B8' },
  trustDivider: { color: '#334155' },
  heroChips: { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' },
  heroChip: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', padding: '6px 14px', fontSize: '0.82rem', color: '#CBD5E1', backdropFilter: 'blur(10px)' },

  // Stats
  statsSection: { padding: '80px 0', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' },
  statCard: { textAlign: 'center', padding: '32px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s ease' },
  statIcon: { fontSize: '2rem', marginBottom: '12px' },
  statValue: { fontSize: '2.5rem', fontWeight: 800, color: '#02C39A', marginBottom: '6px', fontVariantNumeric: 'tabular-nums' },
  statLabel: { fontSize: '0.9rem', color: '#64748B', fontWeight: 500 },

  // Section commons
  sectionHeader: { textAlign: 'center', marginBottom: '60px' },
  sectionBadge: { display: 'inline-block', background: 'rgba(2,195,154,0.1)', border: '1px solid rgba(2,195,154,0.25)', color: '#02C39A', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', padding: '4px 14px', borderRadius: '50px', marginBottom: '16px' },
  sectionTitle: { fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: '#F1F5F9', marginBottom: '14px', lineHeight: 1.2 },
  sectionSub: { fontSize: '1.05rem', color: '#64748B', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 },

  // Features
  featuresSection: { padding: '100px 0' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  featureCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', transition: 'all 0.35s ease', position: 'relative', overflow: 'hidden' },
  featureIconWrap: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' },
  featureTag: { display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', padding: '3px 10px', borderRadius: '50px', marginBottom: '10px' },
  featureTitle: { fontSize: '1.05rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '10px' },
  featureDesc: { fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6, marginBottom: '16px' },
  featureArrow: { fontSize: '0.85rem', fontWeight: 600, transition: 'transform 0.2s' },

  // How it Works
  howSection: { padding: '100px 0', background: 'rgba(255,255,255,0.015)' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '28px' },
  stepCard: { textAlign: 'center', padding: '36px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.07)', transition: 'all 0.5s ease', position: 'relative' },
  stepNum: { position: 'absolute', top: '16px', right: '20px', fontSize: '2.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.04)', letterSpacing: '-0.02em' },
  stepIcon: { fontSize: '2.5rem', marginBottom: '16px' },
  stepTitle: { fontSize: '1.05rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '10px' },
  stepDesc: { fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 },

  // Testimonials
  testimonialsSection: { padding: '100px 0' },
  testimonialsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  testimonialCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', transition: 'all 0.5s ease', position: 'relative' },
  quoteIcon: { fontSize: '3rem', color: '#02C39A', opacity: 0.3, lineHeight: 1, marginBottom: '8px', fontFamily: 'Georgia, serif' },
  quoteText: { fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: '12px' },
  testimonialAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #065A82, #02C39A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', color: 'white', flexShrink: 0 },
  authorName: { fontWeight: 600, color: '#E2E8F0', fontSize: '0.9rem' },
  authorRole: { color: '#64748B', fontSize: '0.8rem' },

  // CTA
  ctaSection: { padding: '120px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  ctaGlow: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(2,195,154,0.12) 0%, transparent 70%)', pointerEvents: 'none' },
  ctaContent: { position: 'relative', zIndex: 1 },
  ctaTitle: { fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px', color: '#F1F5F9' },
  ctaSub: { fontSize: '1.05rem', color: '#64748B', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7 },
  ctaButtons: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' },
  ctaPrimary: { background: 'linear-gradient(135deg, #02C39A, #065A82)', border: 'none', color: 'white', padding: '18px 36px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 0 40px rgba(2,195,154,0.25)' },
  ctaSecondary: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#E2E8F0', padding: '18px 36px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease' },
  ctaNote: { color: '#475569', fontSize: '0.85rem' },

  // Footer
  footer: { background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 0' },
  footerInner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' },
  footerLogo: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#E2E8F0' },
  footerLinks: { display: 'flex', gap: '28px', flexWrap: 'wrap', justifyContent: 'center' },
  footerLink: { color: '#64748B', fontSize: '0.875rem', cursor: 'pointer', transition: 'color 0.2s', textDecoration: 'none' },
  footerCopy: { color: '#334155', fontSize: '0.8rem' },
};
