function Layout({ children }) {
    return (
        <div
            style={{
                fontFamily: 'Arial, sans-serif',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',   // ✅ vertical centering
                alignItems: 'center',       // ✅ horizontal centering
                textAlign: 'center',        // ✅ text alignment
                padding: '40px 20px',
            }}
        >
            {children}
        </div>
    );
}

export default Layout;