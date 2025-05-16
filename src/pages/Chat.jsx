import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    query,
    orderBy,
    deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';

import Layout from '../components/Layout';
import './Chat.css';

import ImageIcon from '../assets/icons/image-icon.svg';
import SendIcon from '../assets/icons/send-icon.svg';


function Chat() {
    const [user, setUser] = useState(null);
    const [threads, setThreads] = useState([]);
    const [selectedThreadId, setSelectedThreadId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        document.title = 'Chat – MyEzJobs';
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                await loadThreads(firebaseUser.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const loadThreads = async (uid) => {
        const threadsRef = collection(db, 'chats', uid, 'threads');
        const q = query(threadsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const loaded = [];
        snapshot.forEach(doc => loaded.push({ id: doc.id, ...doc.data() }));
        setThreads(loaded);

        if (loaded.length > 0) {
            setSelectedThreadId(loaded[0].id);
            setMessages(loaded[0].messages || []);
        } else {
            // 👇 Auto-create first thread
            const newDoc = await addDoc(threadsRef, {
                title: 'New Chat',
                messages: [],
                createdAt: new Date()
            });

            const newThread = {
                id: newDoc.id,
                title: 'New Chat',
                messages: [],
                createdAt: new Date()
            };

            setThreads([newThread]);
            setSelectedThreadId(newDoc.id);
            setMessages([]);
        }
    };


    const selectThread = async (threadId) => {
        setSelectedThreadId(threadId);
        const threadRef = doc(db, 'chats', user.uid, 'threads', threadId);
        const snap = await getDoc(threadRef);
        if (snap.exists()) {
            const data = snap.data();
            setMessages(data.messages || []);
        }
    };

    const createNewThread = async () => {
        const threadsRef = collection(db, 'chats', user.uid, 'threads');
        const newDoc = await addDoc(threadsRef, {
            title: 'New Chat',
            messages: [],
            createdAt: new Date()
        });

        const newThread = {
            id: newDoc.id,
            title: 'New Chat',
            messages: [],
            createdAt: new Date()
        };

        setThreads(prev => [newThread, ...prev]);
        setSelectedThreadId(newDoc.id);
        setMessages([]);
    };

    const sendMessage = async () => {
        if (!userInput.trim() || !user || !selectedThreadId) return;

        const newMessages = [...messages, { sender: 'user', text: userInput }];
        // Rename chat if it's the first message
        if (messages.length === 0 && user && selectedThreadId) {
            const preview = userInput.slice(0, 40).trim() + (userInput.length > 40 ? '...' : '');
            const threadRef = doc(db, 'chats', user.uid, 'threads', selectedThreadId);
            await setDoc(threadRef, { title: preview }, { merge: true });

            // Update sidebar state
            setThreads(prev =>
                prev.map(t =>
                    t.id === selectedThreadId ? { ...t, title: preview } : t
                )
            );
        }

        setMessages(newMessages);
        setUserInput('');
        setLoading(true);

        try {
            const response = await fetch('https://resume-server-r9po.onrender.com/api/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: 'You are a friendly AI career coach...' },
                        ...newMessages.map((m) => ({
                            role: m.sender === 'user' ? 'user' : 'assistant',
                            content: m.text,
                        })),
                    ],
                }),
            });

            const data = await response.json();
            const aiReply = data.choices?.[0]?.message?.content || 'No response.';
            const updated = [...newMessages, { sender: 'ai', text: aiReply }];
            setMessages(updated);

            const threadRef = doc(db, 'chats', user.uid, 'threads', selectedThreadId);
            await setDoc(threadRef, { messages: updated }, { merge: true });
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'ai', text: 'Something went wrong: ' + err.message }]);
        }

        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const deleteThread = async (threadId) => {
        if (!user) return;

        const confirmed = window.confirm('Delete this chat forever?');
        if (!confirmed) return;

        await deleteDoc(doc(db, 'chats', user.uid, 'threads', threadId));
        setThreads(prev => prev.filter(t => t.id !== threadId));

        if (selectedThreadId === threadId) {
            const remaining = threads.filter(t => t.id !== threadId);
            if (remaining[0]) {
                setSelectedThreadId(remaining[0].id);
                setMessages(remaining[0].messages || []);
            } else {
                setSelectedThreadId(null);
                setMessages([]);
            }
        }
    };

    return (
        <Layout fullScreen>
            <div className="chat-page">
                {user ? (
                    <div className="chat-header-logged-in">
                        <h1>👋 Welcome back, {user.displayName || 'friend'}!</h1>
                        <button className="clear-chat-btn" onClick={createNewThread}>
                            ➕ New Chat
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
                                {threads.map((t) => (
                                    <li key={t.id} className={t.id === selectedThreadId ? 'active-thread' : ''}>
                                        <span onClick={() => selectThread(t.id)}>{t.title || 'Untitled'}</span>
                                        <button onClick={() => deleteThread(t.id)} className="delete-btn" disabled={loading}>🗑</button></li>
                                ))}
                            </ul>

                        </aside>
                    )}

                    <div className="chat-main">
                        <div className="chat-box">
                            {messages.map((msg, index) => (
                                <div key={index} className={`chat-message ${msg.sender}`}>
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
                                onChange={(e) => {
                                    setUserInput(e.target.value);
                                    e.target.style.height = 'auto'; // reset
                                    e.target.style.height = `${e.target.scrollHeight}px`; // grow
                                }}                                onKeyPress={handleKeyPress}
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
