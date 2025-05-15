import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase'; // adjust if needed
import { doc, getDoc, setDoc } from 'firebase/firestore';

import Layout from '../components/Layout';
import './Chat.css';

import ImageIcon from '../assets/icons/image-icon.svg';
import SendIcon from '../assets/icons/send-icon.svg';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [user, setUser] = useState(null);

    // Handle responsive changes
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Update document title
    useEffect(() => {
        document.title = 'Chat – MyEzJobs';
    }, []);

    // Listen for auth state + load chat from Firestore
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                const userDocRef = doc(db, 'chats', firebaseUser.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const saved = docSnap.data();
                    setMessages(saved.messages || []);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    // Save messages to Firestore when changed
    useEffect(() => {
        if (!user) return;
        const userDocRef = doc(db, 'chats', user.uid);
        setDoc(userDocRef, { messages }, { merge: true });
    }, [messages, user]);

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setLoading(true);

        try {
            const response = await fetch('https://resume-server-r9po.onrender.com/api/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content:
                                'You are a friendly AI career coach helping users with resumes, job hunting, and interview prep.',
                        },
                        ...newMessages.map((m) => ({
                            role: m.sender === 'user' ? 'user' : 'assistant',
                            content: m.text,
                        })),
                    ],
                }),
            });

            const data = await response.json();
            const aiReply = data.choices?.[0]?.message?.content || 'No response.';
            setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
        } catch (err) {
            setMessages((prev) => [...prev, { sender: 'ai', text: 'Something went wrong: ' + err.message }]);
        }

        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleClearChat = async () => {
        setMessages([]);
        if (user) {
            const userDocRef = doc(db, 'chats', user.uid);
            await setDoc(userDocRef, { messages: [] }, { merge: true });
        }
    };

    return (
        <Layout fullScreen>
            <div className="chat-page">
                {user ? (
                    <div className="chat-header-logged-in">
                        <h1>👋 Welcome back, {user.displayName || 'friend'}!</h1>
                        <button className="clear-chat-btn" onClick={handleClearChat}>
                            🗑 New Chat
                        </button>
                    </div>
                ) : (
                    <h1>MyEzJobs AI</h1>
                )}

                <div className="chat-content-wrapper">
                    {user && (
                        <aside className="chat-history">
                            <h3>📂 Recent Chats</h3>
                            <ul>
                                <li>Resume Feedback</li>
                                <li>Interview Prep</li>
                                <li>Job Search Tips</li>
                            </ul>
                        </aside>
                    )}

                    <div className="chat-main">
                        <div className="chat-box">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`chat-message ${msg.sender === 'user' ? 'user' : 'ai'}`}
                                >
                                    <div className="chat-bubble">{msg.text}</div>
                                </div>
                            ))}
                        </div>

                        <div className="chat-input-area">
                            <button type="button" className="icon-btn">
                                <img src={ImageIcon} alt="Upload" className="image-icon" />
                            </button>
                            <textarea
                                placeholder={
                                    isMobile
                                        ? 'Need help?'
                                        : 'Ask anything about resumes, careers, or interviews...'
                                }
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                rows={2}
                            />
                            <button onClick={sendMessage} disabled={loading}>
                                {loading ? '...' : <img src={SendIcon} alt="Send" className="chat-icon" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Chat;
