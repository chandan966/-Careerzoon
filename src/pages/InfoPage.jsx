import { useState } from 'react';
import { ArrowRight, Check, Copy, Download, Heart, Mail, ShieldCheck } from 'lucide-react';
import './InfoPage.css';

export default function InfoPage({ page }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);

  function makeDraft(event) {
    event.preventDefault();
    const message = `Careerzoon feedback\n\nFrom: ${form.name}\nReply-to: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`;
    setDraft(message);
  }
  async function copyDraft() {
    try { await navigator.clipboard.writeText(draft); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); }
  }
  function downloadDraft() {
    const url = URL.createObjectURL(new Blob([draft], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'careerzoon-feedback.txt'; link.click();
    URL.revokeObjectURL(url);
  }

  if (page === 'about') return <main className="info-page"><div className="page-hero"><div className="page-hero-inner"><span className="eyebrow">ABOUT CAREERZOON</span><h1>A clearer first step into technology.</h1><p>We help students and early-career learners explore IT careers, build practical skills and prepare for their next opportunity.</p></div></div><div className="info-content"><section className="about-card"><span className="about-icon"><Heart size={20} /></span><span className="eyebrow">OUR PURPOSE</span><h2>Make career exploration feel more possible.</h2><p>Careerzoon brings career guides, learning roadmaps, trusted resources and useful browser-based tools together in one accessible place. The goal is to help you take a practical next step—not to promise shortcuts or guaranteed outcomes.</p><div className="about-principles"><div><Check size={16} /><span><b>Open to everyone</b><small>No account, login or paid subscription required.</small></span></div><div><Check size={16} /><span><b>Learn by doing</b><small>Explore skills through projects and clear learning sequences.</small></span></div><div><ShieldCheck size={16} /><span><b>Private by design</b><small>Personal progress and resume data stay in your browser.</small></span></div></div></section><section className="about-note"><h3>Honest opportunities. Always.</h3><p>Careerzoon does not invent live job or internship listings. We direct learners to trusted search platforms and official company career sites so they can check current details at the source.</p></section></div></main>;

  return <main className="info-page"><div className="page-hero"><div className="page-hero-inner"><span className="eyebrow">CONTACT CAREERZOON</span><h1>Share a thought or suggestion.</h1><p>Careerzoon is a frontend-only site and does not have a message server. Draft your note here, then copy or download it to share through a channel you already trust.</p></div></div><div className="info-content contact-layout"><section className="contact-form-card"><span className="eyebrow">WRITE A MESSAGE</span><form onSubmit={makeDraft}><label>Your name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Your email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Subject<input required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} /></label><label>Message<textarea required rows="5" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label><button className="button-primary" type="submit"><Mail size={14} /> Prepare message</button></form>{draft && <div className="contact-draft"><div><b>Your message draft</b><div><button onClick={copyDraft}><Copy size={13} />{copied ? 'Copied' : 'Copy'}</button><button onClick={downloadDraft}><Download size={13} />Download</button></div></div><pre>{draft}</pre><small>This message has not been sent. Careerzoon does not receive or store it.</small></div>}</section><aside className="contact-note"><span className="about-icon"><ShieldCheck size={20} /></span><h2>Your message stays yours.</h2><p>The form only prepares a local message for you. It does not transmit or store personal information.</p><p>If you are reporting a suspicious job, please contact the relevant job board or company through its official website.</p></aside></div></main>;
}
