import { ArrowUpRight, BriefcaseBusiness, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const footerLinks = [
  { title: 'Explore', links: [['Jobs', '/jobs'], ['Internships', '/internships'], ['Careers', '/careers'], ['Roadmaps', '/roadmaps'], ['Skills', '/skills']] },
  { title: 'Career resources', links: [['Resume builder', '/resume-builder'], ['Placement', '/interview'], ['Career guidance', '/guidance']] },
  { title: 'Your toolkit', links: [['Student tools', '/tools'], ['Companies', '/companies'], ['About us', '/about'], ['FAQs', '/#faq'], ['Privacy', '/privacy'], ['Disclaimer', '/disclaimer']] },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="brand footer-logo" to="/"><span className="brand-mark"><BriefcaseBusiness size={19} /></span><span>career<span className="brand-accent">zoon</span></span></Link>
          <p>Discover skills. Explore careers.<br />Get hired. Your future starts with a first step.</p>
          <a className="footer-mail" href="mailto:contactchandan011@gmail.com"><Mail size={15} /> Contact us <ArrowUpRight size={13} /></a>
        </div>
        {footerLinks.map((group) => <div className="footer-column" key={group.title}><h3>{group.title}</h3>{group.links.map(([label, path]) => <Link key={label} to={path}>{label}</Link>)}</div>)}
      </div>
      <div className="footer-bottom"><span>© 2026 Careerzoon. All rights reserved.</span><a className="footer-note" href="https://www.instagram.com/trigger_toofan?vrfl=N3JjMTFrZjVwempj" target="_blank" rel="noreferrer">webdevchandan</a></div>
    </footer>
  );
}
