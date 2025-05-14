import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.svg'; // make sure you have this!

function Navbar() {
    return (
        <nav className="top-nav">
            <div className="logo-area">
                <img src={logo} alt="Logo" className="logo-icon" />
                <span className="logo-text">MyEzJobs</span>
            </div>
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
        </nav>
    );
}

export default Navbar;
