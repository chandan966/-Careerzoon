# Careerzoon

**Discover Skills. Explore Careers. Get Hired.**

Careerzoon is a responsive, frontend-only IT career development platform for students, graduates and job seekers. It helps learners explore technology careers, build skills, follow roadmaps and prepare for opportunities without an account or backend.

## Run locally

```bash
npm install
npm run dev
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

## Features

- Career, skill, company and learning-resource directories with search and filters.
- Guided roadmaps with progress saved in browser local storage.
- Job and internship search sources. Careerzoon does not invent or claim to list live vacancies; verify openings on the official employer site.
- Browser-based resume builder with live preview, PDF download and print support.
- Interview and coding quizzes with explanations and scores.
- Career finder, skill-gap guide, indicative salary estimator, application tracker, cover-letter draft and learning/portfolio checklists.
- Dark mode, responsive navigation and local browser persistence.

Resume details, bookmarks and progress are stored locally in the browser and are not uploaded to a Careerzoon backend.

## Technology

React, JavaScript, Vite, React Router, Lucide React and jsPDF.

## Deployment

The project can be deployed as a static site on Vercel or Netlify. Configure the build command as `npm run build` and the output directory as `dist`. For client-side routes, configure the host to rewrite unknown paths to `index.html`.
