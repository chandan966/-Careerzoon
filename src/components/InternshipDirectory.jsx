import { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, GraduationCap, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { internshipSiteGroups, priorityInternshipSites } from '../data/internshipSites.js';
import DirectoryLogo from './DirectoryLogo.jsx';
import './JobSiteDirectory.css';
import './InternshipDirectory.css';

const sourceCount = internshipSiteGroups.reduce((count, group) => count + group.sites.length, 0);
const priorityTargetByName = new Map(priorityInternshipSites);

export default function InternshipDirectory({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('all');
  const term = query.trim().toLowerCase();
  const visibleGroups = useMemo(() => internshipSiteGroups
    .filter((group) => category === 'all' || group.id === category)
    .map((group) => ({
      ...group,
      sites: group.sites.filter(([name, url, bestFor]) => `${name} ${url} ${bestFor} ${priorityTargetByName.get(name) || ''} ${group.title}`.toLowerCase().includes(term)),
    }))
    .filter((group) => group.sites.length), [category, term]);
  const resultCount = visibleGroups.reduce((count, group) => count + group.sites.length, 0);

  function resetFilters() {
    setQuery('');
    setCategory('all');
  }

  return (
    <section className="job-directory internship-directory" aria-label="Internship platform directory">
      <div className="job-directory-heading">
        <div>
          <span className="eyebrow">{sourceCount} INTERNSHIP PLATFORMS</span>
          <h2>Find the right internship opportunity</h2>
          <p>Explore student-focused platforms in India and internationally. Check current availability, eligibility and application details on each platform.</p>
        </div>
        <div className="directory-total"><GraduationCap size={19} /><span><b>{sourceCount}</b><small>internship platforms</small></span></div>
      </div>

      <label className="job-directory-search">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search platforms or internship types..." aria-label="Search internship platforms" />
        {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
        <span className="directory-count">{resultCount} results</span>
      </label>

      <div className="directory-filters" role="group" aria-label="Filter internship platforms">
        <button type="button" className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>All platforms</button>
        {internshipSiteGroups.map((group) => <button type="button" key={group.id} className={category === group.id ? 'active' : ''} onClick={() => setCategory(group.id)}>{group.id === 'india' ? 'India & student platforms' : 'International platforms'}</button>)}
      </div>

      {!term && category === 'all' && <section className="priority-panel internship-priority-panel">
        <div className="priority-heading"><span className="priority-spark"><Sparkles size={16} /></span><div><h3>Top 10 for B.Tech Computer Science (CS/CSE) &amp; IT students</h3><p>Prioritized for computer science and IT students seeking technical internships, startup experience and international opportunities.</p></div></div>
        <div className="internship-priority-grid">
          {priorityInternshipSites.map(([name, target], index) => {
            const site = internshipSiteGroups.flatMap((group) => group.sites).find(([siteName]) => siteName === name);
            if (!site) return null;
            const [siteName, url] = site;
            return <a className="internship-priority-card" key={name} href={url} target="_blank" rel="noopener noreferrer">
              <span className="job-site-number">{String(index + 1).padStart(2, '0')}</span>
              <DirectoryLogo name={siteName} url={url} />
              <span className="internship-priority-copy"><b>{siteName}</b><small>{target}</small></span>
              <ExternalLink size={13} />
            </a>;
          })}
        </div>
      </section>}

      {visibleGroups.length ? visibleGroups.map((group) => <section className="job-site-group" key={group.id}>
        <div className="job-site-group-heading"><div><h3>{group.title}</h3><p>{group.description}</p></div><span>{group.sites.length} platforms</span></div>
        <div className="job-site-grid">{group.sites.map(([name, url, bestFor]) => <article className="job-site-card internship-site-card" key={`${group.id}-${name}`}>
          <span className="job-site-number">{String(internshipSiteGroups.flatMap((item) => item.sites).findIndex((site) => site[0] === name) + 1).padStart(2, '0')}</span>
          <DirectoryLogo name={name} url={url} />
          <div className="job-site-copy"><h4>{name}</h4><span>{bestFor}</span></div>
          <a className="apply-here" href={url} target="_blank" rel="noopener noreferrer">Visit site <ExternalLink size={13} /></a>
        </article>)}</div>
      </section>) : <div className="directory-empty"><Search size={25} /><h3>No internship platforms found</h3><p>Try a different search or browse all platforms.</p><button type="button" onClick={resetFilters}>Show all platforms <ArrowRight size={14} /></button></div>}

      <aside className="job-directory-note"><ShieldCheck size={18} /><p><b>Apply safely.</b> These links open third-party platforms. Internship listings and eligibility can change; verify the employer, role and application details before sharing personal information. Some international platforms may be country-specific. Careerzoon does not claim these links are live vacancies.</p></aside>
    </section>
  );
}
