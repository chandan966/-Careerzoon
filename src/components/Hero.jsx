import { useState } from 'react';
import { ArrowDownRight, ArrowRight, BriefcaseBusiness, Check, Code2, Compass, GraduationCap, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const orbitRoles = [
  { className: 'orbit-frontend', icon: Code2, label: 'Frontend dev', color: 'purple' },
  { className: 'orbit-data', icon: Sparkles, label: 'Data analyst', color: 'blue' },
  { className: 'orbit-cloud', icon: BriefcaseBusiness, label: 'Cloud engineer', color: 'green' },
];

export default function Hero() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  function search(event) {
    event.preventDefault();
    navigate(`/jobs${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  }

  return (
    <section className="hero">
      <div className="hero-bg-grid" />
      <div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" />
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="kicker-spark"><Sparkles size={13} /></span> YOUR NEXT CHAPTER STARTS HERE</div>
          <h1>Build your future<br />in <span>technology.</span></h1>
          <p className="hero-subtitle">Discover IT careers, explore internships, master in-demand skills, and prepare for your dream job with Careerzoon.</p>
          <form className="hero-search" onSubmit={search}>
            <Search size={19} />
            <input aria-label="Search jobs and internships" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Job title, skill, or company" />
            <button type="submit">Find opportunities <ArrowRight size={16} /></button>
          </form>
          <div className="hero-actions">
            <button className="hero-link primary" onClick={() => navigate('/careers')}>Explore careers <ArrowRight size={16} /></button>
            <button className="hero-link secondary" onClick={() => navigate('/roadmaps')}>Browse roadmaps <ArrowDownRight size={16} /></button>
          </div>
          <div className="hero-proof"><span className="proof-avatars"><i>C</i><i>R</i><i>A</i><i>+</i></span><span>Made for learners building what’s next</span><span className="proof-check"><Check size={12} /></span></div>
        </div>
        <div className="hero-art" aria-label="Illustration of technology career paths">
          <div className="art-orbit orbit-outer" /><div className="art-orbit orbit-inner" />
          <div className="art-center">
            <div className="art-window"><div className="window-top"><span /><span /><span /><small>your-next-role.dev</small></div><div className="window-code"><span className="code-muted">01</span> <b>const</b> <strong>future</strong> = <em>“yours”</em>;<br /><span className="code-muted">02</span> <b>skills</b>.<strong>build</strong><span>( )</span><br /><span className="code-muted">03</span> <b>career</b>.<strong>launch</strong><span>(↗)</span><br /><span className="code-muted">04</span> <i>// let's make it happen</i></div></div>
            <div className="art-plant">✳</div>
          </div>
          {orbitRoles.map(({ className, icon: Icon, label, color }) => <div className={`orbit-chip ${className}`} key={label}><span className={`chip-icon ${color}`}><Icon size={16} /></span><span>{label}</span></div>)}
          <div className="art-note"><span className="note-icon"><Compass size={18} /></span><span><b>Your path, your pace</b><small>One step at a time</small></span></div>
          <div className="art-stat"><span className="stat-icon"><GraduationCap size={18} /></span><span><b>Learn by doing</b><small>Build real projects</small></span></div>
        </div>
      </div>
      <div className="hero-bottom"><span>YOUR CAREER TOOLKIT</span><div className="hero-bottom-line" /><span>Explore · Learn · Launch</span></div>
    </section>
  );
}
