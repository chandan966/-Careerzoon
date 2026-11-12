import { useMemo } from 'react';
import { Building2, ExternalLink, Search } from 'lucide-react';
import CompanyLogo from './CompanyLogo.jsx';
import './CompanyDirectory.css';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });

export default function CompanyDirectory({
  companies,
  totalCompanies,
  sectors,
  query,
  onQueryChange,
  activeSector,
  onSectorChange,
  onOpen,
}) {
  const { sortedCompanies, groups, letters, companyNumbers } = useMemo(() => {
    const sorted = [...companies].sort((a, b) => collator.compare(a.name, b.name));
    const grouped = new Map();
    sorted.forEach((company) => {
      const firstCharacter = company.name.trim().charAt(0).toUpperCase();
      const letter = /^[A-Z]$/.test(firstCharacter) ? firstCharacter : '#';
      const list = grouped.get(letter);
      if (list) {
        list.push(company);
      } else {
        grouped.set(letter, [company]);
      }
    });
    const letterKeys = [...grouped.keys()];
    const numbers = new Map(sorted.map((company, index) => [company.name, index + 1]));
    return { sortedCompanies: sorted, groups: grouped, letters: letterKeys, companyNumbers: numbers };
  }, [companies]);

  function resetFilters() {
    onQueryChange('');
    onSectorChange('All companies');
  }

  return (
    <section className="job-directory company-directory" aria-label="Company directory">
      <div className="job-directory-heading">
        <div>
          <span className="eyebrow">COMPANY DIRECTORY</span>
          <h2>Explore companies</h2>
          <p>Browse company profiles alphabetically, compare technology sectors and visit official career websites.</p>
        </div>
        <div className="directory-total"><Building2 size={18} /><span><b>{totalCompanies}</b><small>companies</small></span></div>
      </div>

      <label className="job-directory-search">
        <Search size={18} />
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search companies, sectors or technology..." aria-label="Search companies" />
        {query && <button type="button" onClick={() => onQueryChange('')} aria-label="Clear search">×</button>}
        <span className="directory-count">{companies.length} {companies.length === 1 ? 'company' : 'companies'}</span>
      </label>

      <div className="directory-filters" role="group" aria-label="Filter companies by sector">
        {sectors.map((sector) => (
          <button key={sector} type="button" className={activeSector === sector ? 'active' : ''} onClick={() => onSectorChange(sector)}>
            {sector}
          </button>
        ))}
      </div>

      {companies.length ? <>
        {letters.map((letter) => {
          const letterCompanies = groups.get(letter);
          return (
            <section className="job-site-group company-letter-group" id={`company-letter-${letter.toLowerCase()}`} key={letter} aria-labelledby={`company-heading-${letter.toLowerCase()}`}>
              <div className="job-site-group-heading">
                <div><h3 id={`company-heading-${letter.toLowerCase()}`}>{letter === '#' ? '0–9' : letter}</h3></div>
                <span>{letterCompanies.length} {letterCompanies.length === 1 ? 'company' : 'companies'}</span>
              </div>
              <div className="job-site-grid">
                {letterCompanies.map((company) => (
                  <article className="job-site-card company-site-card" key={company.name}>
                    <span className="job-site-number">{String(companyNumbers.get(company.name)).padStart(3, '0')}</span>
                    <CompanyLogo company={company} />
                    <div className="job-site-copy"><h4>{company.name}</h4><span>{company.sector}</span></div>
                    <div className="company-site-actions">
                      <button type="button" className="company-profile-link" onClick={() => onOpen(company)}>Profile</button>
                      <a className="apply-here" href={company.url} target="_blank" rel="noopener noreferrer">
                        {company.hasCareerPortal === false ? 'Website' : 'Careers'} <ExternalLink size={13} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </> : <div className="directory-empty"><Search size={25} /><h3>No companies found</h3><p>Try a different search or choose another sector.</p><button type="button" onClick={resetFilters}>Show all companies</button></div>}

      <nav className="company-alphabet" aria-label="Browse companies by first letter">
        <span>Jump to</span>
        <div>{alphabet.map((letter) => letters.includes(letter)
          ? <a key={letter} href={`#company-letter-${letter.toLowerCase()}`} aria-label={`Companies starting with ${letter}`}>{letter}</a>
          : <span key={letter} className="company-letter-disabled" aria-disabled="true">{letter}</span>)}</div>
      </nav>
    </section>
  );
}
