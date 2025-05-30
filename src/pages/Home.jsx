import Navbar from '../components/Navbar';
import './Home.css';

import heroIllustration from '../assets/illustrations/hero-laptop.svg';
import resumeMan from '../assets/illustrations/resume-man.svg';

function Home() {
    return (
        <div>
            <Navbar />

            {/* Hero Section */}
            <main className="hero-container">
                <div className="hero-text">
                    <h2 className="hero-tagline">Build Resumes. Land Jobs. The Easy Way.</h2>
                    <h1 className="hero-title">
                        From <span className="gradient-text">Send</span><br />
                        to <span className="gradient-text">You’re Hired</span>
                    </h1>
                    <p className="hero-subtext">
                        Build the perfect resume, explore job and internship openings,
                        and land the opportunity that fits you best.
                    </p>

                    <div className="hero-buttons">
                        <button className="hero-btn">Build New Resume</button>
                        <button className="hero-btn">Upload Resume</button>
                        <button className="hero-btn">AI Assistant</button>
                        <button className="hero-btn">Job Board</button>
                        <button className="hero-btn learn-more-btn">Learn More</button>
                    </div>
                </div>
                <div className="hero-illustration">
                    <img src={heroIllustration} alt="Woman at laptop illustration" />
                </div>
            </main>

            {/* Polished Resume Section */}
            <section className="info-section purple-section">
                <div className="info-content">
                    <img
                        src={resumeMan}
                        alt="Man holding resume illustration"
                        className="info-image"
                    />
                    <div className="info-text">
                        <h2>
                            Stand Out with a <span className="highlight">Polished</span> Resume
                        </h2>
                        <p>
                            Your resume is your first impression—make it count. With MyEzJobs, you can
                            create visually striking, professionally formatted resumes that highlight
                            your strengths and land interviews faster.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
