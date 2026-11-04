import { useMemo, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, ExternalLink, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { jobSiteGroups, priorityJobSites } from '../data/jobSites.js';
import DirectoryLogo from './DirectoryLogo.jsx';
import './JobSiteDirectory.css';

const categoryOptions = [
  ['all', 'All sources'],
  ['india', 'India job boards & internships'],
  ['international', 'International & remote'],
  ['india-companies', 'Indian company careers'],
  ['international-companies', 'International company careers'],
  ['public', 'Government & apprenticeships'],
];
const searchableRoles = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Python Developer', 'Java Developer',
  'React Developer', 'Angular Developer', 'Software Engineer', 'Data Analyst', 'Data Scientist',
  'AI / ML Engineer', 'Cybersecurity Analyst', 'Cloud Engineer', 'DevOps Engineer', 'Software Tester',
  'QA Engineer', 'UI/UX Designer', 'Network Engineer', 'Database Administrator', 'Mobile App Developer',
];

const sitesWithNumbers = jobSiteGroups.flatMap((group) => group.sources.map(([name, url, type], index) => ({ name, url, type, groupId: group.id, number: index })));
const sourceCount = jobSiteGroups.reduce((total, group) => total + group.sources.length, 0);
const siteNumber = new Map();
let number = 1;
jobSiteGroups.forEach((group) => group.sources.forEach(([name]) => siteNumber.set(`${group.id}:${name}`, number++)));

export default function JobSiteDirectory({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('all');
  const term = query.trim().toLowerCase();
  const matchingRole = term.length >= 3 ? searchableRoles.find((role) => role.toLowerCase().includes(term) || term.includes(role.toLowerCase())) : null;
  const visibleGroups = useMemo(() => jobSiteGroups
    .filter(() => !matchingRole)
    .filter((group) => category === 'all' || group.id === category)
    .map((group) => ({
      ...group,
      sources: group.sources.filter(([name, url, type]) => `${name} ${url} ${type} ${group.title}`.toLowerCase().includes(term)),
    }))
    .filter((group) => group.sources.length), [category, matchingRole, term]);
  const prioritySites = useMemo(() => {
    return priorityJobSites.flatMap((name) => {
      const candidates = sitesWithNumbers.filter((site) => site.name === name);
      const site = candidates.find((candidate) => category === 'all' || candidate.groupId === category);
      return site && `${site.name} ${site.type}`.toLowerCase().includes(term) ? [site] : [];
    });
  }, [category, term]);
  const resultCount = matchingRole ? 3 : visibleGroups.reduce((total, group) => total + group.sources.length, 0);
  const roleSearches = matchingRole ? [
    { name: 'LinkedIn Jobs', url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(matchingRole)}` },
    { name: 'Indeed India', url: `https://in.indeed.com/jobs?q=${encodeURIComponent(matchingRole)}` },
    { name: 'Naukri', url: `https://www.naukri.com/${matchingRole.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-jobs` },
  ] : [];

  return (
    <section className="job-directory" aria-label="Job and internship website directory">
      <div className="job-directory-heading">
        <div>
          <span className="eyebrow">{sourceCount} NATIONAL &amp; INTERNATIONAL SOURCES</span>
          <h2>Find your next opportunity</h2>
          <p>Browse India-focused job and internship platforms, international and remote roles, official company career portals, and government programs.</p>
        </div>
        <div className="directory-total"><BriefcaseBusiness size={18} /><span><b>{sourceCount}</b><small>job &amp; internship sources</small></span></div>
      </div>

      <label className="job-directory-search">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a website, company or opportunity type..." aria-label="Search job websites" />
        {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
        <span className="directory-count">{resultCount} results</span>
      </label>

      <div className="directory-filters" role="group" aria-label="Filter job websites">
        {categoryOptions.map(([value, label]) => <button key={value} className={category === value ? 'active' : ''} onClick={() => setCategory(value)}>{label}</button>)}
      </div>

      {!term && category === 'all' && <section className="priority-panel">
        <div className="priority-heading"><span className="priority-spark"><Sparkles size={16} /></span><div><h3>Start with these 15</h3><p>A practical shortlist across internships, job boards and company career pages.</p></div></div>
        <div className="priority-grid">{prioritySites.map((site) => <a className="priority-site" key={`${site.groupId}-${site.name}`} href={site.url} target="_blank" rel="noreferrer"><DirectoryLogo name={site.name} url={site.url} /><span>{site.name}</span><ExternalLink size={12} /></a>)}</div>
      </section>}

      {matchingRole && <section className="role-search-panel">
        <div><span className="eyebrow">SEARCHING FOR {matchingRole.toUpperCase()}</span><h3>See current results on job platforms</h3><p>These links search the selected role directly. Openings change frequently; confirm each listing with the employer before applying.</p></div>
        <div className="role-search-links">{roleSearches.map((site) => <a key={site.name} href={site.url} target="_blank" rel="noreferrer"><DirectoryLogo name={site.name} url={site.url} /><span>{site.name}</span><ExternalLink size={14} /></a>)}</div>
      </section>}

      {visibleGroups.length ? visibleGroups.map((group) => <section className="job-site-group" key={group.id}>
        <div className="job-site-group-heading"><div><h3>{group.title}</h3><p>{group.description}</p></div><span>{group.sources.length} websites</span></div>
        <div className="job-site-grid">{group.sources.map(([name, url, type]) => <article className="job-site-card" key={`${group.id}-${name}`}>
          <span className="job-site-number">{String(siteNumber.get(`${group.id}:${name}`)).padStart(2, '0')}</span>
          <DirectoryLogo name={name} url={url} />
          <div className="job-site-copy"><h4>{name}</h4><span>{type}</span></div>
          <a className="apply-here" href={url} target="_blank" rel="noreferrer">Apply here <ExternalLink size={13} /></a>
        </article>)}</div>
      </section>) : !matchingRole && <div className="directory-empty"><Search size={25} /><h3>No websites found</h3><p>Try another search or choose a different category.</p><button onClick={() => { setQuery(''); setCategory('all'); }}>Show all websites <ArrowRight size={14} /></button></div>}

      <aside className="job-directory-note"><ShieldCheck size={18} /><p><b>Apply safely.</b> These links take you to third-party platforms or official organization websites. Openings, eligibility and application processes can change—verify each role on the destination site. Some remote or international platforms may primarily target experienced professionals. Careerzoon does not claim these links are live vacancies.</p></aside>
    </section>
  );
}
