import { useMemo } from 'react';
import { ArrowRight, Award, BookOpen, CheckCircle2, Code2, ExternalLink, GraduationCap, Lightbulb, Search, ShieldCheck, Sparkles } from 'lucide-react';
import DirectoryLogo from './DirectoryLogo.jsx';
import SkillLogo from './SkillLogo.jsx';
import {
  certificateOptions,
  internshipSkillPaths,
  learningPlatforms,
  projectIdeas,
  recommendedLearningPlan,
} from '../data/skillDirectory.js';
import './SkillDirectory.css';

export default function SkillDirectory({
  skills,
  totalSkills,
  categories,
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
  onOpen,
}) {
  const groupedSkills = useMemo(() => {
    const groups = new Map();
    skills.forEach((skill) => {
      if (!groups.has(skill.category)) groups.set(skill.category, []);
      groups.get(skill.category).push(skill);
    });
    return [...groups.entries()].map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.title.localeCompare(b.title)),
    }));
  }, [skills]);

  return (
    <section className="job-directory skill-directory" aria-label="Technology skills directory">
      <div className="job-directory-heading">
        <div>
          <span className="eyebrow">{totalSkills} SKILL AREAS</span>
          <h2>Explore skills for a career in tech</h2>
          <p>Browse practical learning paths across programming, web development, data, AI, security, cloud and more. Each skill links to a free or official learning resource.</p>
        </div>
        <div className="directory-total"><Code2 size={18} /><span><b>{totalSkills}</b><small>skills to explore</small></span></div>
      </div>

      <label className="job-directory-search">
        <Search size={18} />
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search a skill, technology or career area..." aria-label="Search skills" />
        {query && <button type="button" onClick={() => onQueryChange('')} aria-label="Clear search">×</button>}
        <span className="directory-count">{skills.length} results</span>
      </label>

      <div className="directory-filters" role="group" aria-label="Filter skills by category">
        {['All skills', ...categories].map((category) => <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => onCategoryChange(category)}>{category}</button>)}
      </div>

      {groupedSkills.length ? groupedSkills.map(({ category, items }) => (
        <section className="job-site-group skill-group" key={category}>
          <div className="job-site-group-heading"><div><h3>{category}</h3><p>Learning resources and skill guides</p></div><span>{items.length} skills</span></div>
          <div className="job-site-grid">
            {items.map((skill, index) => (
              <article className="job-site-card skill-card" key={skill.title}>
                <SkillLogo name={skill.title} index={index} />
                <div className="job-site-copy">
                  <h4>{skill.title}</h4>
                  <span>{skill.level && skill.level !== 'Varies by topic' ? `${skill.level} · ${skill.time}` : 'Explore the learning guide'}</span>
                  <p>{skill.description}</p>
                </div>
                <div className="skill-card-actions">
                  <button type="button" className="apply-here skill-details" onClick={() => onOpen(skill)}>Details <ArrowRight size={13} /></button>
                  <a className="apply-here" href={skill.resourceUrl} target="_blank" rel="noreferrer">Open resource <ExternalLink size={13} /></a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )) : <div className="directory-empty"><Search size={25} /><h3>No skills found</h3><p>Try another search or choose a different category.</p><button onClick={() => { onQueryChange(''); onCategoryChange('All skills'); }}>Show all skills <ArrowRight size={14} /></button></div>}

      <section className="skill-guide-section">
        <div className="skill-section-heading"><span className="priority-spark"><Sparkles size={16} /></span><div><h2>Free learning platforms</h2><p>Explore trusted resources for building technical foundations and practical projects.</p></div></div>
        <div className="skill-platform-grid">{learningPlatforms.map(([name, focus, url]) => <a className="skill-platform-card" key={name} href={url} target="_blank" rel="noreferrer"><DirectoryLogo name={name} url={url} /><span><b>{name}</b><small>{focus}</small></span><ExternalLink size={13} /></a>)}</div>
      </section>

      <section className="skill-guide-section">
        <div className="skill-section-heading"><span className="priority-spark"><GraduationCap size={16} /></span><div><h2>Internship skill paths for CS/CSE &amp; IT students</h2><p>Examples for B.Tech Computer Science, Computer Engineering and IT students. Check the requirements and eligibility on each actual listing.</p></div></div>
        <div className="skill-advice-grid">{internshipSkillPaths.map(([role, skillsRequired, level]) => <article className="skill-advice-card" key={role}><span>{level}</span><h3>{role}</h3><p>{skillsRequired}</p></article>)}</div>
      </section>

      <section className="skill-guide-section">
        <div className="skill-section-heading"><span className="priority-spark"><Lightbulb size={16} /></span><div><h2>Suggested 10-step learning plan</h2><p>A flexible example for students; adjust the sequence and pace to your target role.</p></div></div>
        <div className="skill-plan-grid">{recommendedLearningPlan.map(([topic, duration, outcome], index) => <article className="skill-plan-card" key={topic}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{topic}</h3><p>{outcome}</p></div><small>{duration}</small></article>)}</div>
      </section>

      <section className="skill-guide-section">
        <div className="skill-section-heading"><span className="priority-spark"><Code2 size={16} /></span><div><h2>Portfolio project ideas</h2><p>Choose projects that demonstrate your reasoning, documentation and ability to finish useful work.</p></div></div>
        <div className="skill-advice-grid">{projectIdeas.map(([name, stack, level]) => <article className="skill-advice-card" key={name}><span>{level}</span><h3>{name}</h3><p>{stack}</p></article>)}</div>
      </section>

      <section className="skill-guide-section">
        <div className="skill-section-heading"><span className="priority-spark"><Award size={16} /></span><div><h2>Certificates and badges</h2><p>Check current fees and assessment requirements with each provider; a credential complements, but does not replace, project work.</p></div></div>
        <div className="skill-certificate-grid">{certificateOptions.map(([provider, credential, cost]) => <article className="skill-certificate-card" key={provider}><Award size={16} /><div><h3>{provider}</h3><p>{credential}</p></div><span>{cost}</span></article>)}</div>
      </section>

      <aside className="job-directory-note skill-career-note"><ShieldCheck size={18} /><p><b>A practical career strategy.</b> Choose one primary career and one secondary skill, learn the foundations in order, build and document quality projects, get feedback, prepare a clear resume and apply through verified sources. Do not pay to apply, and never present a course certificate as work experience.</p></aside>
      <section className="skill-guide-section">
        <div className="skill-section-heading"><span className="priority-spark"><CheckCircle2 size={16} /></span><div><h2>Example focus: Full Stack Developer</h2><p>A starting point from the guide; tailor it to your interests, experience and opportunities.</p></div></div>
        <div className="skill-focus-grid">
          {[
            ['Primary career', 'Full Stack Developer'],
            ['Secondary skill', 'Python'],
            ['Programming', 'JavaScript, Python'],
            ['Frontend', 'React, HTML, CSS'],
            ['Backend', 'Node.js, Express'],
            ['Database', 'MySQL, PostgreSQL'],
            ['Tools', 'Git, GitHub, Postman'],
            ['Additional', 'DSA, SQL, REST APIs'],
            ['Deployment', 'Vercel, Docker, cloud basics'],
            ['Portfolio', '3–5 quality projects'],
          ].map(([label, focus]) => <article className="skill-focus-card" key={label}><span>{label}</span><b>{focus}</b></article>)}
        </div>
      </section>
      <div className="skill-directory-footer"><BookOpen size={15} /><span>Start with fundamentals, practice consistently, and revisit your learning plan as your interests grow.</span></div>
    </section>
  );
}
