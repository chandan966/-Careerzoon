import { softwareTools } from '../src/data/softwareTools.js';
import fs from 'fs';

const base = 'https://careerzoon.vercel.app';
const today = new Date().toISOString().split('T')[0];

const corePages = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/jobs', priority: '0.9', changefreq: 'daily' },
  { path: '/internships', priority: '0.9', changefreq: 'daily' },
  { path: '/careers', priority: '0.9', changefreq: 'weekly' },
  { path: '/roadmaps', priority: '0.9', changefreq: 'weekly' },
  { path: '/skills', priority: '0.8', changefreq: 'weekly' },
  { path: '/companies', priority: '0.8', changefreq: 'weekly' },
  { path: '/resume-builder', priority: '0.8', changefreq: 'monthly' },
  { path: '/interview', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools', priority: '0.8', changefreq: 'weekly' },
  { path: '/guidance', priority: '0.7', changefreq: 'monthly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.5', changefreq: 'monthly' },
  { path: '/terms', priority: '0.5', changefreq: 'monthly' },
  { path: '/disclaimer', priority: '0.5', changefreq: 'monthly' }
];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

for (const p of corePages) {
  xml += '  <url>\n';
  xml += `    <loc>${base}${p.path}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
  xml += `    <priority>${p.priority}</priority>\n`;
  xml += '  </url>\n';
}

for (const t of softwareTools) {
  xml += '  <url>\n';
  xml += `    <loc>${base}/tools/${t.slug}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += '    <changefreq>monthly</changefreq>\n';
  xml += '    <priority>0.7</priority>\n';
  xml += '  </url>\n';
}

xml += '</urlset>\n';

fs.writeFileSync('public/sitemap.xml', xml);
console.log(`sitemap.xml generated with ${corePages.length + softwareTools.length} URLs.`);
