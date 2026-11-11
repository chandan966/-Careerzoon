import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Check, Clock3, Download, ExternalLink, GraduationCap, Search, Sparkles, X } from 'lucide-react';
import SkillLogo from './SkillLogo.jsx';
import { roadmapCareerPaths } from '../data/roadmapCareerPaths.js';
import {
  roadmap2026CareerDirection,
  roadmap2026DailyRoutine,
  roadmap2026Months,
  roadmap2026PracticePlatforms,
  roadmap2026Priorities,
  roadmap2026Skills,
} from '../data/roadmap2026.js';
import {
  additionalRoadmapSkills,
  roadmap2026AdditionalPlatforms,
  roadmap2026DomainPriorities,
} from '../data/roadmap2026Additional.js';
import './Roadmap2026.css';

const normalizedSkillTitle = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const careerPathAliases = {
  'Data Analytics': ['Data Analysis'],
  'Generative AI & LLM Development': ['Generative AI', 'LLM Development'],
  'DevOps Engineering': ['DevOps'],
  'Flutter Development': ['Flutter'],
  'Software Testing & QA': ['Software Testing'],
  'IoT & Embedded Systems': ['IoT Development', 'Embedded Systems'],
};
const replacedSkillTitles = new Set(roadmapCareerPaths.flatMap((item) => [
  item.skill,
  ...(careerPathAliases[item.skill] || []),
]).map(normalizedSkillTitle));
const careerPathSkills = roadmapCareerPaths.map((item, index) => ({
    ...item,
    number: index + 1,
    details: true,
  }));
const existingRoadmapSkills = [
  ...roadmap2026Skills,
  ...additionalRoadmapSkills.map(([skill, category, roadmap, url], index) => ({
    number: index + 1,
    skill,
    category,
    roadmap,
    url,
  })),
].filter((item) => !replacedSkillTitles.has(normalizedSkillTitle(item.skill)));
const allRoadmapSkills = [...careerPathSkills, ...existingRoadmapSkills]
  .map((item, index) => ({ ...item, number: index + 1 }));
const roadmapCategoryCount = new Set(allRoadmapSkills.map((item) => item.category)).size;

