import React from 'react';
import '../styles/layout.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div>© {new Date().getFullYear()} Event Reservations</div>
        <div className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
