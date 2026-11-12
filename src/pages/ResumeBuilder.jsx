import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Briefcase,
  CheckCircle2,
  Code2,
  Download,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Info,
  Linkedin,
  Mail,
  MapPin,
  Phone,
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
  portfolio: '',
  linkedin: '',
  objective: '',
  education: [
    { school: '', degree: '', location: '', years: '', gpa: '' },
  ],
  experienceList: [
    { company: '', role: '', location: '', dates: '', bullets: '' },
  ],
  projects: [
    { title: '', technologies: '', link: '', description: '' },
  ],
  skills: '',
  skillsCategories: {
    languages: '',
    frameworks: '',
    tools: '',
  },
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
  linkedin: 'linkedin.com/in/aanya-sharma',
  objective:
    'Results-driven Software Engineer with strong foundations in data structures, algorithms, and distributed systems. Experienced in developing scalable full-stack web applications with React, Node.js, and PostgreSQL. Passionate about building high-performance APIs, reducing latency, and writing clean, maintainable code in agile teams.',
  education: [
    {
      school: 'National Institute of Technology Karnataka (NITK)',
      degree: 'B.Tech in Computer Science & Engineering',
      location: 'Surathkal, India',
      years: '2020 – 2024',
      gpa: 'CGPA: 8.9 / 10',
    },
  ],
  skills:
    'JavaScript, TypeScript, Python, Java, SQL, C++, React.js, Node.js, Express.js, PostgreSQL, Docker, AWS, Git, Redis, REST APIs, Tailwind CSS',
  skillsCategories: {
    languages: 'JavaScript (ES6+), TypeScript, Python, Java, SQL, C++',
    frameworks: 'React.js, Node.js, Express.js, Next.js, Redux Toolkit, Tailwind CSS',
    tools: 'Git, GitHub, Docker, AWS (EC2, S3), PostgreSQL, MongoDB, Redis, Linux, Postman',
  },
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
  certifications:
    '• AWS Certified Cloud Practitioner — Amazon Web Services (2024)\n• Meta Front-End Developer Professional Certificate — Meta / Coursera (2023)',
  achievements:
    '• 1st Place Winner (out of 70+ engineering teams) at National HackIndia Hackathon (2023)\n• Solved 500+ Data Structures & Algorithms problems across LeetCode & Codeforces (Knight rank)',
  languages: 'English (Professional Working Proficiency), Hindi (Native)',
};

