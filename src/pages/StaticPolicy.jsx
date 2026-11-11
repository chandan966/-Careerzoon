export default function StaticPolicy({ kind }) {
  if (kind === 'privacy') {
    return (
      <main className="policy-page">
        <div className="page-hero">
          <div className="page-hero-inner">
            <span className="eyebrow">CAREERZOON LEGAL</span>
            <h1>Privacy Policy</h1>
            <p>Clear, transparent information about how data and advertising cookies are handled.</p>
          </div>
        </div>
        <article className="policy-content">
          <h2>Overview</h2>
          <p>
            Careerzoon (available at <b>careerzoon.vercel.app</b>) is an educational career exploration platform designed for students, graduates, and technology professionals. We are committed to transparency and respect for your personal privacy. This Privacy Policy details our practices regarding browser storage, analytics, external links, and third-party advertising.
          </p>

          <h2>Google AdSense &amp; Advertising Cookies</h2>
          <p>
            Careerzoon displays advertisements provided by Google AdSense to support the maintenance of our free educational resources. Google, as a third-party vendor, uses cookies and web beacons to serve ads on our website.
          </p>
          <p>
            Google’s use of advertising cookies (including the DoubleClick cookie) enables it and its advertising partners to serve relevant ads to visitors based on their visits to Careerzoon and other sites across the Internet. These cookies help deliver personalized advertisements according to your general interests and browsing context.
          </p>

          <h2>How You Can Manage and Opt Out of Cookies</h2>
          <p>
            You have full control over your advertising preferences and cookie choices:
          </p>
          <p>
            • <b>Google Ad Settings:</b> You can customize your Google ad settings or opt out of personalized advertising at any time by visiting{' '}
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>.
          </p>
          <p>
            • <b>Third-Party Network Opt-Out:</b> You can also opt out of third-party vendors’ use of cookies for personalized advertising through the{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              Digital Advertising Alliance (aboutads.info)
            </a>{' '}
            or the{' '}
            <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
              Network Advertising Initiative
            </a>.
          </p>
          <p>
            • <b>Browser Controls:</b> Most web browsers allow you to block, manage, or delete cookies through browser settings. Disabling cookies will not prevent you from using Careerzoon’s educational roadmaps, tool guides, or resume builder.
          </p>

          <h2>Data Stays on Your Device (Browser LocalStorage)</h2>
          <p>
            Careerzoon does not require an account, username, or password. Features such as your resume builder details, checklist progression, dark/light theme preference, and saved tool bookmarks are stored entirely in your web browser’s local storage (LocalStorage).
          </p>
          <p>
            We do not transmit your resume details, contact numbers, or checklist data to our servers. You can clear this information at any time directly through your browser’s cache and site settings.
          </p>

          <h2>Log Files and Hosting Telemetry</h2>
          <p>
            Like most websites, hosting providers (such as Vercel) automatically collect standard, non-personally identifiable log information when pages are requested. This may include internet protocol (IP) addresses, browser type, internet service provider (ISP), referring/exit pages, operating system, and timestamps. This information is used strictly for technical performance monitoring, security diagnostics, and site reliability.
          </p>

          <h2>External Links to Third-Party Websites</h2>
          <p>
            Careerzoon aggregates links to official company career portals, job boards, documentation sites, and educational platforms. When you click an external link, you leave Careerzoon and are subject to the terms and privacy practices of that third-party website. We recommend reviewing their respective privacy policies before providing personal details or applying for positions.
          </p>

          <h2>Children’s Privacy Protection (COPPA)</h2>
          <p>
            Careerzoon does not knowingly collect or solicit personal information from children under the age of 13. If you believe a child has provided personal information to us, please contact us immediately so we can promptly address the matter.
          </p>

          <h2>Updates to This Policy</h2>
          <p>
            We may update our Privacy Policy periodically to reflect technological updates, regulatory standards, or Google AdSense program requirements. Changes will be posted directly on this page with an updated effective date.
          </p>

          <h2>Contact Information</h2>
          <p>
            If you have questions, feedback, or concerns regarding this Privacy Policy, please email us directly at{' '}
            <a href="mailto:contactchandan011@gmail.com">contactchandan011@gmail.com</a>.
          </p>
        </article>
      </main>
    );
  }

  if (kind === 'terms') {
    return (
      <main className="policy-page">
        <div className="page-hero">
          <div className="page-hero-inner">
            <span className="eyebrow">CAREERZOON LEGAL</span>
            <h1>Terms and Conditions</h1>
            <p>Guidelines and terms for accessing and using Careerzoon’s career and learning platform.</p>
          </div>
        </div>
        <article className="policy-content">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using Careerzoon (<b>careerzoon.vercel.app</b>), you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should discontinue using the website.
          </p>

          <h2>2. Educational and Informational Nature</h2>
          <p>
            Careerzoon provides technology learning roadmaps, curated skill guides, software directory references, and placement preparation resources for general educational and informational purposes. The content is intended to support self-guided career discovery and learning.
          </p>

          <h2>3. No Guarantee of Employment</h2>
          <p>
            Careerzoon is not an employer, recruitment agency, or staffing firm. We do not provide job placement guarantees, employment offers, or assurance of interview selection. All career opportunities, salary estimates, and hiring timelines represent general industry context and must be independently verified with prospective employers.
          </p>

          <h2>4. Third-Party Listings and External Content</h2>
          <p>
            Links to third-party job portals, internship platforms, and company career pages are provided for user convenience. Careerzoon does not verify live vacancy statuses, nor do we represent or endorse any third-party employer.
          </p>
          <p>
            <b>Important Security Notice:</b> Always verify vacancies on the employer’s official website domain. Legitimate companies will never require job seekers to pay fees for applications, interviews, or equipment deposits. Never send money for employment opportunities.
          </p>

          <h2>5. Use of Browser-Based Tools</h2>
          <p>
            Careerzoon provides client-side interactive tools, including a resume builder, interview practice modules, and software exploration guides. You are solely responsible for verifying the accuracy of the resumes and content you generate. Because storage is local to your browser, we advise keeping independent backups of your important documents.
          </p>

          <h2>6. Intellectual Property &amp; Trademarks</h2>
          <p>
            Original text, compilation structure, and custom guides on Careerzoon are protected by intellectual property laws. Third-party brand names, company logos, product trademarks, and software names (such as Google, Microsoft, React, Docker, Python) belong to their respective trademark holders and are used nominatively for identification and educational reference only.
          </p>

          <h2>7. Disclaimer of Warranties &amp; Limitation of Liability</h2>
          <p>
            The website and all materials are provided on an &quot;as-is&quot; and &quot;as-available&quot; basis without warranties of any kind, whether express or implied. Careerzoon and its contributors disclaim liability for any errors, omissions, interruptions, or damages resulting from the use of this website.
          </p>

          <h2>8. Modifications to Service and Terms</h2>
          <p>
            We reserve the right to modify or discontinue any part of the website or update these terms at any time. Continued access following changes constitutes acceptance of the modified terms.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            For questions regarding these Terms and Conditions, please contact us at{' '}
            <a href="mailto:contactchandan011@gmail.com">contactchandan011@gmail.com</a>.
          </p>
        </article>
      </main>
    );
  }

  // kind === 'disclaimer'
  return (
    <main className="policy-page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">CAREERZOON LEGAL</span>
          <h1>Disclaimer</h1>
          <p>Important limitations and educational scope of Careerzoon’s career information.</p>
        </div>
      </div>
      <article className="policy-content">
        <h2>General Educational Disclaimer</h2>
        <p>
          All information published on Careerzoon (<b>careerzoon.vercel.app</b>) is provided in good faith for general educational, guidance, and career development purposes. While we strive to maintain accurate, up-to-date guidance, we make no representations or warranties of any kind regarding completeness, accuracy, reliability, or suitability.
        </p>

        <h2>Career Guidance and Salary Estimates</h2>
        <p>
          Career pathways, skill recommendations, and salary brackets featured across Careerzoon represent estimated industry approximations based on open market research. They do not constitute guaranteed offers, compensation promises, or formal professional advice. Actual compensation and hiring requirements depend on employer standards, geographic location, economic conditions, and individual candidate merit.
        </p>

        <h2>No Recruitment or Staffing Affiliation</h2>
        <p>
          Careerzoon is an independent educational platform. We are not affiliated with, endorsed by, or partnered with the recruitment departments of the third-party companies listed in our directories. Mention of company names does not imply affiliation, sponsorship, or active hiring.
        </p>

        <h2>External Links Disclaimer</h2>
        <p>
          Through this website, you can visit other websites by following hyperlinks to external portals and resources. While we strive to link only to reputable, ethical platforms, we have no control over the content, security, or changes on external sites. Visiting external links is done strictly at your own discretion.
        </p>

        <h2>Consent</h2>
        <p>
          By using our website, you hereby consent to this disclaimer and agree to its terms.
        </p>

        <h2>Contact</h2>
        <p>
          If you require any more information or have questions about our site’s disclaimer, please contact us by email at{' '}
          <a href="mailto:contactchandan011@gmail.com">contactchandan011@gmail.com</a>.
        </p>
      </article>
    </main>
  );
}
