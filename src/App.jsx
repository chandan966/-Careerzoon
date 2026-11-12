import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CookieConsent from './components/CookieConsent.jsx';
import DiwaliGreeting from './components/DiwaliGreeting.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const ExplorerPage = lazy(() => import('./pages/ExplorerPage.jsx'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder.jsx'));
const InterviewPage = lazy(() => import('./pages/InterviewPage.jsx'));
const ToolsPage = lazy(() => import('./pages/ToolsPage.jsx'));
const InfoPage = lazy(() => import('./pages/InfoPage.jsx'));
const StaticPolicy = lazy(() => import('./pages/StaticPolicy.jsx'));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage.jsx'));

const pageTitles = {
  '/': 'Home',
  '/jobs': 'Jobs',
  '/internships': 'Internships',
  '/careers': 'Explore Careers',
  '/roadmaps': 'Learning Roadmaps',
  '/skills': 'Skills Development',
  '/companies': 'Company Directory',
  '/resume-builder': 'Resume Builder',
  '/interview': 'Placement Preparation',
  '/tools': 'Student Tools',
  '/guidance': 'Career Guidance',
  '/about': 'About Careerzoon',
  '/contact': 'Contact',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms and Conditions',
  '/disclaimer': 'Disclaimer',
};

const pageDescriptions = {
  '/': 'Discover IT careers, build in-demand skills, explore learning roadmaps and prepare for your next opportunity with Careerzoon.',
  '/jobs': 'Explore trusted job-search platforms and official company career sites for technology opportunities.',
  '/internships': 'Find trusted internship search platforms and official employer career pages for technology internships.',
  '/careers': 'Explore technology careers, the skills they use and practical next steps for getting started.',
  '/roadmaps': 'Follow step-by-step technology learning roadmaps with skills, projects and resources.',
  '/skills': 'Explore technical skills and trusted learning resources for your technology career.',
  '/companies': 'Learn about technology companies, their work and official career pages.',
  '/resume-builder': 'Create and download a professional resume with Careerzoon’s private, browser-based resume builder.',
  '/interview': 'Prepare for technology placements with topic-based practice questions and explanations.',
  '/tools': 'Discover software tools, official downloads, setup instructions and practical learning guides.',
  '/guidance': 'Explore practical career guidance for students and early-career technology professionals.',
  '/about': 'Learn about Careerzoon and its mission to help learners explore technology careers.',
  '/contact': 'Contact Careerzoon by email.',
  '/privacy': 'Read Careerzoon’s privacy policy, including Google AdSense advertising cookies, browser local storage, and user privacy choices.',
  '/terms': 'Review the terms and conditions for using Careerzoon’s educational roadmaps, tools, and career exploration platform.',
  '/disclaimer': 'Understand the scope, limitations, and educational nature of Careerzoon’s career guides and external opportunity links.',
};

function updateMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const [key, content] = attribute;
    element.setAttribute(key, content);
    document.head.append(element);
  }
  element.setAttribute('content', value);
}

export default function App() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('careerzoon-theme') === 'dark';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('careerzoon-theme', darkMode ? 'dark' : 'light');
    } catch {
      // Storage unavailable
    }
  }, [darkMode]);
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: 'auto' });
    const isToolGuide = location.pathname.startsWith('/tools/');
    const title = isToolGuide ? 'Software Tool Guide' : pageTitles[location.pathname] || 'Careerzoon';
    const fullTitle = `${title} | Careerzoon — Discover Skills. Explore Careers. Get Hired.`;
    const description = isToolGuide
      ? `Learn how to download, set up and use ${location.pathname.split('/').pop().replace(/-/g, ' ')} with Careerzoon’s practical software guide.`
      : pageDescriptions[location.pathname] || pageDescriptions['/'];
    document.title = fullTitle;
    updateMeta('meta[name="description"]', ['name', 'description'], description);
    updateMeta('meta[property="og:title"]', ['property', 'og:title'], fullTitle);
    updateMeta('meta[property="og:description"]', ['property', 'og:description'], description);
    updateMeta('meta[name="twitter:card"]', ['name', 'twitter:card'], 'summary');
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = new URL(location.pathname, window.location.origin).href;
    updateMeta('meta[property="og:url"]', ['property', 'og:url'], canonical.href);
  }, [location.pathname, location.hash]);

  return <div className="app-shell"><Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} /><DiwaliGreeting /><Suspense fallback={<div className="page-loader">Loading Careerzoon…</div>}><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/jobs" element={<ExplorerPage key="jobs" page="jobs" />} />
    <Route path="/internships" element={<ExplorerPage key="internships" page="internships" />} />
    <Route path="/careers" element={<ExplorerPage key="careers" page="careers" />} />
    <Route path="/roadmaps" element={<ExplorerPage key="roadmaps" page="roadmaps" />} />
    <Route path="/skills" element={<ExplorerPage key="skills" page="skills" />} />
    <Route path="/companies" element={<ExplorerPage key="companies" page="companies" />} />
    <Route path="/resume-builder" element={<ResumeBuilder />} />
    <Route path="/interview" element={<InterviewPage />} />
    <Route path="/tools" element={<ToolsPage />} />
    <Route path="/tools/:toolSlug" element={<ToolDetailPage />} />
    <Route path="/guidance" element={<ExplorerPage key="guidance" page="guidance" />} />
    <Route path="/about" element={<InfoPage page="about" />} />
    <Route path="/contact" element={<InfoPage page="contact" />} />
    <Route path="/privacy" element={<StaticPolicy kind="privacy" />} />
    <Route path="/terms" element={<StaticPolicy kind="terms" />} />
    <Route path="/disclaimer" element={<StaticPolicy kind="disclaimer" />} />
    <Route path="*" element={<main className="not-found"><h1>Page not found</h1><p>Let’s help you find your next step.</p><a href="/">Back to Careerzoon home</a></main>} />
  </Routes></Suspense><CookieConsent /><Footer /></div>;
}
