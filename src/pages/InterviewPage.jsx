import { useState, useMemo } from 'react';
import { ArrowDown, ArrowRight, Award, BookOpen, CheckCircle2, ChevronDown, HelpCircle, RotateCcw } from 'lucide-react';
import placementGuide from '../data/placement-preparation-guide.md?raw';
import { questions } from '../data/content.js';
import './InterviewPage.css';

function formatInlineMarkdown(text) {
  const tokens = text.match(/(\[[^\]]+\]\(https?:\/\/[^)]+\)|\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*)/g);
  if (!tokens) return text;
  const parts = [];
  let remaining = text;
  tokens.forEach((token, index) => {
    const position = remaining.indexOf(token);
    if (position > 0) parts.push(remaining.slice(0, position));
    const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) {
      parts.push(<a href={link[2]} target="_blank" rel="noopener noreferrer" key={`link-${index}`}>{link[1]}</a>);
    } else if (token.startsWith('**') || token.startsWith('__')) {
      parts.push(<strong key={`strong-${index}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      parts.push(<code key={`code-${index}`}>{token.slice(1, -1)}</code>);
    } else {
      parts.push(<em key={`em-${index}`}>{token.slice(1, -1)}</em>);
    }
    remaining = remaining.slice(position + token.length);
  });
  if (remaining) parts.push(remaining);
  return parts;
}

function parseGuideMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();
    if (!trimmed) { index += 1; continue; }

    if (trimmed.startsWith('```')) {
      const codeLines = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({ type: 'code-block', content: codeLines.join('\n') });
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      blocks.push({ type: `heading-${Math.min(heading[1].length, 4)}`, content: heading[2] });
      index += 1;
      continue;
    }

    if (/^[-*_]{3,}$/.test(trimmed)) {
      blocks.push({ type: 'divider' });
      index += 1;
      continue;
    }

    if (trimmed.startsWith('|')) {
      const rows = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        const cells = lines[index].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
        if (!cells.every((cell) => /^:?-{3,}:?$/.test(cell))) rows.push(cells);
        index += 1;
      }
      if (rows.length) blocks.push({ type: 'table', rows });
      continue;
    }

    const listItem = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.+)$/);
    if (listItem) {
      const ordered = /^\d/.test(listItem[2]);
      const items = [];
      while (index < lines.length) {
        const item = lines[index].match(/^(\s*)([-*+]|\d+[.)])\s+(.+)$/);
        if (!item || /^\d/.test(item[2]) !== ordered) break;
        items.push(item[3]);
        index += 1;
      }
      blocks.push({ type: ordered ? 'ordered-list' : 'unordered-list', items });
      continue;
    }

    if (trimmed.startsWith('>')) {
      const quote = [];
      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quote.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push({ type: 'quote', content: quote.join(' ') });
      continue;
    }

    const paragraph = [trimmed];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,6}\s|```|[-*_]{3,}$|\||>|(\s*)([-*+]|\d+[.)])\s+)/.test(lines[index].trim())) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: 'paragraph', content: paragraph.join(' ') });
  }
  return blocks;
}

const placementGuideBlocks = parseGuideMarkdown(placementGuide);

const placementSteps = [
  {
    title: 'DSA + Problem Solving',
    phase: 'Core foundations',
    description: 'Build a repeatable way to break down coding problems, choose an approach, and explain its efficiency.',
    focus: ['Arrays and strings', 'Hash maps and sets', 'Stacks and queues', 'Trees and graphs', 'Sorting and searching', 'Recursion and dynamic programming'],
    outcome: 'Solve problems regularly and explain your approach and time and space complexity.',
  },
  {
    title: 'One Programming Language',
    phase: 'Core foundations',
    description: 'Choose one language—Python, Java, or C++—and learn it well before switching between languages.',
    focus: ['Syntax and data types', 'Functions and collections', 'Input and output', 'Error handling', 'Standard library', 'Implementing DSA in your language'],
    outcome: 'Write clear programs independently and use your chosen language for coding rounds.',
  },
  {
    title: 'Object-Oriented Programming',
    phase: 'Core foundations',
    description: 'Understand how to organize code into reusable types and model real problems with objects.',
    focus: ['Classes and objects', 'Encapsulation', 'Inheritance and composition', 'Polymorphism', 'Interfaces and abstraction'],
    outcome: 'Explain OOP concepts with examples and use them in a small application.',
  },
  {
    title: 'DBMS + SQL',
    phase: 'Core foundations',
    description: 'Learn how relational databases store information and practice retrieving it accurately.',
    focus: ['Tables, keys, and relationships', 'Normalization', 'SELECT and filtering', 'Joins and grouping', 'Subqueries', 'Transactions and indexes'],
    outcome: 'Write SQL queries and describe the database design behind a project.',
  },
  {
    title: 'Computer Networks',
    phase: 'Core foundations',
    description: 'Learn the basics of how computers communicate and how web requests travel.',
    focus: ['TCP/IP and OSI models', 'IP addresses and ports', 'DNS', 'TCP vs. UDP', 'HTTP and HTTPS'],
    outcome: 'Clearly explain what happens when you enter a website address in a browser.',
  },
  {
    title: 'Operating Systems',
    phase: 'Core foundations',
    description: 'Understand how an operating system manages programs and hardware resources.',
    focus: ['Processes and threads', 'CPU scheduling', 'Memory and virtual memory', 'Synchronization', 'Deadlocks and file systems'],
    outcome: 'Describe common OS concepts and compare the trade-offs behind them.',
  },
  {
    title: 'Aptitude + Reasoning',
    phase: 'Core foundations',
    description: 'Prepare for timed screening tests with a steady mix of quantitative and logical practice.',
    focus: ['Percentages and ratios', 'Averages and arithmetic', 'Time, speed, and work', 'Sequences and patterns', 'Logical reasoning'],
    outcome: 'Practice with a timer, review mistakes, and improve accuracy without rushing.',
  },
  {
    title: 'Projects',
    phase: 'Show what you can do',
    description: 'Build a small portfolio that demonstrates applied skills, thoughtful decisions, and finished work.',
    focus: ['Choose a clear problem', 'Build 2–3 relevant projects', 'Include useful tests', 'Deploy at least one project', 'Write setup instructions and a README'],
    outcome: 'Be ready to demo each project and explain your contribution and key decisions.',
  },
  {
    title: 'Git / GitHub',
    phase: 'Show what you can do',
    description: 'Use version control to track your work and make your projects easy for others to review.',
    focus: ['Commits and branches', 'Push and pull', 'Merging and resolving conflicts', 'GitHub repositories', 'Clear README files'],
    outcome: 'Keep your projects organized in public or shareable repositories with meaningful commit history.',
  },
  {
    title: 'Communication + HR Interview',
    phase: 'Interview readiness',
    description: 'Practice explaining your skills and experiences clearly, honestly, and with relevant examples.',
    focus: ['A concise self-introduction', 'Explaining your resume and projects', 'Behavioral examples using STAR', 'Strengths and growth areas', 'Mock interviews and questions for the interviewer'],
    outcome: 'Give structured answers, listen carefully, and communicate your thinking with confidence.',
  },
];

function PlacementQuiz() {
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const topics = useMemo(() => ['All', ...new Set(questions.map((q) => q.topic))], []);

  const activeQuestions = useMemo(() => {
    if (selectedTopic === 'All') return questions;
    return questions.filter((q) => q.topic === selectedTopic);
  }, [selectedTopic]);

  const currentQ = activeQuestions[currentIndex] || activeQuestions[0];

  function handleSelectTopic(topic) {
    setSelectedTopic(topic);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  }

  function handleOptionClick(index) {
    if (selectedOption !== null || !currentQ) return;
    setSelectedOption(index);
    if (index === currentQ.answer) {
      setScore((prev) => prev + 1);
    }
  }

  function handleNext() {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  }

  return (
    <section className="placement-quiz-section" aria-labelledby="placement-quiz-title">
      <div className="placement-quiz-header">
        <div className="quiz-header-badge"><HelpCircle size={18} /></div>
        <div>
          <span className="eyebrow">INTERACTIVE PRACTICE QUIZ</span>
          <h2 id="placement-quiz-title">Test your placement readiness</h2>
          <p>Work through topic-based multiple choice questions, get immediate feedback with explanations, and track your accuracy.</p>
        </div>
      </div>

      <div className="quiz-topic-bar" role="tablist" aria-label="Quiz topics">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={selectedTopic === t}
            className={`quiz-topic-btn ${selectedTopic === t ? 'active' : ''}`}
            onClick={() => handleSelectTopic(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {isFinished ? (
        <div className="quiz-finish-card">
          <div className="quiz-finish-icon"><Award size={36} /></div>
          <h3>Quiz Complete!</h3>
          <p className="quiz-score-display">
            You scored <strong>{score}</strong> out of <strong>{activeQuestions.length}</strong> ({Math.round((score / (activeQuestions.length || 1)) * 100)}%)
          </p>
          <p className="quiz-score-message">
            {score === activeQuestions.length
              ? 'Outstanding! You mastered all questions in this category.'
              : score >= activeQuestions.length / 2
              ? 'Well done! Review the topics below to solidify your understanding.'
              : 'Keep practicing! Review the detailed placement study guide below and try again.'}
          </p>
          <button type="button" className="button-primary quiz-restart-btn" onClick={handleRestart}>
            <RotateCcw size={15} /> Retake Quiz
          </button>
        </div>
      ) : currentQ ? (
        <div className="quiz-card">
          <div className="quiz-card-meta">
            <div className="quiz-meta-pills">
              <span className="quiz-pill topic">{currentQ.topic}</span>
              <span className={`quiz-pill difficulty ${(currentQ.difficulty || 'Easy').toLowerCase()}`}>{currentQ.difficulty || 'Easy'}</span>
            </div>
            <div className="quiz-meta-counter">
              Question {currentIndex + 1} of {activeQuestions.length}
            </div>
          </div>

          <h3 className="quiz-question-text">{currentQ.question}</h3>

          <div className="quiz-options-list">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.answer;
              let optionClass = 'quiz-option-button';
              if (selectedOption !== null) {
                if (isCorrect) optionClass += ' correct';
                else if (isSelected) optionClass += ' incorrect';
              }
              return (
                <button
                  key={option}
                  type="button"
                  disabled={selectedOption !== null}
                  onClick={() => handleOptionClick(idx)}
                  className={optionClass}
                >
                  <span className="quiz-option-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="quiz-option-text">{option}</span>
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className={`quiz-feedback-box ${selectedOption === currentQ.answer ? 'success' : 'info'}`}>
              <b>{selectedOption === currentQ.answer ? '✓ Correct!' : `✕ The correct answer is: ${currentQ.options[currentQ.answer]}`}</b>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          <div className="quiz-footer-bar">
            <span className="quiz-current-score">
              Score: <strong>{score}</strong> / {activeQuestions.length}
            </span>
            <button
              type="button"
              className="button-primary quiz-next-btn"
              disabled={selectedOption === null}
              onClick={handleNext}
            >
              {currentIndex + 1 === activeQuestions.length ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default function InterviewPage() {
  return (
    <main className="placement-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">PLACEMENT PREPARATION</span>
          <h1>A clear path to placement readiness.</h1>
          <p>Work through these ten areas in order. Build strong fundamentals, show your skills through projects, and practice communicating your work.</p>
        </div>
      </div>

      <section className="placement-content" aria-labelledby="placement-roadmap-title">
        <div className="placement-intro">
          <div className="placement-intro-icon"><BookOpen size={19} /></div>
          <div>
            <span className="eyebrow">YOUR PREPARATION ROADMAP</span>
            <h2 id="placement-roadmap-title">10 areas to prepare for placements</h2>
            <p>This overview follows your requested order. The detailed guide below also includes its own suggested sequence and schedule. Choose Python, Java, or C++ for step 2, then learn and practice at a steady pace.</p>
          </div>
        </div>

        <ol className="placement-roadmap">
          {placementSteps.map((step, index) => (
            <li className="placement-step" key={step.title}>
              <span className="placement-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <article className="placement-step-card">
                <div className="placement-step-heading">
                  <div>
                    <span className="placement-phase">{step.phase}</span>
                    <h3>{step.title}</h3>
                  </div>
                  <span className="placement-step-check" aria-hidden="true"><CheckCircle2 size={17} /></span>
                </div>
                <p className="placement-step-description">{step.description}</p>
                <h4>What to focus on</h4>
                <ul className="placement-focus-list">
                  {step.focus.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div className="placement-outcome"><b>Goal</b><span>{step.outcome}</span></div>
              </article>
              {index < placementSteps.length - 1 && <ArrowDown className="placement-step-connector" size={15} aria-hidden="true" />}
            </li>
          ))}
        </ol>

        <PlacementQuiz />

        <details className="placement-guide">
          <summary>
            <span className="placement-guide-icon"><BookOpen size={18} /></span>
            <span className="placement-guide-summary"><b>Open the complete placement study guide</b><small>Topic-by-topic resources, practice plans, projects, and a six-month schedule</small></span>
            <ChevronDown className="placement-guide-chevron" size={18} />
          </summary>
          <article className="placement-guide-content">
            {placementGuideBlocks.map((block, index) => {
              if (block.type.startsWith('heading-')) {
                const Heading = `h${block.type.slice(-1)}`;
                return <Heading key={`heading-${index}`}>{formatInlineMarkdown(block.content)}</Heading>;
              }
              if (block.type === 'paragraph') return <p key={`paragraph-${index}`}>{formatInlineMarkdown(block.content)}</p>;
              if (block.type === 'ordered-list' || block.type === 'unordered-list') {
                const List = block.type === 'ordered-list' ? 'ol' : 'ul';
                return <List key={`list-${index}`}>{block.items.map((item, itemIndex) => <li key={`item-${itemIndex}`}>{formatInlineMarkdown(item)}</li>)}</List>;
              }
              if (block.type === 'code-block') return <pre key={`code-block-${index}`}><code>{block.content}</code></pre>;
              if (block.type === 'quote') return <blockquote key={`quote-${index}`}>{formatInlineMarkdown(block.content)}</blockquote>;
              if (block.type === 'table') return <div className="placement-guide-table-wrap" key={`table-${index}`}><table><thead><tr>{block.rows[0].map((cell, cellIndex) => <th key={`head-${cellIndex}`}>{formatInlineMarkdown(cell)}</th>)}</tr></thead><tbody>{block.rows.slice(1).map((row, rowIndex) => <tr key={`row-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`cell-${cellIndex}`}>{formatInlineMarkdown(cell)}</td>)}</tr>)}</tbody></table></div>;
              return <hr key={`divider-${index}`} />;
            })}
          </article>
        </details>

        <aside className="placement-next-step">
          <span><CheckCircle2 size={18} /></span>
          <div><h3>Keep your preparation practical</h3><p>Balance concepts with regular problem-solving, project work, and speaking practice. Adjust the pace to your schedule and the roles you are targeting.</p></div>
          <ArrowRight size={17} aria-hidden="true" />
        </aside>
      </section>
    </main>
  );
}
