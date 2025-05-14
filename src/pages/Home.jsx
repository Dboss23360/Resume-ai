import Navbar from '../components/Navbar';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <Navbar />

            <main className="hero-container">
                <h2 className="hero-tagline">Build Resumes. Land Jobs. The Easy Way.</h2>

                <h1 className="hero-title">From “Send” to “You’re Hired”</h1>

                <p className="hero-subtext">
                    Build the perfect resume, explore job and internship openings, and land the opportunity that fits you best.
                </p>

                <div className="hero-buttons">
                    <Link to="/build" className="hero-btn">Build New Resume</Link>
                    <Link to="/upload" className="hero-btn">Upload Resume</Link>
                    <Link to="/chat" className="hero-btn">AI Assistant</Link>
                    <Link to="/jobs" className="hero-btn">Job Board</Link>
                    <Link to="/learn" className="hero-btn outline">Learn More</Link>
                </div>
            </main>
        </div>
    );
}

export default Home;
