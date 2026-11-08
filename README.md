# Careerzoon

**Discover Skills. Explore Careers. Get Hired.**

Careerzoon is a responsive, frontend-only IT career development platform for students, graduates, and job seekers. It brings career exploration, learning plans, trusted opportunity sources, and job-readiness tools together in one place.

> Careerzoon does not require an account and has no backend, database, authentication, or payment flow. Browser-based progress and saved items stay in the visitor's browser.

## Website

- **Live website:** [careerzoon.vercel.app](https://careerzoon.vercel.app/)
- **Source repository:** [github.com/chandan966/-Careerzoon](https://github.com/chandan966/-Careerzoon)

## Deploy Careerzoon

The current production deployment is available at [https://careerzoon.vercel.app/](https://careerzoon.vercel.app/). The buttons below can be used to create a separate deployment from this repository.

Deploy the repository using either platform:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchandan966%2F-Careerzoon)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https%3A%2F%2Fgithub.com%2Fchandan966%2F-Careerzoon)

Use these build settings if the platform does not detect them automatically:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish/output directory | `dist` |
| Framework | Vite |
| Node.js | Use a currently supported LTS release |

Careerzoon uses client-side routes, so configure the hosting provider to serve `index.html` for application routes such as `/tools/css`. See the platform guides for [Vercel](https://vercel.com/docs) and [Netlify](https://docs.netlify.com/routing/redirects/rewrites-proxies/).

## Website sections and features

- **Home:** Introductory search and highlights for careers, jobs, internships, roadmaps, skills, companies, resume building, interview preparation, learning resources, and FAQs.
- **Jobs:** Browse trusted job-search sources and company career pages. Careerzoon does not claim that linked positions are verified live vacancies.
- **Internships:** Explore internship search sources and employer pages; confirm eligibility and current openings with the provider.
- **Explore Careers:** Browse technology roles, career information, recommended skills, and related learning.
- **Roadmaps:** Explore 25 detailed CS and IT career paths with step-by-step topics, suggested timelines, tools, projects, and learning resources. Download the career roadmaps and companion guide together as a PDF.
- **Skills:** Browse technical skills and learning resources.
- **Companies:** Explore company information and links to official career pages.
- **Resume Builder:** Create and preview a resume in the browser, then print or save it as a PDF.
- **Placement Preparation:** Follow a 10-area placement roadmap covering DSA, one programming language, OOP, DBMS and SQL, networking, operating systems, aptitude, projects, Git/GitHub, and communication/HR interviews. Expand the detailed study guide for recommended resources, practice routines, project ideas, and a six-month schedule.
- **Tools:** Search and filter a software-tools directory, bookmark and compare tools, revisit recently viewed tools, and open individual guides with official links, setup instructions, projects, features, documentation, pricing information, alternatives, and FAQs. CSS is included in the directory.
- **Career Guidance:** Browse career guidance content.
- **Global navigation and search:** Responsive site navigation, search, active-page indicators, and light/dark theme selection.
- **Contact:** Email `contactchandan011@gmail.com`.

## Technology

- React 18 and JavaScript
- Vite
- React Router
- Lucide React
- CSS
- jsPDF
- Browser `localStorage` for supported settings, bookmarks, and progress

## Requirements

- Node.js (LTS recommended)
- npm
- A current web browser

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build and preview

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Vite writes the generated static site to `dist/`.

## Project structure

```text
public/            Static assets, favicon, robots.txt
src/
  components/      Shared navigation, footer, directories, and UI
  data/            Static career, roadmap, skill, company, and tool content
  pages/           Route-level pages
  styles/          Global styles and theme tokens
index.html         Application entry and document metadata
```

## Privacy and security

- No user accounts, authentication, backend, database, or payment processing.
- Browser features that save data use local storage on that device; clearing browser storage removes it.
- Do not place private credentials or API keys in client-side source code.
- External job, internship, company, software-download, and learning links are provided by third parties. Verify important details on their official websites.
- Vercel deployments receive HTTPS, MIME-sniffing, clickjacking, cross-origin opener, legacy cross-domain policy, referrer, and browser-permission protections from `vercel.json`. Netlify deployments receive the same headers from `public/_headers`.
- A Content Security Policy is not set because the site loads third-party resources, including AdSense; configure and test a policy against the services you enable before adding one.

## Search engine and sharing metadata

The app includes page titles and descriptions, social-sharing metadata, a favicon, and `public/robots.txt`. For search indexing, create and submit a sitemap using `https://careerzoon.vercel.app/` as the public domain.

## Validation

Run the production build before deploying:

```bash
npm run build
```
