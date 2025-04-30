function Layout({ children }) {
    return (
        <div
            style={{
                padding: '40px 20px',
                fontFamily: 'Arial',
                maxWidth: '800px',
                margin: '0 auto',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxSizing: 'border-box',
            }}
        >
            {children}

            <footer style={{ marginTop: 'auto', fontSize: '14px', color: '#888' }}>
                © {new Date().getFullYear()} MyResumePilot
            </footer>
        </div>
    );
}

export default Layout;