const templateOptions = [
  {
    id: 'ivy',
    name: 'Ivy League / Jake’s ATS',
    desc: 'Highest ATS Rate · Big Tech & FAANG',
    accent: '#0f172a',
  },
  {
    id: 'modern',
    name: 'Modern Tech Pro',
    desc: 'Startups & Product Engineering',
    accent: '#0d9488',
  },
  {
    id: 'tech',
    name: 'Silicon Valley Dev',
    desc: 'Full Stack & Software Engineers',
    accent: '#6366f1',
  },
  {
    id: 'classic',
    name: 'Executive Corporate',
    desc: 'Consulting, Finance & Enterprise',
    accent: '#1e3a8a',
  },
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
  const [template, setTemplate] = useState('ivy');
  const [density, setDensity] = useState('compact');
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
    return resume.skills
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
    if (resume.education.some((e) => e.school.trim() && e.degree.trim())) score += 15;
    if (skillsList.length >= 4) score += 15;
    const hasExp = resume.experienceList?.some((e) => e.company.trim() && e.bullets.trim());
    const hasProj = resume.projects?.some((p) => p.title.trim() && p.description.trim());
    if (hasExp || hasProj) score += 15;
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
    setNotice('Professional sample loaded! Ready to customize or download.');
    setTimeout(() => setNotice(''), 4000);
  }

  function handleReset() {
    if (window.confirm('Clear all fields to start with a blank resume?')) {
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
      format: 'a4',
    });

    const isCompact = density === 'compact';
    const margin = isCompact ? 14 : 16;
    const pageWidth = 210;
    const maxWidth = pageWidth - margin * 2;
    let y = isCompact ? 14 : 16;

    const themes = {
      ivy: {
        primary: [15, 23, 42],
        accent: [15, 23, 42],
        subtext: [51, 65, 85],
        divider: [51, 65, 85],
        ruleWidth: 0.5,
        topBar: false,
        centeredHeader: true,
      },
      modern: {
        primary: [15, 23, 42],
        accent: [13, 148, 136],
        subtext: [71, 85, 105],
        divider: [153, 246, 228],
        ruleWidth: 0.6,
        topBar: true,
        topBarColor: [13, 148, 136],
        centeredHeader: false,
      },
      tech: {
        primary: [15, 23, 42],
        accent: [99, 102, 241],
        subtext: [79, 70, 229],
        divider: [224, 231, 255],
        ruleWidth: 0.6,
        topBar: true,
        topBarColor: [99, 102, 241],
        centeredHeader: false,
      },
      classic: {
        primary: [15, 23, 42],
        accent: [30, 58, 138],
        subtext: [71, 85, 105],
        divider: [203, 213, 225],
        ruleWidth: 0.5,
        topBar: false,
        centeredHeader: false,
      },
    };

    const theme = themes[template] || themes.ivy;

    if (theme.topBar) {
      pdf.setFillColor(...theme.topBarColor);
      pdf.rect(0, 0, pageWidth, 3.5, 'F');
      y = isCompact ? 15 : 18;
    }

    const checkPage = (neededHeight = 10) => {
      if (y + neededHeight > 282) {
        pdf.addPage();
        y = margin;
      }
    };

    // Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(isCompact ? 19 : 21);
    pdf.setTextColor(...theme.primary);

    if (theme.centeredHeader) {
      pdf.text(resume.name.toUpperCase(), pageWidth / 2, y, { align: 'center' });
      y += isCompact ? 4.5 : 5.5;

      if (resume.role) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(isCompact ? 9.5 : 10.5);
        pdf.setTextColor(...theme.subtext);
        pdf.text(resume.role, pageWidth / 2, y, { align: 'center' });
        y += isCompact ? 4 : 4.5;
      }

      const contacts = [
        resume.email,
        resume.phone,
        resume.location,
        resume.linkedin,
        resume.portfolio,
      ].filter(Boolean);
      if (contacts.length) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(isCompact ? 8 : 8.5);
        pdf.setTextColor(...theme.subtext);
        pdf.text(contacts.join('   |   '), pageWidth / 2, y, { align: 'center' });
        y += isCompact ? 5 : 6;
      }
    } else {
      pdf.text(resume.name, margin, y);
      y += isCompact ? 4.5 : 5.5;

      if (resume.role) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(isCompact ? 9.5 : 10.5);
        pdf.setTextColor(...theme.accent);
        pdf.text(resume.role, margin, y);
        y += isCompact ? 4 : 4.5;
      }

      const contacts = [
        resume.email,
        resume.phone,
        resume.location,
        resume.linkedin,
        resume.portfolio,
      ].filter(Boolean);
      if (contacts.length) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(isCompact ? 8 : 8.5);
        pdf.setTextColor(...theme.subtext);
        pdf.text(contacts.join('   |   '), margin, y);
        y += isCompact ? 5 : 6;
      }
    }

    const addSectionHeader = (title) => {
      checkPage(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(isCompact ? 9.5 : 10);
      pdf.setTextColor(...theme.accent);
      pdf.text(title.toUpperCase(), margin, y);
      y += 1.8;
      pdf.setDrawColor(...theme.divider);
      pdf.setLineWidth(theme.ruleWidth);
      pdf.line(margin, y, margin + maxWidth, y);
      y += isCompact ? 3.5 : 4;
    };

    // Summary
    if (resume.objective?.trim()) {
      addSectionHeader('Professional Summary');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(isCompact ? 8.5 : 9);
      pdf.setTextColor(51, 65, 85);
      const lines = pdf.splitTextToSize(resume.objective.trim(), maxWidth);
      pdf.text(lines, margin, y);
      y += lines.length * (isCompact ? 3.6 : 4) + (isCompact ? 2 : 3);
    }

    // Education
    const validEdu = resume.education.filter((e) => e.school?.trim() || e.degree?.trim());
    if (validEdu.length) {
      addSectionHeader('Education');
      validEdu.forEach((edu) => {
        checkPage(14);
        // Line 1: School (Bold) on left, Location or Years on right
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(isCompact ? 9 : 9.5);
        pdf.setTextColor(...theme.primary);
        pdf.text(edu.school || 'University', margin, y);

        const rightDate = edu.years || '';
        if (rightDate) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(isCompact ? 8.5 : 9);
          pdf.setTextColor(51, 65, 85);
          pdf.text(rightDate, margin + maxWidth, y, { align: 'right' });
        }
        y += isCompact ? 3.8 : 4.2;

        // Line 2: Degree on left (Italic), Location or GPA on right
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(isCompact ? 8.5 : 9);
        pdf.setTextColor(51, 65, 85);
        pdf.text(edu.degree || 'Degree', margin, y);

        const rightSub = [edu.location, edu.gpa].filter(Boolean).join('   |   ');
        if (rightSub) {
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(isCompact ? 8 : 8.5);
          pdf.text(rightSub, margin + maxWidth, y, { align: 'right' });
        }
        y += isCompact ? 4.5 : 5.5;
      });
    }

    // Technical Skills
    const hasCatSkills =
      resume.skillsCategories?.languages ||
      resume.skillsCategories?.frameworks ||
      resume.skillsCategories?.tools;
    if (hasCatSkills || resume.skills) {
      addSectionHeader('Technical Skills');
      pdf.setFontSize(isCompact ? 8.5 : 9);

      if (hasCatSkills) {
        const renderCat = (label, val) => {
          if (!val?.trim()) return;
          checkPage(6);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...theme.primary);
          pdf.text(`${label}: `, margin, y);
          const labelWidth = pdf.getTextWidth(`${label}: `);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(51, 65, 85);
          const lines = pdf.splitTextToSize(val.trim(), maxWidth - labelWidth);
          pdf.text(lines, margin + labelWidth, y);
          y += lines.length * (isCompact ? 3.6 : 4) + (isCompact ? 1 : 1.5);
        };
        renderCat('Languages', resume.skillsCategories.languages);
        renderCat('Frameworks & Libraries', resume.skillsCategories.frameworks);
        renderCat('Tools, Cloud & Databases', resume.skillsCategories.tools);
        y += isCompact ? 1.5 : 2.5;
      } else {
        checkPage(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(51, 65, 85);
        const lines = pdf.splitTextToSize(resume.skills, maxWidth);
        pdf.text(lines, margin, y);
        y += lines.length * (isCompact ? 3.6 : 4) + (isCompact ? 2 : 3);
      }
    }

    // Experience
    const validExp = resume.experienceList?.filter((e) => e.company?.trim() || e.role?.trim());
    if (validExp && validExp.length) {
      addSectionHeader('Work Experience');
      validExp.forEach((exp) => {
        checkPage(16);
        // Line 1: Role (Bold) on left, Dates on right
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(isCompact ? 9 : 9.5);
        pdf.setTextColor(...theme.primary);
        pdf.text(exp.role || 'Role', margin, y);

        if (exp.dates) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(isCompact ? 8.5 : 9);
          pdf.setTextColor(51, 65, 85);
          pdf.text(exp.dates, margin + maxWidth, y, { align: 'right' });
        }
        y += isCompact ? 3.8 : 4.2;

        // Line 2: Company (Italic) on left, Location on right
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(isCompact ? 8.5 : 9);
        pdf.setTextColor(71, 85, 105);
        pdf.text(exp.company || 'Company', margin, y);

        if (exp.location) {
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(isCompact ? 8 : 8.5);
          pdf.text(exp.location, margin + maxWidth, y, { align: 'right' });
        }
        y += isCompact ? 4 : 4.5;

        // Bullets
        if (exp.bullets) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(isCompact ? 8 : 8.5);
          pdf.setTextColor(51, 65, 85);
          const rawLines = exp.bullets.split('\n');
          rawLines.forEach((line) => {
            if (!line.trim()) return;
            checkPage(6);
            const cleanText = line.replace(/^[•\-\*]\s*/, '').trim();
            const wrapped = pdf.splitTextToSize(cleanText, maxWidth - 5.5);
            pdf.text('•', margin + 1.2, y);
            pdf.text(wrapped, margin + 4.8, y);
            y += wrapped.length * (isCompact ? 3.4 : 3.8) + (isCompact ? 0.8 : 1.2);
          });
        }
        y += isCompact ? 2 : 3;
      });
    }

    // Projects
    const validProj = resume.projects.filter((p) => p.title?.trim() || p.description?.trim());
    if (validProj.length) {
      addSectionHeader('Projects');
      validProj.forEach((proj) => {
        checkPage(15);
        // Line 1: Title (Bold) + Tech stack (Italic) on left, Link on right
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(isCompact ? 9 : 9.5);
        pdf.setTextColor(...theme.primary);
        const titleText = proj.title || 'Project';
        pdf.text(titleText, margin, y);
        const titleWidth = pdf.getTextWidth(titleText);

        if (proj.technologies) {
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(isCompact ? 8 : 8.5);
          pdf.setTextColor(100, 116, 139);
          pdf.text(`  |  ${proj.technologies}`, margin + titleWidth, y);
        }

        if (proj.link) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(isCompact ? 8 : 8.5);
          pdf.setTextColor(99, 102, 241);
          pdf.text(proj.link, margin + maxWidth, y, { align: 'right' });
        }
        y += isCompact ? 4 : 4.5;

        // Bullets or description
        if (proj.description) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(isCompact ? 8 : 8.5);
          pdf.setTextColor(51, 65, 85);
          const rawLines = proj.description.split('\n');
          rawLines.forEach((line) => {
            if (!line.trim()) return;
            checkPage(6);
            const cleanText = line.replace(/^[•\-\*]\s*/, '').trim();
            const wrapped = pdf.splitTextToSize(cleanText, maxWidth - 5.5);
            pdf.text('•', margin + 1.2, y);
            pdf.text(wrapped, margin + 4.8, y);
            y += wrapped.length * (isCompact ? 3.4 : 3.8) + (isCompact ? 0.8 : 1.2);
          });
        }
        y += isCompact ? 2 : 3;
      });
    }

    // Certifications
    if (resume.certifications?.trim()) {
      addSectionHeader('Certifications & Licenses');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(isCompact ? 8 : 8.5);
      pdf.setTextColor(51, 65, 85);
      const lines = resume.certifications.split('\n');
      lines.forEach((l) => {
        if (!l.trim()) return;
        checkPage(5);
        const clean = l.replace(/^[•\-\*]\s*/, '').trim();
        const wrapped = pdf.splitTextToSize(clean, maxWidth - 5.5);
        pdf.text('•', margin + 1.2, y);
        pdf.text(wrapped, margin + 4.8, y);
        y += wrapped.length * (isCompact ? 3.4 : 3.8) + (isCompact ? 0.8 : 1.2);
      });
      y += isCompact ? 1 : 2;
    }

    // Achievements
    if (resume.achievements?.trim()) {
      addSectionHeader('Honors & Extracurriculars');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(isCompact ? 8 : 8.5);
      pdf.setTextColor(51, 65, 85);
      const lines = resume.achievements.split('\n');
      lines.forEach((l) => {
        if (!l.trim()) return;
        checkPage(5);
        const clean = l.replace(/^[•\-\*]\s*/, '').trim();
        const wrapped = pdf.splitTextToSize(clean, maxWidth - 5.5);
        pdf.text('•', margin + 1.2, y);
        pdf.text(wrapped, margin + 4.8, y);
        y += wrapped.length * (isCompact ? 3.4 : 3.8) + (isCompact ? 0.8 : 1.2);
      });
      y += isCompact ? 1 : 2;
    }

    // Languages
    if (resume.languages?.trim()) {
      addSectionHeader('Languages');
      checkPage(5);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(isCompact ? 8.5 : 9);
      pdf.setTextColor(51, 65, 85);
      pdf.text(resume.languages.trim(), margin, y);
    }

    const safeFilename =
      resume.name
        .trim()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase() || 'resume';
    pdf.save(`${safeFilename}-careerzoon.pdf`);
    setNotice('Your professional CV has been downloaded successfully!');
    setTimeout(() => setNotice(''), 4000);
  }

  return (
    <main className="resume-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">JOB-READY RESUME BUILDER</span>
          <h1>Build a high-converting, ATS-winning resume.</h1>
          <p>Designed using top engineering hiring rubrics (FAANG, Big Tech &amp; Global Startups). Choose proven ATS formats, craft quantifiable impact bullet points, and land interviews.</p>
          <div className="page-hero-meta">
            <span>✓ 100% Free &amp; Private</span>
            <span>✓ 1-Page Compact Mode</span>
            <span>✓ High-ATS LaTeX Quality</span>
            <span>✓ Instant PDF Export</span>
          </div>
        </div>
      </div>

      <div className="resume-workspace">
        {/* Editor Form Column */}
        <section className="resume-form-panel">
          <div className="resume-panel-head">
            <div>
              <span className="eyebrow">EDITOR</span>
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

          {/* Template Selector */}
          <div className="template-picker-section">
            <span className="template-section-label">Select Industry Template:</span>
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

          {/* ATS Readiness Score */}
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
                ? 'Tip: Add target role, education, and at least 4 skills to reach 50+.'
                : atsScore < 80
                ? 'Tip: Include a career summary and at least 1 project with measurable results (e.g., "Reduced latency by 25%").'
                : 'Excellent! Your resume contains all the essential ATS keywords and structure.'}
            </p>
          </div>

          {/* Form Sections */}
          <div className="resume-form">
            {/* 1. Personal Information */}
            <ResumeSection title="Contact Information" icon={<Mail size={14} />}>
              <div className="form-grid">
                <Field label="Full Name" value={resume.name} onChange={(v) => update('name', v)} placeholder="e.g. Aanya Sharma" />
                <Field label="Target Headline / Role" value={resume.role} onChange={(v) => update('role', v)} placeholder="e.g. Software Development Engineer" />
                <Field label="Email Address" value={resume.email} onChange={(v) => update('email', v)} placeholder="aanya@example.com" type="email" />
                <Field label="Phone Number" value={resume.phone} onChange={(v) => update('phone', v)} placeholder="+91 98765 43210" />
                <Field label="Location (City, Country)" value={resume.location} onChange={(v) => update('location', v)} placeholder="Bengaluru, India" />
                <Field label="LinkedIn Profile" value={resume.linkedin} onChange={(v) => update('linkedin', v)} placeholder="linkedin.com/in/username" />
                <Field label="GitHub / Portfolio" value={resume.portfolio} onChange={(v) => update('portfolio', v)} placeholder="github.com/username" />
              </div>
            </ResumeSection>

            {/* 2. Professional Summary */}
            <ResumeSection title="Professional Summary" icon={<FileText size={14} />}>
              <textarea
                value={resume.objective}
                onChange={(e) => update('objective', e.target.value)}
                placeholder="Write 2–3 concise sentences summarizing your engineering background, top technical strengths, and what you bring to the team."
                rows="3"
              />
            </ResumeSection>

            {/* 3. Education */}
            <ResumeSection
              title="Education"
              icon={<GraduationCap size={14} />}
              add={() => addGroup('education', { school: '', degree: '', location: '', years: '', gpa: '' })}
            >
              {resume.education.map((item, index) => (
                <div className="repeat-group" key={`edu-${index}`}>
                  <div className="form-grid">
                    <Field label="University / College" value={item.school} onChange={(v) => updateGroup('education', index, 'school', v)} placeholder="e.g. NIT Surathkal" />
                    <Field label="Degree &amp; Major" value={item.degree} onChange={(v) => updateGroup('education', index, 'degree', v)} placeholder="e.g. B.Tech in Computer Science" />
                    <Field label="Location (City)" value={item.location} onChange={(v) => updateGroup('education', index, 'location', v)} placeholder="e.g. Surathkal, India" />
                    <Field label="Graduation Year / Dates" value={item.years} onChange={(v) => updateGroup('education', index, 'years', v)} placeholder="e.g. 2020 – 2024" />
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

            {/* 4. Technical Skills */}
            <ResumeSection title="Technical Skills (Categorized)" icon={<Code2 size={14} />}>
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

            {/* 5. Work Experience */}
            <ResumeSection
              title="Work &amp; Internship Experience"
              icon={<Briefcase size={14} />}
              add={() => addGroup('experienceList', { company: '', role: '', location: '', dates: '', bullets: '' })}
            >
              <div className="bullet-helper-bar">
                <span className="helper-label">💡 Insert Action Verb:</span>
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
                    <Field label="Company / Organization" value={item.company} onChange={(v) => updateGroup('experienceList', index, 'company', v)} placeholder="e.g. TechNova Solutions" />
                    <Field label="Job Title / Role" value={item.role} onChange={(v) => updateGroup('experienceList', index, 'role', v)} placeholder="e.g. Software Engineer Intern" />
                    <Field label="Location" value={item.location} onChange={(v) => updateGroup('experienceList', index, 'location', v)} placeholder="e.g. Bengaluru, India" />
                    <Field label="Dates / Duration" value={item.dates} onChange={(v) => updateGroup('experienceList', index, 'dates', v)} placeholder="e.g. Jan 2024 – Jun 2024" />
                    <label className="field-label full-field">
                      Accomplishments &amp; Impact (1 bullet per line)
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

            {/* 6. Projects */}
            <ResumeSection
              title="Key Technical Projects"
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
                      What you built &amp; measurable outcomes (bullets)
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

            {/* 7. Certifications & Honors */}
            <ResumeSection title="Certifications, Honors &amp; Languages" icon={<Award size={14} />}>
              <label className="field-label full-field">
                Certifications &amp; Licenses (1 per line)
                <textarea
                  value={resume.certifications}
                  onChange={(e) => update('certifications', e.target.value)}
                  placeholder="• AWS Certified Cloud Practitioner — Amazon Web Services (2024)&#10;• Meta Front-End Developer Professional Certificate (2023)"
                  rows="2"
                />
              </label>
              <label className="field-label full-field">
                Honors, Hackathons &amp; Achievements (1 per line)
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
              <Download size={15} /> Download PDF (A4)
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
              <span className="eyebrow">LIVE WYSIWYG PREVIEW</span>
              <h2>{templateOptions.find((t) => t.id === template)?.name}</h2>
            </div>
            <div className="preview-toolbar-controls">
              <div className="density-toggle" role="group" aria-label="Page density">
                <button
                  type="button"
                  className={`density-btn ${density === 'compact' ? 'active' : ''}`}
                  onClick={() => setDensity('compact')}
                  title="Optimize spacing to fit on 1 single page"
                >
                  1-Page Fit
                </button>
                <button
                  type="button"
                  className={`density-btn ${density === 'standard' ? 'active' : ''}`}
                  onClick={() => setDensity('standard')}
                  title="Standard comfortable spacing"
                >
                  Standard
                </button>
              </div>
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
              <article className={`resume-paper-document ${template} ${density}`}>
                {(template === 'modern' || template === 'tech') && <div className="paper-top-accent-bar" />}

                {/* Header */}
                <header className="paper-header">
                  <h1 className="paper-name">{resume.name || 'Your Full Name'}</h1>
                  {resume.role && <h2 className="paper-headline">{resume.role}</h2>}
                  <div className="paper-contact-row">
                    {resume.email && (
                      <span className="paper-contact-item">
                        <Mail size={11} /> {resume.email}
                      </span>
                    )}
                    {resume.phone && (
                      <span className="paper-contact-item">
                        <Phone size={11} /> {resume.phone}
                      </span>
                    )}
                    {resume.location && (
                      <span className="paper-contact-item">
                        <MapPin size={11} /> {resume.location}
                      </span>
                    )}
                    {resume.linkedin && (
                      <span className="paper-contact-item">
                        <Linkedin size={11} /> {resume.linkedin}
                      </span>
                    )}
                    {resume.portfolio && (
                      <span className="paper-contact-item">
                        <Globe size={11} /> {resume.portfolio}
                      </span>
                    )}
                  </div>
                </header>

                {/* Professional Summary */}
                {resume.objective?.trim() && (
                  <section className="paper-section">
                    <h3 className="paper-section-heading">Professional Summary</h3>
                    <p className="paper-paragraph">{resume.objective}</p>
                  </section>
                )}

                {/* Education */}
                {resume.education.some((e) => e.school || e.degree) && (
                  <section className="paper-section">
                    <h3 className="paper-section-heading">Education</h3>
                    {resume.education
                      .filter((e) => e.school || e.degree)
                      .map((edu, idx) => (
                        <div className="paper-entry" key={idx}>
                          <div className="paper-entry-row primary">
                            <strong className="entry-bold">{edu.school || 'University'}</strong>
                            <span className="entry-right-date">{edu.years}</span>
                          </div>
                          <div className="paper-entry-row secondary">
                            <span className="entry-italic">{edu.degree || 'Degree / Major'}</span>
                            <span className="entry-right-sub">
                              {[edu.location, edu.gpa].filter(Boolean).join('   |   ')}
                            </span>
                          </div>
                        </div>
                      ))}
                  </section>
                )}

                {/* Technical Skills */}
                {(resume.skillsCategories?.languages ||
                  resume.skillsCategories?.frameworks ||
                  resume.skillsCategories?.tools ||
                  resume.skills) && (
                  <section className="paper-section">
                    <h3 className="paper-section-heading">Technical Skills</h3>
                    {resume.skillsCategories?.languages || resume.skillsCategories?.frameworks ? (
                      <div className="paper-skills-matrix">
                        {resume.skillsCategories.languages && (
                          <div className="paper-skill-row">
                            <strong className="skill-cat-label">Languages: </strong>
                            <span className="skill-cat-values">{resume.skillsCategories.languages}</span>
                          </div>
                        )}
                        {resume.skillsCategories.frameworks && (
                          <div className="paper-skill-row">
                            <strong className="skill-cat-label">Frameworks &amp; Libraries: </strong>
                            <span className="skill-cat-values">{resume.skillsCategories.frameworks}</span>
                          </div>
                        )}
                        {resume.skillsCategories.tools && (
                          <div className="paper-skill-row">
                            <strong className="skill-cat-label">Tools, Cloud &amp; Databases: </strong>
                            <span className="skill-cat-values">{resume.skillsCategories.tools}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="paper-skill-pills">
                        {skillsList.map((skill) => (
                          <span className="paper-skill-pill" key={skill}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* Work Experience */}
                {resume.experienceList.some((e) => e.company || e.role) && (
                  <section className="paper-section">
                    <h3 className="paper-section-heading">Work Experience</h3>
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

                {/* Projects */}
                {resume.projects.some((p) => p.title || p.description) && (
                  <section className="paper-section">
                    <h3 className="paper-section-heading">Key Technical Projects</h3>
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
                                <ExternalLink size={10} /> {proj.link}
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

                {/* Certifications */}
                {resume.certifications?.trim() && (
                  <section className="paper-section">
                    <h3 className="paper-section-heading">Certifications &amp; Licenses</h3>
                    <ul className="paper-bullet-list">
                      {resume.certifications.split('\n').map((line, idx) => {
                        const clean = line.replace(/^[•\-\*]\s*/, '').trim();
                        if (!clean) return null;
                        return <li key={idx}>{clean}</li>;
                      })}
                    </ul>
                  </section>
                )}

                {/* Achievements */}
                {resume.achievements?.trim() && (
                  <section className="paper-section">
                    <h3 className="paper-section-heading">Honors &amp; Extracurriculars</h3>
                    <ul className="paper-bullet-list">
                      {resume.achievements.split('\n').map((line, idx) => {
                        const clean = line.replace(/^[•\-\*]\s*/, '').trim();
                        if (!clean) return null;
                        return <li key={idx}>{clean}</li>;
                      })}
                    </ul>
                  </section>
                )}

                {/* Languages */}
                {resume.languages?.trim() && (
                  <section className="paper-section">
                    <h3 className="paper-section-heading">Languages</h3>
                    <p className="paper-paragraph">{resume.languages}</p>
                  </section>
                )}
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
