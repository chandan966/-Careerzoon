import { useEffect, useState } from 'react';
import { ArrowDownToLine, ArrowLeft, ArrowRight, BookOpen, Check, CircleHelp, ExternalLink, GraduationCap, Keyboard, MonitorCog, Play, Settings2, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getSoftwareToolBySlug, softwareTools } from '../data/softwareTools.js';
import ToolLogo from '../components/ToolLogo.jsx';
import './ToolDetailPage.css';

const practicalExamples = {
  'visual-studio-code': { label: 'Open your first project', code: 'mkdir hello-careerzoon\ncd hello-careerzoon\ncode .', note: 'The `code` command is available after enabling the VS Code shell command; use File → Open Folder if it is not installed.' },
  git: { label: 'Start a local repository', code: 'git init\ngit status\ngit add README.md\ngit commit -m "Add project README"', note: 'Configure your commit name and email before creating your first commit.' },
  python: { label: 'Run a first Python file', code: 'print("Hello, Careerzoon!")', note: 'Save this in hello.py and run `python hello.py` (or `python3 hello.py`, depending on your installation).' },
  javascript: { label: 'Run JavaScript with Node.js', code: 'console.log("Hello, Careerzoon!");', note: 'Save this in hello.js and run `node hello.js` from the project folder.' },
  nodejs: { label: 'Start a simple local server', code: 'const http = require("node:http");\nhttp.createServer((req, res) => {\n  res.end("Hello, Careerzoon!");\n}).listen(3000);', note: 'Save as server.js, run `node server.js`, then open http://localhost:3000.' },
  react: { label: 'Create a React learning project', code: 'npm create vite@latest hello-react -- --template react\ncd hello-react\nnpm install\nnpm run dev', note: 'Install Node.js first. Follow the Vite output for the local development URL.' },
  docker: { label: 'Run a disposable hello-world container', code: 'docker run --rm hello-world', note: 'Docker Desktop or a compatible Docker Engine must be running. This pulls a small public image.' },
  postman: { label: 'Try a public sample API', code: 'GET https://jsonplaceholder.typicode.com/posts/1', note: 'Create a GET request in Postman and inspect the JSON response. Do not send secrets to public demo APIs.' },
};

