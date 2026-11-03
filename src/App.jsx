import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import ExplorerPage from './pages/ExplorerPage.jsx';
import ResumeBuilder from './pages/ResumeBuilder.jsx';
import InterviewPage from './pages/InterviewPage.jsx';
import ToolsPage from './pages/ToolsPage.jsx';
import InfoPage from './pages/InfoPage.jsx';

const pageTitles = {
  '/': 'Home',
  '/jobs': 'Jobs',
  '/internships': 'Internships',
  '/careers': 'Explore Careers',
  '/roadmaps': 'Learning Roadmaps',
  '/skills': 'Skills Development',
  '/companies': 'Company Directory',
  '/resume-builder': 'Resume Builder',
  '/interview': 'Interview Preparation',
  '/resources': 'Learning Resources',
  '/tools': 'Student Tools',
  '/guidance': 'Career Guidance',
  '/about': 'About Careerzoon',
  '/contact': 'Contact',
  '/privacy': 'Privacy',
  '/disclaimer': 'Disclaimer',
};

function StaticPolicy({ kind }) {
  const privacy = kind === 'privacy';
  return <main className="policy-page"><div className="page-hero"><div className="page-hero-inner"><span className="eyebrow">CAREERZOON</span><h1>{privacy ? 'Your privacy, in plain language.' : 'A note about Careerzoon.'}</h1><p>{privacy ? 'Careerzoon is a frontend-only learning and discovery resource.' : 'Helpful career guidance, not a guarantee of employment.'}</p></div></div><article className="policy-content"><h2>{privacy ? 'Data stays in your browser' : 'Information is for educational purposes'}</h2><p>{privacy ? 'Careerzoon does not require an account and does not send resume details, bookmarks, roadmap progress, application tracker entries or checklist progress to a server. These features may use your browser’s local storage. You can clear this data through your browser settings at any time.' : 'Career information, salary context, learning plans and external listings are general educational information. We do not promise employment, verify third-party vacancies, or guarantee that salary estimates reflect a specific offer. Always verify current details with the official employer or provider.'}</p><h2>{privacy ? 'External links' : 'Third-party services'}</h2><p>{privacy ? 'Links to company career pages, learning resources and job platforms lead to third-party sites with their own privacy practices and terms.' : 'Third-party websites and job boards are independent of Careerzoon. Check URLs carefully and never pay a fee to apply for a job unless you have independently verified the process.'}</p><h2>Contact</h2><p>Visit the <a href="/contact">Contact page</a> to prepare a message locally. Messages are not transmitted to a server.</p></article></main>;
}

export default function App() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('careerzoon-theme') === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('careerzoon-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: 'auto' });
    const title = pageTitles[location.pathname] || 'Careerzoon';
    document.title = `${title} | Careerzoon`;
  }, [location.pathname, location.hash]);

  return <div className="app-shell"><Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/jobs" element={<ExplorerPage key="jobs" page="jobs" />} />
    <Route path="/internships" element={<ExplorerPage key="internships" page="internships" />} />
    <Route path="/careers" element={<ExplorerPage key="careers" page="careers" />} />
    <Route path="/roadmaps" element={<ExplorerPage key="roadmaps" page="roadmaps" />} />
    <Route path="/skills" element={<ExplorerPage key="skills" page="skills" />} />
    <Route path="/companies" element={<ExplorerPage key="companies" page="companies" />} />
    <Route path="/resume-builder" element={<ResumeBuilder />} />
    <Route path="/interview" element={<InterviewPage />} />
    <Route path="/resources" element={<ExplorerPage key="resources" page="resources" />} />
    <Route path="/tools" element={<ToolsPage />} />
    <Route path="/guidance" element={<ExplorerPage key="guidance" page="guidance" />} />
    <Route path="/about" element={<InfoPage page="about" />} />
    <Route path="/contact" element={<InfoPage page="contact" />} />
    <Route path="/privacy" element={<StaticPolicy kind="privacy" />} />
    <Route path="/disclaimer" element={<StaticPolicy kind="disclaimer" />} />
    <Route path="*" element={<main className="not-found"><h1>Page not found</h1><p>Let’s help you find your next step.</p><a href="/">Back to Careerzoon home</a></main>} />
  </Routes><Footer /></div>;
}
