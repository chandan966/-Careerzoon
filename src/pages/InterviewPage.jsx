import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Target } from 'lucide-react';
import { questions } from '../data/content.js';
import './InterviewPage.css';

const topics = ['All topics', ...new Set(questions.map((question) => question.topic))];

export default function InterviewPage() {
  const [topic, setTopic] = useState('All topics');
  const [difficulty, setDifficulty] = useState('All levels');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const filtered = useMemo(() => questions.filter((question) => (topic === 'All topics' || question.topic === topic) && (difficulty === 'All levels' || question.difficulty === difficulty)), [topic, difficulty]);
  function reset() { setIndex(0); setSelected(null); setAnswers([]); setFinished(false); }
  function changeFilter(setter, value) { setter(value); reset(); }
  function chooseAnswer(value) { if (selected === null) setSelected(value); }
  function nextQuestion() {
    if (selected === null || !filtered[index]) return;
    const updated = [...answers, selected];
    setAnswers(updated);
    if (index + 1 >= filtered.length) setFinished(true);
    else { setIndex(index + 1); setSelected(null); }
  }
  const score = answers.reduce((total, answer, questionIndex) => total + (answer === filtered[questionIndex]?.answer ? 1 : 0), 0);
  const current = filtered[index];

  return <main className="interview-page"><div className="page-hero"><div className="page-hero-inner"><span className="eyebrow">INTERVIEW PREPARATION</span><h1>Practice today. Feel ready tomorrow.</h1><p>Build confidence with bite-sized, topic-based questions. Review every explanation and learn at your own pace.</p></div></div><div className="quiz-content"><div className="quiz-filter-row"><label>Topic<select value={topic} onChange={(event) => changeFilter(setTopic, event.target.value)}>{topics.map((item) => <option key={item}>{item}</option>)}</select></label><label>Difficulty<select value={difficulty} onChange={(event) => changeFilter(setDifficulty, event.target.value)}>{['All levels', 'Easy', 'Medium', 'Hard'].map((item) => <option key={item}>{item}</option>)}</select></label><span className="quiz-availability">{filtered.length} {filtered.length === 1 ? 'question' : 'questions'} available</span></div>
    {!filtered.length ? <div className="quiz-empty"><Target size={25} /><h2>No questions in this combination yet</h2><p>Try a different topic or difficulty to keep practicing.</p></div> : finished ? <section className="quiz-result"><div className="result-check"><CheckCircle2 size={29} /></div><span className="eyebrow">PRACTICE COMPLETE</span><h2>{score} <small>/ {filtered.length}</small></h2><p>{score === filtered.length ? 'Excellent work—you got every answer right.' : score >= Math.ceil(filtered.length / 2) ? 'Nice progress. Review the explanations and keep going.' : 'Good start. Learning from each explanation is what counts.'}</p><div className="result-bar"><span style={{ width: `${filtered.length ? score / filtered.length * 100 : 0}%` }} /></div><button className="button-primary" onClick={reset}><RotateCcw size={14} /> Try again</button></section> : <section className="quiz-card"><div className="quiz-card-head"><span className="quiz-topic">{current.topic}</span><span className={`quiz-difficulty ${current.difficulty.toLowerCase()}`}>{current.difficulty}</span><span className="quiz-counter">Question {index + 1} of {filtered.length}</span></div><div className="quiz-progress"><span style={{ width: `${(index / filtered.length) * 100}%` }} /></div><h2>{current.question}</h2><div className="quiz-options">{current.options.map((option, optionIndex) => <button key={option} disabled={selected !== null} onClick={() => chooseAnswer(optionIndex)} className={`quiz-option ${selected === optionIndex ? (optionIndex === current.answer ? 'correct' : 'incorrect') : selected !== null && optionIndex === current.answer ? 'reveal-correct' : ''}`}><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>{option}{selected !== null && optionIndex === current.answer && <CheckCircle2 size={16} />}</button>)}</div>{selected !== null && <div className={`answer-explanation ${selected === current.answer ? 'is-correct' : 'is-incorrect'}`}><b>{selected === current.answer ? 'That’s right!' : `Not quite. The answer is ${current.options[current.answer]}.`}</b><p>{current.explanation}</p></div>}<div className="quiz-footer"><span>{answers.filter((answer, answerIndex) => answer === filtered[answerIndex]?.answer).length + (selected === current.answer ? 1 : 0)} correct so far</span><button className="button-primary" disabled={selected === null} onClick={nextQuestion}>{index + 1 === filtered.length ? 'See my score' : 'Next question'} <ArrowRight size={14} /></button></div></section>}
    <div className="quiz-tip"><span>✦</span><p><b>Learning tip</b> — Try explaining your reasoning out loud, just like you would in a real interview.</p></div></div></main>;
}
