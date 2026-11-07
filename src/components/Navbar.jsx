import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, ChevronDown, Command, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { navigation, searchItems } from '../data/content.js';
import './Navbar.css';

export default function Navbar({ darkMode, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const term = query.toLowerCase();
    return searchItems.filter((item) => `${item.title} ${item.type} ${item.description}`.toLowerCase().includes(term)).slice(0, 6);
  }, [query]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  function chooseResult(path) {
    navigate(path);
    setQuery('');
    setSearchOpen(false);
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" to="/" aria-label="Careerzoon home" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><BriefcaseBusiness size={19} strokeWidth={2.5} /></span>
          <span>career<span className="brand-accent">zoon</span></span>
        </Link>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="icon-btn search-trigger" aria-label={searchOpen ? 'Close search' : 'Open search'} aria-expanded={searchOpen} onClick={() => setSearchOpen(!searchOpen)}><Search size={19} /></button>
          <button className="icon-btn theme-toggle" aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`} onClick={onToggleTheme}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button className="mobile-menu-btn" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </div>
      {searchOpen && (
        <div className="search-layer">
          <button className="search-backdrop" aria-label="Close search" onClick={() => setSearchOpen(false)} />
          <div className="search-panel" role="dialog" aria-modal="true" aria-label="Search Careerzoon">
            <div className="global-search">
              <Search size={20} />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') setSearchOpen(false); if (event.key === 'Enter' && results[0]) chooseResult(results[0].path); }} placeholder="Search careers, skills, roadmaps..." aria-label="Search Careerzoon" />
              <kbd>ESC</kbd>
              <button className="search-close" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={18} /></button>
            </div>
            <div className="search-results">
              {query.trim().length < 2 ? <div className="search-hint"><Command size={16} /> Try “frontend”, “Python” or “interview”</div> : results.length ? results.map((item) => (
                <button key={`${item.type}-${item.title}`} className="search-result" onClick={() => chooseResult(item.path)}>
                  <span className="search-result-icon"><Search size={15} /></span><span className="search-result-copy"><strong>{item.title}</strong><small>{item.description}</small></span><span className="search-type">{item.type}</span><ArrowRight size={15} />
                </button>
              )) : <div className="search-empty">No matches found. Try a broader search.</div>}
            </div>
          </div>
        </div>



      )}
    </header>
  );
}
