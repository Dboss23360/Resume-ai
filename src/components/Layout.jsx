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
                alignItems: 'center', // 🟢 center children
                textAlign: 'center'   // 🟢 center text content
            }}
        >
            {children}
        </div>
    );
}

export default Layout;
