import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h4>MyBlog</h4>
          <p>&copy; {new Date().getFullYear()} MyBlog. All rights reserved.</p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/">Features</Link>
          <Link to="/">Pricing</Link>
          <Link to="/">FAQs</Link>
          <Link to="/">About</Link>
        </div>

        <div className="footer-social">
          <a href="https://github.com/HalfDeveloperVishal" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/vishal-singh-b27b64214/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
