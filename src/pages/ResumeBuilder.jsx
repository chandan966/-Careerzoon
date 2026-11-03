import { useEffect, useMemo, useState } from 'react';
import { Download, FileText, Plus, Printer, Trash2 } from 'lucide-react';
import './ResumeBuilder.css';

const blankResume = {
  name: '', role: '', email: '', phone: '', location: '', portfolio: '', objective: '',
  education: [{ school: '', degree: '', years: '' }],
  projects: [{ title: '', description: '', link: '' }],
  skills: '', experience: '', certifications: '', achievements: '', languages: '',
};

function getResume() {
  try {
    const stored = JSON.parse(localStorage.getItem('careerzoon-resume') || 'null');
    return stored ? { ...blankResume, ...stored } : blankResume;
  } catch {
    return blankResume;
  }
}

export default function ResumeBuilder() {
  const [resume, setResume] = useState(getResume);
  const [template, setTemplate] = useState('classic');
  const [notice, setNotice] = useState('');
  useEffect(() => localStorage.setItem('careerzoon-resume', JSON.stringify(resume)), [resume]);

  const skills = useMemo(() => resume.skills.split(',').map((skill) => skill.trim()).filter(Boolean), [resume.skills]);
  function update(field, value) { setResume((current) => ({ ...current, [field]: value })); }
  function updateGroup(group, index, field, value) {
    setResume((current) => ({ ...current, [group]: current[group].map((entry, itemIndex) => itemIndex === index ? { ...entry, [field]: value } : entry) }));
  }
  function addGroup(group, entry) { setResume((current) => ({ ...current, [group]: [...current[group], entry] })); }
  function removeGroup(group, index) { setResume((current) => ({ ...current, [group]: current[group].filter((_, itemIndex) => itemIndex !== index) })); }
  async function downloadPdf() {
    if (!resume.name.trim()) {
      setNotice('Add your name before downloading your resume.');
      return;
    }
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    const margin = 18;
    const maxWidth = 174;
    let y = 22;
    const addLine = (text, size = 10, bold = false, color = [47, 55, 75]) => {
      pdf.setFont('helvetica', bold ? 'bold' : 'normal');
      pdf.setFontSize(size);
      pdf.setTextColor(...color);
      const lines = pdf.splitTextToSize(text || ' ', maxWidth);
      if (y + lines.length * (size * .48) > 278) { pdf.addPage(); y = 20; }
      pdf.text(lines, margin, y);
      y += lines.length * (size * .48) + (size > 14 ? 4 : 3);
    };
    addLine(resume.name, 22, true, [32, 37, 55]);
    if (resume.role) addLine(resume.role, 11, true, [111, 63, 189]);
    addLine([resume.email, resume.phone, resume.location, resume.portfolio].filter(Boolean).join('  |  '), 9, false, [95, 105, 120]);
    const section = (heading, body) => {
      if (!body) return;
      y += 3;
      addLine(heading.toUpperCase(), 10, true, [111, 63, 189]);
      addLine(body, 9);
    };
    section('Profile', resume.objective);
    section('Education', resume.education.map((item) => [item.degree, item.school, item.years].filter(Boolean).join(' — ')).filter(Boolean).join('\n'));
    section('Skills', skills.join('  ·  '));
    section('Experience', resume.experience);
    section('Projects', resume.projects.map((item) => [item.title, item.description, item.link].filter(Boolean).join(' — ')).filter(Boolean).join('\n'));
    section('Certifications', resume.certifications);
    section('Achievements', resume.achievements);
    section('Languages', resume.languages);
    pdf.save(`${resume.name.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-resume.pdf`);
    setNotice('Your PDF resume is ready to download.');
  }

  return <main className="resume-page"><div className="page-hero"><div className="page-hero-inner"><span className="eyebrow">FREE RESUME BUILDER</span><h1>Make your next move stand out.</h1><p>Create a clear, ATS-friendly resume. Your information stays on this device—no account or upload required.</p><div className="page-hero-meta"><span>✓ Saved privately in your browser</span><span>✓ Download a PDF or print</span></div></div></div><div className="resume-workspace"><section className="resume-form-panel"><div className="resume-panel-head"><div><span className="eyebrow">YOUR DETAILS</span><h2>Build your resume</h2></div><label className="template-picker">Template<select value={template} onChange={(event) => setTemplate(event.target.value)}><option value="classic">Classic ATS</option><option value="modern">Modern minimal</option></select></label></div>
    <div className="resume-form">
      <ResumeSection title="Personal information"><div className="form-grid"><Field label="Full name" value={resume.name} onChange={(value) => update('name', value)} placeholder="e.g. Aanya Sharma" /><Field label="Target role" value={resume.role} onChange={(value) => update('role', value)} placeholder="e.g. Junior Frontend Developer" /><Field label="Email" value={resume.email} onChange={(value) => update('email', value)} placeholder="you@example.com" type="email" /><Field label="Phone" value={resume.phone} onChange={(value) => update('phone', value)} placeholder="+91 98765 43210" /><Field label="Location" value={resume.location} onChange={(value) => update('location', value)} placeholder="City, Country" /><Field label="Portfolio / LinkedIn" value={resume.portfolio} onChange={(value) => update('portfolio', value)} placeholder="linkedin.com/in/you" /></div></ResumeSection>
      <ResumeSection title="Career summary"><textarea value={resume.objective} onChange={(event) => update('objective', event.target.value)} placeholder="Write 2–3 concise sentences about your strengths and the role you’re pursuing." rows="3" /></ResumeSection>
      <ResumeSection title="Education" add={() => addGroup('education', { school: '', degree: '', years: '' })}>{resume.education.map((item, index) => <div className="repeat-group" key={`education-${index}`}><div className="form-grid"><Field label="Institution" value={item.school} onChange={(value) => updateGroup('education', index, 'school', value)} placeholder="University or college" /><Field label="Degree / course" value={item.degree} onChange={(value) => updateGroup('education', index, 'degree', value)} placeholder="B.Tech, Computer Science" /><Field label="Years" value={item.years} onChange={(value) => updateGroup('education', index, 'years', value)} placeholder="2022 – 2026" /></div>{resume.education.length > 1 && <button className="remove-row" onClick={() => removeGroup('education', index)} aria-label="Remove education"><Trash2 size={14} /></button>}</div>)}</ResumeSection>
      <ResumeSection title="Technical skills"><Field label="Skills (comma separated)" value={resume.skills} onChange={(value) => update('skills', value)} placeholder="JavaScript, React, Git, SQL" /></ResumeSection>
      <ResumeSection title="Experience"><textarea value={resume.experience} onChange={(event) => update('experience', event.target.value)} placeholder="Role, organization and dates. Describe your impact with clear action verbs and measurable results." rows="4" /></ResumeSection>
      <ResumeSection title="Projects" add={() => addGroup('projects', { title: '', description: '', link: '' })}>{resume.projects.map((item, index) => <div className="repeat-group" key={`project-${index}`}><div className="form-grid"><Field label="Project name" value={item.title} onChange={(value) => updateGroup('projects', index, 'title', value)} placeholder="e.g. Campus events app" /><Field label="Project link" value={item.link} onChange={(value) => updateGroup('projects', index, 'link', value)} placeholder="github.com/you/project" /><label className="field-label full-field">What you built<textarea value={item.description} onChange={(event) => updateGroup('projects', index, 'description', event.target.value)} placeholder="Tools used, your contribution and the outcome." rows="2" /></label></div>{resume.projects.length > 1 && <button className="remove-row" onClick={() => removeGroup('projects', index)} aria-label="Remove project"><Trash2 size={14} /></button>}</div>)}</ResumeSection>
      <ResumeSection title="Certifications & achievements"><Field label="Certifications" value={resume.certifications} onChange={(value) => update('certifications', value)} placeholder="Certification — issuer, year" /><Field label="Achievements" value={resume.achievements} onChange={(value) => update('achievements', value)} placeholder="Awards, competitions, contributions" /><Field label="Languages" value={resume.languages} onChange={(value) => update('languages', value)} placeholder="English, Hindi" /></ResumeSection>
    </div>
    {notice && <p className="resume-notice" role="status">{notice}</p>}
    <div className="resume-actions"><button className="button-primary" onClick={downloadPdf}><Download size={15} /> Download PDF</button><button className="resume-print" onClick={() => window.print()}><Printer size={15} /> Print</button><span>Saved automatically on this device</span></div>
  </section>
  <aside className="resume-preview-panel"><div className="preview-head"><div><span className="eyebrow">LIVE PREVIEW</span><h2>{template === 'classic' ? 'Classic ATS' : 'Modern minimal'}</h2></div><FileText size={18} /></div><article className={`resume-preview ${template}`}><header><h1>{resume.name || 'Your Name'}</h1>{resume.role && <h2>{resume.role}</h2>}<p>{[resume.email, resume.phone, resume.location, resume.portfolio].filter(Boolean).join('  ·  ') || 'email@example.com  ·  City, Country'}</p></header>
    {resume.objective && <PreviewSection title="Profile"><p>{resume.objective}</p></PreviewSection>}
    {resume.education.some((item) => item.school || item.degree) && <PreviewSection title="Education">{resume.education.filter((item) => item.school || item.degree).map((item, index) => <p key={index}><b>{item.degree || 'Degree / course'}</b><br />{item.school}{item.years ? ` · ${item.years}` : ''}</p>)}</PreviewSection>}
    {skills.length > 0 && <PreviewSection title="Technical skills"><div className="preview-skills">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></PreviewSection>}
    {resume.experience && <PreviewSection title="Experience"><p className="preserve-lines">{resume.experience}</p></PreviewSection>}
    {resume.projects.some((item) => item.title || item.description) && <PreviewSection title="Projects">{resume.projects.filter((item) => item.title || item.description).map((item, index) => <p key={index}><b>{item.title || 'Project'}</b><br /><span className="preserve-lines">{item.description}</span></p>)}</PreviewSection>}
    {resume.certifications && <PreviewSection title="Certifications"><p className="preserve-lines">{resume.certifications}</p></PreviewSection>}{resume.achievements && <PreviewSection title="Achievements"><p className="preserve-lines">{resume.achievements}</p></PreviewSection>}{resume.languages && <PreviewSection title="Languages"><p>{resume.languages}</p></PreviewSection>}
    </article><div className="privacy-note">Your resume details are stored only in this browser’s local storage.</div></aside></div></main>;
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return <label className="field-label">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}
function ResumeSection({ title, children, add }) {
  return <section className="resume-section"><div className="resume-section-title"><h3>{title}</h3>{add && <button onClick={add}><Plus size={13} /> Add</button>}</div>{children}</section>;
}
function PreviewSection({ title, children }) {
  return <section className="preview-section"><h3>{title}</h3>{children}</section>;
}
