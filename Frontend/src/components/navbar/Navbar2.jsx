import React, { useState, useEffect, useContext } from 'react';
import { Edit3, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authcontext/AuthContext';
import './Navbar.css';

const Navbar2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, isChecking, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    if (isMenuOpen) toggleMenu();
    navigate('/');
  };

  const handleLogin = () => {
    if (isMenuOpen) toggleMenu();
    navigate('/login');
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }, [isMenuOpen]);

  if (isChecking) return null;

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <div className="logo-icon"><Edit3 size={20} /></div>
          <a href="/" className="logo-text">TechBlog</a>
        </div>

        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/userpost" className="nav-link">My Posts</Link>
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Contact</a>
        </nav>

        <div className="header-actions">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="write-btn">Logout</button>
          ) : (
            <button onClick={handleLogin} className="write-btn">Login</button>
          )}

          <button className="hamburger-btn" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`mobile-panel ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-panel-header">
          <span className="logo-text">TechBlog</span>
          <button className="close-btn" onClick={toggleMenu}><X size={24} /></button>
        </div>
        <nav className="mobile-panel-links">
          <Link to="/" onClick={toggleMenu}>Home</Link>
          <Link to="/userpost" onClick={toggleMenu}>My Posts</Link>
          <a href="#" onClick={toggleMenu}>About</a>
          <a href="#" onClick={toggleMenu}>Contact</a>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="mobile-panel-link">Logout</button>
          ) : (
            <button onClick={handleLogin} className="mobile-panel-link">Login</button>
          )}
        </nav>
      </div>

      {/* Overlay */}
      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </header>
  );
};

export default Navbar2;