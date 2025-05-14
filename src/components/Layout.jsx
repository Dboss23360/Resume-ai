import Navbar from './Navbar';
import './Layout.css';

function Layout({ children, fullScreen = false }) {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(to right, #0b0b0d, #2c1e6a)',
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
