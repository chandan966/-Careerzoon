import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Briefcase,
  CheckCircle2,
  Code2,
  Download,
  FileText,
  GraduationCap,
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

const blankResume = {
  name: '',
  role: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  portfolio: '',
  objective: '',
  skillsCategories: {
    languages: '',
    frameworks: '',
    tools: '',
  },
  skills: '',
  experienceList: [
    { company: '', role: '', location: '', dates: '', bullets: '' },
  ],
  projects: [
    { title: '', technologies: '', link: '', description: '' },
  ],
  education: [
    { school: '', degree: '', location: '', years: '', gpa: '' },
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
  portfolio: 'github.com/aanya-sharma',
  objective:
    'Results-driven Software Engineer with strong foundations in data structures, algorithms, and full-stack system architecture. Experienced in designing and deploying scalable web applications with React, Node.js, and PostgreSQL. Proven track record of optimizing database queries to reduce API latency by 35% and building resilient microservices in Agile teams.',
  skillsCategories: {
    languages: 'JavaScript (ES6+), TypeScript, Python, Java, SQL, C++',
    frameworks: 'React.js, Node.js, Express.js, Next.js, Redux Toolkit, Tailwind CSS',
    tools: 'Git, GitHub, Docker, AWS (EC2, S3), PostgreSQL, MongoDB, Redis, Linux, RESTful APIs',
  },
  skills:
    'JavaScript, TypeScript, Python, Java, SQL, C++, React.js, Node.js, Express.js, PostgreSQL, Docker, AWS, Git, Redis',
  experienceList: [
    {
      company: 'TechNova Solutions',
      role: 'Software Engineer Intern',
      location: 'Bengaluru, India',
      dates: 'Jan 2024 – Jun 2024',
      bullets:
        '• Architected and deployed 6+ reusable React micro-frontend components, decreasing customer dashboard initial load time by 28% for 45,000+ active users.\n• Engineered robust RESTful endpoints with Node.js and PostgreSQL, optimizing database indexing to reduce median query response time from 310ms to 185ms.\n• Automated unit and end-to-end integration test suites using Jest and GitHub Actions, elevating automated pipeline test coverage from 62% to 88%.\n• Collaborated in an Agile Scrum team of 7 engineers, actively participating in bi-weekly sprint planning, architecture reviews, and production releases.',
    },
  ],
  projects: [
    {
      title: 'DevCollab — Realtime Collaborative Code Workspace',
      technologies: 'React, Node.js, WebSockets, Redis, Docker',
      link: 'github.com/aanya-sharma/devcollab',
      description:
        '• Developed a full-stack real-time collaborative code editor supporting multi-user simultaneous document editing using Operational Transformation and WebSockets.\n• Integrated syntax highlighting for 12+ languages with an isolated Docker-based code execution sandbox.\n• Engineered Redis Pub/Sub channels handling 2,000+ concurrent connections with zero dropped messages.',
    },
    {
      title: 'AlgoVisualizer — Interactive DSA Learning Platform',
      technologies: 'TypeScript, React, Canvas API, Tailwind CSS',
      link: 'github.com/aanya-sharma/algovis',
      description:
        '• Engineered an interactive algorithm visualizer demonstrating pathfinding (Dijkstra, A*) and sorting algorithms with custom speed playback and memory tracers.\n• Reached 15,000+ monthly active student learners with 99.9% uptime deployed on Vercel.',
    },
  ],
  education: [
    {
      school: 'National Institute of Technology Karnataka (NITK)',
      degree: 'B.Tech in Computer Science & Engineering',
      location: 'Surathkal, India',
      years: '2020 – 2024',
      gpa: 'CGPA: 8.9 / 10',
    },
  ],
  certifications:
    '• AWS Certified Cloud Practitioner — Amazon Web Services (2024)\n• Meta Front-End Developer Professional Certificate — Meta / Coursera (2023)',
  achievements:
    '• 1st Place Winner (out of 70+ engineering teams) at National HackIndia Hackathon (2023)\n• Solved 500+ Data Structures & Algorithms problems across LeetCode & Codeforces (Knight rank)',
  languages: 'English (Professional), Hindi (Native)',
};

const templateOptions = [
  {
    id: 'ivy-center',
    name: 'Harvard / Ivy ATS (Centered Header)',
    desc: 'Gold Standard FAANG / Big Tech · Single Column',
    align: 'center',
  },
  {
    id: 'ivy-left',
    name: 'Standard Tech ATS (Left Aligned)',
    desc: 'Clean & Modern Engineering · Single Column',
    align: 'left',
  },
];

const fontOptions = [
  { id: 'sans', name: 'Clean Sans-Serif (Arial / Helvetica / Inter)' },
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

function getInitialResume() {
  try {
    const stored = JSON.parse(localStorage.getItem('careerzoon-resume') || 'null');
    if (stored) {
      return {
        ...blankResume,
        ...stored,
        education: stored.education?.length ? stored.education : blankResume.education,
        experienceList: stored.experienceList?.length
          ? stored.experienceList
          : stored.experience
          ? [
              {
                company: 'Work Experience',
                role: stored.role || 'Role',
                location: '',
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
  const [fontSize, setFontSize] = useState('big'); // Default to 'big' as requested
  const [zoom, setZoom] = useState(100);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('careerzoon-resume', JSON.stringify(resume));
    } catch {
      // Storage unavailable or private mode
    }
  }, [resume]);

  const skillsList = useMemo(() => {
    if (resume.skillsCategories?.languages || resume.skillsCategories?.frameworks) {
      return [
        ...resume.skillsCategories.languages.split(','),
        ...resume.skillsCategories.frameworks.split(','),
        ...resume.skillsCategories.tools.split(','),
      ]
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return (resume.skills || '')
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
  }, [resume.skills, resume.skillsCategories]);

  const atsScore = useMemo(() => {
    let score = 0;
    if (resume.name.trim()) score += 10;
    if (resume.role.trim()) score += 10;
    if (resume.email.trim() && (resume.phone.trim() || resume.location.trim())) score += 10;
    if (resume.linkedin.trim() || resume.portfolio.trim()) score += 10;
    if (resume.objective.trim().length > 40) score += 15;
    if (skillsList.length >= 4) score += 15;
    if (resume.experienceList?.some((e) => e.company.trim() && e.bullets.trim())) score += 15;
    if (resume.education.some((e) => e.school.trim() && e.degree.trim())) score += 15;
    return Math.min(100, score);
  }, [resume, skillsList]);

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

  function handleLoadSample() {
    setResume(sampleResume);
    setNotice('Professional single-column ATS sample loaded! Ready to edit or download.');
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

  async function downloadPdf() {
    if (!resume.name.trim()) {
      setNotice('Please enter your full name before downloading your resume.');
      return;
    }
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [210, 297], // Exact A4 Dimensions: 210 x 297 mm (8.27 x 11.69 in)
    });

    const isBig = fontSize === 'big';
    const isCompact = fontSize === 'compact';
    const margin = isBig ? 15 : isCompact ? 12 : 14;
    const pageWidth = 210;
    const maxWidth = pageWidth - margin * 2;
    let y = isBig ? 16 : isCompact ? 13 : 15;

    const fontChoice = fontFamily === 'serif' ? 'times' : 'helvetica';
    const isCenter = template === 'ivy-center';

    const checkPage = (neededHeight = 10) => {
      if (y + neededHeight > 282) {
        pdf.addPage();
        y = margin;
      }
    };

    // Header: Name
    pdf.setFont(fontChoice, 'bold');
    pdf.setFontSize(isBig ? 24 : isCompact ? 19 : 21);
    pdf.setTextColor(15, 23, 42); // Pure black/slate

    if (isCenter) {
      pdf.text(resume.name.toUpperCase(), pageWidth / 2, y, { align: 'center' });
      y += isBig ? 6 : isCompact ? 4.5 : 5.2;

      if (resume.role) {
        pdf.setFont(fontChoice, 'normal');
        pdf.setFontSize(isBig ? 11.5 : isCompact ? 9.5 : 10.5);
        pdf.setTextColor(51, 65, 85);
        pdf.text(resume.role, pageWidth / 2, y, { align: 'center' });
        y += isBig ? 5 : isCompact ? 4 : 4.5;
      }

      const contacts = [
        resume.phone,
        resume.email,
        resume.location,
        resume.linkedin,
        resume.portfolio,
      ].filter(Boolean);
      if (contacts.length) {
        pdf.setFont(fontChoice, 'normal');
        pdf.setFontSize(isBig ? 9.5 : isCompact ? 8 : 8.8);
        pdf.setTextColor(51, 65, 85);
        pdf.text(contacts.join('   |   '), pageWidth / 2, y, { align: 'center' });
        y += isBig ? 6.5 : isCompact ? 5 : 5.8;
      }
    } else {
      pdf.text(resume.name.toUpperCase(), margin, y);
      y += isBig ? 6 : isCompact ? 4.5 : 5.2;

      if (resume.role) {
        pdf.setFont(fontChoice, 'bold');
        pdf.setFontSize(isBig ? 11.5 : isCompact ? 9.5 : 10.5);
        pdf.setTextColor(51, 65, 85);
        pdf.text(resume.role, margin, y);
        y += isBig ? 5 : isCompact ? 4 : 4.5;
      }

      const contacts = [
        resume.phone,
        resume.email,
        resume.location,
        resume.linkedin,
        resume.portfolio,
      ].filter(Boolean);
      if (contacts.length) {
        pdf.setFont(fontChoice, 'normal');
        pdf.setFontSize(isBig ? 9.5 : isCompact ? 8 : 8.8);
        pdf.setTextColor(51, 65, 85);
        pdf.text(contacts.join('   |   '), margin, y);
        y += isBig ? 6.5 : isCompact ? 5 : 5.8;
      }
    }

    const addSectionHeader = (title) => {
      checkPage(12);
      pdf.setFont(fontChoice, 'bold');
      pdf.setFontSize(isBig ? 11 : isCompact ? 9.5 : 10.2);
      pdf.setTextColor(15, 23, 42);
      pdf.text(title.toUpperCase(), margin, y);
      y += 1.8;
      pdf.setDrawColor(15, 23, 42);
      pdf.setLineWidth(0.4);
      pdf.line(margin, y, margin + maxWidth, y);
      y += isBig ? 4.5 : isCompact ? 3.5 : 4;
    };

    // 1. PROFESSIONAL SUMMARY
    if (resume.objective?.trim()) {
      addSectionHeader('Professional Summary');
      pdf.setFont(fontChoice, 'normal');
      pdf.setFontSize(isBig ? 10 : isCompact ? 8.5 : 9.2);
      pdf.setTextColor(30, 41, 59);
      const lines = pdf.splitTextToSize(resume.objective.trim(), maxWidth);
      pdf.text(lines, margin, y);
      y += lines.length * (isBig ? 4.3 : isCompact ? 3.6 : 3.9) + (isBig ? 3 : isCompact ? 2 : 2.5);
    }

    // 2. TECHNICAL SKILLS
    const hasCatSkills =
      resume.skillsCategories?.languages ||
      resume.skillsCategories?.frameworks ||
      resume.skillsCategories?.tools;
    if (hasCatSkills || resume.skills) {
      addSectionHeader('Technical Skills');
      pdf.setFontSize(isBig ? 10 : isCompact ? 8.5 : 9.2);

      if (hasCatSkills) {
        const renderCat = (label, val) => {
          if (!val?.trim()) return;
          checkPage(7);
          pdf.setFont(fontChoice, 'bold');
          pdf.setTextColor(15, 23, 42);
          pdf.text(`${label}: `, margin, y);
          const labelWidth = pdf.getTextWidth(`${label}: `);
          pdf.setFont(fontChoice, 'normal');
          pdf.setTextColor(30, 41, 59);
          const lines = pdf.splitTextToSize(val.trim(), maxWidth - labelWidth);
          pdf.text(lines, margin + labelWidth, y);
          y += lines.length * (isBig ? 4.3 : isCompact ? 3.6 : 3.9) + (isBig ? 1.5 : 1);
        };
        renderCat('Languages', resume.skillsCategories.languages);
        renderCat('Frameworks & Libraries', resume.skillsCategories.frameworks);
        renderCat('Tools, Cloud & Databases', resume.skillsCategories.tools);
        y += isBig ? 2.5 : isCompact ? 1.5 : 2;
      } else {
        checkPage(8);
        pdf.setFont(fontChoice, 'normal');
        pdf.setTextColor(30, 41, 59);
        const lines = pdf.splitTextToSize(resume.skills, maxWidth);
        pdf.text(lines, margin, y);
        y += lines.length * (isBig ? 4.3 : isCompact ? 3.6 : 3.9) + (isBig ? 3 : isCompact ? 2 : 2.5);
      }
    }

    // 3. EXPERIENCE
    const validExp = resume.experienceList?.filter((e) => e.company?.trim() || e.role?.trim());
    if (validExp && validExp.length) {
      addSectionHeader('Experience');
      validExp.forEach((exp) => {
        checkPage(18);
        // Line 1: Job Role (Bold) on left, Dates on right
        pdf.setFont(fontChoice, 'bold');
        pdf.setFontSize(isBig ? 10.8 : isCompact ? 9 : 9.8);
        pdf.setTextColor(15, 23, 42);
        pdf.text(exp.role || 'Job Role', margin, y);

        if (exp.dates) {
          pdf.setFont(fontChoice, 'bold');
          pdf.setFontSize(isBig ? 10 : isCompact ? 8.5 : 9.2);
          pdf.setTextColor(15, 23, 42);
          pdf.text(exp.dates, margin + maxWidth, y, { align: 'right' });
        }
        y += isBig ? 4.5 : isCompact ? 3.8 : 4.2;

        // Line 2: Company (Italic) on left, Location on right
        pdf.setFont(fontChoice, 'italic');
        pdf.setFontSize(isBig ? 10 : isCompact ? 8.5 : 9.2);
        pdf.setTextColor(71, 85, 105);
        pdf.text(exp.company || 'Company', margin, y);

        if (exp.location) {
          pdf.setFont(fontChoice, 'italic');
          pdf.setFontSize(isBig ? 9.5 : isCompact ? 8 : 8.8);
          pdf.text(exp.location, margin + maxWidth, y, { align: 'right' });
        }
        y += isBig ? 4.8 : isCompact ? 4 : 4.5;

        // Bullets
        if (exp.bullets) {
          pdf.setFont(fontChoice, 'normal');
          pdf.setFontSize(isBig ? 9.5 : isCompact ? 8 : 8.8);
          pdf.setTextColor(30, 41, 59);
          const rawLines = exp.bullets.split('\n');
          rawLines.forEach((line) => {
            if (!line.trim()) return;
            checkPage(7);
            const cleanText = line.replace(/^[•\-\*]\s*/, '').trim();
            const wrapped = pdf.splitTextToSize(cleanText, maxWidth - 5.5);
            pdf.text('•', margin + 1.2, y);
            pdf.text(wrapped, margin + 4.8, y);
            y += wrapped.length * (isBig ? 4 : isCompact ? 3.4 : 3.8) + (isBig ? 1.2 : 0.8);
          });
        }
        y += isBig ? 3 : isCompact ? 2 : 2.5;
      });
    }

    // 4. PROJECTS
    const validProj = resume.projects?.filter((p) => p.title?.trim() || p.description?.trim());
    if (validProj && validProj.length) {
      addSectionHeader('Projects');
      validProj.forEach((proj) => {
        checkPage(17);
        // Line 1: Title (Bold) + Tech stack (Italic) on left, Link on right
        pdf.setFont(fontChoice, 'bold');
        pdf.setFontSize(isBig ? 10.8 : isCompact ? 9 : 9.8);
        pdf.setTextColor(15, 23, 42);
        const titleText = proj.title || 'Project';
        pdf.text(titleText, margin, y);
        const titleWidth = pdf.getTextWidth(titleText);

        if (proj.technologies) {
          pdf.setFont(fontChoice, 'italic');
          pdf.setFontSize(isBig ? 9.5 : isCompact ? 8 : 8.8);
          pdf.setTextColor(100, 116, 139);
          pdf.text(`  |  ${proj.technologies}`, margin + titleWidth, y);
        }

        if (proj.link) {
          pdf.setFont(fontChoice, 'normal');
          pdf.setFontSize(isBig ? 9.5 : isCompact ? 8 : 8.8);
          pdf.setTextColor(30, 41, 59);
          pdf.text(proj.link, margin + maxWidth, y, { align: 'right' });
        }
        y += isBig ? 4.5 : isCompact ? 4 : 4.5;

        // Bullets or description
        if (proj.description) {
          pdf.setFont(fontChoice, 'normal');
          pdf.setFontSize(isBig ? 9.5 : isCompact ? 8 : 8.8);
          pdf.setTextColor(30, 41, 59);
          const rawLines = proj.description.split('\n');
          rawLines.forEach((line) => {
            if (!line.trim()) return;
            checkPage(7);
            const cleanText = line.replace(/^[•\-\*]\s*/, '').trim();
            const wrapped = pdf.splitTextToSize(cleanText, maxWidth - 5.5);
            pdf.text('•', margin + 1.2, y);
            pdf.text(wrapped, margin + 4.8, y);
            y += wrapped.length * (isBig ? 4 : isCompact ? 3.4 : 3.8) + (isBig ? 1.2 : 0.8);
          });
        }
        y += isBig ? 3 : isCompact ? 2 : 2.5;
      });
    }

    // 5. EDUCATION
    const validEdu = resume.education.filter((e) => e.school?.trim() || e.degree?.trim());
    if (validEdu.length) {
      addSectionHeader('Education');
      validEdu.forEach((edu) => {
        checkPage(16);
        // Line 1: Degree & Major (Bold) on left, Dates on right
        pdf.setFont(fontChoice, 'bold');
        pdf.setFontSize(isBig ? 10.8 : isCompact ? 9 : 9.8);
        pdf.setTextColor(15, 23, 42);
        pdf.text(edu.degree || 'Degree / Major', margin, y);

        const rightDate = edu.years || '';
        if (rightDate) {
          pdf.setFont(fontChoice, 'bold');
          pdf.setFontSize(isBig ? 10 : isCompact ? 8.5 : 9.2);
          pdf.setTextColor(15, 23, 42);
          pdf.text(rightDate, margin + maxWidth, y, { align: 'right' });
        }
        y += isBig ? 4.5 : isCompact ? 3.8 : 4.2;

        // Line 2: Institution (Italic) on left, Location & GPA on right
        pdf.setFont(fontChoice, 'italic');
        pdf.setFontSize(isBig ? 10 : isCompact ? 8.5 : 9.2);
        pdf.setTextColor(71, 85, 105);
        pdf.text(edu.school || 'University', margin, y);

        const rightSub = [edu.location, edu.gpa].filter(Boolean).join('   |   ');
        if (rightSub) {
          pdf.setFont(fontChoice, 'italic');
          pdf.setFontSize(isBig ? 9.5 : isCompact ? 8 : 8.8);
          pdf.text(rightSub, margin + maxWidth, y, { align: 'right' });
        }
        y += isBig ? 5 : isCompact ? 4.5 : 5.5;
      });
    }

    // 6. CERTIFICATIONS
    if (resume.certifications?.trim()) {
      addSectionHeader('Certifications');
      pdf.setFont(fontChoice, 'normal');
      pdf.setFontSize(isBig ? 9.5 : isCompact ? 8 : 8.8);
      pdf.setTextColor(30, 41, 59);
      const lines = resume.certifications.split('\n');
      lines.forEach((l) => {
        if (!l.trim()) return;
        checkPage(6);
        const clean = l.replace(/^[•\-\*]\s*/, '').trim();
        const wrapped = pdf.splitTextToSize(clean, maxWidth - 5.5);
        pdf.text('•', margin + 1.2, y);
        pdf.text(wrapped, margin + 4.8, y);
        y += wrapped.length * (isBig ? 4 : isCompact ? 3.4 : 3.8) + (isBig ? 1.2 : 0.8);
      });
      y += isBig ? 2 : isCompact ? 1 : 2;
    }

    // 7. ACHIEVEMENTS
    if (resume.achievements?.trim()) {
      addSectionHeader('Achievements');
      pdf.setFont(fontChoice, 'normal');
      pdf.setFontSize(isBig ? 9.5 : isCompact ? 8 : 8.8);
      pdf.setTextColor(30, 41, 59);
      const lines = resume.achievements.split('\n');
      lines.forEach((l) => {
        if (!l.trim()) return;
        checkPage(6);
        const clean = l.replace(/^[•\-\*]\s*/, '').trim();
        const wrapped = pdf.splitTextToSize(clean, maxWidth - 5.5);
        pdf.text('•', margin + 1.2, y);
        pdf.text(wrapped, margin + 4.8, y);
        y += wrapped.length * (isBig ? 4 : isCompact ? 3.4 : 3.8) + (isBig ? 1.2 : 0.8);
      });
      y += isBig ? 2 : isCompact ? 1 : 2;
    }

    // 8. LANGUAGES
    if (resume.languages?.trim()) {
      addSectionHeader('Languages');
      checkPage(6);
      pdf.setFont(fontChoice, 'normal');
      pdf.setFontSize(isBig ? 10 : isCompact ? 8.5 : 9.2);
      pdf.setTextColor(30, 41, 59);
      pdf.text(resume.languages.trim(), margin, y);
    }

    const safeFilename =
      resume.name
        .trim()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase() || 'resume';
    pdf.save(`${safeFilename}-A4-CV.pdf`);
    setNotice('Your professional A4 CV (210 × 297 mm) has been downloaded successfully!');
    setTimeout(() => setNotice(''), 4000);
  }

  return (
    <main className="resume-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">PROFESSIONAL ATS A4 CV BUILDER</span>
          <h1>Single-Column, 100% ATS-Compliant Professional CV</h1>
          <p>Strictly adheres to top hiring rubrics: ISO A4 standard (210 × 297 mm), single-column linear layout, no distracting graphics, and optimal parsing for Workday, Greenhouse, and human recruiters.</p>
          <div className="page-hero-meta">
            <span>✓ Exact A4 (210 × 297 mm)</span>
            <span>✓ Single-Column ATS Layout</span>
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

          {/* Form Sections In Requested Sequence */}
          <div className="resume-form">
            {/* Header / Contact Info */}
            <ResumeSection title="Name &amp; Contact Information" icon={<Mail size={14} />}>
              <div className="form-grid">
                <Field label="Full Name" value={resume.name} onChange={(v) => update('name', v)} placeholder="e.g. AANYA SHARMA" />
                <Field label="Target Headline / Role" value={resume.role} onChange={(v) => update('role', v)} placeholder="e.g. Software Development Engineer" />
                <Field label="Phone Number" value={resume.phone} onChange={(v) => update('phone', v)} placeholder="+91 98765 43210" />
                <Field label="Email Address" value={resume.email} onChange={(v) => update('email', v)} placeholder="aanya@example.com" type="email" />
                <Field label="Location (City, Country)" value={resume.location} onChange={(v) => update('location', v)} placeholder="Bengaluru, India" />
                <Field label="LinkedIn URL / Handle" value={resume.linkedin} onChange={(v) => update('linkedin', v)} placeholder="linkedin.com/in/username" />
                <Field label="GitHub / Portfolio" value={resume.portfolio} onChange={(v) => update('portfolio', v)} placeholder="github.com/username" />
              </div>
            </ResumeSection>

            {/* 1. PROFESSIONAL SUMMARY */}
            <ResumeSection title="Professional Summary" icon={<FileText size={14} />}>
              <textarea
                value={resume.objective}
                onChange={(e) => update('objective', e.target.value)}
                placeholder="Write 2–3 concise sentences summarizing your core technical strengths, engineering background, and business impact."
                rows="3"
              />
            </ResumeSection>

            {/* 2. TECHNICAL SKILLS */}
            <ResumeSection title="Technical Skills" icon={<Code2 size={14} />}>
              <div className="skills-categorized-inputs">
                <Field
                  label="Programming Languages"
                  value={resume.skillsCategories?.languages || ''}
                  onChange={(v) => updateSkillCat('languages', v)}
                  placeholder="e.g. JavaScript (ES6+), TypeScript, Python, Java, SQL, C++"
                />
                <Field
                  label="Frameworks &amp; Libraries"
                  value={resume.skillsCategories?.frameworks || ''}
                  onChange={(v) => updateSkillCat('frameworks', v)}
                  placeholder="e.g. React.js, Node.js, Express.js, Next.js, Redux, Tailwind CSS"
                />
                <Field
                  label="Tools, Cloud &amp; Databases"
                  value={resume.skillsCategories?.tools || ''}
                  onChange={(v) => updateSkillCat('tools', v)}
                  placeholder="e.g. Git, GitHub, Docker, AWS (S3, EC2), PostgreSQL, MongoDB, Redis, Linux"
                />
              </div>
            </ResumeSection>

            {/* 3. EXPERIENCE */}
            <ResumeSection
              title="Experience"
              icon={<Briefcase size={14} />}
              add={() => addGroup('experienceList', { company: '', role: '', location: '', dates: '', bullets: '' })}
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
                    <Field label="Job Title / Role" value={item.role} onChange={(v) => updateGroup('experienceList', index, 'role', v)} placeholder="e.g. Software Engineer Intern" />
                    <Field label="Dates / Duration" value={item.dates} onChange={(v) => updateGroup('experienceList', index, 'dates', v)} placeholder="e.g. Jan 2024 – Jun 2024" />
                    <Field label="Company / Organization" value={item.company} onChange={(v) => updateGroup('experienceList', index, 'company', v)} placeholder="e.g. TechNova Solutions" />
                    <Field label="Location" value={item.location} onChange={(v) => updateGroup('experienceList', index, 'location', v)} placeholder="e.g. Bengaluru, India" />
                    <label className="field-label full-field">
                      Impact Bullets (1 accomplishment per line)
                      <textarea
                        value={item.bullets}
                        onChange={(e) => updateGroup('experienceList', index, 'bullets', e.target.value)}
                        placeholder="• Architected and deployed 6+ reusable React components, decreasing page load time by 28% for 45k users.&#10;• Engineered RESTful APIs in Node.js, reducing median response time by 35%."
                        rows="4"
                      />
                    </label>
                  </div>
                  {resume.experienceList.length > 1 && (
                    <button type="button" className="remove-row" onClick={() => removeGroup('experienceList', index)} aria-label="Remove experience">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </ResumeSection>

            {/* 4. PROJECTS */}
            <ResumeSection
              title="Projects"
              icon={<Code2 size={14} />}
              add={() => addGroup('projects', { title: '', technologies: '', link: '', description: '' })}
            >
              {resume.projects.map((item, index) => (
                <div className="repeat-group" key={`proj-${index}`}>
                  <div className="form-grid">
                    <Field label="Project Title" value={item.title} onChange={(v) => updateGroup('projects', index, 'title', v)} placeholder="e.g. DevCollab Workspace" />
                    <Field label="Technologies Used" value={item.technologies} onChange={(v) => updateGroup('projects', index, 'technologies', v)} placeholder="e.g. React, Node.js, Redis, Docker" />
                    <Field label="GitHub / Live Link" value={item.link} onChange={(v) => updateGroup('projects', index, 'link', v)} placeholder="github.com/username/project" />
                    <label className="field-label full-field">
                      What you engineered &amp; measurable outcomes (bullets)
                      <textarea
                        value={item.description}
                        onChange={(e) => updateGroup('projects', index, 'description', e.target.value)}
                        placeholder="• Built a real-time collaborative editor with live multi-cursor syncing over WebSockets.&#10;• Scaled Redis channels to handle 2,000+ concurrent connections with 0 dropped events."
                        rows="3"
                      />
                    </label>
                  </div>
                  {resume.projects.length > 1 && (
                    <button type="button" className="remove-row" onClick={() => removeGroup('projects', index)} aria-label="Remove project">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </ResumeSection>

            {/* 5. EDUCATION */}
            <ResumeSection
              title="Education"
              icon={<GraduationCap size={14} />}
              add={() => addGroup('education', { school: '', degree: '', location: '', years: '', gpa: '' })}
            >
              {resume.education.map((item, index) => (
                <div className="repeat-group" key={`edu-${index}`}>
                  <div className="form-grid">
                    <Field label="Degree &amp; Major" value={item.degree} onChange={(v) => updateGroup('education', index, 'degree', v)} placeholder="e.g. B.Tech in Computer Science" />
                    <Field label="Graduation Year / Dates" value={item.years} onChange={(v) => updateGroup('education', index, 'years', v)} placeholder="e.g. 2020 – 2024" />
                    <Field label="University / College" value={item.school} onChange={(v) => updateGroup('education', index, 'school', v)} placeholder="e.g. NIT Surathkal" />
                    <Field label="Location (City, Country)" value={item.location} onChange={(v) => updateGroup('education', index, 'location', v)} placeholder="e.g. Surathkal, India" />
                    <Field label="GPA / Percentage (Optional)" value={item.gpa} onChange={(v) => updateGroup('education', index, 'gpa', v)} placeholder="e.g. CGPA: 8.9 / 10" />
                  </div>
                  {resume.education.length > 1 && (
                    <button type="button" className="remove-row" onClick={() => removeGroup('education', index)} aria-label="Remove education">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </ResumeSection>

            {/* 6. CERTIFICATIONS */}
            <ResumeSection title="Certifications" icon={<Award size={14} />}>
              <label className="field-label full-field">
                Certifications (1 per line)
                <textarea
                  value={resume.certifications}
                  onChange={(e) => update('certifications', e.target.value)}
                  placeholder="• AWS Certified Cloud Practitioner — Amazon Web Services (2024)&#10;• Meta Front-End Developer Professional Certificate (2023)"
                  rows="2"
                />
              </label>
            </ResumeSection>

            {/* 7. ACHIEVEMENTS */}
            <ResumeSection title="Achievements" icon={<Award size={14} />}>
              <label className="field-label full-field">
                Honors &amp; Hackathon Achievements (1 per line)
                <textarea
                  value={resume.achievements}
                  onChange={(e) => update('achievements', e.target.value)}
                  placeholder="• 1st Place Winner out of 70+ teams at National HackIndia Hackathon (2023)&#10;• Solved 500+ LeetCode problems (Knight rank)"
                  rows="2"
                />
              </label>
              <Field
                label="Languages"
                value={resume.languages}
                onChange={(v) => update('languages', v)}
                placeholder="e.g. English (Fluent), Hindi (Native)"
              />
            </ResumeSection>
          </div>

          {notice && <p className="resume-notice" role="status">{notice}</p>}

          {/* Action Buttons */}
          <div className="resume-actions">
            <button type="button" className="button-primary download-btn" onClick={downloadPdf}>
              <Download size={15} /> Download A4 PDF (210 × 297 mm)
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

        {/* Live A4 Preview Column */}
        <aside className="resume-preview-panel">
          <div className="preview-head">
            <div>
              <div className="preview-eyebrow-row">
                <span className="eyebrow">A4 CV DOCUMENT</span>
                <span className="a4-size-indicator">210 × 297 mm · Single Column</span>
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
              {/* Paper Canvas */}
              <article
                className={`resume-paper-document ${template} ${fontFamily} font-${fontSize}`}
              >
                {/* Header */}
                <header className="paper-header">
                  <h1 className="paper-name">{resume.name || 'YOUR FULL NAME'}</h1>
                  {resume.role && <div className="paper-headline">{resume.role}</div>}
                  <div className="paper-contact-row">
                    {[
                      resume.phone,
                      resume.email,
                      resume.location,
                      resume.linkedin,
                      resume.portfolio,
                    ]
                      .filter(Boolean)
                      .map((item, idx, arr) => (
                        <span key={idx} className="paper-contact-item">
                          {item}
                          {idx < arr.length - 1 && <span className="contact-separator">|</span>}
                        </span>
                      ))}
                  </div>
                </header>

                {/* 1. PROFESSIONAL SUMMARY */}
                {resume.objective?.trim() && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">PROFESSIONAL SUMMARY</h2>
                    <p className="paper-paragraph">{resume.objective}</p>
                  </section>
                )}

                {/* 2. TECHNICAL SKILLS */}
                {(resume.skillsCategories?.languages ||
                  resume.skillsCategories?.frameworks ||
                  resume.skillsCategories?.tools ||
                  resume.skills) && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">TECHNICAL SKILLS</h2>
                    <div className="paper-skills-matrix">
                      {resume.skillsCategories?.languages && (
                        <div className="paper-skill-row">
                          <strong className="skill-cat-label">Languages: </strong>
                          <span className="skill-cat-values">{resume.skillsCategories.languages}</span>
                        </div>
                      )}
                      {resume.skillsCategories?.frameworks && (
                        <div className="paper-skill-row">
                          <strong className="skill-cat-label">Frameworks &amp; Libraries: </strong>
                          <span className="skill-cat-values">{resume.skillsCategories.frameworks}</span>
                        </div>
                      )}
                      {resume.skillsCategories?.tools && (
                        <div className="paper-skill-row">
                          <strong className="skill-cat-label">Tools, Cloud &amp; Databases: </strong>
                          <span className="skill-cat-values">{resume.skillsCategories.tools}</span>
                        </div>
                      )}
                      {!resume.skillsCategories?.languages && !resume.skillsCategories?.frameworks && resume.skills && (
                        <div className="paper-skill-row">
                          <strong className="skill-cat-label">Skills: </strong>
                          <span className="skill-cat-values">{resume.skills}</span>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* 3. EXPERIENCE */}
                {resume.experienceList.some((e) => e.company || e.role) && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">EXPERIENCE</h2>
                    {resume.experienceList
                      .filter((e) => e.company || e.role)
                      .map((exp, idx) => (
                        <div className="paper-entry" key={idx}>
                          <div className="paper-entry-row primary">
                            <strong className="entry-bold">{exp.role || 'Job Role'}</strong>
                            <span className="entry-right-date">{exp.dates}</span>
                          </div>
                          <div className="paper-entry-row secondary">
                            <span className="entry-italic">{exp.company || 'Company'}</span>
                            {exp.location && <span className="entry-right-sub">{exp.location}</span>}
                          </div>
                          {exp.bullets && (
                            <ul className="paper-bullet-list">
                              {exp.bullets.split('\n').map((line, bIdx) => {
                                const clean = line.replace(/^[•\-\*]\s*/, '').trim();
                                if (!clean) return null;
                                return <li key={bIdx}>{clean}</li>;
                              })}
                            </ul>
                          )}
                        </div>
                      ))}
                  </section>
                )}

                {/* 4. PROJECTS */}
                {resume.projects?.some((p) => p.title || p.description) && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">PROJECTS</h2>
                    {resume.projects
                      .filter((p) => p.title || p.description)
                      .map((proj, idx) => (
                        <div className="paper-entry" key={idx}>
                          <div className="paper-entry-row primary">
                            <div className="entry-title-with-stack">
                              <strong className="entry-bold">{proj.title || 'Project Title'}</strong>
                              {proj.technologies && (
                                <span className="entry-tech-stack"> | {proj.technologies}</span>
                              )}
                            </div>
                            {proj.link && (
                              <span className="entry-right-link">
                                {proj.link}
                              </span>
                            )}
                          </div>
                          {proj.description && (
                            <ul className="paper-bullet-list">
                              {proj.description.split('\n').map((line, bIdx) => {
                                const clean = line.replace(/^[•\-\*]\s*/, '').trim();
                                if (!clean) return null;
                                return <li key={bIdx}>{clean}</li>;
                              })}
                            </ul>
                          )}
                        </div>
                      ))}
                  </section>
                )}

                {/* 5. EDUCATION */}
                {resume.education.some((e) => e.school || e.degree) && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">EDUCATION</h2>
                    {resume.education
                      .filter((e) => e.school || e.degree)
                      .map((edu, idx) => (
                        <div className="paper-entry" key={idx}>
                          <div className="paper-entry-row primary">
                            <strong className="entry-bold">{edu.degree || 'Degree / Major'}</strong>
                            <span className="entry-right-date">{edu.years}</span>
                          </div>
                          <div className="paper-entry-row secondary">
                            <span className="entry-italic">{edu.school || 'University'}</span>
                            <span className="entry-right-sub">
                              {[edu.location, edu.gpa].filter(Boolean).join('   |   ')}
                            </span>
                          </div>
                        </div>
                      ))}
                  </section>
                )}

                {/* 6. CERTIFICATIONS */}
                {resume.certifications?.trim() && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">CERTIFICATIONS</h2>
                    <ul className="paper-bullet-list">
                      {resume.certifications.split('\n').map((line, idx) => {
                        const clean = line.replace(/^[•\-\*]\s*/, '').trim();
                        if (!clean) return null;
                        return <li key={idx}>{clean}</li>;
                      })}
                    </ul>
                  </section>
                )}

                {/* 7. ACHIEVEMENTS */}
                {resume.achievements?.trim() && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">ACHIEVEMENTS</h2>
                    <ul className="paper-bullet-list">
                      {resume.achievements.split('\n').map((line, idx) => {
                        const clean = line.replace(/^[•\-\*]\s*/, '').trim();
                        if (!clean) return null;
                        return <li key={idx}>{clean}</li>;
                      })}
                    </ul>
                  </section>
                )}

                {/* 8. LANGUAGES (Optional) */}
                {resume.languages?.trim() && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">LANGUAGES</h2>
                    <p className="paper-paragraph">{resume.languages}</p>
                  </section>
                )}

                {/* ISO A4 Sheet Verification Marker */}
                <footer className="paper-footer-tag">
                  <span>Standard A4 · 210 × 297 mm · Single Column ATS</span>
                  <span>Page 1 of 1</span>
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

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="field-label">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
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