export default function Roadmap2026() {
  const [query, setQuery] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);
  const [downloadError, setDownloadError] = useState('');
  const { matchingCareerPaths, groups } = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = ({ skill, category, roadmap, description = '' }) => `${skill} ${category} ${roadmap} ${description}`.toLowerCase().includes(term);
    const matchingCareerPaths = careerPathSkills.filter(matches);
    const matching = existingRoadmapSkills.filter(matches);
    const grouped = new Map();
    matching.forEach((item) => {
      if (!grouped.has(item.category)) grouped.set(item.category, []);
      grouped.get(item.category).push(item);
    });
    return { matchingCareerPaths, groups: [...grouped.entries()] };
  }, [query]);
  const visibleCount = matchingCareerPaths.length + groups.reduce((count, [, entries]) => count + entries.length, 0);

  async function downloadCareerRoadmaps() {
    setDownloadError('');
    try {
      const [{ jsPDF }, { default: guide }] = await Promise.all([
        import('jspdf'),
        import('../data/career-roadmap-guide.md?raw'),
      ]);
      const pdf = new jsPDF();
      const margin = 16;
      const maxWidth = 178;
      const pageBottom = 280;
      let y = 20;

      const addText = (text, size = 9, bold = false, color = [47, 55, 75], indent = 0) => {
        pdf.setFont('helvetica', bold ? 'bold' : 'normal');
        pdf.setFontSize(size);
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(String(text || ' '), maxWidth - indent);
        const lineHeight = size * 0.5;
        if (y + lines.length * lineHeight > pageBottom) {
          pdf.addPage();
          y = 18;
        }
        pdf.text(lines, margin + indent, y);
        y += lines.length * lineHeight + 2;
      };
      const formatMarkdown = (text) => text
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
        .replace(/\*\*(.*?)\*\*|__(.*?)__/g, '$1$2')
        .replace(/\*(.*?)\*|_(.*?)_/g, '$1$2')
        .replace(/~~(.*?)~~|`([^`]+)`/g, '$1$2')
        .replace(/[–—]/g, '-')
        .replace(/→/g, '->')
        .replace(/↓/g, 'v')
        .replace(/•/g, '-')
        .replace(/[^\u0000-\u00ff]/g, '');

      addText('Careerzoon: 25 Complete CS & IT Career Roadmaps', 18, true, [111, 63, 189]);
      addText('A step-by-step guide with suggested timelines, tools, projects, and learning resources.', 9, false, [95, 105, 120]);
      y += 3;

      roadmapCareerPaths.forEach((path, pathIndex) => {
        addText(`${String(pathIndex + 1).padStart(2, '0')}. ${path.skill}`, 13, true, [47, 55, 75]);
        addText(path.category, 9, true, [111, 63, 189]);
        addText(path.description);
        addText(`Career direction: ${path.career}  |  Duration: ${path.duration}  |  Level: ${path.difficulty}`);
        addText('Learning steps', 10, true, [111, 63, 189]);
        path.topics.forEach(([topic, duration, detail], topicIndex) => {
          addText(`${topicIndex + 1}. ${topic} (${duration})`, 9, true, [47, 55, 75], 3);
          addText(detail, 8, false, [75, 85, 100], 6);
        });
        addText(`Recommended tools: ${path.tools.join(', ')}`, 8);
        addText(`Practical projects: ${path.projects.join('; ')}`, 8);
        addText(`Learning resources: ${path.resources.map(([name, url]) => `${name} - ${url}`).join('; ')}`, 8);
        y += 5;
      });

      pdf.addPage();
      y = 20;
      addText('Complete 25-Skill Learning Guide', 18, true, [111, 63, 189]);
      addText('Full guide provided by the user, with its learning order, timelines, skill paths, projects, and recommendations.', 9, false, [95, 105, 120]);
      y += 3;

      let inCodeBlock = false;
      guide.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          return;
        }
        if (!trimmed) {
          y += 2;
          return;
        }
        if (/^[-*_]{3,}$/.test(trimmed)) {
          y += 2;
          return;
        }
        const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (heading) {
          const level = heading[1].length;
          addText(formatMarkdown(heading[2]), level === 1 ? 14 : level === 2 ? 11 : 9, true, [111, 63, 189]);
          y += 2;
          return;
        }
        if (trimmed.startsWith('|')) {
          if (/^\|?\s*:?-{3,}/.test(trimmed)) return;
          addText(formatMarkdown(trimmed.split('|').filter(Boolean).join('  |  ')), 8, false, [47, 55, 75], 3);
          return;
        }
        const listItem = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.+)$/);
        if (listItem) {
          const indent = 4 + Math.min(listItem[1].length, 8) * 2;
          const marker = /^\d/.test(listItem[2]) ? `${listItem[2]} ` : '- ';
          addText(`${marker}${formatMarkdown(listItem[3])}`, inCodeBlock ? 8 : 9, false, [47, 55, 75], indent);
          return;
        }
        const quote = trimmed.match(/^>\s?(.*)$/);
        if (quote) {
          addText(formatMarkdown(quote[1]), 8, false, [95, 105, 120], 5);
          return;
        }
        addText(formatMarkdown(trimmed), inCodeBlock ? 8 : 9, false, inCodeBlock ? [95, 105, 120] : [47, 55, 75], inCodeBlock ? 5 : 0);
      });

      const pageCount = pdf.getNumberOfPages();
      for (let page = 1; page <= pageCount; page += 1) {
        pdf.setPage(page);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(125, 130, 140);
        pdf.text(`Careerzoon | ${page} of ${pageCount}`, 194, 289, { align: 'right' });
      }

      pdf.save('careerzoon-25-career-roadmaps.pdf');
    } catch (error) {
      console.error('Unable to generate the career roadmap PDF.', error);
      setDownloadError('The PDF could not be created. Please try again.');
    }
  }

  const renderSkillCard = (item) => (
    <article className={`roadmap-2026-skill-card${item.details ? ' has-roadmap-details' : ''}`} key={`${item.number}-${item.skill}`}>
      <span className="roadmap-2026-card-mark"><SkillLogo name={item.skill} index={item.number} /><span className="roadmap-2026-number">{String(item.number).padStart(2, '0')}</span></span>
      <div><h4>{item.skill}</h4>{item.details && <p className="roadmap-2026-description">{item.description}</p>}<p className="roadmap-2026-path">{item.roadmap}</p>{item.details && <button className="roadmap-2026-detail-button" type="button" onClick={() => setSelectedPath(item)}>Explore full roadmap <ArrowRight size={13} /></button>}</div>
      <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Learn ${item.skill}`} title={`Open ${item.skill} learning resource`}><ExternalLink size={15} /></a>
    </article>
  );

  return (
    <section className="roadmap-2026" aria-labelledby="roadmap-2026-title">
      <header className="roadmap-2026-heading">
        <span className="eyebrow">CAREER ROADMAP · 2026</span>
        <h2 id="roadmap-2026-title">CS &amp; IT Skills Roadmaps</h2>
        <p>A practical skill-by-skill learning guide, a focused priority list, and a six-month plan for building internship-ready experience.</p>
        <div className="roadmap-2026-count"><BookOpen size={16} /><b>{allRoadmapSkills.length} skills</b><span>across {roadmapCategoryCount} career areas</span></div>
      </header>

      <aside className="roadmap-2026-caveat"><Sparkles size={17} /><p><b>A practical selection, not a live ranking.</b> Skills are grouped to help you explore; demand varies by role, location and employer.</p></aside>

      <div className="roadmap-2026-toolbar">
        <label className="roadmap-2026-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${allRoadmapSkills.length} skills or learning steps...`} aria-label="Search 2026 skills roadmap" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Clear roadmap search">×</button>}<span>{visibleCount} results</span></label>
      </div>

      {matchingCareerPaths.length > 0 && <section className="roadmap-2026-group roadmap-2026-career-paths">
        <div className="roadmap-2026-group-heading"><span>01</span><h3>25 complete CS &amp; IT career roadmaps</h3><small>{matchingCareerPaths.length} paths</small></div>
        <div className="roadmap-2026-skill-grid">{matchingCareerPaths.map(renderSkillCard)}</div>
        <button className="roadmap-2026-download" type="button" onClick={downloadCareerRoadmaps}><Download size={15} /> Download 25 roadmaps + full guide (PDF)</button>
        {downloadError && <p className="roadmap-2026-download-error" role="alert">{downloadError}</p>}
      </section>}

      {groups.length ? groups.map(([category, entries], categoryIndex) => (
        <section className="roadmap-2026-group" key={category}>
          <div className="roadmap-2026-group-heading"><span>{String(categoryIndex + 2).padStart(2, '0')}</span><h3>{category}</h3><small>{entries.length} skills</small></div>
          <div className="roadmap-2026-skill-grid">{entries.map(renderSkillCard)}</div>
        </section>
      )) : matchingCareerPaths.length === 0 && <div className="roadmap-2026-empty"><Search size={21} /><b>No matching skills</b><span>Try a different search term.</span></div>}

      {selectedPath && <div className="roadmap-2026-modal-backdrop" role="presentation" onClick={() => setSelectedPath(null)}>
        <section className="roadmap-2026-modal" role="dialog" aria-modal="true" aria-labelledby="roadmap-2026-modal-title" onClick={(event) => event.stopPropagation()}>
          <button type="button" className="roadmap-2026-modal-close" onClick={() => setSelectedPath(null)} aria-label="Close roadmap"><X size={17} /></button>
          <div className="roadmap-2026-modal-title"><SkillLogo name={selectedPath.skill} /><div><span className="eyebrow">{selectedPath.category}</span><h2 id="roadmap-2026-modal-title">{selectedPath.skill}</h2></div></div>
          <p className="roadmap-2026-modal-description">{selectedPath.description}</p>
          <div className="roadmap-2026-modal-facts"><span><b>Level</b>{selectedPath.difficulty}</span><span><b>Suggested time</b>{selectedPath.duration}</span><span><b>Daily study</b>{selectedPath.dailyStudy}</span><span><b>Career direction</b>{selectedPath.career}</span></div>
          <h3>Step-by-step learning roadmap</h3>
          <ol className="roadmap-2026-topic-list">{selectedPath.topics.map(([topic, time, detail], index) => <li key={topic}><span>{String(index + 1).padStart(2, '0')}</span><div><h4>{topic}</h4><p>{detail}</p></div><small>{time}</small></li>)}</ol>
          <h3>Recommended tools and technologies</h3>
          <div className="roadmap-2026-tool-list">{selectedPath.tools.map((tool) => <span key={tool}><Check size={12} />{tool}</span>)}</div>
          <h3>Practical projects</h3>
          <ul className="roadmap-2026-project-list">{selectedPath.projects.map((project) => <li key={project}>{project}</li>)}</ul>
          <h3>Learning resources</h3>
          <div className="roadmap-2026-resource-list">{selectedPath.resources.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name}<ExternalLink size={13} /></a>)}</div>
        </section>
      </div>}

      <section className="roadmap-2026-section">
        <div className="roadmap-2026-section-heading"><span><Sparkles size={16} /></span><div><h3>10 skills to prioritise</h3><p>A practical combination for software development internships and entry-level roles.</p></div></div>
        <div className="roadmap-2026-priorities">{roadmap2026Priorities.map(([skill, reason], index) => <article className="roadmap-2026-priority" key={skill}><span>{String(index + 1).padStart(2, '0')}</span><b>{skill}</b><small>{reason}</small></article>)}</div>
      </section>

      <section className="roadmap-2026-section">
        <div className="roadmap-2026-section-heading"><span><GraduationCap size={16} /></span><div><h3>Six-month learning roadmap</h3><p>Suggested sequence and practice projects; adjust the pace to your background and available time.</p></div></div>
        <div className="roadmap-2026-months">{roadmap2026Months.map(([month, skills, project]) => <article className="roadmap-2026-month" key={month}><span>{month}</span><div><h4>{skills}</h4><p>Practical project: <b>{project}</b></p></div><ArrowRight size={15} /></article>)}</div>
        <div className="roadmap-2026-daily"><div><Clock3 size={16} /><b>Example daily study target: 3–4 hours</b></div><div className="roadmap-2026-routine">{roadmap2026DailyRoutine.map(([duration, activity]) => <span key={activity}><b>{duration}</b>{activity}</span>)}</div></div>
      </section>

      <section className="roadmap-2026-section">
        <div className="roadmap-2026-section-heading"><span><BookOpen size={16} /></span><div><h3>Practice platforms</h3><p>Use a platform that matches the kind of practice you want to do.</p></div></div>
        <div className="roadmap-2026-platforms">{roadmap2026PracticePlatforms.map(([name, purpose, url]) => <a className="roadmap-2026-platform" href={url} target="_blank" rel="noopener noreferrer" key={name}><span><b>{name}</b><small>{purpose}</small></span><ExternalLink size={14} /></a>)}</div>
      </section>

      <section className="roadmap-2026-section">
        <div className="roadmap-2026-section-heading"><span><BookOpen size={16} /></span><div><h3>Free roadmap and learning websites</h3><p>Structured learning paths and courses across technology areas.</p></div></div>
        <div className="roadmap-2026-platforms">{roadmap2026AdditionalPlatforms.map(([name, purpose, url]) => <a className="roadmap-2026-platform" href={url} target="_blank" rel="noopener noreferrer" key={name}><span><b>{name}</b><small>{purpose}</small></span><ExternalLink size={14} /></a>)}</div>
      </section>

      <section className="roadmap-2026-section">
        <div className="roadmap-2026-section-heading"><span><GraduationCap size={16} /></span><div><h3>Suggested priorities by domain</h3><p>A sample order for building a broad Computer Engineering foundation.</p></div></div>
        <div className="roadmap-2026-direction">{roadmap2026DomainPriorities.map(([domain, skills]) => <article key={domain}><span>{domain}</span><b>{skills}</b></article>)}</div>
      </section>

      <section className="roadmap-2026-section roadmap-2026-career">
        <div className="roadmap-2026-section-heading"><span><GraduationCap size={16} /></span><div><h3>Example career direction: Full Stack Developer</h3><p>Strengthen existing skills instead of collecting technologies. Pick one primary path and build depth through projects.</p></div></div>
        <div className="roadmap-2026-direction">{roadmap2026CareerDirection.map(([category, target]) => <article key={category}><span>{category}</span><b>{target}</b></article>)}</div>
      </section>

      <footer className="roadmap-2026-footer"><BookOpen size={16} /><p>Learning durations and outcomes depend on your experience, practice and goals. Focus on understanding, building projects and reflecting on feedback—not just completing a checklist.</p></footer>
    </section>
  );
}
