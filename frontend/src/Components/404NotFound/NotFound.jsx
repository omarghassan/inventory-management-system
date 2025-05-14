import { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  const [counter, setCounter] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/admin/home');
    }
  }, [counter, navigate]);

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <h1 className="error-code">404</h1>

        <div className="divider-wrapper">
          <div className="divider-line"></div>
          <div className="divider-text">Page Not Found</div>
          <div className="divider-line"></div>
        </div>

        <p className="error-message">
          Oops! The page you are looking for might have been removed, or is temporarily unavailable.
        </p>

        <a
          href="/"
          className="back-home-button"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          <Home className="icon" />
          Back to Homepage
          {counter > 0 && <span className="countdown">({counter}s)</span>}
        </a>
      </div>
    </div>
  );
}