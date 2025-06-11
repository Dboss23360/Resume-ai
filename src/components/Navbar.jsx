import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../context/ThemeContext';

import logo from '../assets/logo.svg';
import profileIcon from '../assets/icons/profile.svg';

function Navbar() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const navigate = useNavigate();

    const { user } = useAuth();
    const { setTheme } = useTheme();

    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const profileRef = useRef(null);
    const mobileRef = useRef(null);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    const handleLogout = async () => {
        await signOut(auth);
        setTheme("light");
        localStorage.setItem("theme", "light");
        setDropdownOpen(false);
        closeMenu();
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!profileRef.current?.contains(e.target)) setDropdownOpen(false);
            if (!mobileRef.current?.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className={`fixed top-4 inset-x-0 z-50 w-full text-white before:absolute before:inset-0 before:max-w-5xl before:mx-2 lg:before:mx-auto before:rounded-[26px] before:bg-neutral-800/30 before:backdrop-blur-md ${!isHome ? 'before:hidden' : ''}`}>
            <nav className="relative max-w-5xl w-full flex flex-wrap items-center justify-between py-2 px-4 mx-2 lg:mx-auto" ref={mobileRef}>
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                    <img src={logo} alt="MyEzJobs Logo" className="h-8 w-auto" />
                    <span className="text-xl font-semibold text-white">MyEzJobs</span>
                </Link>

                {/* Hamburger */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white ml-auto mr-7 p-2"
                    style={{
                        background: 'transparent',
                        border: 'none',
                    }}
                >
                    {menuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    )}
                </button>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-x-6">
                    <Link to="/" className="text-sm text-white hover:text-purple-300">Home</Link>
                    <Link to="/build" className="text-sm text-white hover:text-purple-300">Build Resume</Link>
                    <Link to="/upload" className="text-sm text-white hover:text-purple-300">Refine Resume</Link>
                    <Link to="/chat" className="text-sm text-white hover:text-purple-300">AI Assistant</Link>
                    <Link to="/jobs" className="text-sm text-white hover:text-purple-300">Job Board</Link>
                    <Link to="/contact" className="text-sm text-white hover:text-purple-300">Contact</Link>

                    {!user ? (
                        <>
                            <Link to="/login" className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3 rounded-full transition">Login</Link>
                            <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3 rounded-full transition">Sign Up</Link>
                        </>
                    ) : (
                        <div className="relative" ref={profileRef}>
                            <img
                                src={profileIcon}
                                alt="Profile"
                                className="h-8 w-8 cursor-pointer"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            />
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded shadow-lg text-white text-sm">
                                    <Link to="/account" className="block px-4 py-2 hover:bg-neutral-700" onClick={() => setDropdownOpen(false)}>Account Settings</Link>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-neutral-700">Logout</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile dropdown */}
                {menuOpen && (
                    <div className="absolute top-full left-0 w-full bg-neutral-900 shadow-md rounded-lg mt-2 py-4 flex flex-col gap-y-3 text-white md:hidden">
                        <Link to="/" onClick={closeMenu} className="px-4">Home</Link>
                        <Link to="/build" onClick={closeMenu} className="px-4">Build Resum</Link>
                        <Link to="/upload" onClick={closeMenu} className="px-4">Refine Resume</Link>
                        <Link to="/chat" onClick={closeMenu} className="px-4">AI Assistant</Link>
                        <Link to="/jobs" onClick={closeMenu} className="px-4">Job Board</Link>
                        <Link to="/contact" onClick={closeMenu} className="px-4">Contact</Link>
                        {!user ? (
                            <>
                                <Link to="/login" onClick={closeMenu} className="px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full py-2 text-center">Login</Link>
                                <Link to="/signup" onClick={closeMenu} className="px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full py-2 text-center">Sign Up</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/account" onClick={closeMenu} className="px-4">Account Settings</Link>
                                <button onClick={handleLogout} className="px-4 text-left">Logout</button>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Navbar;
