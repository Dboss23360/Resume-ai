import Navbar from '../components/Navbar';
import './Home.css';

function Home() {
    return (
        <>
            <Navbar />
            <main className="hero-container">
                <h2 className="hero-tagline">Build Resumes. Land Jobs. The Easy Way.</h2>
                <h1 className="hero-title">From “Send” to “You’re Hired”</h1>
                <p className="hero-subtext">
                    Build the perfect resume, explore job and internship openings, and land the opportunity that fits you best.
                </p>
                <div className="hero-buttons">
                    <button className="hero-btn">Build New Resume</button>
                    <button className="hero-btn">Upload Resume</button>
                    <button className="hero-btn">AI Assistant</button>
                    <button className="hero-btn">Job Board</button>
                    <button className="hero-btn outline">Learn More</button>
                </div>
            </main>
        </>
    );
}

export default Home;
