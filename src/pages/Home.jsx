import { FaTools, FaEdit, FaComments, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';

function Home() {
    return (
        <div>
            <Navbar />

            <main className="hero">
                <h1 className="home-title">Build Resumes.<br />Land Jobs.<br />The Easy Way</h1>
                <p className="home-subtitle">
                    AI-powered tools to build resumes, find jobs, and get hired faster.
                </p>

                <div className="button-group">
                    <Link to="/build" className="home-button">
                        <FaTools style={{ marginRight: '8px' }} />
                        Build Resume
                    </Link>
                    <Link to="/refine" className="home-button">
                        <FaEdit style={{ marginRight: '8px' }} />
                        Refine Resume
                    </Link>
                    <Link to="/jobs" className="home-button">
                        <FaSearch style={{ marginRight: '8px' }} />
                        Find Jobs
                    </Link>
                    <Link to="/chat" className="home-button">
                        <FaComments style={{ marginRight: '8px' }} />
                        Chat With AI
                    </Link>
                </div>
            </main>

            <footer>
                <div className="footer-links">
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Contact</a>
                </div>
                <p>© 2025 MyEzJobs</p>
            </footer>
        </div>
    );
}

export default Home;
