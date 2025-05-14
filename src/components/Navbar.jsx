import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.svg';

function Navbar() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <nav className={`top-nav ${!isHome ? 'logo-only' : ''}`}>
            <Link to="/" className="logo-link">
                <div className="logo-area">
                    <img src={logo} alt="Logo" className="logo-icon" />
                    <span className="logo-text">MyEzJobs</span>
                </div>
            </Link>

            {isHome && (
                <>
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
                        <button className="nav-btn outline">Login</button>
                        <button className="nav-btn filled">Sign Up</button>
                    </div>
                </>
            )}
        </nav>
    );
}

export default Navbar;
