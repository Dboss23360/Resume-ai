// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="top-nav">
            <div className="logo">MyEzJobs</div>
            <div className="nav-links">
                <Link to="/build">Resume Builder</Link>
                <Link to="/jobs">Job Search</Link>
                <Link to="/chat">AI Chat</Link>
                <button className="signup-btn">Sign up</button>
            </div>
        </nav>
    );
}

export default Navbar;