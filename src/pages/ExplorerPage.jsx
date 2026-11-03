import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, ChevronDown, CircleCheck, ExternalLink, Info, Search } from 'lucide-react';
import SectionTitle from '../components/SectionTitle.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import { careers, companies, companyProfiles, officialBoards, roadmapResourceLinks, roadmaps, resources, skillResourceLinks, skills } from '../data/content.js';
import './ExplorerPage.css';

const pageConfig = {
  careers: { eyebrow: 'EXPLORE IT CAREERS', title: 'Find the work that fits you.', intro: 'Get a practical overview of technology roles, the skills they use and ways to get started.', data: careers, kind: 'career', filters: ['All paths', 'Development', 'Data', 'Security', 'Infrastructure', 'Design'] },
  roadmaps: { eyebrow: 'LEARN WITH A PLAN', title: 'A clear path from curious to capable.', intro: 'Choose a learning path, work through practical topics and keep your progress saved in this browser.', data: roadmaps, kind: 'roadmap', filters: ['All roadmaps', 'Beginner friendly', 'Intermediate'] },
  skills: { eyebrow: 'SKILLS DEVELOPMENT CENTER', title: 'Build skills. Build confidence.', intro: 'Explore the technical foundations and tools used across today’s technology careers.', data: skills, kind: 'skill', filters: ['All skills', 'Programming', 'Frontend', 'Backend', 'Database', 'Security', 'Cloud', 'Tools', 'Design', 'Foundations'] },
  companies: { eyebrow: 'COMPANY DIRECTORY', title: 'Get to know the teams hiring in tech.', intro: 'Explore company profiles and follow the official careers link to check current roles and opportunities.', data: companies, kind: 'company', filters: ['All companies', 'IT services', 'Software & cloud', 'Software & internet', 'Technology & commerce'] },
  resources: { eyebrow: 'LEARNING RESOURCE LIBRARY', title: 'Good resources. No paywall required.', intro: 'A curated collection of free, legitimate learning resources from trusted providers and official documentation.', data: resources, kind: 'resource', filters: ['All resources', 'Documentation', 'Free courses', 'Practice', 'Coding practice', 'Cloud learning', 'Design learning', 'Web development'] },
};

const guidance = [
  ['Find internships', 'Start with your target role and a short list of companies. Check official career pages, trusted job boards and your college placement cell. Tailor a one-page resume, apply early and track each application. Never pay to apply.'],
  ['Apply for fresher jobs', 'Build a focused resume around projects, coursework and demonstrable skills. Search for entry-level, graduate and trainee roles. Read requirements carefully, personalize each application and use only verified employer links.'],
  ['Use LinkedIn effectively', 'Create a clear headline and About section, add projects and skills, and connect with alumni and professionals respectfully. Follow companies and recruiters; use job alerts and verify openings on company career sites.'],
  ['Contact recruiters professionally', 'Keep outreach brief: introduce yourself, mention a specific relevant role or skill, provide one link to your portfolio and ask one clear question. Avoid mass messaging or repeatedly following up.'],
  ['Write a professional email', 'Use a specific subject line, a polite greeting, concise context, one clear request and a professional sign-off. Check names, attachments and links before sending.'],
  ['Prepare for aptitude tests', 'Review arithmetic, logical reasoning and verbal basics. Practice timed sets, then review why each answer is right or wrong. Sleep well and read test instructions before starting.'],
  ['Prepare for technical interviews', 'Practice explaining your projects and decisions. Review fundamentals for the role, solve problems aloud, test edge cases and ask clarifying questions. Treat interviews as a two-way conversation.'],
  ['Get ready for campus placements', 'Understand your campus process and eligibility rules. Prepare a concise introduction, resume walkthrough, core subject fundamentals, aptitude and mock interviews. Confirm dates with official college communication.'],
  ['Spot a fake job posting', 'Be cautious of upfront fees, guaranteed offers, pressure, personal email domains, suspicious links or requests for banking details. Verify the role on the company’s official careers domain and report suspicious messages.'],
  ['Follow up thoughtfully', 'If no timeline was shared, a brief courteous follow-up after about a week is reasonable. Reference the role and date, thank the recruiter and then give them time to respond.'],
];
const jobRoles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Python Developer', 'Java Developer', 'React Developer', 'Angular Developer', 'Software Engineer', 'Data Analyst', 'Data Scientist', 'AI / ML Engineer', 'Cybersecurity Analyst', 'Cloud Engineer', 'DevOps Engineer', 'Software Tester', 'QA Engineer', 'UI/UX Designer', 'Network Engineer', 'Database Administrator', 'Mobile App Developer'];
const internshipAreas = ['Web Development', 'Frontend Development', 'Backend Development', 'Python Development', 'Java Development', 'Cybersecurity', 'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Cloud Computing', 'DevOps', 'Software Testing', 'UI/UX Design', 'Mobile App Development'];

function storedArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function storedObject(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

export default function ExplorerPage({ page }) {
  const config = pageConfig[page];
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('q') || '');
  const [activeFilter, setActiveFilter] = useState(config?.filters?.[0] || (page === 'jobs' || page === 'internships' ? 'All roles' : 'All'));
  const [selected, setSelected] = useState(null);
  const [bookmarks, setBookmarks] = useState(() => storedArray('careerzoon-bookmarks'));
  const [progress, setProgress] = useState(() => storedObject('careerzoon-roadmap-progress'));
  const filtered = useMemo(() => (config?.data || []).filter((item) => {
    const title = item.title || item.name;
    const matchesText = `${title} ${item.category || ''} ${item.description || item.detail || ''} ${(item.skills || []).join(' ')}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = !activeFilter.startsWith('All') && activeFilter !== 'All paths' && activeFilter !== 'All roadmaps' && activeFilter !== 'All skills' && activeFilter !== 'All companies' && activeFilter !== 'All resources'
      ? item.category === activeFilter || item.level === activeFilter || item.sector === activeFilter || item.type === activeFilter
      : true;
    return matchesText && matchesFilter;
  }), [activeFilter, config?.data, query]);

  if (page === 'jobs' || page === 'internships') {
    const internship = page === 'internships';
    const data = internship
      ? [
        { name: 'Internshala', url: 'https://internshala.com/internships/', icon: 'GraduationCap', detail: 'Explore internships across web development, Python, data science, design and more. Review the employer and stipend details on each listing.' },
        { name: 'LinkedIn Internships', url: 'https://www.linkedin.com/jobs/', icon: 'BriefcaseBusiness', detail: 'Search for internships by role, location and remote options. Verify the application on the organization’s official site.' },
        { name: 'Wellfound', url: 'https://wellfound.com/jobs', icon: 'Rocket', detail: 'Discover startup internships and early-career opportunities. Read company and role details before applying.' },
        ...companies.slice(0, 4).map((company) => ({ name: `${company.name} Careers`, url: company.url, icon: 'Building2', detail: `Check ${company.name}’s official careers site for current internships and early-career programs.` })),
      ] : officialBoards.map((board) => ({ name: board.name, url: board.url, icon: board.icon, detail: board.detail }));
    const categories = internship ? internshipAreas : jobRoles;
    const categoryMatches = categories.filter((item) => item.toLowerCase().includes(query.toLowerCase()) && (activeFilter === 'All roles' || activeFilter === item));
    return <main className="explorer-page"><div className="page-hero"><div className="page-hero-inner"><span className="eyebrow">{internship ? 'INTERNSHIP DISCOVERY' : 'JOB DISCOVERY'}</span><h1>{internship ? 'Start your career with real-world experience.' : 'Find your next opportunity.'}</h1><p>{internship ? 'Explore trusted platforms and official company career pages. Check current openings directly at the source.' : 'Discover where to search for IT jobs and apply through trusted platforms and official company career pages.'}</p><div className="page-hero-meta"><span><Check size={14} /> No fabricated vacancies</span><span><Check size={14} /> Direct application sources</span><span><Check size={14} /> Open to everyone</span></div></div></div><div className="explorer-content"><div className="notice-card"><Info size={18} /><div><b>Important: these are search sources, not live listings.</b><p>Careerzoon does not publish or imply these are verified live vacancies. Search for relevant roles on each platform, check the employer’s official website, and verify details before sharing personal information.</p></div></div><SectionTitle eyebrow={internship ? 'INTERNSHIP SEARCH' : 'JOB SEARCH'} title={internship ? 'Explore internship sources' : 'Choose where to search'} description="Use filters on the source sites to narrow by role, location, experience and work arrangement." /><div className="opportunity-filter-row"><label className="explorer-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${internship ? 'internship areas' : 'job roles'}...`} aria-label={`Search ${internship ? 'internship areas' : 'job roles'}`} /></label><label className="filter-select"><span>Role</span><select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)}><option>All roles</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label></div><div className="category-panel"><h3>{internship ? 'Internship areas' : 'Job roles'} {query && `matching “${query}”`}</h3>{categoryMatches.length ? <div className="tag-row">{categoryMatches.map((item) => <span className="tag" key={item}>{item}</span>)}</div> : <p className="category-empty">No role matches yet. Try another search term or select “All roles”.</p>}</div><div className="source-grid">{data.map((item) => <FeatureCard key={item.name} item={{ ...item, title: item.name, color: 'violet' }} />)}</div><div className="category-panel"><h3>{internship ? 'Before applying' : 'Search smart and safely'}</h3><p className="category-empty">{internship ? 'Use each platform’s own filters to check stipend (paid or unpaid), duration, location, eligibility and whether the role is remote. These details belong to the source listing and may change.' : 'Use each source’s filters for experience, location, remote or work-from-home options, employment type and company. Verify openings and apply on the employer’s official site whenever possible.'}</p></div></div></main>;
  }

  if (page === 'guidance') return <main className="explorer-page"><div className="page-hero"><div className="page-hero-inner"><span className="eyebrow">PRACTICAL CAREER GUIDANCE</span><h1>Small steps make a big difference.</h1><p>Practical, honest advice for finding opportunities and preparing for your first role in tech.</p></div></div><div className="explorer-content"><div className="guidance-grid">{guidance.map(([title, text], index) => <article className="guidance-card" key={title}><span className="guidance-number">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></main>;

  function toggleBookmark(title) {
    const next = bookmarks.includes(title) ? bookmarks.filter((item) => item !== title) : [...bookmarks, title];
    setBookmarks(next);
    localStorage.setItem('careerzoon-bookmarks', JSON.stringify(next));
  }
  function toggleTopic(roadmap, topic) {
    const key = `${roadmap}:${topic}`;
    const next = { ...progress, [key]: !progress[key] };
    setProgress(next);
    localStorage.setItem('careerzoon-roadmap-progress', JSON.stringify(next));
  }

  return <main className="explorer-page"><div className="page-hero"><div className="page-hero-inner"><span className="eyebrow">{config.eyebrow}</span><h1>{config.title}</h1><p>{config.intro}</p></div></div><div className="explorer-content">
    {page === 'roadmaps' && <div className="notice-card roadmap-notice"><BookOpen size={18} /><div><b>Your progress stays on this device.</b><p>Check off topics as you complete them. Your checklist is saved in this browser using local storage.</p></div></div>}
    <div className="explorer-toolbar"><label className="explorer-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${page}...`} aria-label={`Search ${page}`} />{query && <button onClick={() => setQuery('')} aria-label="Clear search">×</button>}</label><label className="filter-select"><span>{page === 'skills' ? 'Category' : 'Filter'}</span><select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)} aria-label={`Filter ${page}`}>{config.filters.map((filter) => <option key={filter}>{filter}</option>)}</select><ChevronDown size={14} /></label><span className="result-count">{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</span></div>
    {page === 'companies' && <div className="notice-card compact-notice"><Info size={16} /><span>Hiring and internship details can change. Visit each company’s official careers site for current information.</span></div>}
    {filtered.length ? <div className={`explorer-grid ${page === 'companies' || page === 'resources' ? 'two-col' : ''}`}>{filtered.map((item) => <FeatureCard key={item.title || item.name} item={item} type={config.kind} saved={bookmarks.includes(item.title || item.name)} onBookmark={toggleBookmark} onOpen={setSelected} />)}</div> : <div className="empty-state"><Search size={25} /><h3>No matching results</h3><p>Try a different search or choose another filter.</p><button className="button-primary" onClick={() => { setQuery(''); setActiveFilter(config.filters[0]); }}>Clear filters</button></div>}
    {selected && <div className="detail-backdrop" role="presentation" onClick={() => setSelected(null)}><section className="detail-modal" role="dialog" aria-modal="true" aria-label={`${selected.title || selected.name} details`} onClick={(event) => event.stopPropagation()}><button className="detail-close" onClick={() => setSelected(null)} aria-label="Close details">×</button><span className="eyebrow">{config.kind === 'roadmap' ? 'LEARNING ROADMAP' : config.kind === 'skill' ? 'SKILL GUIDE' : config.kind === 'company' ? 'COMPANY PROFILE' : 'CAREER OVERVIEW'}</span><h2>{selected.title || selected.name}</h2><p>{selected.description}</p>{config.kind === 'company' && <CompanyDetails company={selected} />}{selected.salary && <p className="detail-salary">Indicative salary range for India: <strong>{selected.salary}</strong> <small>Annual, indicative only—not a live offer or guarantee. Actual compensation varies by location, experience, employer and current market.</small></p>}{selected.skills && <><h3>{config.kind === 'career' ? 'Technical skills to develop' : 'Core skills'}</h3><div className="tag-row">{selected.skills.map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div></>}{config.kind === 'skill' && <><h3>Getting started</h3><p><b>Prerequisites:</b> {selected.prerequisite}. <b>Difficulty:</b> {selected.level}. <b>Estimated learning time:</b> {selected.time}.</p><p><b>Where it’s used:</b> {selected.description} <b>Related careers:</b> {selected.careers}.</p><h3>Practice project</h3><p>Build a focused, well-documented {selected.title} project. Explain the problem, your approach, the tools you used and what you learned; ask for feedback and iterate.</p><ResourceLinks urls={skillResourceLinks[selected.title]} fallback={selected.category} /></>}{config.kind === 'career' && <><h3>Qualifications and recommended technologies</h3><p>A relevant degree, diploma or equivalent practical experience can be a starting point. Employers value demonstrable skills, projects and a willingness to keep learning. Start with {selected.skills.slice(0, 3).join(', ')}.</p><h3>Beginner project idea</h3><p>Build a small portfolio project related to {selected.title.toLowerCase()}, write a clear README and ask someone to review it.</p><h3>Opportunities and career growth</h3><p>Explore entry-level roles on verified job platforms. With experience, people may grow toward senior individual-contributor, specialist, lead or engineering-management paths, depending on interests and opportunity.</p><Link className="detail-resource-link" to="/jobs">Explore job search sources <ArrowRight size={13} /></Link></>}{selected.topics && <><div className="detail-progress">{selected.topics.filter((topic) => progress[`${selected.title}:${topic}`]).length} of {selected.topics.length} topics complete</div><h3>Beginner level</h3><div className="topic-list">{selected.topics.slice(0, 2).map((topic, index) => <TopicCheckbox key={topic} topic={topic} index={index} roadmap={selected.title} progress={progress} onToggle={toggleTopic} />)}</div><h3>Intermediate level</h3><div className="topic-list">{selected.topics.slice(2, 4).map((topic, index) => <TopicCheckbox key={topic} topic={topic} index={index + 2} roadmap={selected.title} progress={progress} onToggle={toggleTopic} />)}</div><h3>Advanced level</h3><div className="topic-list">{selected.topics.slice(4).map((topic, index) => <TopicCheckbox key={topic} topic={topic} index={index + 4} roadmap={selected.title} progress={progress} onToggle={toggleTopic} />)}</div><h3>Recommended tools</h3><p>{selected.title.toLowerCase().includes('design') ? 'Figma, a notebook for research notes, and accessibility checklists.' : selected.title.toLowerCase().includes('data') ? 'Python or spreadsheets, SQL, a notebook environment, and a visualization tool.' : selected.title.toLowerCase().includes('security') || selected.title.toLowerCase().includes('hacking') ? 'Linux, networking learning labs, and security tools used only in authorized environments.' : 'A code editor, Git and GitHub, a browser or terminal, and a project README.'}</p><h3>Practical project</h3><p>{selected.project}</p><p><b>Related roles:</b> {careers.filter((career) => career.category === (selected.title.toLowerCase().includes('data') ? 'Data' : selected.title.toLowerCase().includes('security') ? 'Security' : selected.title.toLowerCase().includes('cloud') || selected.title.toLowerCase().includes('devops') ? 'Infrastructure' : 'Development')).slice(0, 3).map((career) => career.title).join(', ')}.</p><ResourceLinks urls={roadmapResourceLinks[selected.title]} fallback={selected.title} /></>}{selected.category && <p className="detail-meta"><b>Category:</b> {selected.category} <span>·</span> <b>Typical learning time:</b> {selected.time || selected.duration || 'Varies by background'}</p>}{!selected.topics && config.kind !== 'company' && config.kind !== 'skill' && <div className="detail-resources"><h3>Explore free learning resources</h3>{resources.slice(0, 3).map((resource) => <a key={resource.title} href={resource.url} target="_blank" rel="noreferrer">{resource.title} <ExternalLink size={13} /></a>)}</div>}<button className="button-primary detail-done" onClick={() => setSelected(null)}>Got it <ArrowRight size={14} /></button></section></div>}
  </div></main>;
}

function TopicCheckbox({ topic, index, roadmap, progress, onToggle }) {
  const complete = Boolean(progress[`${roadmap}:${topic}`]);
  return <label className={`topic-check ${complete ? 'complete' : ''}`}><input type="checkbox" checked={complete} onChange={() => onToggle(roadmap, topic)} /><span className="topic-check-icon"><CircleCheck size={17} /></span><span><small>STEP {String(index + 1).padStart(2, '0')}</small>{topic}</span></label>;
}

function ResourceLinks({ urls, fallback }) {
  const links = urls?.length ? urls.map((url) => ({ title: new URL(url).hostname.replace(/^www\./, ''), url })) : resources.filter((resource) => `${resource.type} ${resource.title} ${resource.description}`.toLowerCase().includes(String(fallback).toLowerCase())).slice(0, 2);
  return <div className="detail-resources"><h3>Free learning resources</h3>{links.length ? links.map((resource) => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer">{resource.title} <ExternalLink size={13} /></a>) : <a href="https://www.freecodecamp.org/learn/" target="_blank" rel="noreferrer">freeCodeCamp — free project-based courses <ExternalLink size={13} /></a>}</div>;
}

function CompanyDetails({ company }) {
  const profile = companyProfiles[company.name] || { focus: company.sector, skills: ['Role-specific fundamentals', 'Problem solving', 'Communication'], preparation: 'Check the official job listing for requirements and process details.' };
  return <><h3>Company overview and technology areas</h3><p>{company.detail} Focus areas include {profile.focus.toLowerCase()}.</p><p><b>Industry:</b> {company.sector}.</p><h3>Fresher and internship opportunities</h3><p>Look for graduate, entry-level and internship roles on the official careers site. Availability and eligibility vary by location and opening; no vacancy is implied here.</p><h3>Skills to prepare</h3><div className="tag-row">{profile.skills.map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div><h3>Hiring and interview preparation</h3><p>{profile.preparation}</p><div className="detail-resources"><a href={company.url} target="_blank" rel="noreferrer">Official careers website <ExternalLink size={13} /></a></div></>;
}
