import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  Download,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Plus,
  Printer,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import './ResumeBuilder.css';

const blankResume = {
  name: '',
  role: '',
  email: '',
  phone: '',
  location: '',
  portfolio: '',
  objective: '',
  education: [{ school: '', degree: '', years: '' }],
  projects: [{ title: '', description: '', link: '' }],
  skills: '',
  experience: '',
  certifications: '',
  achievements: '',
  languages: '',
};

const sampleResume = {
  name: 'Aanya Sharma',
  role: 'Software Development Engineer',
  email: 'aanya.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  portfolio: 'github.com/aanya-sharma',
  objective:
    'Results-driven software engineer with strong foundations in full-stack web development, data structures, and database design. Experienced in building responsive React applications and robust Node.js APIs with a focus on performance and clean architecture.',
  education: [
    {
      school: 'National Institute of Technology',
      degree: 'B.Tech in Computer Science & Engineering',
      years: '2020 – 2024',
    },
  ],
  skills:
    'JavaScript, TypeScript, React, Node.js, Express, Python, SQL, PostgreSQL, Git, Docker, REST APIs, Tailwind CSS',
  experience:
    'Software Engineer Intern · TechNova Solutions (Jan 2024 – Jun 2024)\n• Developed and shipped 8+ responsive React components, improving page load performance by 28% across high-traffic user dashboards.\n• Designed and integrated RESTful endpoints with Node.js and PostgreSQL, optimizing database queries to reduce API latency by 35%.\n• Collaborated closely in an Agile engineering team of 6, participating in sprint planning, code reviews, and automated CI/CD pipeline deployments.',
  projects: [
    {
      title: 'DevCollab — Realtime Developer Workspace',
      link: 'github.com/aanya-sharma/devcollab',
      description:
        'Engineered a full-stack collaborative markdown editor with live syntax highlighting, multi-user document syncing via WebSockets, and secure JWT-based authentication.',
    },
    {
      title: 'AlgoVisualizer — Interactive DSA Learning Tool',
      link: 'github.com/aanya-sharma/algovis',
      description:
        'Built an interactive browser-based visualization platform for graph pathfinding and sorting algorithms with step-by-step playback controls, serving over 12,000 student learners.',
    },
  ],
  certifications:
    'AWS Certified Cloud Practitioner (2024) · Meta Frontend Developer Certificate (2023)',
  achievements:
    'Ranked Top 5% in University Coding Hackathon (2023) · Solved 450+ Data Structures & Algorithms problems on LeetCode',
  languages: 'English (Professional), Hindi (Native)',
};

