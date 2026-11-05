import { useState } from 'react';
import './ToolLogo.css';

export default function ToolLogo({ tool }) {
  const [failed, setFailed] = useState(false);
  const initials = tool.name.split(/[\s/]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return <span className={`tool-logo${tool.icon && !failed ? ' is-branded' : ''}`} style={{ '--tool-color': `#${tool.color}` }} role="img" aria-label={`${tool.name} logo`}>
    {tool.icon && !failed
      ? <img src={`https://cdn.simpleicons.org/${tool.icon}/${tool.color}`} alt="" onError={() => setFailed(true)} />
      : <span aria-hidden="true">{initials}</span>}
  </span>;
}
