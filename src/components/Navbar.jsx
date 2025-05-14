import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.svg';
import { useState } from 'react';

function Navbar() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(prev => !prev);

    return (
        <nav className={`top-nav ${!isHome ? 'logo-only' : ''}`}>
            <Link to="/" className="logo-link">
                <div className="logo-area">
                    <img src={logo} alt="Logo" className="logo-icon" />
                    <span className="logo-text">MyEzJobs</span>
                </div>
            </Link>

            {/* Hamburger (shown on mobile only) */}
            <div className="hamburger" onClick={toggleMenu}>
                <div />
                <div />
                <div />
            </div>

            {menuOpen && (
                <div className="mobile-menu">
                    <Link to="/build" onClick={toggleMenu}>Build</Link>
                    <Link to="/upload" onClick={toggleMenu}>Upload</Link>
                    <Link to="/chat" onClick={toggleMenu}>AI</Link>
                    <Link to="/jobs" onClick={toggleMenu}>Jobs</Link>
                    <Link to="/pricing" onClick={toggleMenu}>Pricing</Link>
                    <Link to="/contact" onClick={toggleMenu}>Contact</Link>
                    <button className="nav-btn" onClick={toggleMenu}>Login</button>
                    <button className="nav-btn filled" onClick={toggleMenu}>Sign Up</button>
                </div>
            )}

            {/* Desktop nav (hidden on mobile for now) */}
            {isHome && (
                <div className="desktop-nav">
                    <div className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/build">Build</Link>
                        <Link to="/upload">Upload</Link>
                        <Link to="/chat">AI</Link>
                        <Link to="/jobs">Jobs</Link>
                        <Link to="/pricing">Pricing</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                    <div className="nav-actions">
                        <button className="nav-btn">Login</button>
                        <button className="nav-btn filled">Sign Up</button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
