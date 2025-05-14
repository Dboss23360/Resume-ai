import Navbar from './Navbar';

function Layout({ children }) {
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

            <main
                style={{
                    flex: 1,
                    padding: '60px 20px 40px',
                    maxWidth: '960px',
                    margin: '0 auto',
                    boxSizing: 'border-box',
                    width: '100%',
                }}
            >
                {children}
            </main>

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