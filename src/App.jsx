import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BuildResume from "./pages/BuildResume";
import Chat from "./pages/Chat";
import RefineResume from "./pages/RefineResume";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ScrollToTop from "./components/ScrollToTop";

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/build" element={<BuildResume />} />
                <Route path="/refine" element={<RefineResume />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </Router>
    );
}

export default App;
