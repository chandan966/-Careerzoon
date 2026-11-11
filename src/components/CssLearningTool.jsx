import { useState } from 'react';
import { ArrowRight, BookOpen, Check, Code2, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CssLearningTool.css';

const examples = {
  card: {
    label: 'Card styling',
    description: 'Use spacing, borders, color, and a subtle shadow to make a component clear.',
    code: '.profile-card {\n  padding: 24px;\n  border: 1px solid #e2e8f0;\n  border-radius: 16px;\n  background: white;\n  box-shadow: 0 12px 30px #10182812;\n}',
  },
  grid: {
    label: 'Responsive grid',
    description: 'CSS Grid arranges cards in columns and adapts the layout for narrower screens.',
    code: '.project-grid {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 16px;\n}\n\n@media (max-width: 700px) {\n  .project-grid {\n    grid-template-columns: 1fr;\n  }\n}',
  },
  hover: {
    label: 'Hover interaction',
    description: 'Transitions make small interactive changes feel smooth without distracting motion.',
    code: '.action-card {\n  transition: transform 160ms ease,\n    box-shadow 160ms ease;\n}\n\n.action-card:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 14px 28px #10182818;\n}',
  },
};

export default function CssLearningTool() {
  const [activeExample, setActiveExample] = useState('card');
  const [copied, setCopied] = useState(false);
  const example = examples[activeExample];

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error('Unable to copy the CSS example.', error);
      setCopied(false);
    }
  }

  return <div className="css-learning-tool">
    <header className="css-learning-heading">
      <span className="css-learning-icon"><Code2 size={19} /></span>
      <div><span className="eyebrow">CSS LEARNING TOOL</span><h2>Style the web, one rule at a time.</h2><p>Explore practical CSS patterns, preview their effect, and follow the complete CSS guide.</p></div>
    </header>

    <section className="css-playground" aria-label="Interactive CSS examples">
      <div className="css-playground-heading"><div><Sparkles size={16} /><div><h3>CSS pattern playground</h3><p>Select an example to see a live preview and its code.</p></div></div><span>Try it</span></div>
      <div className="css-example-tabs" role="tablist" aria-label="CSS examples">
        {Object.entries(examples).map(([key, item]) => <button key={key} type="button" role="tab" aria-selected={activeExample === key} className={activeExample === key ? 'active' : ''} onClick={() => setActiveExample(key)}>{item.label}</button>)}
      </div>
      <div className="css-playground-content">
        <div className={`css-live-preview preview-${activeExample}`}>
          <div className="css-preview-card"><span className="css-preview-mark">CZ</span><div><b>Build something useful</b><p>CSS shapes the layout, spacing, and visual details of this card.</p><span className="css-preview-action">Explore the example <ArrowRight size={12} /></span></div></div>
          {activeExample === 'grid' && <div className="css-preview-mini-grid"><span>Structure</span><span>Spacing</span><span>Responsive</span></div>}
          <small>Live preview · {example.label}</small>
        </div>
        <div className="css-example-code"><div><span>example.css</span><button type="button" onClick={copyCode}><Check size={12} />{copied ? 'Copied' : 'Copy CSS'}</button></div><pre><code>{example.code}</code></pre><p>{example.description}</p></div>
      </div>
    </section>

    <section className="css-foundations">
      <div><BookOpen size={16} /><h3>What to learn first</h3></div>
      <div className="css-foundation-grid">
        {[
          ['Selectors & cascade', 'Target elements and understand which rule takes effect.'],
          ['Box model', 'Control content, padding, borders, and margins.'],
          ['Flexbox & Grid', 'Create layouts that align and organize content.'],
          ['Responsive design', 'Adapt layouts for different screen sizes.'],
          ['Typography & color', 'Build hierarchy with readable type and accessible contrast.'],
          ['States & transitions', 'Style focus, hover, and other interaction states.'],
        ].map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h4>{title}</h4><p>{description}</p></div></article>)}
      </div>
    </section>

    <div className="css-learning-actions"><p>CSS works directly in your browser—no separate installation required.</p><div><a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank" rel="noopener noreferrer">MDN CSS reference <ExternalLink size={13} /></a><Link to="/tools/css">Open complete CSS tool guide <ArrowRight size={14} /></Link></div></div>
  </div>;
}
