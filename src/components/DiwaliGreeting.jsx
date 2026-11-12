import { useState, useEffect } from 'react';
import './DiwaliGreeting.css';

export default function DiwaliGreeting() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem('careerzoon-diwali-dismissed');
      if (!isDismissed) {
        setDismissed(false);
      }
    } catch {
      setDismissed(true);
    }
  }, []);

  function handleDismiss() {
    setDismissed(true);
    try {
      localStorage.setItem('careerzoon-diwali-dismissed', 'true');
    } catch {
      // Storage unavailable
    }
  }

  if (dismissed) return null;

  return (
    <div className="diwali-greeting" role="status">
      <span>✨ Happy Diwali ✨ Wishing you growth and success in your career journey!</span>
      <button type="button" className="diwali-dismiss" onClick={handleDismiss} aria-label="Dismiss greeting">×</button>
    </div>
  );
}
