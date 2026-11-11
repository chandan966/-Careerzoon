import { ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness, CheckCircle2, Compass, GraduationCap, MoveUpRight, Play, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import { careers, companies, roadmaps, resources } from '../data/content.js';
import './Home.css';

const faq = [
  ['Do I need an account to use Careerzoon?', 'No. Careerzoon is open to everyone. Bookmarks and learning progress are stored locally in your browser.'],
  ['Does Careerzoon list live job openings?', 'We do not publish or invent live vacancies. Our Jobs and Internships pages point you to trusted search platforms and official company career sites so you can verify current openings directly.'],
  ['Are the roadmaps suitable for beginners?', 'Yes. Each roadmap shows a suggested order, projects and a rough time estimate. Adjust the pace to your experience and schedule.'],
  ['Is the resume builder private?', 'Your resume data stays in your browser. It is not uploaded to a server. You can print or save your resume as a PDF from your device.'],
];

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <section className="home-search-strip">
          <div className="strip-icon"><Compass size={21} /></div><div><b>Not sure where to start?</b><span>Find a path that fits your interests, one step at a time.</span></div><Link to="/careers">Explore careers <ArrowRight size={15} /></Link>
        </section>
        <section className="content-section">
          <SectionTitle eyebrow="FIND YOUR DIRECTION" title="Careers worth exploring" description="Get to know the roles shaping technology—and find one that feels right for you." action={<Link className="text-link" to="/careers">Explore all careers <ArrowRight size={15} /></Link>} />
          <div className="card-grid career-preview">{careers.slice(0, 4).map((item) => <FeatureCard item={item} key={item.title} type="career" />)}</div>
        </section>
        <section className="home-opportunities">
          <div className="opportunity-copy"><span className="eyebrow">YOUR NEXT OPPORTUNITY</span><h2>Find the right opportunity.<br /><span>At the source.</span></h2><p>We don’t make up job listings. Explore trusted job platforms and apply directly through official company career pages.</p><div className="opportunity-actions"><Link to="/jobs" className="button-primary">Explore job sources <ArrowRight size={16} /></Link><Link to="/internships" className="button-ghost">Find internships <ArrowUpRight size={16} /></Link></div><div className="trust-note"><CheckCircle2 size={15} /> Always verify the role and application link with the employer</div></div>
          <div className="opportunity-visual"><div className="opp-card opp-card-main"><div className="opp-logo"><BriefcaseBusiness size={19} /></div><div><b>Explore what’s out there</b><span>Official job and internship sources</span></div><MoveUpRight size={17} /></div><div className="opp-card"><span className="opp-icon violet"><Target size={17} /></span><div><b>Find your fit</b><span>Browse roles by interest</span></div></div><div className="opp-card"><span className="opp-icon cyan"><GraduationCap size={17} /></span><div><b>Apply with confidence</b><span>Go straight to the source</span></div></div><div className="opp-dots">✳</div></div>
        </section>
        <section className="content-section alt-section">
          <SectionTitle eyebrow="LEARN WITH A PLAN" title="A roadmap for your next step" description="Clear, project-based paths help turn a big career goal into manageable learning." action={<Link className="text-link" to="/roadmaps">Browse roadmaps <ArrowRight size={15} /></Link>} />
          <div className="card-grid">{roadmaps.slice(0, 3).map((item) => <FeatureCard item={item} key={item.title} type="roadmap" />)}</div>
        </section>
        <section className="content-section">
          <SectionTitle eyebrow="BUILD YOUR TOOLKIT" title="Skills that open doors" description="Start with the fundamentals, practice by building, and grow from there." action={<Link className="text-link" to="/skills">Explore the skills library <ArrowRight size={15} /></Link>} />
          <div className="skill-band"><div className="skill-band-intro"><span className="round-feature purple"><Sparkles size={20} /></span><h3>Learn by making</h3><p>Small, real projects help you turn concepts into confidence.</p><Link to="/skills">Find your next skill <ArrowRight size={15} /></Link></div><div className="skill-pills">{['JavaScript', 'Python', 'React', 'SQL', 'Git & GitHub', 'AWS Cloud', 'Data structures', 'Cybersecurity', 'Figma', 'Docker'].map((skill, i) => <Link key={skill} to="/skills" className={`skill-pill ${i % 3 === 1 ? 'pill-purple' : i % 3 === 2 ? 'pill-blue' : ''}`}><span>↗</span>{skill}</Link>)}</div></div>
        </section>
        <section className="company-band"><div><span className="eyebrow">EXPLORE THE INDUSTRY</span><h2>Get to know the companies<br />building the future.</h2><p>Learn about technology teams, career pages and hiring journeys.</p><Link to="/companies" className="button-primary">Explore companies <ArrowRight size={16} /></Link></div><div className="company-logo-grid">{companies.slice(0, 8).map((company) => <Link to="/companies" key={company.name} className="company-logo" title={`${company.name} careers`}><span style={{ '--company-color': company.color }}>{company.initials}</span><small>{company.name}</small></Link>)}</div></section>
        <section className="home-promo-row">
          <div className="promo-card resume-promo"><div className="promo-icon"><BookOpen size={22} /></div><span className="eyebrow">MAKE A STRONG FIRST IMPRESSION</span><h2>Your experience<br />deserves a great resume.</h2><p>Build a polished, ATS-friendly resume that’s yours to download. No account needed.</p><Link to="/resume-builder" className="button-light">Build your resume <ArrowRight size={15} /></Link><div className="promo-watermark">CV</div></div>
          <div className="promo-card interview-promo"><div className="promo-icon"><Play size={22} /></div><span className="eyebrow">PRACTICE MAKES PROGRESS</span><h2>Walk into your next<br />interview prepared.</h2><p>Work through topic-based questions, get explanations and track your score.</p><Link to="/interview" className="button-outline-light">Start practicing <ArrowRight size={15} /></Link><div className="interview-score"><TrendingUp size={18} /><span><b>Practice at your pace</b><small>Learn from every answer</small></span></div></div>
        </section>
        <section className="content-section resources-section">
          <SectionTitle eyebrow="KEEP LEARNING" title="Good learning starts here" description="A hand-picked library of free, legitimate resources to help you keep moving." />
          <div className="resource-grid">{resources.slice(0, 4).map((resource) => <a key={resource.title} href={resource.url} className="resource-link-card" target="_blank" rel="noopener noreferrer"><span className="resource-icon"><BookOpen size={17} /></span><span><small>{resource.type}</small><b>{resource.title}</b><span>{resource.description}</span></span><ArrowUpRight size={15} /></a>)}</div>
        </section>
        <section className="faq-section" id="faq"><SectionTitle eyebrow="A FEW QUICK ANSWERS" title="Questions students ask" /><div className="faq-grid">{faq.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>
        <section className="closing-cta"><div><span className="eyebrow">YOUR FUTURE IS BUILT, NOT FOUND</span><h2>Start where you are.<br /><span>Grow from there.</span></h2><p>Pick one skill. Follow one roadmap. Take one step today.</p></div><Link to="/roadmaps" className="button-light">Choose your roadmap <ArrowRight size={16} /></Link></section>
      </main>
    </>
  );
}
