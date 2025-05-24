import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';

import resumeIcon from '../assets/icons/home-resume-icon.svg';
import uploadIcon from '../assets/icons/home-upload-icon.svg';
import chatIcon from '../assets/icons/home-chat-icon.svg';
import searchIcon from '../assets/icons/home-search-icon.svg';

function Home() {
    return (
        <div>
            <Navbar />

            <main className="hero-container">
                <h2 className="hero-tagline">
                    Build Resumes. Land Jobs. The Easy Way.
                </h2>

                <h1 className="hero-title">
                    From <span>“Send”</span> to <span className="gradient-text">“You’re Hired”</span>
                </h1>

                <p className="hero-subtext">
                    Build the perfect resume, explore job and internship openings,<br />
                    and land the opportunity that fits you best.
                </p>

                <div className="hero-buttons">
                    <Link to="/build" className="hero-btn">Build New Resume</Link>
                    <Link to="/upload" className="hero-btn">Upload Resume</Link>
                    <Link to="/chat" className="hero-btn">AI Assistant</Link>
                    <Link to="/jobs" className="hero-btn">Job Board</Link>
                    <Link to="/learn" className="hero-btn learn-more-btn">Learn More</Link>
                </div>
            </main>

            <section className="home-icons-section">
                <h2 className="icon-header">How it works</h2>
                <div className="icon-grid">
                    <div className="icon-item">
                        <img src={resumeIcon} alt="Create Resume Icon" />
                        <div className="icon-text">
                            <h3>Create Your Resume</h3>
                            <p>Use our builder to craft a standout resume in minutes.</p>
                        </div>
                    </div>

                    <div className="icon-item">
                        <img src={uploadIcon} alt="Upload Resume Icon" />
                        <div className="icon-text">
                            <h3>Upload Existing</h3>
                            <p>Already have one? Upload and improve it instantly.</p>
                        </div>
                    </div>

                    <div className="icon-item">
                        <img src={chatIcon} alt="AI Assistant Icon" />
                        <div className="icon-text">
                            <h3>Get AI Advice</h3>
                            <p>Chat with our AI to refine your resume and job pitch.</p>
                        </div>
                    </div>

                    <div className="icon-item">
                        <img src={searchIcon} alt="Search Jobs Icon" />
                        <div className="icon-text">
                            <h3>Find Jobs</h3>
                            <p>Explore listings tailored to your skills and goals.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
