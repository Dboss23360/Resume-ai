import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BuildResume from './pages/BuildResume';
import Chat from './pages/Chat';
import RefineResume from './pages/RefineResume';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/build" element={<BuildResume />} />
                <Route path="/refine" element={<RefineResume />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </Router>
    );
}

export default App;
