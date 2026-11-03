import { ArrowRight, Bookmark, Clock3, ExternalLink, GraduationCap, Sparkles } from 'lucide-react';
import { BrainCircuit, Building2, ChartNoAxesCombined, CheckCircle2, Cloud, Code2, Coffee, Database, GraduationCap as GraduationIcon, Layers3, PanelsTopLeft, Rocket, Search, Server, ShieldCheck, Shield, BookOpen, BriefcaseBusiness, FileText } from 'lucide-react';

const iconMap = { BrainCircuit, Building2, ChartNoAxesCombined, CheckCircle2, Cloud, Code2, Coffee, Database, GraduationCap: GraduationIcon, Layers3, PanelsTopLeft, Rocket, Search, Server, ShieldCheck, Shield, BookOpen, BriefcaseBusiness, FileText };

export default function FeatureCard({ item, type, saved, onBookmark, onOpen }) {
  const Icon = iconMap[item.icon] || Sparkles;
  return (
    <article className="feature-card">
      <div className="feature-card-top">
        <span className={`feature-icon ${item.color || 'violet'}`}><Icon size={20} /></span>
        {onBookmark && <button className={`bookmark-btn ${saved ? 'saved' : ''}`} onClick={() => onBookmark(item.title)} aria-label={`${saved ? 'Remove' : 'Save'} ${item.title}`}>{saved ? 'Saved' : <Bookmark size={16} />}</button>}
        {item.level && <span className="level-pill">{item.level}</span>}
        {item.sector && <span className="level-pill">{item.sector}</span>}
        {item.type && !item.level && !item.sector && <span className="level-pill">{item.type}</span>}
      </div>
      <h3>{item.title || item.name}</h3>
      <p>{item.description || item.detail}</p>
      {item.skills && <div className="tag-row">{item.skills.slice(0, 3).map((skill) => <span className="tag" key={skill}>{skill}</span>)}{item.skills.length > 3 && <span className="tag">+{item.skills.length - 3}</span>}</div>}
      {item.topics && <div className="card-meta"><span><Clock3 size={14} />{item.time}</span><span><GraduationCap size={14} />{item.topics.length} steps</span></div>}
      {item.time && !item.topics && <div className="card-meta"><span><Clock3 size={14} />{item.time}</span></div>}
      {item.salary && <div className="salary-line">Indicative India range <strong>{item.salary}</strong></div>}
      <div className="card-bottom">
        {item.url ? <div className="card-actions">{type === 'company' && onOpen && <button className="card-link" onClick={() => onOpen(item)}>Company profile <ArrowRight size={14} /></button>}<a href={item.url} target="_blank" rel="noreferrer" className="card-link">Visit official site <ExternalLink size={14} /></a></div> : <button className="card-link" onClick={() => onOpen?.(item)}>{type === 'roadmap' ? 'Start this roadmap' : type === 'skill' ? 'Explore skill' : 'Explore career'} <ArrowRight size={14} /></button>}
      </div>
    </article>
  );
}
