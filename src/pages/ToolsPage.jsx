import { lazy, Suspense, useMemo, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Check, CheckCircle2, ClipboardList, Copy, Download, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { careers, questions } from '../data/content.js';
import CssLearningTool from '../components/CssLearningTool.jsx';
import './ToolsPage.css';

const ToolDirectory = lazy(() => import('../components/ToolDirectory.jsx'));
const interestOptions = ['Building websites', 'Working with data', 'Protecting systems', 'Designing experiences', 'Cloud infrastructure', 'Creating software'];
const portfolioItems = ['Professional headline and short introduction', 'About section focused on your strengths', 'Two or more projects with clear explanations', 'Links to working demos or screenshots', 'GitHub profile with readable project READMEs', 'Contact details and professional links', 'Mobile-friendly layout with no broken links', 'Proofread content and accessible color contrast'];
const defaultLearning = ['Choose one role to explore', 'Learn or review the core fundamentals', 'Practice with a small project', 'Ask for feedback and improve the project', 'Document your work in a portfolio', 'Review your progress and choose a next step'];
const initialApplications = (() => {
  try { return JSON.parse(localStorage.getItem('careerzoon-applications') || '[]'); } catch { return []; }
})();
const initialChecks = (key, items) => {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
};

const toolsNavList = [
  { id: 'Software Tools Directory', label: 'Tools Directory' },
  { id: 'Career Finder', label: 'Career Finder' },
  { id: 'Skill Gap', label: 'Skill Gap Plan' },
  { id: 'Salary Estimator', label: 'Salary Estimator' },
  { id: 'Application Tracker', label: 'Job Tracker' },
  { id: 'Cover Letter', label: 'Cover Letter' },
  { id: 'Coding Quiz', label: 'Coding Quiz' },
  { id: 'Portfolio Checklist', label: 'Portfolio Checklist' },
  { id: 'Learning Momentum', label: 'Learning Checklist' },
  { id: 'CSS', label: 'CSS Visualizer' },
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState('Software Tools Directory');
  const [interests, setInterests] = useState([]);
  const [knownSkills, setKnownSkills] = useState([]);
  const [targetRole, setTargetRole] = useState(careers[0].title);
  const [experience, setExperience] = useState('0');
  const [location, setLocation] = useState('India');
  const [applications, setApplications] = useState(initialApplications);
  const [newApplication, setNewApplication] = useState({ role: '', company: '', date: '' });
  const [coverLetter, setCoverLetter] = useState({ name: '', role: '', company: '', skills: '', project: '' });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [copied, setCopied] = useState(false);
  const [portfolio, setPortfolio] = useState(() => initialChecks('careerzoon-portfolio-checklist', portfolioItems));
  const [learning, setLearning] = useState(() => initialChecks('careerzoon-learning-checklist', defaultLearning));
  const role = careers.find((item) => item.title === targetRole) || careers[0];
  const recommendedCareers = useMemo(() => careers.filter((career) => {
    const map = { Development: ['Building websites', 'Creating software'], Data: ['Working with data'], Security: ['Protecting systems'], Infrastructure: ['Cloud infrastructure'], Design: ['Designing experiences'] };
    return interests.length === 0 || (map[career.category] || []).some((interest) => interests.includes(interest));
  }), [interests]);
  const gap = role.skills.filter((skill) => !knownSkills.includes(skill));
  const years = Math.max(0, Number(experience) || 0);
  const midpoint = parseFloat(role.salary.match(/₹([\d.]+)L/)?.[1] || '4');
  const salaryMin = Math.round((midpoint * (1 + Math.min(years, 12) * .075)) * 10) / 10;

  function setInterest(value) { setInterests((old) => old.includes(value) ? old.filter((item) => item !== value) : [...old, value]); }
  function setSkill(value) { setKnownSkills((old) => old.includes(value) ? old.filter((item) => item !== value) : [...old, value]); }
  function saveApplications(next) {
    setApplications(next);
    try {
      localStorage.setItem('careerzoon-applications', JSON.stringify(next));
    } catch {
      // Storage unavailable
    }
  }
  function addApplication(event) {
    event.preventDefault();
    if (!newApplication.role.trim() || !newApplication.company.trim()) return;
    saveApplications([{ ...newApplication, id: Date.now(), status: 'Applied' }, ...applications]);
    setNewApplication({ role: '', company: '', date: '' });
  }
  function updateApplication(id, status) { saveApplications(applications.map((item) => item.id === id ? { ...item, status } : item)); }
  function toggleCheck(key, item, setState, storageKey) {
    setState((old) => {
      const next = { ...old, [item]: !old[item] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Storage unavailable
      }
      return next;
    });
  }
  function generateLetter(event) {
    event.preventDefault();
    const { name, role: letterRole, company, skills: letterSkills, project } = coverLetter;
    if (!name.trim() || !letterRole.trim() || !company.trim()) { setGeneratedLetter('Please add your name, the role, and the company to generate a letter.'); return; }
    setGeneratedLetter(`Dear Hiring Team,\n\nI am writing to express my interest in the ${letterRole} opportunity at ${company}. I am an early-career technology professional eager to contribute, learn, and build thoughtful solutions.\n\n${letterSkills.trim() ? `My experience with ${letterSkills.trim()} has helped me develop a strong foundation for this role. ` : 'Through my learning and project work, I have developed a strong foundation for this role. '}${project.trim() ? `One project I am proud of is ${project.trim()}, where I applied my skills to solve a practical problem.` : 'I enjoy learning by building practical projects and improving them through feedback.'}\n\nI would welcome the opportunity to share more about my work and how I could contribute to your team. Thank you for your time and consideration.\n\nKind regards,\n${name}`);
  }
  async function copyLetter() {
    try { await navigator.clipboard.writeText(generatedLetter); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); }
  }
  function downloadLetter() {
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'careerzoon-cover-letter.txt'; anchor.click();
    URL.revokeObjectURL(url);
  }
  function renderTool() {
    if (activeTool === 'Software Tools Directory') return <Suspense fallback={<div className="tool-directory-loading">Loading the software tools directory…</div>}><ToolDirectory /></Suspense>;
    if (activeTool === 'CSS') return <CssLearningTool />;
    if (activeTool === 'Career Finder') return <div className="tool-content"><div className="tool-intro"><h2>Which parts of tech excite you?</h2><p>Select any that sound interesting. This is a starting point for exploration—not a test or a fixed answer.</p></div><div className="choice-grid">{interestOptions.map((item) => <button key={item} onClick={() => setInterest(item)} className={`choice-card ${interests.includes(item) ? 'selected' : ''}`}><span>{interests.includes(item) ? <CheckCircle2 size={18} /> : <span className="choice-empty" />}</span>{item}</button>)}</div><div className="recommend-head"><h3>{interests.length ? 'Paths to explore' : 'Popular starting points'}</h3><span>{recommendedCareers.length} suggestions</span></div><div className="recommend-grid">{recommendedCareers.slice(0, 4).map((item) => <Link className="recommend-card" key={item.title} to="/careers"><BriefcaseBusiness size={17} /><span><b>{item.title}</b><small>{item.description}</small></span><ArrowRight size={14} /></Link>)}</div></div>;
    if (activeTool === 'Skill Gap') return <div className="tool-content"><div className="tool-intro"><h2>Make a learning plan for your target role.</h2><p>Select a role and the skills you already know. We’ll show suggested areas to build—no score or judgment.</p></div><label className="tool-field">Target role<select value={targetRole} onChange={(event) => setTargetRole(event.target.value)}>{careers.map((item) => <option key={item.title}>{item.title}</option>)}</select></label><div className="skill-check-grid">{role.skills.map((skill) => <label key={skill} className={`skill-check ${knownSkills.includes(skill) ? 'checked' : ''}`}><input type="checkbox" checked={knownSkills.includes(skill)} onChange={() => setSkill(skill)} />{skill}<span>{knownSkills.includes(skill) ? 'Familiar' : 'To explore'}</span></label>)}</div><div className="gap-result"><b>{gap.length} skill{gap.length === 1 ? '' : 's'} to explore</b><p>{gap.length ? `Suggested next topics: ${gap.join(', ')}.` : 'You’ve marked all suggested skills as familiar. Try a portfolio project to put them together.'}</p><Link to="/roadmaps">Find a related roadmap <ArrowRight size={14} /></Link></div></div>;
    if (activeTool === 'Salary Estimator') return <div className="tool-content"><div className="tool-intro"><h2>Explore an indicative salary range.</h2><p>This is a broad, illustrative estimate—not a promise or offer. Actual compensation varies widely by location, experience, employer and market.</p></div><label className="tool-field">Career path<select value={targetRole} onChange={(event) => setTargetRole(event.target.value)}>{careers.map((item) => <option key={item.title}>{item.title}</option>)}</select></label><label className="tool-field">Experience in years<input type="number" min="0" max="40" value={experience} onChange={(event) => setExperience(event.target.value)} /></label><label className="tool-field">Location context<select value={location} onChange={(event) => setLocation(event.target.value)}><option>India</option><option>United States</option><option>United Kingdom</option><option>Other / compare locally</option></select></label><div className="salary-result"><span>Illustrative range · {location}</span><strong>{location === 'India' ? `₹${salaryMin}L – ₹${Math.round((salaryMin * 2.8) * 10) / 10}L` : 'Compare local salary data'}</strong><small>{location === 'India' ? `Per year, before tax. Baseline for ${role.title}: ${role.salary}. This simplified estimate is for exploration only; verify with current local salary sources.` : 'Salary ranges differ significantly by region and currency. Check recent local salary surveys and job postings for context.'}</small></div></div>;
    if (activeTool === 'Application Tracker') return <div className="tool-content"><div className="tool-intro"><h2>Keep your job search organized.</h2><p>Your application notes stay in this browser. Add only details you’re comfortable storing on this device.</p></div><form className="application-form" onSubmit={addApplication}><input aria-label="Job role" value={newApplication.role} onChange={(event) => setNewApplication({ ...newApplication, role: event.target.value })} placeholder="Role title" required /><input aria-label="Company" value={newApplication.company} onChange={(event) => setNewApplication({ ...newApplication, company: event.target.value })} placeholder="Company" required /><input aria-label="Application date" type="date" value={newApplication.date} onChange={(event) => setNewApplication({ ...newApplication, date: event.target.value })} /><button className="button-primary" type="submit"><Plus size={14} /> Add</button></form>{applications.length ? <div className="application-list">{applications.map((item) => <article className="application-row" key={item.id}><div><b>{item.role}</b><span>{item.company}{item.date ? ` · ${item.date}` : ''}</span></div><select aria-label={`Update status for ${item.role}`} value={item.status} onChange={(event) => updateApplication(item.id, event.target.value)}>{['Saved', 'Applied', 'Interview', 'Offer', 'Closed'].map((status) => <option key={status}>{status}</option>)}</select><button className="delete-application" onClick={() => saveApplications(applications.filter((application) => application.id !== item.id))} aria-label={`Delete ${item.role}`}><Trash2 size={15} /></button></article>)}</div> : <div className="tracker-empty"><ClipboardList size={23} /><b>No applications yet</b><span>Add an opportunity above to keep track of your search.</span></div>}</div>;
    if (activeTool === 'Cover Letter') return <div className="tool-content"><div className="tool-intro"><h2>Draft a thoughtful cover letter.</h2><p>Use this as a starting point. Personalize it for the role and check the company’s official application instructions.</p></div><form className="cover-form" onSubmit={generateLetter}><label className="tool-field">Your name<input value={coverLetter.name} onChange={(event) => setCoverLetter({ ...coverLetter, name: event.target.value })} placeholder="Your name" /></label><label className="tool-field">Role title<input value={coverLetter.role} onChange={(event) => setCoverLetter({ ...coverLetter, role: event.target.value })} placeholder="e.g. Junior Software Engineer" /></label><label className="tool-field">Company<input value={coverLetter.company} onChange={(event) => setCoverLetter({ ...coverLetter, company: event.target.value })} placeholder="Company name" /></label><label className="tool-field">Relevant skills<input value={coverLetter.skills} onChange={(event) => setCoverLetter({ ...coverLetter, skills: event.target.value })} placeholder="e.g. React, teamwork, SQL" /></label><label className="tool-field full-width">A relevant project or experience<input value={coverLetter.project} onChange={(event) => setCoverLetter({ ...coverLetter, project: event.target.value })} placeholder="Briefly describe something you built or contributed to" /></label><button className="button-primary" type="submit">Generate a draft <ArrowRight size={14} /></button></form>{generatedLetter && <div className="generated-letter"><div><b>Your editable draft</b><div className="letter-actions"><button onClick={copyLetter}><Copy size={13} />{copied ? 'Copied' : 'Copy'}</button><button onClick={downloadLetter}><Download size={13} />Download</button></div></div><textarea value={generatedLetter} onChange={(event) => setGeneratedLetter(event.target.value)} rows="12" aria-label="Generated cover letter" /></div>}</div>;
    if (activeTool === 'Coding Quiz') return <CodingQuiz />;
    if (activeTool === 'Portfolio Checklist') return <div className="tool-content"><div className="tool-intro"><h2>A portfolio that tells your story.</h2><p>Use this checklist to review the essentials. Your progress is saved in this browser.</p></div><Checklist items={portfolioItems} checks={portfolio} onToggle={(item) => toggleCheck('portfolio', item, setPortfolio, 'careerzoon-portfolio-checklist')} /><div className="check-progress"><span>{portfolioItems.filter((item) => portfolio[item]).length} of {portfolioItems.length} complete</span><div><i style={{ width: `${portfolioItems.filter((item) => portfolio[item]).length / portfolioItems.length * 100}%` }} /></div></div></div>;
    return <div className="tool-content"><div className="tool-intro"><h2>Keep your learning momentum.</h2><p>A simple browser-saved checklist to help turn career goals into consistent steps.</p></div><Checklist items={defaultLearning} checks={learning} onToggle={(item) => toggleCheck('learning', item, setLearning, 'careerzoon-learning-checklist')} /><div className="check-progress"><span>{defaultLearning.filter((item) => learning[item]).length} of {defaultLearning.length} complete</span><div><i style={{ width: `${defaultLearning.filter((item) => learning[item]).length / defaultLearning.length * 100}%` }} /></div></div><Link className="tool-resource-link" to="/roadmaps">Pick a learning roadmap <ArrowRight size={14} /></Link></div>;
  }

  return <main className="tools-page"><div className="page-hero"><div className="page-hero-inner"><span className="eyebrow">YOUR STUDENT TOOLKIT</span><h1>Find, install, and learn the tools behind your career.</h1><p>Explore official software downloads, step-by-step setup guides, practical projects, and helpful student tools. No login or backend required.</p><div className="page-hero-meta"><span>✓ Official vendor links</span><span>✓ Bookmarks stay in your browser</span></div></div></div><div className="tools-workspace"><nav className="tools-nav-bar" role="tablist" aria-label="Student toolkit options">{toolsNavList.map((tool) => <button key={tool.id} type="button" role="tab" aria-selected={activeTool === tool.id} className={`tool-nav-btn ${activeTool === tool.id ? 'active' : ''}`} onClick={() => setActiveTool(tool.id)}>{tool.label}</button>)}</nav><section className="tool-panel">{renderTool()}</section></div></main>;
}

