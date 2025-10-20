import React from 'react';
import '../styles/layout.css';

const Navbar = ({ user, logout }) => {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';

  const handleLogout = () => {
    if (typeof logout === 'function') {
      logout();
    } else {
      // fallback if logout not provided
      localStorage.removeItem('user');
    }
    // Redirect to login page after logout
    window.location.href = '/login';
  };

  return (
    <header className="app-navbar">
      <div className="nav-container">
        <a href="/" className="brand">Event Reservations</a>

        {/* Show primary links only for guests */}
        <nav className="nav-links">
          {!user && (
            <>
              <a href="/">Home</a>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </>
          )}
        </nav>

        <div className="nav-actions">
          {/* On dashboard, when logged in, show only a Logout button */}
          {user && path === '/dashboard' ? (
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              {user ? <span className="user-name">{user.name}</span> : null}
              <button className="nav-toggle" aria-label="menu">☰</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
