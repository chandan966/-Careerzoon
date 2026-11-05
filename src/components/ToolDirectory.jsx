import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronDown, GitCompareArrows, Search, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { softwareToolCategories, softwareTools } from '../data/softwareTools.js';
import ToolLogo from './ToolLogo.jsx';
import './ToolDirectory.css';

function readList(key) {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function ToolCard({ item, saved, comparing, compareSlugs, onToggleSave, onToggleCompare }) {
  return <article className="tool-directory-card">
    <div className="tool-card-top"><ToolLogo tool={item} /><span className="tool-difficulty">{item.difficulty}</span></div>
    <Link className="tool-card-title" to={`/tools/${item.slug}`}><h3>{item.name}</h3><ArrowRight size={15} /></Link>
    <span className="tool-card-category">{item.category}</span>
    <p>{item.description}</p>
    <div className="tool-card-meta"><span>{item.pricing}</span><span>{item.platforms.join(' · ')}</span></div>
    <div className="tool-card-actions">
      <Link className="tool-card-open" to={`/tools/${item.slug}`}>Explore tool <ArrowRight size={14} /></Link>
      <button type="button" className={saved ? 'is-selected' : ''} onClick={() => onToggleSave(item.slug)} aria-label={`${saved ? 'Remove bookmark for' : 'Bookmark'} ${item.name}`} title={saved ? 'Remove bookmark' : 'Bookmark tool'}><Star size={16} fill={saved ? 'currentColor' : 'none'} /></button>
      <label className={comparing ? 'is-selected' : ''} title={comparing ? 'Remove from comparison' : 'Add to comparison'}><input type="checkbox" checked={comparing} disabled={!comparing && compareSlugs.length === 2} onChange={() => onToggleCompare(item.slug)} aria-label={`Compare ${item.name}`} /><GitCompareArrows size={15} /></label>
    </div>
  </article>;
}

export default function ToolDirectory() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All categories');
  const [platform, setPlatform] = useState('Any platform');
  const [price, setPrice] = useState('Any pricing');
  const [difficulty, setDifficulty] = useState('Any level');
  const [bookmarks, setBookmarks] = useState(() => readList('careerzoon-tool-bookmarks'));
  const [recent] = useState(() => readList('careerzoon-tool-recent'));
  const [compareSlugs, setCompareSlugs] = useState([]);
  const filteredTools = useMemo(() => softwareTools.filter((item) => {
    const matchesText = `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesCategory = activeCategory === 'All categories' || item.category === activeCategory;
    const matchesPlatform = platform === 'Any platform' || item.platforms.includes(platform);
    const matchesPrice = price === 'Any pricing'
      || (price === 'Free options' && /free|open source/i.test(item.pricing))
      || (price === 'Paid options' && /paid|commercial|usage-based/i.test(item.pricing));
    const matchesDifficulty = difficulty === 'Any level' || item.difficulty === difficulty;
    return matchesText && matchesCategory && matchesPlatform && matchesPrice && matchesDifficulty;
  }), [activeCategory, difficulty, platform, price, query]);
  const comparison = softwareTools.filter((item) => compareSlugs.includes(item.slug));
  const recentlyViewed = recent.map((slug) => softwareTools.find((item) => item.slug === slug)).filter(Boolean);

  function toggleBookmark(slug) {
    const next = bookmarks.includes(slug) ? bookmarks.filter((item) => item !== slug) : [...bookmarks, slug];
    setBookmarks(next);
    localStorage.setItem('careerzoon-tool-bookmarks', JSON.stringify(next));
  }
  function toggleCompare(slug) {
    setCompareSlugs((current) => current.includes(slug)
      ? current.filter((item) => item !== slug)
      : current.length < 2 ? [...current, slug] : current);
  }
  function clearFilters() {
    setQuery('');
    setActiveCategory('All categories');
    setPlatform('Any platform');
    setPrice('Any pricing');
    setDifficulty('Any level');
  }

  return <div className="tool-directory">
    <div className="tool-directory-heading">
      <div><span className="eyebrow">SOFTWARE TOOLS DIRECTORY</span><h2>Find the right tool. Learn it step by step.</h2><p>Browse official downloads, setup instructions, practical projects, documentation, and alternatives. Always check the vendor for current system requirements and pricing.</p></div>
      <div className="tool-directory-count"><b>{softwareTools.length}</b><span>tools</span><b>{softwareToolCategories.length}</b><span>categories</span></div>
    </div>

    <div className="tool-directory-controls">
      <label className="tool-directory-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools, categories, or uses..." aria-label="Search software tools" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={15} /></button>}</label>
      {[
        ['Category', activeCategory, setActiveCategory, ['All categories', ...softwareToolCategories.map((item) => item.name)]],
        ['Platform', platform, setPlatform, ['Any platform', 'Windows', 'macOS', 'Linux', 'Web']],
        ['Pricing', price, setPrice, ['Any pricing', 'Free options', 'Paid options']],
        ['Level', difficulty, setDifficulty, ['Any level', 'Beginner', 'Beginner to intermediate', 'Beginner to advanced', 'Intermediate to advanced']],
      ].map(([label, value, setter, options]) => <label className="tool-directory-filter" key={label}><span>{label}</span><select value={value} onChange={(event) => setter(event.target.value)} aria-label={`Filter tools by ${label.toLowerCase()}`}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={13} /></label>)}
      <button type="button" className="tool-filter-reset" onClick={clearFilters}>Clear filters</button>
    </div>
    <div className="tool-directory-results"><span><b>{filteredTools.length}</b> matching tools</span><span>Compare up to 2 tools</span></div>

    <div className="tool-category-pills" aria-label="Tool categories">
      <button type="button" className={activeCategory === 'All categories' ? 'active' : ''} onClick={() => setActiveCategory('All categories')}>All tools <span>{softwareTools.length}</span></button>
      {softwareToolCategories.map((category) => <button key={category.name} type="button" className={activeCategory === category.name ? 'active' : ''} onClick={() => setActiveCategory(category.name)}>{category.name}<span>{category.tools.length}</span></button>)}
    </div>

    {bookmarks.length > 0 && <section className="tool-quick-shelf"><div><Star size={15} /><h3>Bookmarked tools</h3></div><div>{softwareTools.filter((item) => bookmarks.includes(item.slug)).map((item) => <Link key={item.slug} to={`/tools/${item.slug}`}>{item.name}<ArrowRight size={12} /></Link>)}</div></section>}
    {recentlyViewed.length > 0 && <section className="tool-quick-shelf"><div><BookOpen size={15} /><h3>Recently viewed</h3></div><div>{recentlyViewed.map((item) => <Link key={item.slug} to={`/tools/${item.slug}`}>{item.name}<ArrowRight size={12} /></Link>)}</div></section>}

    {filteredTools.length ? <div className="tool-directory-grid">{filteredTools.map((item) => <ToolCard key={item.slug} item={item} saved={bookmarks.includes(item.slug)} comparing={compareSlugs.includes(item.slug)} compareSlugs={compareSlugs} onToggleSave={toggleBookmark} onToggleCompare={toggleCompare} />)}</div>
      : <div className="tool-directory-empty"><Search size={22} /><b>No tools match these filters</b><span>Try a different search or clear the selected filters.</span><button type="button" onClick={clearFilters}>Show all tools</button></div>}

    {comparison.length > 0 && <section className="tool-compare-panel">
      <div className="tool-compare-heading"><div><GitCompareArrows size={17} /><h3>Compare tools <small>{comparison.length}/2</small></h3></div><button type="button" onClick={() => setCompareSlugs([])} aria-label="Clear comparison"><X size={16} /></button></div>
      {comparison.length < 2 && <p>Select one more tool to compare categories, platforms, pricing, and learning levels.</p>}
      <div className="tool-compare-grid">{comparison.map((item) => <article key={item.slug}><ToolLogo tool={item} /><h4>{item.name}</h4><dl><dt>Category</dt><dd>{item.category}</dd><dt>Platforms</dt><dd>{item.platforms.join(', ')}</dd><dt>Difficulty</dt><dd>{item.difficulty}</dd><dt>Pricing</dt><dd>{item.pricing}</dd></dl><Link to={`/tools/${item.slug}`}>View guide <ArrowRight size={13} /></Link></article>)}</div>
    </section>}
    <p className="tool-directory-note"><Check size={14} /> Careerzoon links to official vendor pages; software is not hosted here. Features, pricing, and requirements can change.</p>
  </div>;
}