function Checklist({ items, checks, onToggle }) {
  return <div className="checklist">{items.map((item) => <label key={item} className={`checklist-row ${checks[item] ? 'done' : ''}`}><input type="checkbox" checked={Boolean(checks[item])} onChange={() => onToggle(item)} /><span className="checkmark"><Check size={13} /></span><span>{item}</span></label>)}</div>;
}

function CodingQuiz() {
  const codingQuestions = questions.filter((question) => ['JavaScript', 'Python', 'React', 'SQL', 'DSA', 'Java'].includes(question.topic));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const question = codingQuestions[index];
  const score = answers.filter((answer, answerIndex) => answer === codingQuestions[answerIndex]?.answer).length;
  function advance() {
    const updated = [...answers, selected];
    setAnswers(updated);
    if (index + 1 === codingQuestions.length) setFinished(true);
    else { setIndex(index + 1); setSelected(null); }
  }
  function restart() { setIndex(0); setSelected(null); setAnswers([]); setFinished(false); }

  return <div className="tool-content"><div className="tool-intro"><h2>Quick coding knowledge check.</h2><p>Practice programming fundamentals with instant feedback. Answers are not uploaded or stored.</p></div>{finished ? <div className="coding-result"><CheckCircle2 size={26} /><h3>{score} of {codingQuestions.length} correct</h3><p>Review the explanations in Placement Prep to keep building your understanding.</p><button className="button-primary" onClick={restart}>Try again <ArrowRight size={14} /></button></div> : <div className="coding-question"><div className="quiz-card-head"><span className="quiz-topic">{question.topic}</span><span className="quiz-counter">Question {index + 1} of {codingQuestions.length}</span></div><h3>{question.question}</h3><div className="quiz-options">{question.options.map((option, optionIndex) => <button key={option} disabled={selected !== null} onClick={() => setSelected(optionIndex)} className={`quiz-option ${selected === optionIndex ? (optionIndex === question.answer ? 'correct' : 'incorrect') : selected !== null && optionIndex === question.answer ? 'reveal-correct' : ''}`}><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div>{selected !== null && <div className="answer-explanation"><b>{selected === question.answer ? 'Correct!' : `The answer is ${question.options[question.answer]}.`}</b><p>{question.explanation}</p></div>}<div className="quiz-footer"><span>{score + (selected === question.answer ? 1 : 0)} correct so far</span><button className="button-primary" disabled={selected === null} onClick={advance}>{index + 1 === codingQuestions.length ? 'Finish quiz' : 'Next question'} <ArrowRight size={14} /></button></div></div>}</div>;
}
