/* eslint-disable no-unused-vars */
import React from 'react';
import axios from 'axios';

const Navbar = ({ setPage, currentPage, user, setUser }) => {
  const handleLogout = () => {
    axios
      .get('/api/auth/logout', { withCredentials: true })
      .then(() => {
        setUser(null);
        setPage('home');
      })
      .catch((err) => console.error(err));
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-brand" onClick={() => setPage('home')}>
          SocialGenAI
        </h1>
        <ul className="navbar-nav">
          <li>
            <button onClick={() => setPage('home')} className="nav-button">
              Home
            </button>
          </li>
          {(
            <li>
              <button onClick={() => setPage('dashboard')} className="nav-button">
                Dashboard
              </button>
            </li>
          )}
          
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
