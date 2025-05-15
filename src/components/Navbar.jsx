import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

import './Navbar.css';
import logo from '../assets/logo.svg';
import profileIcon from '../assets/icons/profile.svg';

function Navbar() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const profileRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const toggleMenu = () => setMenuOpen(prev => !prev);
    const closeMenu = () => setMenuOpen(false);

    const handleLogout = async () => {
        await signOut(auth);
        setDropdownOpen(false);
        closeMenu();
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                <div /><div /><div />
            </div>

            {/* Mobile nav menu */}
            {menuOpen && (
                <div className="mobile-menu" ref={mobileMenuRef}>
                    <Link to="/build" onClick={closeMenu}>Build</Link>
                    <Link to="/upload" onClick={closeMenu}>Upload</Link>
                    <Link to="/chat" onClick={closeMenu}>AI</Link>
                    <Link to="/jobs" onClick={closeMenu}>Jobs</Link>
                    <Link to="/pricing" onClick={closeMenu}>Pricing</Link>
                    <Link to="/contact" onClick={closeMenu}>Contact</Link>

                    {!user ? (
                        <>
                            <Link to="/login" onClick={closeMenu}>
                                <button className="nav-btn">Login</button>
                            </Link>
                            <Link to="/signup" onClick={closeMenu}>
                                <button className="nav-btn filled">Sign Up</button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" onClick={closeMenu}>Account Settings</Link>
                            <button onClick={handleLogout} className="nav-btn">Logout</button>
                        </>
                    )}
                </div>
            )}

            {/* Desktop nav only on homepage */}
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
                        {!user ? (
                            <>
                                <Link to="/login">
                                    <button className="nav-btn">Login</button>
                                </Link>
                                <Link to="/signup">
                                    <button className="nav-btn filled">Sign Up</button>
                                </Link>
                            </>
                        ) : (
                            <div className="profile-menu" ref={profileRef}>
                                <img
                                    src={profileIcon}
                                    alt="Profile"
                                    className="profile-icon"
                                    onClick={() => setDropdownOpen(prev => !prev)}
                                />
                                {dropdownOpen && (
                                    <div className="dropdown">
                                        <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                                            Account Settings
                                        </Link>
                                        <button onClick={handleLogout}>Logout</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

        </nav>
    );
}

export default Navbar;
