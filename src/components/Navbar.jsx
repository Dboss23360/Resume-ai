import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';
import logo from '../assets/logo.svg';

function Navbar() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(prev => !prev);
    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className={`top-nav ${!isHome ? 'logo-only' : ''}`}>
            {/* Logo */}
            <Link to="/" className="logo-link" onClick={closeMenu}>
                <div className="logo-area">
                    <img src={logo} alt="Logo" className="logo-icon" />
                    <span className="logo-text">MyEzJobs</span>
                </div>
            </Link>

            {/* Hamburger for mobile */}
            <div className="hamburger" onClick={toggleMenu}>
                <div />
                <div />
                <div />
            </div>

            {/* Mobile nav menu */}
            {menuOpen && (
                <div className="mobile-menu">
                    <Link to="/build" onClick={closeMenu}>Build</Link>
                    <Link to="/upload" onClick={closeMenu}>Upload</Link>
                    <Link to="/chat" onClick={closeMenu}>AI</Link>
                    <Link to="/jobs" onClick={closeMenu}>Jobs</Link>
                    <Link to="/pricing" onClick={closeMenu}>Pricing</Link>
                    <Link to="/contact" onClick={closeMenu}>Contact</Link>
                    <Link to="/login" onClick={closeMenu}><button className="nav-btn">Login</button></Link>
                    <Link to="/signup" onClick={closeMenu}><button className="nav-btn filled">Sign Up</button></Link>
                </div>
            )}

            {/* Desktop nav only on homepage */}
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
                        <Link to="/login"><button className="nav-btn">Login</button></Link>
                        <Link to="/signup"><button className="nav-btn filled">Sign Up</button></Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
