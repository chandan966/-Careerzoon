import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Briefcase,
  CheckCircle2,
  Code2,
  Download,
  FileText,
  Globe,
  GraduationCap,
  Layers,
  Mail,
  Plus,
  Printer,
  RotateCcw,
  Sparkles,
  Trash2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import './ResumeBuilder.css';

export const SKILL_CATEGORY_DEFS = [
  { key: 'languages', label: 'Programming Languages' },
  { key: 'frameworks', label: 'Frameworks & Libraries' },
  { key: 'frontend', label: 'Frontend Technologies' },
  { key: 'backend', label: 'Backend Technologies' },
  { key: 'databases', label: 'Databases' },
  { key: 'tools', label: 'Tools & Platforms' },
  { key: 'other', label: 'Other Technical Skills' },
];

const blankResume = {
  name: '',
  role: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  portfolio: '',
  objective: '',
  education: [
    { degree: '', school: '', board: '', location: '', startYear: '', years: '', gpa: '' },
  ],
  skillsCategories: {
    languages: '',
    frameworks: '',
    frontend: '',
    backend: '',
    databases: '',
    tools: '',
    other: '',
  },
  skills: '',
  experienceList: [
    { role: '', company: '', location: '', startDate: '', dates: '', bullets: '' },
  ],
  projects: [
    { title: '', technologies: '', link: '', github: '', dates: '', description: '' },
  ],
  certifications: '',
  achievements: '',
  languages: '',
};

const sampleResume = {
  name: 'AANYA SHARMA',
  role: 'Software Development Engineer',
  email: 'aanya.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  linkedin: 'linkedin.com/in/aanya-sharma',
  github: 'github.com/aanya-sharma',
  portfolio: 'aanyasharma.dev',
  objective:
    'Software Development Engineer with a B.Tech in Computer Science & Engineering from NITK Surathkal. Proficient in TypeScript, React.js, Node.js, PostgreSQL, and Docker. Proven experience building scalable web applications, optimizing database queries for sub-200ms latency, and delivering robust CI/CD pipelines in Agile teams.',
  education: [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      school: 'National Institute of Technology Karnataka (NITK)',
      board: '',
      location: 'Surathkal, India',
      startYear: '2020',
      years: '2020 – 2024',
      gpa: 'CGPA: 8.9 / 10',
    },
  ],
  skillsCategories: {
    languages: 'JavaScript (ES6+), TypeScript, Python, Java, C++, SQL, HTML5/CSS3',
    frameworks: 'React.js, Next.js, Node.js, Express.js, Redux Toolkit, Tailwind CSS, Jest',
    frontend: 'React.js, Next.js, TypeScript, Tailwind CSS, Redux Toolkit, HTML5/CSS3',
    backend: 'Node.js, Express.js, RESTful APIs, Microservices Architecture',
    databases: 'PostgreSQL, MongoDB, Redis, Supabase',
    tools: 'Git, GitHub, Docker, AWS (S3, EC2), Postman, Linux, CI/CD Actions',
    other: 'Data Structures & Algorithms, System Design, Object-Oriented Design',
  },
  skills: '',
  experienceList: [
    {
      role: 'Software Engineer Intern',
      company: 'TechNova Solutions',
      location: 'Bengaluru, India',
      startDate: 'Jan 2024',
      dates: 'Jan 2024 – Jun 2024',
      bullets:
        '• Architected and deployed 6+ reusable React micro-frontend components, decreasing customer dashboard initial load time by 28% for 45,000+ active users.\n• Engineered robust RESTful endpoints with Node.js and PostgreSQL, optimizing database indexing to reduce median query response time from 310ms to 185ms.\n• Automated unit and end-to-end integration test suites using Jest and GitHub Actions, elevating automated pipeline test coverage from 62% to 88%.\n• Collaborated in an Agile Scrum team of 7 engineers, actively participating in bi-weekly sprint planning, architecture reviews, and production releases.',
    },
  ],
  projects: [
    {
      title: 'DevCollab — Realtime Collaborative Code Workspace',
      technologies: 'React, Node.js, WebSockets, Redis, Docker',
      link: 'https://devcollab.demo',
      github: 'https://github.com/aanya-sharma/devcollab',
      dates: '2024',
      description:
        '• Architected a real-time collaborative code editor supporting concurrent multi-user editing with Operational Transformation and WebSockets.\n• Integrated syntax highlighting for 12+ programming languages with an isolated Docker-based code execution sandbox.\n• Engineered Redis Pub/Sub channels handling 2,000+ concurrent socket connections with sub-50ms synchronization latency.',
    },
    {
      title: 'CloudMetrics — Distributed System Monitoring Dashboard',
      technologies: 'Next.js, TypeScript, PostgreSQL, Docker, AWS',
      link: 'https://cloudmetrics.demo',
      github: 'https://github.com/aanya-sharma/cloudmetrics',
      dates: '2023',
      description:
        '• Designed an interactive cloud monitoring dashboard aggregating real-time CPU, memory, and API latencies across 40+ microservices.\n• Optimized PostgreSQL timeseries aggregation queries, cutting complex analytical response latency by 38%.\n• Implemented secure JWT role-based authentication and automated alerting via webhooks.',
    },
  ],
  certifications:
    'AWS Certified Cloud Practitioner — Amazon Web Services — 2024\nMeta Front-End Developer Professional Certificate — Meta / Coursera — 2023',
  achievements:
    '1st Place Winner (out of 70+ engineering teams) — National HackIndia Hackathon — 2023\nSolved 500+ Data Structures & Algorithms problems (Knight Rank) — LeetCode & Codeforces — 2024',
  languages: 'English — Professional\nHindi — Fluent\nGerman — Elementary',
};

const templateOptions = [
  {
    id: 'ivy-center',
    name: 'Standard ATS (Centered Header)',
    desc: 'Gold Standard Single-Column · High ATS Parsing Rate',
    align: 'center',
  },
  {
    id: 'ivy-left',
    name: 'Modern ATS (Left Aligned)',
    desc: 'Clean & Structured Single-Column · Engineering ATS',
    align: 'left',
  },
];

const fontOptions = [
  { id: 'sans', name: 'Clean Sans-Serif (Arial / Inter)' },
  { id: 'serif', name: 'Classic Serif (Times / Georgia)' },
];

const actionVerbs = [
  'Developed',
  'Engineered',
  'Optimized',
  'Architected',
  'Implemented',
  'Automated',
  'Spearheaded',
  'Designed',
  'Integrated',
  'Reduced',
  'Increased',
  'Led',
];

// Helper: Extract 4-digit year for reverse-chronological sorting
export function extractYear(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return 0;
  const lower = dateStr.toLowerCase();
  if (lower.includes('present') || lower.includes('current') || lower.includes('now')) {
    return 9999;
  }
  const matches = dateStr.match(/\b(19\d\d|20\d\d)\b/g);
  if (matches && matches.length > 0) {
    return Math.max(...matches.map(Number));
  }
  return 0;
}

export function sortReverseChronological(items, getDateFn) {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const yearA = extractYear(getDateFn(a));
    const yearB = extractYear(getDateFn(b));
    return yearB - yearA;
  });
}

export function parseBullets(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .split('\n')
    .map((line) => line.replace(/^[•\-\*\u2022\u25E6]\s*/, '').trim())
    .filter(Boolean);
}

