import Navbar from './Navbar';
import './Layout.css';

function Layout({ children, fullScreen = false }) {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'block',
                background: 'linear-gradient(90deg, #0A0A0A 0%, #0A0A0A 28%, #130C2A 45%, #2B1A5F 70%, #3A2A80 100%)',
                fontFamily: 'Inter, sans-serif',
                color: 'white',
            }}
        >
            <Navbar />

            {fullScreen ? (
                children
            ) : (
                <main className="responsive-wrapper">
                    {children}
                </main>
            )}

            <footer
                style={{
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: '#aaa',
                    padding: '1rem 0',
                }}
            >
                © {new Date().getFullYear()} MyEzJobs
            </footer>
        </div>
    );
}

export default Layout;
