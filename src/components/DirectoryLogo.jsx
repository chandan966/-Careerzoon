import { useState } from 'react';

function monogram(name) {
  const words = name.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().split(/\s+/);
  if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return words[0].slice(0, 2).toUpperCase();
}

function markColor(name) {
  let hash = 0;
  for (const character of name) hash = (hash * 31 + character.charCodeAt(0)) % 360;
  return `hsl(${hash} 52% 43%)`;
}

export default function DirectoryLogo({ name, url }) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  let logoUrl = null;
  try {
    logoUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(url).hostname)}&sz=128`;
  } catch {
    logoUrl = null;
  }

  return (
    <span className={`job-site-logo${logoLoaded ? ' logo-loaded' : ''}`} style={{ '--site-color': markColor(name) }} aria-label={`${name} logo`}>
      <span className="job-site-monogram" aria-hidden="true">{monogram(name)}</span>
      {logoUrl && !logoFailed && <img src={logoUrl} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onLoad={() => setLogoLoaded(true)} onError={() => setLogoFailed(true)} />}
    </span>
  );
}
