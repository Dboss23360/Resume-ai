import Navbar from './Navbar';
import './Layout.css';
import { useTheme } from '../context/ThemeContext';

function Layout({ children, fullScreen = false }) {
    const { theme } = useTheme();

    const darkBackground = 'linear-gradient(90deg, #0A0A0A 0%, #0A0A0A 28%, #130C2A 45%, #2B1A5F 70%, #3A2A80 100%)';
    const lightBackground = 'linear-gradient(90deg, #ffffff 0%, #fafaff 28%, #f3f1ff 45%, #f0eeff 70%, #ecebff 100%)';
    const background = theme === 'light' ? lightBackground : darkBackground;
    const textColor = theme === 'light' ? '#111' : 'white';

    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background,
                fontFamily: 'Inter, sans-serif',
                color: textColor,
                overflow: 'hidden',
            }}
        >
            <Navbar />

            {fullScreen ? (
                <main
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    {children}
                </main>
            ) : (
                <main className="responsive-wrapper">{children}</main>
            )}

            <footer
                style={{
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: theme === 'light' ? '#555' : '#aaa',
                    padding: '1rem 0',
                }}
            >
                © {new Date().getFullYear()} MyEzJobs
            </footer>
        </div>
    );
}

export default Layout;
