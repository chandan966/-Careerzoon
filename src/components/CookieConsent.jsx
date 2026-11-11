import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('careerzoon-consent');
      if (!consent) {
        setShow(true);
      }
    } catch {
      // If localStorage is unavailable, do not show banner
      setShow(false);
    }
  }, []);

  function handleChoice(value) {
    try {
      localStorage.setItem('careerzoon-consent', value);
    } catch {
      // Ignore storage errors
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="cookie-consent-bar" role="region" aria-label="Cookie and Privacy Preferences">
      <p className="cookie-consent-text">
        We use cookies and browser storage to enhance your experience and analyze traffic. Third-party partners, including Google, may use cookies to serve ads based on your visits. Learn more in our <Link to="/privacy">Privacy Policy</Link>.
      </p>
      <div className="cookie-consent-actions">
        <button
          type="button"
          className="cookie-btn-decline"
          onClick={() => handleChoice('essential')}
          aria-label="Use essential cookies only"
        >
          Essential Only
        </button>
        <button
          type="button"
          className="cookie-btn-accept"
          onClick={() => handleChoice('all')}
          aria-label="Accept all cookies and personalized ads"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
