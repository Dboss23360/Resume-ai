import { FaTools, FaEdit, FaComments } from 'react-icons/fa';
import Layout from '../components/Layout'; // adjust path if needed
import './Home.css';

function Home() {
    return (
        <Layout>
            <h1 className="home-title">Welcome to MyEzJobs!</h1>
            <p className="home-subtitle">What would you like to do?</p>
            <div className="button-group">
                <a href="/build" className="home-button">
                    <FaTools style={{ marginRight: '8px' }} />
                    Build Resume
                </a>
                <a href="/refine" className="home-button">
                    <FaEdit style={{ marginRight: '8px' }} />
                    Refine Resume
                </a>
                <a href="/chat" className="home-button">
                    <FaComments style={{ marginRight: '8px' }} />
                    Chat With AI
                </a>
            </div>
        </Layout>
    );
}

export default Home;
