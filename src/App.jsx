import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BuildResume from './pages/BuildResume';
import Chat from './pages/Chat';
import RefineResume from "./pages/RefineResume.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/build" element={<BuildResume />} />
                <Route path="/refine" element={<RefineResume />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>

            <footer style={{ marginTop: '2rem', textAlign: 'center', fontSize: '14px', color: '#888' }}>
                © {new Date().getFullYear()} MyResumePilot
            </footer>
        </Router>
    );
}


export default App;