const templateOptions = [
  { id: 'modern', name: 'Modern Professional', desc: 'Tech & Startups', accent: '#0d9488' },
  { id: 'classic', name: 'Executive Classic', desc: 'Corporate & Enterprise', accent: '#1e3a8a' },
  { id: 'tech', name: 'Tech / Engineering', desc: 'Developers & Code', accent: '#6366f1' },
  { id: 'minimal', name: 'Minimalist Clean', desc: 'ATS Pure & Minimal', accent: '#374151' },
];

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
  const [template, setTemplate] = useState('modern');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('careerzoon-resume', JSON.stringify(resume));
    } catch {
      // Ignore storage errors if private mode or quota is restricted
    }
  }, [resume]);

  const skills = useMemo(
    () => resume.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
    [resume.skills]
  );

  const atsScore = useMemo(() => {
    let score = 0;
    if (resume.name.trim()) score += 10;
    if (resume.role.trim()) score += 10;
    if (resume.email.trim()) score += 10;
    if (resume.phone.trim() || resume.location.trim()) score += 10;
    if (resume.objective.trim().length > 30) score += 15;
    if (resume.education.some((item) => item.school.trim() && item.degree.trim())) score += 15;
    if (skills.length >= 3) score += 15;
    if (
      resume.experience.trim().length > 30 ||
      resume.projects.some((item) => item.title.trim() && item.description.trim())
    ) {
      score += 15;
    }
    return Math.min(100, score);
  }, [resume, skills]);

  function update(field, value) {
    setResume((current) => ({ ...current, [field]: value }));
  }

  function updateGroup(group, index, field, value) {
    setResume((current) => ({
      ...current,
      [group]: current[group].map((entry, itemIndex) =>
        itemIndex === index ? { ...entry, [field]: value } : entry
      ),
    }));
  }

  function addGroup(group, entry) {
    setResume((current) => ({ ...current, [group]: [...current[group], entry] }));
  }

  function removeGroup(group, index) {
    setResume((current) => ({
      ...current,
      [group]: current[group].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function handleLoadSample() {
    setResume(sampleResume);
    setNotice('Sample resume loaded! You can now customize all fields with your own details.');
  }

  function handleReset() {
    if (window.confirm('Reset resume to a clean blank form?')) {
      setResume(blankResume);
      setNotice('Resume form cleared.');
    }
  }

  function exportJson() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement('a');
    const safeName = resume.name.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'resume';
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${safeName}-careerzoon-backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setNotice('Resume backup file exported successfully.');
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && typeof parsed === 'object') {
          setResume({ ...blankResume, ...parsed });
          setNotice('Resume backup restored successfully!');
        }
      } catch {
        setNotice('Invalid backup file. Please select a valid JSON backup.');
      }
    };
    reader.readAsText(file);
  }

  async function downloadPdf() {
    if (!resume.name.trim()) {
      setNotice('Please enter your full name before downloading your resume.');
      return;
    }
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const margin = 18;
    const pageWidth = 210;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const themes = {
      modern: {
        primary: [15, 23, 42],
        accent: [13, 148, 136],
        subtext: [71, 85, 105],
        divider: [204, 251, 241],
        ruleWidth: 0.6,
        topBar: true,
        topBarColor: [13, 148, 136],
      },
      classic: {
        primary: [15, 23, 42],
        accent: [30, 58, 138],
        subtext: [71, 85, 105],
        divider: [203, 213, 225],
        ruleWidth: 0.5,
        topBar: false,
      },
      tech: {
        primary: [15, 23, 42],
        accent: [99, 102, 241],
        subtext: [79, 70, 229],
        divider: [224, 231, 255],
        ruleWidth: 0.7,
        topBar: true,
        topBarColor: [99, 102, 241],
      },
      minimal: {
        primary: [17, 24, 39],
        accent: [55, 65, 81],
        subtext: [107, 114, 128],
        divider: [229, 231, 235],
        ruleWidth: 0.35,
        topBar: false,
      },
    };

    const theme = themes[template] || themes.modern;

    if (theme.topBar) {
      pdf.setFillColor(...theme.topBarColor);
      pdf.rect(0, 0, pageWidth, 4, 'F');
      y = 22;
    }

    const addText = (text, size = 10, bold = false, color = [47, 55, 75], spacing = 2) => {
      if (!text) return;
      pdf.setFont('helvetica', bold ? 'bold' : 'normal');
      pdf.setFontSize(size);
      pdf.setTextColor(...color);
      const lines = pdf.splitTextToSize(text, maxWidth);
      const lineHeight = size * 0.42;
      if (y + lines.length * lineHeight > 278) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(lines, margin, y);
      y += lines.length * lineHeight + spacing;
    };

    addText(resume.name, 22, true, theme.primary, 1);
    if (resume.role) {
      addText(resume.role, 11, true, theme.accent, 2);
    }

    const contactList = [resume.email, resume.phone, resume.location, resume.portfolio].filter(Boolean);
    if (contactList.length) {
      addText(contactList.join('   |   '), 8.5, false, theme.subtext, 3);
    }

    pdf.setDrawColor(...theme.accent);
    pdf.setLineWidth(theme.ruleWidth);
    pdf.line(margin, y, margin + maxWidth, y);
    y += 5;

    const addSection = (heading, content) => {
      if (!content) return;
      if (Array.isArray(content) && content.length === 0) return;
      if (typeof content === 'string' && !content.trim()) return;

      if (y > 255) {
        pdf.addPage();
        y = 20;
      }

      addText(heading.toUpperCase(), 10, true, theme.accent, 1.5);
      pdf.setDrawColor(...theme.divider);
      pdf.setLineWidth(0.35);
      pdf.line(margin, y, margin + maxWidth, y);
      y += 3.5;

      if (typeof content === 'string') {
        const items = content.split('\n');
        items.forEach((item) => {
          if (!item.trim()) return;
          addText(item.trim(), 9, false, [51, 65, 85], 1.8);
        });
      } else if (Array.isArray(content)) {
        content.forEach((item) => {
          if (!item) return;
          addText(item, 9, false, [51, 65, 85], 2);
        });
      }
      y += 2.5;
    };

    addSection('Professional Summary', resume.objective);

    const educationContent = resume.education
      .filter((e) => e.school || e.degree)
      .map((e) => [e.degree, e.school, e.years].filter(Boolean).join('   —   '));
    addSection('Education', educationContent);

    if (skills.length > 0) {
      addSection('Technical Skills', skills.join('   ·   '));
    }

    addSection('Experience', resume.experience);

    const projectContent = resume.projects
      .filter((p) => p.title || p.description)
      .map((p) => {
        let str = p.title || 'Project';
        if (p.link) str += ` (${p.link})`;
        if (p.description) str += `\n${p.description}`;
        return str;
      });
    addSection('Key Projects', projectContent);

    addSection('Certifications', resume.certifications);
    addSection('Achievements & Honors', resume.achievements);
    addSection('Languages', resume.languages);

    const safeFilename =
      resume.name
        .trim()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase() || 'careerzoon';
    pdf.save(`${safeFilename}-resume.pdf`);
    setNotice('Your professional PDF resume has been downloaded successfully.');
  }

  return (
    <main className="resume-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">PROFESSIONAL RESUME BUILDER</span>
          <h1>Create an ATS-ready resume that gets noticed.</h1>
          <p>Choose from curated professional templates, edit in real time, and download a publication-grade PDF. Your data stays 100% private on your device.</p>
          <div className="page-hero-meta">
            <span>✓ 100% Free &amp; Private</span>
            <span>✓ ATS-Optimized Formats</span>
            <span>✓ Vector PDF Download</span>
            <span>✓ Instant Print</span>
          </div>
        </div>
      </div>

      <div className="resume-workspace">
        <section className="resume-form-panel">
          <div className="resume-panel-head">
            <div>
              <span className="eyebrow">RESUME EDITOR</span>
              <h2>Fill your details</h2>
            </div>
            <div className="resume-panel-head-actions">
              <button
                type="button"
                className="resume-quick-btn sample"
                onClick={handleLoadSample}
                title="Fill with professional example data"
              >
                <Sparkles size={13} /> Load Sample
              </button>
              <button
                type="button"
                className="resume-quick-btn reset"
                onClick={handleReset}
                title="Clear all fields"
              >
                <RotateCcw size={13} /> Clear
              </button>
            </div>
          </div>

          <div className="template-picker-section">
            <span className="template-section-label">Select Professional Template:</span>
            <div className="template-picker-grid" role="tablist" aria-label="Resume templates">
              {templateOptions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={template === t.id}
                  className={`template-card-btn ${template === t.id ? 'active' : ''}`}
                  onClick={() => setTemplate(t.id)}
                >
                  <span className="template-swatch" style={{ background: t.accent }} />
                  <span className="template-card-texts">
                    <strong className="template-card-name">{t.name}</strong>
                    <small className="template-card-desc">{t.desc}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="ats-score-box">
            <div className="ats-score-header">
              <span>
                <Sparkles size={14} /> ATS Readiness Score: <b>{atsScore}/100</b>
              </span>
              <span className={`ats-score-badge ${atsScore >= 80 ? 'strong' : atsScore >= 50 ? 'good' : 'warning'}`}>
                {atsScore >= 80 ? 'Strong ATS Match' : atsScore >= 50 ? 'Good Start' : 'Needs More Detail'}
              </span>
            </div>
            <div className="ats-score-bar">
              <div
                className="ats-score-fill"
                style={{
                  width: `${atsScore}%`,
                  background:
                    atsScore >= 80
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : atsScore >= 50
                      ? 'linear-gradient(90deg, #f59e0b, #10b981)'
                      : 'linear-gradient(90deg, #ef4444, #f59e0b)',
                }}
              />
            </div>
            <p className="ats-score-tip">
              {atsScore < 50
                ? 'Tip: Add target role, education, and at least 3 skills to reach 50+.'
                : atsScore < 80
                ? 'Tip: Include a 2-3 sentence career summary and at least one project or work experience.'
                : 'Great job! Your resume has strong ATS coverage with all key sections filled.'}
            </p>
          </div>

          <div className="resume-form">
            <ResumeSection title="Personal information" icon={<Briefcase size={14} />}>
              <div className="form-grid">
                <Field label="Full name" value={resume.name} onChange={(value) => update('name', value)} placeholder="e.g. Aanya Sharma" />
                <Field label="Target role" value={resume.role} onChange={(value) => update('role', value)} placeholder="e.g. Software Development Engineer" />
                <Field label="Email" value={resume.email} onChange={(value) => update('email', value)} placeholder="you@example.com" type="email" />
                <Field label="Phone" value={resume.phone} onChange={(value) => update('phone', value)} placeholder="+91 98765 43210" />
                <Field label="Location" value={resume.location} onChange={(value) => update('location', value)} placeholder="Bengaluru, India" />
                <Field label="Portfolio / LinkedIn / GitHub" value={resume.portfolio} onChange={(value) => update('portfolio', value)} placeholder="github.com/your-username" />
              </div>
            </ResumeSection>

            <ResumeSection title="Career summary" icon={<FileText size={14} />}>
              <textarea
                value={resume.objective}
                onChange={(event) => update('objective', event.target.value)}
                placeholder="Write 2–3 concise sentences highlighting your core technical competencies, engineering strengths, and career goals."
                rows="3"
              />
            </ResumeSection>

            <ResumeSection
              title="Education"
              icon={<GraduationCap size={14} />}
              add={() => addGroup('education', { school: '', degree: '', years: '' })}
            >
              {resume.education.map((item, index) => (
                <div className="repeat-group" key={`education-${index}`}>
                  <div className="form-grid">
                    <Field label="Institution" value={item.school} onChange={(value) => updateGroup('education', index, 'school', value)} placeholder="e.g. National Institute of Technology" />
                    <Field label="Degree / Branch" value={item.degree} onChange={(value) => updateGroup('education', index, 'degree', value)} placeholder="e.g. B.Tech in Computer Science" />
                    <Field label="Graduation Year" value={item.years} onChange={(value) => updateGroup('education', index, 'years', value)} placeholder="e.g. 2020 – 2024" />
                  </div>
                  {resume.education.length > 1 && (
                    <button className="remove-row" onClick={() => removeGroup('education', index)} aria-label="Remove education">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </ResumeSection>

            <ResumeSection title="Technical skills" icon={<Code2 size={14} />}>
              <Field
                label="Skills (comma separated)"
                value={resume.skills}
                onChange={(value) => update('skills', value)}
                placeholder="e.g. JavaScript, TypeScript, React, Node.js, Express, Python, SQL, PostgreSQL, Git, Docker"
              />
            </ResumeSection>

            <ResumeSection title="Experience" icon={<Briefcase size={14} />}>
              <textarea
                value={resume.experience}
                onChange={(event) => update('experience', event.target.value)}
                placeholder="Role, organization, and dates. Use action bullet points (•) describing your technical impact and measurable results."
                rows="5"
              />
            </ResumeSection>

            <ResumeSection
              title="Key projects"
              icon={<Code2 size={14} />}
              add={() => addGroup('projects', { title: '', description: '', link: '' })}
            >
              {resume.projects.map((item, index) => (
                <div className="repeat-group" key={`project-${index}`}>
                  <div className="form-grid">
                    <Field label="Project title" value={item.title} onChange={(value) => updateGroup('projects', index, 'title', value)} placeholder="e.g. DevCollab — Realtime Workspace" />
                    <Field label="Repository / Live Demo link" value={item.link} onChange={(value) => updateGroup('projects', index, 'link', value)} placeholder="github.com/username/project" />
                    <label className="field-label full-field">
                      Project description &amp; technical stack
                      <textarea
                        value={item.description}
                        onChange={(event) => updateGroup('projects', index, 'description', event.target.value)}
                        placeholder="Technologies used, architecture choices, your contribution, and measurable outcomes."
                        rows="2"
                      />
                    </label>
                  </div>
                  {resume.projects.length > 1 && (
                    <button className="remove-row" onClick={() => removeGroup('projects', index)} aria-label="Remove project">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </ResumeSection>

            <ResumeSection title="Certifications, honors &amp; languages" icon={<Award size={14} />}>
              <Field label="Certifications" value={resume.certifications} onChange={(value) => update('certifications', value)} placeholder="e.g. AWS Certified Cloud Practitioner (2024)" />
              <Field label="Achievements &amp; Hackathons" value={resume.achievements} onChange={(value) => update('achievements', value)} placeholder="e.g. Top 5% in University Hackathon, 450+ LeetCode problems" />
              <Field label="Languages" value={resume.languages} onChange={(value) => update('languages', value)} placeholder="e.g. English (Fluent), Hindi (Native)" />
            </ResumeSection>
          </div>

          {notice && <p className="resume-notice" role="status">{notice}</p>}

          <div className="resume-actions">
            <button type="button" className="button-primary download-btn" onClick={downloadPdf}>
              <Download size={15} /> Download PDF
            </button>
            <button type="button" className="resume-print" onClick={() => window.print()}>
              <Printer size={15} /> Print
            </button>
            <div className="resume-backup-buttons">
              <button type="button" className="resume-backup-btn" onClick={exportJson} title="Export resume JSON backup">
                Backup JSON
              </button>
              <label className="resume-backup-btn" title="Import resume JSON backup">
                Restore JSON
                <input type="file" accept=".json" onChange={importJson} style={{ display: 'none' }} />
              </label>
            </div>
            <span className="privacy-badge">🔒 100% Local Storage</span>
          </div>
        </section>

        <aside className="resume-preview-panel">
          <div className="preview-head">
            <div>
              <span className="eyebrow">LIVE A4 PREVIEW</span>
              <h2>
                {templateOptions.find((t) => t.id === template)?.name || 'Modern Professional'}
              </h2>
            </div>
            <div className="preview-format-tag">
              <FileText size={14} />
              <span>A4 Document</span>
            </div>
          </div>

          <div className="resume-preview-wrapper">
            <article className={`resume-preview ${template}`}>
              {(template === 'modern' || template === 'tech') && <div className="preview-top-accent" />}
              <header className="resume-preview-header">
                <h1 className="preview-name">{resume.name || 'Your Full Name'}</h1>
                <h2 className="preview-role">{resume.role || 'Your Professional Headline / Target Role'}</h2>
                <div className="preview-contact-bar">
                  {resume.email ? (
                    <span className="contact-item">
                      <Mail size={12} /> {resume.email}
                    </span>
                  ) : (
                    <span className="contact-item placeholder">
                      <Mail size={12} /> email@example.com
                    </span>
                  )}
                  {resume.phone && (
                    <span className="contact-item">
                      <Phone size={12} /> {resume.phone}
                    </span>
                  )}
                  {resume.location && (
                    <span className="contact-item">
                      <MapPin size={12} /> {resume.location}
                    </span>
                  )}
                  {resume.portfolio && (
                    <span className="contact-item">
                      <Globe size={12} /> {resume.portfolio}
                    </span>
                  )}
                </div>
              </header>

              {resume.objective && (
                <PreviewSection title="Professional Summary">
                  <p className="preview-body-text">{resume.objective}</p>
                </PreviewSection>
              )}

              {resume.education.some((item) => item.school || item.degree) && (
                <PreviewSection title="Education">
                  {resume.education
                    .filter((item) => item.school || item.degree)
                    .map((item, index) => (
                      <div className="preview-entry" key={index}>
                        <div className="preview-entry-head">
                          <strong className="entry-title">{item.degree || 'Degree / Course of Study'}</strong>
                          {item.years && <span className="entry-date">{item.years}</span>}
                        </div>
                        <div className="entry-sub">{item.school || 'University / Institution'}</div>
                      </div>
                    ))}
                </PreviewSection>
              )}

              {skills.length > 0 && (
                <PreviewSection title="Technical Skills">
                  <div className="preview-skills">
                    {skills.map((skill) => (
                      <span className="skill-chip" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </PreviewSection>
              )}

              {resume.experience && (
                <PreviewSection title="Experience">
                  <div className="preview-body-text preserve-lines">{resume.experience}</div>
                </PreviewSection>
              )}

              {resume.projects.some((item) => item.title || item.description) && (
                <PreviewSection title="Key Projects">
                  {resume.projects
                    .filter((item) => item.title || item.description)
                    .map((item, index) => (
                      <div className="preview-entry" key={index}>
                        <div className="preview-entry-head">
                          <strong className="entry-title">{item.title || 'Project Name'}</strong>
                          {item.link && (
                            <span className="entry-link">
                              <ExternalLink size={10} /> {item.link}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <div className="preview-body-text preserve-lines entry-desc">
                            {item.description}
                          </div>
                        )}
                      </div>
                    ))}
                </PreviewSection>
              )}

              {resume.certifications && (
                <PreviewSection title="Certifications">
                  <div className="preview-body-text preserve-lines">{resume.certifications}</div>
                </PreviewSection>
              )}

              {resume.achievements && (
                <PreviewSection title="Achievements &amp; Honors">
                  <div className="preview-body-text preserve-lines">{resume.achievements}</div>
                </PreviewSection>
              )}

              {resume.languages && (
                <PreviewSection title="Languages">
                  <div className="preview-body-text">{resume.languages}</div>
                </PreviewSection>
              )}
            </article>
          </div>

          <div className="privacy-note">
            <CheckCircle2 size={13} /> Stored privately in browser local storage. No server uploads.
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="field-label">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function ResumeSection({ title, icon, children, add }) {
  return (
    <section className="resume-section">
      <div className="resume-section-title">
        <h3>
          {icon}
          <span>{title}</span>
        </h3>
        {add && (
          <button type="button" onClick={add}>
            <Plus size={13} /> Add
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function PreviewSection({ title, children }) {
  return (
    <section className="preview-section">
      <h3 className="preview-section-title">{title}</h3>
      {children}
    </section>
  );
}
