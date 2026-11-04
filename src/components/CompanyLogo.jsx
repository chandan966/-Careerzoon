import { useState } from 'react';

function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  } catch {
    return null;
  }
}

export default function CompanyLogo({ company }) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const logoUrl = getFaviconUrl(company.url);

  return (
    <span
      className={`company-brand-mark${logoLoaded ? ' logo-loaded' : ''}`}
      style={{ '--company-color': company.color }}
      aria-label={`${company.name} logo`}
    >
      <span className="company-brand-initials" aria-hidden="true">{company.initials}</span>
      {logoUrl && !logoFailed && (
        <img
          src={logoUrl}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLogoLoaded(true)}
          onError={() => setLogoFailed(true)}
        />
      )}
    </span>
  );
}