export function parseLanguages(text) {
  if (!text || typeof text !== 'string') return [];
  const parts = text.includes('\n') ? text.split('\n') : text.split(',');
  return parts
    .map((p) => p.replace(/^[•\-\*]\s*/, '').trim())
    .filter(Boolean)
    .map((entry) => {
      const dashMatch = entry.match(/^([^\-—–(]+)\s*[\-—–]\s*(.+)$/);
      if (dashMatch) {
        return { name: dashMatch[1].trim(), level: dashMatch[2].trim() };
      }
      const parenMatch = entry.match(/^([^(]+)\s*\((.+)\)$/);
      if (parenMatch) {
        return { name: parenMatch[1].trim(), level: parenMatch[2].trim() };
      }
      return { name: entry.trim(), level: '' };
    });
}

export function formatEducationDates(item) {
  if (item.startYear && item.years) {
    if (item.years.includes(item.startYear)) return item.years;
    return `${item.startYear} – ${item.years}`;
  }
  return item.years || item.startYear || '';
}

export function formatEducationInstitution(item) {
  const parts = [];
  if (item.school) parts.push(item.school);
  if (item.board) parts.push(`(${item.board})`);
  return parts.join(' ');
}

export function formatExperienceDates(item) {
  if (item.startDate && item.dates) {
    if (item.dates.includes(item.startDate)) return item.dates;
    return `${item.startDate} – ${item.dates}`;
  }
  return item.dates || item.startDate || '';
}

// Basic input validation helpers
export function isValidEmail(val) {
  if (!val) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

export function isValidPhone(val) {
  if (!val) return true;
  return /^[\d+\-\s()]{7,20}$/.test(val.trim());
}

export function isValidUrl(val) {
  if (!val) return true;
  const clean = val.trim().replace(/^https?:\/\//i, '');
  return clean.length >= 3 && clean.includes('.');
}

// Generate a professional 2-3 line neutral summary strictly from user data (0 hallucination)
export function generateNeutralSummary(resume) {
  const parts = [];
  const role = resume.role?.trim();
  const validEdu = (resume.education || []).filter((e) => e.degree?.trim() || e.school?.trim());
  const latestEdu = validEdu[0];

  const enteredSkills = [];
  if (resume.skillsCategories) {
    Object.values(resume.skillsCategories).forEach((val) => {
      if (val && typeof val === 'string' && val.trim()) {
        val.split(',').forEach((s) => {
          const trimmed = s.trim();
          if (trimmed && !enteredSkills.includes(trimmed)) enteredSkills.push(trimmed);
        });
      }
    });
  }
  if (!enteredSkills.length && resume.skills) {
    resume.skills.split(',').forEach((s) => {
      const trimmed = s.trim();
      if (trimmed && !enteredSkills.includes(trimmed)) enteredSkills.push(trimmed);
    });
  }

  const validExp = (resume.experienceList || []).filter((e) => e.role?.trim() || e.company?.trim());
  const validProj = (resume.projects || []).filter((p) => p.title?.trim());

  if (role && latestEdu?.degree) {
    parts.push(
      `${role} with academic background in ${latestEdu.degree}${
        latestEdu.school ? ` from ${latestEdu.school}` : ''
      }.`
    );
  } else if (role) {
    parts.push(
      `Dedicated ${role} with practical experience applying software engineering principles and building reliable applications.`
    );
  } else if (latestEdu?.degree) {
    parts.push(
      `Engineering graduate with a ${latestEdu.degree}${
        latestEdu.school ? ` from ${latestEdu.school}` : ''
      }.`
    );
  } else {
    parts.push('Results-driven software developer dedicated to delivering scalable, maintainable, and high-quality software.');
  }

  if (enteredSkills.length >= 3) {
    const topSkills = enteredSkills.slice(0, 6).join(', ');
    parts.push(`Proficient in core technologies including ${topSkills}.`);
  }

  if (validExp.length > 0) {
    const latestCompany = validExp[0].company?.trim();
    const latestRole = validExp[0].role?.trim();
    if (latestCompany && latestRole) {
      parts.push(`Brings hands-on industry experience as a ${latestRole} at ${latestCompany}, contributing to robust technical solutions.`);
    } else {
      parts.push('Experienced in collaborative development, following agile methodologies and best engineering practices.');
    }
  } else if (validProj.length > 0) {
    const projectNames = validProj.slice(0, 2).map((p) => p.title?.trim()).filter(Boolean).join(' and ');
    parts.push(`Demonstrated practical engineering ability through technical projects including ${projectNames}.`);
  } else {
    parts.push('Focused on continuous learning, problem solving, and writing efficient, clean code.');
  }

  return parts.join(' ');
}

function getInitialResume() {
  try {
    const stored = JSON.parse(localStorage.getItem('careerzoon-resume') || 'null');
    if (stored) {
      return {
        ...blankResume,
        ...stored,
        github: stored.github || (stored.portfolio?.includes('github') ? stored.portfolio : ''),
        skillsCategories: {
          ...blankResume.skillsCategories,
          ...(stored.skillsCategories || {}),
        },
        education: stored.education?.length ? stored.education : blankResume.education,
        experienceList: stored.experienceList?.length
          ? stored.experienceList
          : stored.experience
          ? [
              {
                role: stored.role || 'Role',
                company: 'Work Experience',
                location: '',
                startDate: '',
                dates: '',
                bullets: stored.experience,
              },
            ]
          : blankResume.experienceList,
        projects: stored.projects?.length ? stored.projects : blankResume.projects,
      };
    }
    return sampleResume;
  } catch {
    return sampleResume;
  }
}

export default function ResumeBuilder() {
  const [resume, setResume] = useState(getInitialResume);
  const [template, setTemplate] = useState('ivy-center');
  const [fontFamily, setFontFamily] = useState('sans');
  const [fontSize, setFontSize] = useState('big');
  const [zoom, setZoom] = useState(100);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('careerzoon-resume', JSON.stringify(resume));
    } catch {
      // Storage unavailable or private browsing
    }
  }, [resume]);

  // Derived sorted data for reverse-chronological presentation
  const sortedEducation = useMemo(() => {
    const valid = (resume.education || []).filter(
      (e) => e.school?.trim() || e.degree?.trim()
    );
    return sortReverseChronological(valid, (e) => formatEducationDates(e));
  }, [resume.education]);

  const sortedExperience = useMemo(() => {
    const valid = (resume.experienceList || []).filter(
      (e) => e.company?.trim() || e.role?.trim() || e.bullets?.trim()
    );
    return sortReverseChronological(valid, (e) => formatExperienceDates(e));
  }, [resume.experienceList]);

  const sortedProjects = useMemo(() => {
    const valid = (resume.projects || []).filter(
      (p) => p.title?.trim() || p.description?.trim()
    );
    return sortReverseChronological(valid, (p) => p.dates || '');
  }, [resume.projects]);

  const parsedLanguages = useMemo(() => {
    return parseLanguages(resume.languages);
  }, [resume.languages]);

  const skillsList = useMemo(() => {
    const fromCats = SKILL_CATEGORY_DEFS.flatMap((cat) => {
      const val = resume.skillsCategories?.[cat.key] || '';
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    });
    if (fromCats.length > 0) return Array.from(new Set(fromCats));
    return (resume.skills || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [resume.skills, resume.skillsCategories]);

  const hasCategorizedSkills = useMemo(() => {
    return SKILL_CATEGORY_DEFS.some(
      (cat) => (resume.skillsCategories?.[cat.key] || '').trim().length > 0
    );
  }, [resume.skillsCategories]);

  const atsScore = useMemo(() => {
    let score = 0;
    if (resume.name.trim()) score += 10;
    if (resume.role.trim()) score += 10;
    if (resume.email.trim() && (resume.phone.trim() || resume.location.trim())) score += 10;
    if (resume.linkedin.trim() || resume.github.trim() || resume.portfolio.trim()) score += 10;
    if (resume.objective.trim().length > 40) score += 15;
    if (skillsList.length >= 4) score += 15;
    if (sortedExperience.length > 0 || sortedProjects.length > 0) score += 15;
    if (sortedEducation.length > 0) score += 15;
    return Math.min(100, score);
  }, [resume, skillsList, sortedEducation, sortedExperience, sortedProjects]);

  function update(field, value) {
    setResume((prev) => ({ ...prev, [field]: value }));
  }

  function updateSkillCat(cat, value) {
    setResume((prev) => ({
      ...prev,
      skillsCategories: { ...prev.skillsCategories, [cat]: value },
    }));
  }

  function updateGroup(group, index, field, value) {
    setResume((prev) => ({
      ...prev,
      [group]: prev[group].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  }

  function addGroup(group, defaultItem) {
    setResume((prev) => ({ ...prev, [group]: [...prev[group], defaultItem] }));
  }

  function removeGroup(group, index) {
    setResume((prev) => ({
      ...prev,
      [group]: prev[group].filter((_, i) => i !== index),
    }));
  }

  function handleAutoGenerateSummary() {
    const summary = generateNeutralSummary(resume);
    update('objective', summary);
    setNotice('Generated professional summary from your entered details.');
    setTimeout(() => setNotice(''), 3500);
  }

  function handleLoadSample() {
    setResume(sampleResume);
    setNotice('Professional single-column ATS sample loaded! Ready to edit.');
    setTimeout(() => setNotice(''), 4000);
  }

  function handleReset() {
    if (window.confirm('Clear all fields to start with a blank single-column ATS resume?')) {
      setResume(blankResume);
      setNotice('Form cleared.');
      setTimeout(() => setNotice(''), 3000);
    }
  }

  function insertVerb(group, index, field, verb) {
    const current = resume[group][index][field] || '';
    const prefix = current ? (current.endsWith('\n') ? current : current + '\n') : '';
    updateGroup(group, index, field, `${prefix}• ${verb} `);
  }

  function exportJson() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const a = document.createElement('a');
    const safeName = resume.name.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'resume';
    a.href = dataStr;
    a.download = `${safeName}-careerzoon-backup.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setNotice('Resume backup file exported.');
    setTimeout(() => setNotice(''), 3000);
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
          setTimeout(() => setNotice(''), 3000);
        }
      } catch {
        setNotice('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  }

  // Exact ISO A4 PDF Download strictly matching the preview & 8-section sequence
  async function downloadPdf() {
    if (!resume.name.trim()) {
      setNotice('Please enter your full name before downloading your resume.');
      return;
    }
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4', // ISO Standard A4: 210 × 297 mm
    });

    const isBig = fontSize === 'big';
    const isCompact = fontSize === 'compact';
    const margin = isBig ? 13 : isCompact ? 11 : 12;
    const pageWidth = 210;
    const pageHeight = 297;
    const maxWidth = pageWidth - margin * 2;
    let y = isBig ? 14 : isCompact ? 12 : 13;

    const fontChoice = fontFamily === 'serif' ? 'times' : 'helvetica';
    const isCenter = template === 'ivy-center';

    const checkPage = (neededHeight = 10) => {
      if (y + neededHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    const addSectionHeader = (title) => {
      checkPage(12);
      pdf.setFont(fontChoice, 'bold');
      pdf.setFontSize(isBig ? 10.5 : isCompact ? 9.2 : 9.8);
      pdf.setTextColor(15, 23, 42);
      pdf.text(title.toUpperCase(), margin, y);
      y += 1.5;
      pdf.setDrawColor(15, 23, 42);
      pdf.setLineWidth(0.35);
      pdf.line(margin, y, margin + maxWidth, y);
      y += isBig ? 3.8 : isCompact ? 2.8 : 3.2;
    };

    // ==========================================
    // 1. PERSONAL INFORMATION (HEADER)
    // ==========================================
    pdf.setFont(fontChoice, 'bold');
    pdf.setFontSize(isBig ? 21 : isCompact ? 17 : 19);
    pdf.setTextColor(15, 23, 42);

    if (isCenter) {
      pdf.text(resume.name.toUpperCase(), pageWidth / 2, y, { align: 'center' });
      y += isBig ? 5.2 : isCompact ? 4.2 : 4.6;

      if (resume.role?.trim()) {
        pdf.setFont(fontChoice, 'bold');
        pdf.setFontSize(isBig ? 10.5 : isCompact ? 9 : 9.8);
        pdf.setTextColor(51, 65, 85);
        pdf.text(resume.role.trim(), pageWidth / 2, y, { align: 'center' });
        y += isBig ? 4.5 : isCompact ? 3.6 : 4;
      }

      const contactLine1 = [resume.phone?.trim(), resume.email?.trim(), resume.location?.trim()].filter(Boolean);
      const contactLine2 = [resume.linkedin?.trim(), resume.github?.trim(), resume.portfolio?.trim()].filter(Boolean);

      pdf.setFont(fontChoice, 'normal');
      pdf.setFontSize(isBig ? 9 : isCompact ? 7.8 : 8.4);
      pdf.setTextColor(51, 65, 85);

      if (contactLine1.length) {
        pdf.text(contactLine1.join('   •   '), pageWidth / 2, y, { align: 'center' });
        y += isBig ? 3.8 : isCompact ? 3.2 : 3.5;
      }
      if (contactLine2.length) {
        pdf.text(contactLine2.join('   •   '), pageWidth / 2, y, { align: 'center' });
        y += isBig ? 4.8 : isCompact ? 3.8 : 4.2;
      } else {
        y += isBig ? 2 : 1.5;
      }
    } else {
      pdf.text(resume.name.toUpperCase(), margin, y);
      y += isBig ? 5.2 : isCompact ? 4.2 : 4.6;

      if (resume.role?.trim()) {
        pdf.setFont(fontChoice, 'bold');
        pdf.setFontSize(isBig ? 10.5 : isCompact ? 9 : 9.8);
        pdf.setTextColor(51, 65, 85);
        pdf.text(resume.role.trim(), margin, y);
        y += isBig ? 4.5 : isCompact ? 3.6 : 4;
      }

      const contactLine1 = [resume.phone?.trim(), resume.email?.trim(), resume.location?.trim()].filter(Boolean);
      const contactLine2 = [resume.linkedin?.trim(), resume.github?.trim(), resume.portfolio?.trim()].filter(Boolean);

      pdf.setFont(fontChoice, 'normal');
      pdf.setFontSize(isBig ? 9 : isCompact ? 7.8 : 8.4);
      pdf.setTextColor(51, 65, 85);

      if (contactLine1.length) {
        pdf.text(contactLine1.join('   •   '), margin, y);
        y += isBig ? 3.8 : isCompact ? 3.2 : 3.5;
      }
      if (contactLine2.length) {
        pdf.text(contactLine2.join('   •   '), margin, y);
        y += isBig ? 4.8 : isCompact ? 3.8 : 4.2;
      } else {
        y += isBig ? 2 : 1.5;
      }
    }

    // ==========================================
    // 2. PROFESSIONAL SUMMARY
    // ==========================================
    if (resume.objective?.trim()) {
      addSectionHeader('Professional Summary');
      pdf.setFont(fontChoice, 'normal');
      pdf.setFontSize(isBig ? 9.5 : isCompact ? 8.2 : 8.8);
      pdf.setTextColor(30, 41, 59);
      const lines = pdf.splitTextToSize(resume.objective.trim(), maxWidth);
      pdf.text(lines, margin, y);
      y += lines.length * (isBig ? 3.8 : isCompact ? 3.2 : 3.5) + (isBig ? 2.5 : isCompact ? 1.5 : 2);
    }

    // ==========================================
    // 3. EDUCATION
    // ==========================================
    if (sortedEducation.length > 0) {
      addSectionHeader('Education');
      sortedEducation.forEach((edu) => {
        checkPage(14);
        const institution = formatEducationInstitution(edu);
        const datesLocation = [edu.location?.trim(), formatEducationDates(edu)].filter(Boolean).join('   |   ');

        // Line 1: Degree on left (bold) or institution if no degree; Dates/Location on right
        pdf.setFont(fontChoice, 'bold');
        pdf.setFontSize(isBig ? 10 : isCompact ? 8.6 : 9.2);
        pdf.setTextColor(15, 23, 42);
        const primaryLeft = edu.degree?.trim() || institution || 'Degree';
        pdf.text(primaryLeft, margin, y);

        if (datesLocation) {
          pdf.setFont(fontChoice, 'bold');
          pdf.setFontSize(isBig ? 9.5 : isCompact ? 8.2 : 8.8);
          pdf.setTextColor(15, 23, 42);
          pdf.text(datesLocation, margin + maxWidth, y, { align: 'right' });
        }
        y += isBig ? 3.8 : isCompact ? 3.2 : 3.5;

        // Line 2: Institution (Italic) on left; GPA/SGPA on right
        const secondaryLeft = edu.degree?.trim() && institution ? institution : '';
        if (secondaryLeft || edu.gpa?.trim()) {
          pdf.setFont(fontChoice, 'italic');
          pdf.setFontSize(isBig ? 9.5 : isCompact ? 8.2 : 8.8);
          pdf.setTextColor(71, 85, 105);
          if (secondaryLeft) {
            pdf.text(secondaryLeft, margin, y);
          }
          if (edu.gpa?.trim()) {
            pdf.text(edu.gpa.trim(), margin + maxWidth, y, { align: 'right' });
          }
          y += isBig ? 4.2 : isCompact ? 3.5 : 4;
        } else {
          y += 1;
        }
      });
    }

    // ==========================================
    // 4. TECHNICAL SKILLS
    // ==========================================
    if (hasCategorizedSkills || resume.skills?.trim()) {
      addSectionHeader('Technical Skills');
      pdf.setFontSize(isBig ? 9.5 : isCompact ? 8.2 : 8.8);

      if (hasCategorizedSkills) {
        SKILL_CATEGORY_DEFS.forEach((cat) => {
          const val = (resume.skillsCategories?.[cat.key] || '').trim();
          if (!val) return;
          checkPage(6);
          pdf.setFont(fontChoice, 'bold');
          pdf.setTextColor(15, 23, 42);
          const labelText = `${cat.label}: `;
          pdf.text(labelText, margin, y);
          const labelWidth = pdf.getTextWidth(labelText);

          pdf.setFont(fontChoice, 'normal');
          pdf.setTextColor(30, 41, 59);
          const lines = pdf.splitTextToSize(val, maxWidth - labelWidth);
          pdf.text(lines, margin + labelWidth, y);
          y += lines.length * (isBig ? 3.7 : isCompact ? 3.1 : 3.4) + (isBig ? 1.2 : 0.8);
        });
        y += isBig ? 2 : isCompact ? 1.2 : 1.5;
      } else if (resume.skills?.trim()) {
        checkPage(8);
        pdf.setFont(fontChoice, 'normal');
        pdf.setTextColor(30, 41, 59);
        const lines = pdf.splitTextToSize(resume.skills.trim(), maxWidth);
        pdf.text(lines, margin, y);
        y += lines.length * (isBig ? 3.8 : isCompact ? 3.2 : 3.5) + (isBig ? 2 : 1.5);
      }
    }

    // ==========================================
    // 5. PROFESSIONAL EXPERIENCE
    // ==========================================
    if (sortedExperience.length > 0) {
      addSectionHeader('Professional Experience');
      sortedExperience.forEach((exp) => {
        checkPage(16);
        const expDates = formatExperienceDates(exp);

        // Line 1: Job Role (Bold) on left, Dates on right
        pdf.setFont(fontChoice, 'bold');
        pdf.setFontSize(isBig ? 10 : isCompact ? 8.6 : 9.2);
        pdf.setTextColor(15, 23, 42);
        pdf.text(exp.role?.trim() || 'Job Role', margin, y);

        if (expDates) {
          pdf.setFont(fontChoice, 'bold');
          pdf.setFontSize(isBig ? 9.5 : isCompact ? 8.2 : 8.8);
          pdf.setTextColor(15, 23, 42);
          pdf.text(expDates, margin + maxWidth, y, { align: 'right' });
        }
        y += isBig ? 3.8 : isCompact ? 3.2 : 3.5;

        // Line 2: Company (Italic) on left, Location on right
        pdf.setFont(fontChoice, 'italic');
        pdf.setFontSize(isBig ? 9.5 : isCompact ? 8.2 : 8.8);
        pdf.setTextColor(71, 85, 105);
        pdf.text(exp.company?.trim() || 'Company', margin, y);

        if (exp.location?.trim()) {
          pdf.setFont(fontChoice, 'italic');
          pdf.setFontSize(isBig ? 9 : isCompact ? 7.8 : 8.4);
          pdf.text(exp.location.trim(), margin + maxWidth, y, { align: 'right' });
        }
        y += isBig ? 4 : isCompact ? 3.4 : 3.8;

        // Bullets
        const bullets = parseBullets(exp.bullets);
        bullets.forEach((bullet) => {
          checkPage(6);
          pdf.setFont(fontChoice, 'normal');
          pdf.setFontSize(isBig ? 9.2 : isCompact ? 7.8 : 8.4);
          pdf.setTextColor(30, 41, 59);
          const wrapped = pdf.splitTextToSize(bullet, maxWidth - 5);
          pdf.text('•', margin + 1.2, y);
          pdf.text(wrapped, margin + 4.5, y);
          y += wrapped.length * (isBig ? 3.6 : isCompact ? 3.1 : 3.4) + (isBig ? 0.9 : 0.6);
        });
        y += isBig ? 2.5 : isCompact ? 1.5 : 2;
      });
    }

    // ==========================================
    // 6. PROJECTS
    // ==========================================
    if (sortedProjects.length > 0) {
      addSectionHeader('Projects');
      sortedProjects.forEach((proj) => {
        checkPage(16);
        pdf.setFont(fontChoice, 'bold');
        pdf.setFontSize(isBig ? 10 : isCompact ? 8.6 : 9.2);
        pdf.setTextColor(15, 23, 42);
        const titleText = proj.title?.trim() || 'Project';
        pdf.text(titleText, margin, y);
        const titleWidth = pdf.getTextWidth(titleText);

        if (proj.technologies?.trim()) {
          pdf.setFont(fontChoice, 'italic');
          pdf.setFontSize(isBig ? 9 : isCompact ? 7.8 : 8.4);
          pdf.setTextColor(100, 116, 139);
          pdf.text(`  |  ${proj.technologies.trim()}`, margin + titleWidth, y);
        }

        const linkItems = [];
        if (proj.github?.trim()) linkItems.push(proj.github.trim().replace(/^https?:\/\/(www\.)?/, ''));
        if (proj.link?.trim()) linkItems.push(proj.link.trim().replace(/^https?:\/\/(www\.)?/, ''));
        if (linkItems.length > 0) {
          pdf.setFont(fontChoice, 'normal');
          pdf.setFontSize(isBig ? 9 : isCompact ? 7.8 : 8.4);
          pdf.setTextColor(37, 99, 235);
          pdf.text(linkItems.join('  •  '), margin + maxWidth, y, { align: 'right' });
        }
        y += isBig ? 3.8 : isCompact ? 3.2 : 3.5;

        const bullets = parseBullets(proj.description);
        bullets.forEach((bullet) => {
          checkPage(6);
          pdf.setFont(fontChoice, 'normal');
          pdf.setFontSize(isBig ? 9.2 : isCompact ? 7.8 : 8.4);
          pdf.setTextColor(30, 41, 59);
          const wrapped = pdf.splitTextToSize(bullet, maxWidth - 5);
          pdf.text('•', margin + 1.2, y);
          pdf.text(wrapped, margin + 4.5, y);
          y += wrapped.length * (isBig ? 3.6 : isCompact ? 3.1 : 3.4) + (isBig ? 0.9 : 0.6);
        });
        y += isBig ? 2.5 : isCompact ? 1.5 : 2;
      });
    }

    // ==========================================
    // 7. CERTIFICATIONS & ACHIEVEMENTS
    // ==========================================
    const certBullets = parseBullets(resume.certifications);
    const achBullets = parseBullets(resume.achievements);
    if (certBullets.length > 0 || achBullets.length > 0) {
      addSectionHeader('Certifications & Achievements');
      pdf.setFont(fontChoice, 'normal');
      pdf.setFontSize(isBig ? 9.2 : isCompact ? 7.8 : 8.4);
      pdf.setTextColor(30, 41, 59);

      if (certBullets.length > 0) {
        if (achBullets.length > 0) {
          checkPage(6);
          pdf.setFont(fontChoice, 'bold');
          pdf.setFontSize(isBig ? 9.5 : isCompact ? 8.2 : 8.8);
          pdf.setTextColor(15, 23, 42);
          pdf.text('Certifications:', margin, y);
          y += isBig ? 3.6 : isCompact ? 3.0 : 3.3;
        }
        certBullets.forEach((bullet) => {
          checkPage(6);
          pdf.setFont(fontChoice, 'normal');
          pdf.setFontSize(isBig ? 9.2 : isCompact ? 7.8 : 8.4);
          pdf.setTextColor(30, 41, 59);
          const wrapped = pdf.splitTextToSize(bullet, maxWidth - 5);
          pdf.text('•', margin + 1.2, y);
          pdf.text(wrapped, margin + 4.5, y);
          y += wrapped.length * (isBig ? 3.6 : isCompact ? 3.1 : 3.4) + (isBig ? 0.9 : 0.6);
        });
      }

      if (achBullets.length > 0) {
        if (certBullets.length > 0) {
          y += 1.5;
          checkPage(6);
          pdf.setFont(fontChoice, 'bold');
          pdf.setFontSize(isBig ? 9.5 : isCompact ? 8.2 : 8.8);
          pdf.setTextColor(15, 23, 42);
          pdf.text('Achievements & Honors:', margin, y);
          y += isBig ? 3.6 : isCompact ? 3.0 : 3.3;
        }
        achBullets.forEach((bullet) => {
          checkPage(6);
          pdf.setFont(fontChoice, 'normal');
          pdf.setFontSize(isBig ? 9.2 : isCompact ? 7.8 : 8.4);
          pdf.setTextColor(30, 41, 59);
          const wrapped = pdf.splitTextToSize(bullet, maxWidth - 5);
          pdf.text('•', margin + 1.2, y);
          pdf.text(wrapped, margin + 4.5, y);
          y += wrapped.length * (isBig ? 3.6 : isCompact ? 3.1 : 3.4) + (isBig ? 0.9 : 0.6);
        });
      }
      y += isBig ? 2 : isCompact ? 1.2 : 1.5;
    }

    // ==========================================
    // 8. LANGUAGES
    // ==========================================
    if (parsedLanguages.length > 0) {
      addSectionHeader('Languages');
      checkPage(6);
      pdf.setFont(fontChoice, 'normal');
      pdf.setFontSize(isBig ? 9.5 : isCompact ? 8.2 : 8.8);
      pdf.setTextColor(30, 41, 59);
      const langStr = parsedLanguages
        .map((l) => (l.level ? `${l.name} — ${l.level}` : l.name))
        .join('   •   ');
      const wrapped = pdf.splitTextToSize(langStr, maxWidth);
      pdf.text(wrapped, margin, y);
    }

    const safeFilename =
      resume.name
        .trim()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase() || 'resume';
    pdf.save(`${safeFilename}-CV-A4.pdf`);
    setNotice('Your professional A4 CV has been downloaded successfully!');
    setTimeout(() => setNotice(''), 4000);
  }

  return (
    <main className="resume-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">PROFESSIONAL ATS CV BUILDER</span>
          <h1>Single-Column, 100% ATS-Compliant Professional CV</h1>
          <p>
            Strictly follows top hiring rubrics: standard ISO A4 (210 × 297 mm) format, single-column linear layout, no distracting graphics, and optimal parsing for Workday, Greenhouse, Taleo, and human recruiters.
          </p>
          <div className="page-hero-meta">
            <span>✓ Standard ISO A4 (210 × 297 mm)</span>
            <span>✓ Exact 8-Section ATS Sequence</span>
            <span>✓ Reverse Chronological Sorting</span>
            <span>✓ Big Font Size Option</span>
            <span>✓ 100% Private &amp; Free</span>
          </div>
        </div>
      </div>

      <div className="resume-workspace">
        {/* Editor Form Column */}
        <section className="resume-form-panel">
          <div className="resume-panel-head">
            <div>
              <span className="eyebrow">CV EDITOR</span>
              <h2>Fill your resume details</h2>
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

          {/* Template & Typography Controls */}
          <div className="template-picker-section">
            <span className="template-section-label">ATS Layout Style:</span>
            <div className="template-picker-grid" role="tablist" aria-label="Resume layout">
              {templateOptions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={template === t.id}
                  className={`template-card-btn ${template === t.id ? 'active' : ''}`}
                  onClick={() => setTemplate(t.id)}
                >
                  <span className="template-card-texts">
                    <strong className="template-card-name">{t.name}</strong>
                    <small className="template-card-desc">{t.desc}</small>
                  </span>
                </button>
              ))}
            </div>

            <div className="font-picker-row">
              <span className="font-label">ATS Font:</span>
              <div className="font-toggle">
                {fontOptions.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`font-btn ${fontFamily === f.id ? 'active' : ''}`}
                    onClick={() => setFontFamily(f.id)}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ATS Readiness Score */}
          <div className="ats-score-box">
            <div className="ats-score-header">
              <span>
                <Sparkles size={14} /> ATS Score: <b>{atsScore}/100</b>
              </span>
              <span className={`ats-score-badge ${atsScore >= 80 ? 'strong' : atsScore >= 50 ? 'good' : 'warning'}`}>
                {atsScore >= 80 ? 'Top ATS Rank' : atsScore >= 50 ? 'Good Start' : 'Needs More Detail'}
              </span>
            </div>
            <div className="ats-score-bar">
              <div
                className="ats-score-fill"
                style={{
                  width: `${atsScore}%`,
                  background:
                    atsScore >= 80
                      ? '#10b981'
                      : atsScore >= 50
                      ? '#f59e0b'
                      : '#ef4444',
                }}
              />
            </div>
            <p className="ats-score-tip">
              {atsScore < 50
                ? 'Tip: Add target headline, summary, and at least 4 technical skills.'
                : atsScore < 80
                ? 'Tip: Add quantifiable impact bullets to your work experience or projects.'
                : 'Excellent! Your single-column CV has 100% ATS keyword & layout coverage.'}
            </p>
          </div>

          {/* Form Sections Strictly in Requested 8-Section Sequence */}
          <div className="resume-form">
            {/* 1. PERSONAL INFORMATION */}
            <ResumeSection title="1. Personal Information" icon={<Mail size={14} />}>
              <div className="form-grid">
                <Field
                  label="Full Name *"
                  value={resume.name}
                  onChange={(v) => update('name', v)}
                  placeholder="e.g. AANYA SHARMA"
                />
                <Field
                  label="Professional Title / Role"
                  value={resume.role}
                  onChange={(v) => update('role', v)}
                  placeholder="e.g. Software Development Engineer"
                />
                <Field
                  label="Phone Number"
                  value={resume.phone}
                  onChange={(v) => update('phone', v)}
                  placeholder="+91 98765 43210"
                  validate={isValidPhone}
                  errorHint="Please enter a valid phone number"
                />
                <Field
                  label="Email Address"
                  value={resume.email}
                  onChange={(v) => update('email', v)}
                  placeholder="aanya@example.com"
                  type="email"
                  validate={isValidEmail}
                  errorHint="Please enter a valid email address"
                />
                <Field
                  label="Location (City, Country)"
                  value={resume.location}
                  onChange={(v) => update('location', v)}
                  placeholder="Bengaluru, India"
                />
                <Field
                  label="LinkedIn Profile"
                  value={resume.linkedin}
                  onChange={(v) => update('linkedin', v)}
                  placeholder="linkedin.com/in/username"
                  validate={isValidUrl}
                  errorHint="Enter valid LinkedIn URL"
                />
                <Field
                  label="GitHub Profile"
                  value={resume.github}
                  onChange={(v) => update('github', v)}
                  placeholder="github.com/username"
                  validate={isValidUrl}
                  errorHint="Enter valid GitHub URL"
                />
                <Field
                  label="Portfolio Website"
                  value={resume.portfolio}
                  onChange={(v) => update('portfolio', v)}
                  placeholder="portfolio.dev"
                  validate={isValidUrl}
                  errorHint="Enter valid URL"
                />
              </div>
            </ResumeSection>

            {/* 2. PROFESSIONAL SUMMARY */}
            <ResumeSection title="2. Professional Summary" icon={<FileText size={14} />}>
              <div className="summary-helper-row">
                <button
                  type="button"
                  className="auto-summary-btn"
                  onClick={handleAutoGenerateSummary}
                  title="Generate ATS summary strictly based on your entered education, role & skills"
                >
                  <Sparkles size={13} /> Auto-generate Summary from Details
                </button>
              </div>
              <textarea
                value={resume.objective}
                onChange={(e) => update('objective', e.target.value)}
                placeholder="Write a clean 2–4 line professional summary based on your actual experience, skills, and engineering background. Generic statements will be avoided."
                rows="3"
              />
            </ResumeSection>

            {/* 3. EDUCATION */}
            <ResumeSection
              title="3. Education"
              icon={<GraduationCap size={14} />}
              add={() =>
                addGroup('education', {
                  degree: '',
                  school: '',
                  board: '',
                  location: '',
                  startYear: '',
                  years: '',
                  gpa: '',
                })
              }
            >
              {resume.education.map((item, index) => (
                <div className="repeat-group" key={`edu-${index}`}>
                  <div className="form-grid">
                    <Field
                      label="Degree / Course"
                      value={item.degree}
                      onChange={(v) => updateGroup('education', index, 'degree', v)}
                      placeholder="e.g. B.Tech in Computer Science & Engineering"
                    />
                    <Field
                      label="College / School"
                      value={item.school}
                      onChange={(v) => updateGroup('education', index, 'school', v)}
                      placeholder="e.g. NITK Surathkal"
                    />
                    <Field
                      label="University / Board (Optional)"
                      value={item.board}
                      onChange={(v) => updateGroup('education', index, 'board', v)}
                      placeholder="e.g. Autonomous / State Technical University"
                    />
                    <Field
                      label="Location (City, Country)"
                      value={item.location}
                      onChange={(v) => updateGroup('education', index, 'location', v)}
                      placeholder="e.g. Surathkal, India"
                    />
                    <Field
                      label="Start Year"
                      value={item.startYear}
                      onChange={(v) => updateGroup('education', index, 'startYear', v)}
                      placeholder="e.g. 2020"
                    />
                    <Field
                      label="End Year / Expected Graduation"
                      value={item.years}
                      onChange={(v) => updateGroup('education', index, 'years', v)}
                      placeholder="e.g. 2024"
                    />
                    <Field
                      label="Percentage / CGPA / SGPA (Optional)"
                      value={item.gpa}
                      onChange={(v) => updateGroup('education', index, 'gpa', v)}
                      placeholder="e.g. CGPA: 8.9 / 10"
                      className="full-field"
                    />
                  </div>
                  {resume.education.length > 1 && (
                    <button
                      type="button"
                      className="remove-row"
                      onClick={() => removeGroup('education', index)}
                      aria-label="Remove education"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </ResumeSection>

            {/* 4. TECHNICAL SKILLS */}
            <ResumeSection title="4. Technical Skills" icon={<Code2 size={14} />}>
              <div className="skills-categorized-inputs">
                {SKILL_CATEGORY_DEFS.map((cat) => (
                  <Field
                    key={cat.key}
                    label={cat.label}
                    value={resume.skillsCategories?.[cat.key] || ''}
                    onChange={(v) => updateSkillCat(cat.key, v)}
                    placeholder={`Comma-separated list (e.g. ${
                      cat.key === 'languages'
                        ? 'JavaScript, TypeScript, Python, SQL, Java'
                        : cat.key === 'frameworks'
                        ? 'React, Node.js, Express, Next.js'
                        : cat.key === 'databases'
                        ? 'PostgreSQL, MongoDB, Redis'
                        : 'Docker, Git, AWS, Linux'
                    })`}
                  />
                ))}
              </div>
            </ResumeSection>

            {/* 5. PROFESSIONAL EXPERIENCE */}
            <ResumeSection
              title="5. Professional Experience"
              icon={<Briefcase size={14} />}
              add={() =>
                addGroup('experienceList', {
                  role: '',
                  company: '',
                  location: '',
                  startDate: '',
                  dates: '',
                  bullets: '',
                })
              }
            >
              <div className="bullet-helper-bar">
                <span className="helper-label">💡 Action Verbs:</span>
                <div className="verb-chips">
                  {actionVerbs.map((verb) => (
                    <button
                      key={verb}
                      type="button"
                      className="verb-chip"
                      onClick={() => insertVerb('experienceList', 0, 'bullets', verb)}
                    >
                      +{verb}
                    </button>
                  ))}
                </div>
              </div>

              {resume.experienceList.map((item, index) => (
                <div className="repeat-group" key={`exp-${index}`}>
                  <div className="form-grid">
                    <Field
                      label="Job Title / Role"
                      value={item.role}
                      onChange={(v) => updateGroup('experienceList', index, 'role', v)}
                      placeholder="e.g. Software Engineer Intern"
                    />
                    <Field
                      label="Company / Organization"
                      value={item.company}
                      onChange={(v) => updateGroup('experienceList', index, 'company', v)}
                      placeholder="e.g. TechNova Solutions"
                    />
                    <Field
                      label="Location / Remote"
                      value={item.location}
                      onChange={(v) => updateGroup('experienceList', index, 'location', v)}
                      placeholder="e.g. Bengaluru, India or Remote"
                    />
                    <Field
                      label="Start Date"
                      value={item.startDate}
                      onChange={(v) => updateGroup('experienceList', index, 'startDate', v)}
                      placeholder="e.g. Jan 2024"
                    />
                    <Field
                      label="End Date / Present"
                      value={item.dates}
                      onChange={(v) => updateGroup('experienceList', index, 'dates', v)}
                      placeholder="e.g. Jun 2024 or Present"
                    />
                    <label className="field-label full-field">
                      2–4 Concise Bullet Points (1 per line)
                      <textarea
                        value={item.bullets}
                        onChange={(e) => updateGroup('experienceList', index, 'bullets', e.target.value)}
                        placeholder="• Architected reusable React micro-frontend components, decreasing initial load time by 28%.&#10;• Engineered RESTful APIs in Node.js, reducing median response time by 35%."
                        rows="3"
                      />
                    </label>
                  </div>
                  {resume.experienceList.length > 1 && (
                    <button
                      type="button"
                      className="remove-row"
                      onClick={() => removeGroup('experienceList', index)}
                      aria-label="Remove experience"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </ResumeSection>

            {/* 6. PROJECTS */}
            <ResumeSection
              title="6. Projects"
              icon={<Layers size={14} />}
              add={() =>
                addGroup('projects', {
                  title: '',
                  technologies: '',
                  link: '',
                  github: '',
                  dates: '',
                  description: '',
                })
              }
            >
              {resume.projects.map((item, index) => (
                <div className="repeat-group" key={`proj-${index}`}>
                  <div className="form-grid">
                    <Field
                      label="Project Name"
                      value={item.title}
                      onChange={(v) => updateGroup('projects', index, 'title', v)}
                      placeholder="e.g. DevCollab Workspace"
                    />
                    <Field
                      label="Technologies Used"
                      value={item.technologies}
                      onChange={(v) => updateGroup('projects', index, 'technologies', v)}
                      placeholder="e.g. React, Node.js, Redis, Docker"
                    />
                    <Field
                      label="Year / Dates (Optional)"
                      value={item.dates}
                      onChange={(v) => updateGroup('projects', index, 'dates', v)}
                      placeholder="e.g. 2024"
                    />
                    <Field
                      label="GitHub URL (Optional)"
                      value={item.github}
                      onChange={(v) => updateGroup('projects', index, 'github', v)}
                      placeholder="github.com/username/project"
                      validate={isValidUrl}
                      errorHint="Enter valid GitHub URL"
                    />
                    <Field
                      label="Live Demo URL (Optional)"
                      value={item.link}
                      onChange={(v) => updateGroup('projects', index, 'link', v)}
                      placeholder="demo.project.dev"
                      validate={isValidUrl}
                      errorHint="Enter valid URL"
                    />
                    <label className="field-label full-field">
                      2–4 Key Accomplishments / Bullets (1 per line)
                      <textarea
                        value={item.description}
                        onChange={(e) => updateGroup('projects', index, 'description', e.target.value)}
                        placeholder="• Built a real-time collaborative code editor with live multi-cursor syncing over WebSockets.&#10;• Scaled Redis channels to handle 2,000+ concurrent connections with 0 dropped events."
                        rows="3"
                      />
                    </label>
                  </div>
                  {resume.projects.length > 1 && (
                    <button
                      type="button"
                      className="remove-row"
                      onClick={() => removeGroup('projects', index)}
                      aria-label="Remove project"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </ResumeSection>

            {/* 7. CERTIFICATIONS & ACHIEVEMENTS */}
            <ResumeSection title="7. Certifications &amp; Achievements" icon={<Award size={14} />}>
              <label className="field-label full-field">
                Certifications (Format: Certificate Name — Organization — Year)
                <textarea
                  value={resume.certifications}
                  onChange={(e) => update('certifications', e.target.value)}
                  placeholder="AWS Certified Cloud Practitioner — Amazon Web Services — 2024&#10;Meta Front-End Developer Professional Certificate — Meta / Coursera — 2023"
                  rows="2"
                />
              </label>
              <label className="field-label full-field">
                Achievements &amp; Honors (Format: Achievement — Organization/Event — Year)
                <textarea
                  value={resume.achievements}
                  onChange={(e) => update('achievements', e.target.value)}
                  placeholder="1st Place Winner out of 70+ teams — National HackIndia Hackathon — 2023&#10;Solved 500+ LeetCode problems (Knight rank) — LeetCode — 2024"
                  rows="2"
                />
              </label>
            </ResumeSection>

            {/* 8. LANGUAGES */}
            <ResumeSection title="8. Languages" icon={<Globe size={14} />}>
              <Field
                label="Languages Spoken (Format: Language — Proficiency)"
                value={resume.languages}
                onChange={(v) => update('languages', v)}
                placeholder="English — Professional, Hindi — Fluent, German — Elementary"
              />
            </ResumeSection>
          </div>

          {notice && <p className="resume-notice" role="status">{notice}</p>}

          {/* Action Buttons */}
          <div className="resume-actions">
            <button type="button" className="button-primary download-btn" onClick={downloadPdf}>
              <Download size={15} /> Download PDF (ISO A4 · 210 × 297 mm)
            </button>
            <button type="button" className="resume-print" onClick={() => window.print()}>
              <Printer size={15} /> Print
            </button>
            <div className="resume-backup-buttons">
              <button type="button" className="resume-backup-btn" onClick={exportJson} title="Export JSON backup">
                Backup JSON
              </button>
              <label className="resume-backup-btn" title="Import JSON backup">
                Restore JSON
                <input type="file" accept=".json" onChange={importJson} style={{ display: 'none' }} />
              </label>
            </div>
            <span className="privacy-badge">🔒 100% Client-Side Private</span>
          </div>
        </section>

        {/* Live Preview Column */}
        <aside className="resume-preview-panel">
          <div className="preview-head">
            <div>
              <div className="preview-eyebrow-row">
                <span className="eyebrow">CV DOCUMENT</span>
                <span className="a4-size-indicator">ISO A4 (210 × 297 mm) · Single Column</span>
              </div>
              <h2>{templateOptions.find((t) => t.id === template)?.name}</h2>
            </div>
            <div className="preview-toolbar-controls">
              {/* Font Size Selector: Compact, Regular, Big Font */}
              <div className="font-size-toolbar-group" role="group" aria-label="Font size selection">
                <span className="toolbar-label">Size:</span>
                <div className="size-toggle">
                  <button
                    type="button"
                    className={`size-btn ${fontSize === 'compact' ? 'active' : ''}`}
                    onClick={() => setFontSize('compact')}
                    title="Compact Font (fits maximum content on 1 page)"
                  >
                    Compact
                  </button>
                  <button
                    type="button"
                    className={`size-btn ${fontSize === 'regular' ? 'active' : ''}`}
                    onClick={() => setFontSize('regular')}
                    title="Regular Standard Font"
                  >
                    Regular
                  </button>
                  <button
                    type="button"
                    className={`size-btn big-btn ${fontSize === 'big' ? 'active' : ''}`}
                    onClick={() => setFontSize('big')}
                    title="Big Font Size (large, bold and highly readable)"
                  >
                    Big Font 🔠
                  </button>
                </div>
              </div>

              {/* Viewport Zoom */}
              <div className="zoom-controls">
                <button
                  type="button"
                  className="zoom-btn"
                  onClick={() => setZoom((z) => Math.max(70, z - 10))}
                  title="Zoom out"
                >
                  <ZoomOut size={13} />
                </button>
                <span className="zoom-level">{zoom}%</span>
                <button
                  type="button"
                  className="zoom-btn"
                  onClick={() => setZoom((z) => Math.min(120, z + 10))}
                  title="Zoom in"
                >
                  <ZoomIn size={13} />
                </button>
              </div>
            </div>
          </div>

          <div className="resume-preview-scroll-container">
            <div
              className="resume-preview-scale-wrapper"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              {/* Authentic ISO A4 Paper Canvas */}
              <article className={`resume-paper-document ${template} ${fontFamily} font-${fontSize}`}>
                {/* ==========================================
                    1. PERSONAL INFORMATION (HEADER)
                   ========================================== */}
                <header className="paper-header">
                  <h1 className="paper-name">{resume.name || 'YOUR FULL NAME'}</h1>
                  {resume.role?.trim() && <div className="paper-headline">{resume.role.trim()}</div>}
                  <div className="paper-contact-block">
                    {/* Contact Row 1: Phone, Email, Location */}
                    <div className="paper-contact-row">
                      {resume.phone?.trim() && (
                        <span className="paper-contact-item">
                          <a href={`tel:${resume.phone.trim()}`}>{resume.phone.trim()}</a>
                        </span>
                      )}
                      {resume.phone?.trim() && resume.email?.trim() && (
                        <span className="contact-separator">•</span>
                      )}
                      {resume.email?.trim() && (
                        <span className="paper-contact-item">
                          <a href={`mailto:${resume.email.trim()}`}>{resume.email.trim()}</a>
                        </span>
                      )}
                      {(resume.phone?.trim() || resume.email?.trim()) && resume.location?.trim() && (
                        <span className="contact-separator">•</span>
                      )}
                      {resume.location?.trim() && (
                        <span className="paper-contact-item">{resume.location.trim()}</span>
                      )}
                    </div>

                    {/* Contact Row 2: LinkedIn, GitHub, Portfolio */}
                    {(resume.linkedin?.trim() || resume.github?.trim() || resume.portfolio?.trim()) && (
                      <div className="paper-contact-row secondary-contact">
                        {resume.linkedin?.trim() && (
                          <span className="paper-contact-item">
                            <a
                              href={
                                resume.linkedin.startsWith('http')
                                  ? resume.linkedin
                                  : `https://${resume.linkedin}`
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              {resume.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          </span>
                        )}
                        {resume.linkedin?.trim() && (resume.github?.trim() || resume.portfolio?.trim()) && (
                          <span className="contact-separator">•</span>
                        )}
                        {resume.github?.trim() && (
                          <span className="paper-contact-item">
                            <a
                              href={
                                resume.github.startsWith('http')
                                  ? resume.github
                                  : `https://${resume.github}`
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              {resume.github.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          </span>
                        )}
                        {resume.github?.trim() && resume.portfolio?.trim() && (
                          <span className="contact-separator">•</span>
                        )}
                        {resume.portfolio?.trim() && (
                          <span className="paper-contact-item">
                            <a
                              href={
                                resume.portfolio.startsWith('http')
                                  ? resume.portfolio
                                  : `https://${resume.portfolio}`
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              {resume.portfolio.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </header>

                {/* ==========================================
                    2. PROFESSIONAL SUMMARY
                   ========================================== */}
                {resume.objective?.trim() && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">PROFESSIONAL SUMMARY</h2>
                    <p className="paper-paragraph">{resume.objective.trim()}</p>
                  </section>
                )}

                {/* ==========================================
                    3. EDUCATION
                   ========================================== */}
                {sortedEducation.length > 0 && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">EDUCATION</h2>
                    {sortedEducation.map((edu, idx) => {
                      const institution = formatEducationInstitution(edu);
                      const datesLocation = [
                        edu.location?.trim(),
                        formatEducationDates(edu),
                      ]
                        .filter(Boolean)
                        .join('   |   ');

                      return (
                        <div className="paper-entry" key={idx}>
                          <div className="paper-entry-row primary">
                            <strong className="entry-bold">
                              {edu.degree?.trim() || institution || 'Degree / Course'}
                            </strong>
                            {datesLocation && (
                              <span className="entry-right-date">{datesLocation}</span>
                            )}
                          </div>
                          {(institution || edu.gpa?.trim()) && (
                            <div className="paper-entry-row secondary">
                              <span className="entry-italic">
                                {edu.degree?.trim() ? institution : ''}
                              </span>
                              {edu.gpa?.trim() && (
                                <span className="entry-right-sub">{edu.gpa.trim()}</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </section>
                )}

                {/* ==========================================
                    4. TECHNICAL SKILLS
                   ========================================== */}
                {(hasCategorizedSkills || resume.skills?.trim()) && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">TECHNICAL SKILLS</h2>
                    <div className="paper-skills-matrix">
                      {hasCategorizedSkills ? (
                        SKILL_CATEGORY_DEFS.map((cat) => {
                          const val = (resume.skillsCategories?.[cat.key] || '').trim();
                          if (!val) return null;
                          return (
                            <div className="paper-skill-row" key={cat.key}>
                              <strong className="skill-cat-label">{cat.label}: </strong>
                              <span className="skill-cat-values">{val}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="paper-skill-row">
                          <strong className="skill-cat-label">Skills: </strong>
                          <span className="skill-cat-values">{resume.skills.trim()}</span>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* ==========================================
                    5. PROFESSIONAL EXPERIENCE
                   ========================================== */}
                {sortedExperience.length > 0 && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">PROFESSIONAL EXPERIENCE</h2>
                    {sortedExperience.map((exp, idx) => {
                      const expDates = formatExperienceDates(exp);
                      const bullets = parseBullets(exp.bullets);

                      return (
                        <div className="paper-entry" key={idx}>
                          <div className="paper-entry-row primary">
                            <strong className="entry-bold">{exp.role?.trim() || 'Role'}</strong>
                            {expDates && <span className="entry-right-date">{expDates}</span>}
                          </div>
                          <div className="paper-entry-row secondary">
                            <span className="entry-italic">{exp.company?.trim() || 'Company'}</span>
                            {exp.location?.trim() && (
                              <span className="entry-right-sub">{exp.location.trim()}</span>
                            )}
                          </div>
                          {bullets.length > 0 && (
                            <ul className="paper-bullet-list">
                              {bullets.map((bullet, bIdx) => (
                                <li key={bIdx}>{bullet}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </section>
                )}

                {/* ==========================================
                    6. PROJECTS
                   ========================================== */}
                {sortedProjects.length > 0 && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">PROJECTS</h2>
                    {sortedProjects.map((proj, idx) => {
                      const bullets = parseBullets(proj.description);

                      return (
                        <div className="paper-entry" key={idx}>
                          <div className="paper-entry-row primary">
                            <div className="entry-title-with-stack">
                              <strong className="entry-bold">{proj.title?.trim() || 'Project Title'}</strong>
                              {proj.technologies?.trim() && (
                                <span className="entry-tech-stack"> | {proj.technologies.trim()}</span>
                              )}
                            </div>
                            <div className="entry-right-links">
                              {proj.github?.trim() && (
                                <a
                                  href={
                                    proj.github.startsWith('http')
                                      ? proj.github
                                      : `https://${proj.github}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="entry-right-link"
                                >
                                  GitHub
                                </a>
                              )}
                              {proj.github?.trim() && proj.link?.trim() && (
                                <span className="link-separator">•</span>
                              )}
                              {proj.link?.trim() && (
                                <a
                                  href={
                                    proj.link.startsWith('http')
                                      ? proj.link
                                      : `https://${proj.link}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="entry-right-link"
                                >
                                  Live Demo
                                </a>
                              )}
                            </div>
                          </div>
                          {bullets.length > 0 && (
                            <ul className="paper-bullet-list">
                              {bullets.map((bullet, bIdx) => (
                                <li key={bIdx}>{bullet}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </section>
                )}

                {/* ==========================================
                    7. CERTIFICATIONS & ACHIEVEMENTS
                   ========================================== */}
                {(parseBullets(resume.certifications).length > 0 ||
                  parseBullets(resume.achievements).length > 0) && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">CERTIFICATIONS &amp; ACHIEVEMENTS</h2>
                    {parseBullets(resume.certifications).length > 0 && (
                      <div className="paper-cert-group">
                        {parseBullets(resume.achievements).length > 0 && (
                          <div className="paper-subgroup-title">Certifications:</div>
                        )}
                        <ul className="paper-bullet-list">
                          {parseBullets(resume.certifications).map((clean, idx) => (
                            <li key={`cert-${idx}`}>{clean}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {parseBullets(resume.achievements).length > 0 && (
                      <div className="paper-cert-group">
                        {parseBullets(resume.certifications).length > 0 && (
                          <div className="paper-subgroup-title">Achievements &amp; Honors:</div>
                        )}
                        <ul className="paper-bullet-list">
                          {parseBullets(resume.achievements).map((clean, idx) => (
                            <li key={`ach-${idx}`}>{clean}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>
                )}

                {/* ==========================================
                    8. LANGUAGES
                   ========================================== */}
                {parsedLanguages.length > 0 && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">LANGUAGES</h2>
                    <div className="paper-languages-row">
                      {parsedLanguages.map((l, idx) => (
                        <span className="language-badge" key={idx}>
                          <strong>{l.name}</strong>
                          {l.level && <span className="lang-level"> — {l.level}</span>}
                          {idx < parsedLanguages.length - 1 && <span className="lang-sep"> • </span>}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Document Verification Marker */}
                <footer className="paper-footer-tag">
                  <span>Standard ISO A4 (210 × 297 mm) · Single Column ATS</span>
                  <span>Professional Software Developer CV</span>
                </footer>
              </article>
            </div>
          </div>

          <div className="privacy-note">
            <CheckCircle2 size={13} />
            <span>Guaranteed 100% private. Data stays in your browser's local storage.</span>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  validate,
  errorHint,
}) {
  const isInvalid = validate && value?.trim() && !validate(value);

  return (
    <label className={`field-label ${className}`}>
      <span>{label}</span>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={isInvalid ? 'input-has-error' : ''}
      />
      {isInvalid && errorHint && <span className="field-error-hint">{errorHint}</span>}
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