function readBookmarks() {
  try {
    const saved = JSON.parse(localStorage.getItem('careerzoon-tool-bookmarks') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function ToolDetailPage() {
  const { toolSlug } = useParams();
  const item = getSoftwareToolBySlug(toolSlug);
  const [bookmarks, setBookmarks] = useState(readBookmarks);

  useEffect(() => {
    if (!item) return;
    document.title = `${item.name} Tool Guide | Careerzoon`;
    try {
      const current = JSON.parse(localStorage.getItem('careerzoon-tool-recent') || '[]');
      const recent = Array.isArray(current) ? current.filter((slug) => slug !== item.slug) : [];
      const next = [item.slug, ...recent].slice(0, 8);
      localStorage.setItem('careerzoon-tool-recent', JSON.stringify(next));
    } catch (error) {
      console.error('Unable to save recently viewed tools.', error);
    }
  }, [item]);

  if (!item) return <main className="tool-detail-not-found"><h1>Tool guide not found</h1><p>Choose a tool from the directory to view its guide.</p><Link className="button-primary" to="/tools">Back to tools directory <ArrowRight size={15} /></Link></main>;

  const categoryTools = softwareTools.filter((tool) => tool.category === item.category);
  const alternatives = item.alternatives.map((name) => softwareTools.find((tool) => tool.name === name)).filter(Boolean);
  const example = practicalExamples[item.slug];
  const bookmarked = bookmarks.includes(item.slug);

  function toggleBookmark() {
    const next = bookmarked ? bookmarks.filter((slug) => slug !== item.slug) : [...bookmarks, item.slug];
    setBookmarks(next);
    try {
      localStorage.setItem('careerzoon-tool-bookmarks', JSON.stringify(next));
    } catch {
      // Storage unavailable
    }
  }

  return <main className="tool-detail-page">
    <div className="tool-detail-hero"><div className="tool-detail-hero-inner">
      <Link to="/tools" className="tool-back-link"><ArrowLeft size={15} /> All software tools</Link>
      <div className="tool-detail-identity"><ToolLogo tool={item} /><div><span className="eyebrow">{item.category}</span><h1>{item.name}</h1><p>{item.description}</p></div></div>
      <div className="tool-detail-badges"><span>{item.difficulty}</span><span>{item.pricing}</span>{item.platforms.map((os) => <span key={os}>{os}</span>)}</div>
      <div className="tool-detail-actions"><a className="tool-download-button" href={item.download} target="_blank" rel="noopener noreferrer"><ArrowDownToLine size={16} /> {item.platforms.includes('Web') ? 'Open official tool' : 'Official download'} <ExternalLink size={13} /></a><a className="tool-doc-button" href="#installation"><Settings2 size={15} /> Installation guide</a><button type="button" className={`tool-bookmark-button${bookmarked ? ' is-saved' : ''}`} onClick={toggleBookmark} aria-pressed={bookmarked}><Star size={15} fill={bookmarked ? 'currentColor' : 'none'} />{bookmarked ? 'Saved' : 'Save tool'}</button></div>
    </div></div>

    <div className="tool-detail-layout">
      <aside className="tool-detail-sidebar"><b>On this page</b>{[
        ['introduction', 'Introduction'], ['purpose', 'Purpose & use'], ['audience', 'Who should learn it?'], ['requirements', 'Prerequisites & requirements'], ['installation', 'Download & install'], ['setup', 'Setup guide'], ['first-project', 'First project'], ['how-to-use', 'How to use it'], ['features', 'Important features'], ['shortcuts', 'Keyboard shortcuts'], ['video-tutorials', 'Video tutorials'], ['documentation', 'Documentation & pricing'], ['alternatives', 'Alternatives'], ['faqs', 'FAQs'],
      ].map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</aside>

      <div className="tool-detail-content">
        <section id="introduction" className="tool-guide-card"><span className="tool-section-icon"><BookOpen size={17} /></span><h2>Introduction</h2><p>{item.introduction}</p><p className="tool-guide-muted">This guide is a learning starting point. Product features, system support, installation steps, and pricing can change; confirm current details on the official vendor pages before installing.</p></section>
        <section id="purpose" className="tool-guide-card"><span className="tool-section-icon"><MonitorCog size={17} /></span><h2>Purpose and where it is used</h2><p>{item.purpose}</p><div className="tool-guide-tags">{item.usedIn.map((use) => <span key={use}>{use}</span>)}</div></section>
        <section id="audience" className="tool-guide-card"><span className="tool-section-icon"><GraduationCap size={17} /></span><h2>Who should learn it?</h2><p>{item.audience}</p><h3>Prerequisites</h3><p>{item.prerequisites}</p></section>
        <section id="requirements" className="tool-guide-card"><span className="tool-section-icon"><MonitorCog size={17} /></span><h2>System requirements</h2><p>{item.requirements}</p><div className="tool-requirement-callout">These are learning-oriented estimates, not official minimum specifications. Check the linked vendor requirements for your exact OS, device architecture, and version.</div><div className="tool-guide-tags">{item.platforms.map((os) => <span key={os}>{os}</span>)}</div></section>
        <section id="installation" className="tool-guide-card"><span className="tool-section-icon"><ArrowDownToLine size={17} /></span><h2>Download and installation</h2><p>{item.installation}</p><ol className="tool-guide-steps"><li>Open the official download page using the button above.</li><li>Choose your operating system and a supported stable version.</li><li>Follow the vendor instructions for Windows, macOS, Linux, or browser access.</li><li>Review optional components and permissions before continuing.</li><li>Launch the tool and verify it using the vendor’s quickstart or version check.</li></ol><a className="tool-inline-link" href={item.download} target="_blank" rel="noopener noreferrer">Official download / product page <ExternalLink size={13} /></a></section>
        <section id="setup" className="tool-guide-card"><span className="tool-section-icon"><Settings2 size={17} /></span><h2>Setup guide</h2><ol className="tool-guide-steps">{item.setup.map((step) => <li key={step}>{step}</li>)}</ol></section>
        <section id="first-project" className="tool-guide-card"><span className="tool-section-icon"><Check size={17} /></span><h2>Create your first project</h2><p>{item.firstProject}</p>{example && <div className="tool-example"><b>{example.label}</b><pre><code>{example.code}</code></pre><p>{example.note}</p></div>}</section>
        <section id="how-to-use" className="tool-guide-card"><span className="tool-section-icon"><ArrowRight size={17} /></span><h2>How to use it</h2><ol className="tool-guide-steps">{item.usage.map((step) => <li key={step}>{step}</li>)}</ol></section>
        <section id="features" className="tool-guide-card"><span className="tool-section-icon"><Check size={17} /></span><h2>Important features</h2><ul className="tool-guide-list">{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
        <section id="shortcuts" className="tool-guide-card"><span className="tool-section-icon"><Keyboard size={17} /></span><h2>Useful shortcuts</h2><p className="tool-guide-muted">Shortcuts can vary by operating system and product version; confirm them in the tool’s Help or Keyboard Shortcuts menu.</p><div className="tool-shortcuts">{item.shortcuts.map(([keys, action]) => <div key={keys}><kbd>{keys}</kbd><span>{action}</span></div>)}</div></section>
        <section id="video-tutorials" className="tool-guide-card"><span className="tool-section-icon"><Play size={17} /></span><h2>Video tutorials</h2><p>Open video search results for beginner tutorials. Prefer current videos from the official vendor or a trusted educator.</p><a className="tool-inline-link" href={item.videoUrl} target="_blank" rel="noopener noreferrer">Search {item.name} tutorials on YouTube <ExternalLink size={13} /></a></section>
        <section id="documentation" className="tool-guide-card"><span className="tool-section-icon"><BookOpen size={17} /></span><h2>Official documentation and pricing</h2><div className="tool-guide-link-grid"><a href={item.documentation} target="_blank" rel="noopener noreferrer"><span>Official documentation</span><ExternalLink size={14} /></a><a href={item.download} target="_blank" rel="noopener noreferrer"><span>Pricing / product details</span><ExternalLink size={14} /></a></div><p><b>Pricing:</b> {item.pricing}. Plans and eligibility can change; review the vendor’s current terms.</p></section>
        <section id="alternatives" className="tool-guide-card"><span className="tool-section-icon"><ArrowRight size={17} /></span><h2>Alternatives and related tools</h2><div className="tool-related-grid">{alternatives.map((alternative) => <Link key={alternative.slug} to={`/tools/${alternative.slug}`}><ToolLogo tool={alternative} /><span><b>{alternative.name}</b><small>{alternative.pricing}</small></span><ArrowRight size={14} /></Link>)}</div><div className="tool-directory-return"><Link to="/tools">Browse all {softwareTools.length} tools <ArrowRight size={14} /></Link></div></section>
        <section id="faqs" className="tool-guide-card"><span className="tool-section-icon"><CircleHelp size={17} /></span><h2>Frequently asked questions</h2>{item.faqs.map((faq) => <details className="tool-faq" key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</section>
      </div>
    </div>

    <section className="tool-related-bottom"><div><span className="eyebrow">KEEP EXPLORING</span><h2>Related {item.category} tools</h2></div><div>{categoryTools.filter((tool) => tool.slug !== item.slug).slice(0, 3).map((tool) => <Link key={tool.slug} to={`/tools/${tool.slug}`}><ToolLogo tool={tool} />{tool.name}<ArrowRight size={14} /></Link>)}</div></section>
  </main>;
}
