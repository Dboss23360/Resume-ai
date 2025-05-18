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

import ThreadItem from '../components/ThreadItem';

import ReactMarkdown from 'react-markdown';

import Layout from '../components/Layout';
import './Chat.css';

import ImageIcon from '../assets/icons/image-icon.svg';
import SendIcon from '../assets/icons/send-icon.svg';

import { useRef } from 'react';

function formatChatTitle(title) {
    if (!title) return 'Untitled Chat';
    const words = title.trim().split(/\s+/);
    const short = words.slice(0, 5).join(' ');
    return words.length > 5 ? short + '…' : short;
}

function Chat() {
    const [user, setUser] = useState(null);
    const [threads, setThreads] = useState([]);
    const [selectedThreadId, setSelectedThreadId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const textareaRef = useRef(null);
    const scrollRef = useRef(null);
    const [sidebarWidth, setSidebarWidth] = useState(260); // default width in px
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const resizingRef = useRef(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!resizingRef.current) return;
            const min = 180;
            const max = 400;
            const sidebarLeftEdge = document.querySelector('.resizable-sidebar')?.getBoundingClientRect().left || 0;
            const newWidth = Math.min(Math.max(e.clientX - sidebarLeftEdge, min), max);
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            resizingRef.current = false;
            document.body.classList.remove('resizing');
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const startResizing = () => {
        resizingRef.current = true;
        document.body.classList.add('resizing');
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '42px';
        }
    }, []);


    useEffect(() => {
        document.title = 'Chat – MyEzJobs';
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

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
            setSelectedThreadId(null);
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

    const createNewThread = () => {
        setSelectedThreadId(null);
        setMessages([]);
    };

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        let threadId = selectedThreadId;
        const newMessages = [...messages, { sender: 'user', text: userInput }];

        // If user is logged in and no thread exists, create a new one
        if (user && !threadId) {
            const threadsRef = collection(db, 'chats', user.uid, 'threads');
            const newDoc = await addDoc(threadsRef, {
                title: 'New Chat',
                messages: [],
                createdAt: new Date()
            });

            threadId = newDoc.id;
            setSelectedThreadId(threadId);

            const newThread = {
                id: threadId,
                title: 'New Chat',
                messages: [],
                createdAt: new Date()
            };
            setThreads(prev => [newThread, ...prev]);
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

            // Rename thread based on AI reply if it's still "New Chat"
            if (user && threadId) {
                const threadRef = doc(db, 'chats', user.uid, 'threads', threadId);

                // Get current thread data
                const snap = await getDoc(threadRef);
                const threadData = snap.data();

                if (threadData?.title === 'New Chat') {
                    const sentence = aiReply.split(/[.?!]/)[0].trim(); // first sentence
                    const preview = sentence.split(/\s+/).slice(0, 7).join(' ');
                    const aiPreview = preview + (sentence.split(/\s+/).length > 7 ? '…' : '');
                    await setDoc(threadRef, { title: aiPreview }, { merge: true });

                    setThreads(prev =>
                        prev.map(t =>
                            t.id === threadId ? { ...t, title: aiPreview } : t
                        )
                    );
                }
            }

            // Save only if user is logged in
            if (user && threadId) {
                const threadRef = doc(db, 'chats', user.uid, 'threads', threadId);
                await setDoc(threadRef, { messages: updated }, { merge: true });
            }
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'ai', text: 'Something went wrong: ' + err.message }]);
        }

        setLoading(false);
    };



    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !loading) {
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
                {isMobile && user && (
                    <div className="chat-mobile-toggle-container">
                        <button className="mobile-sidebar-toggle" onClick={() => setShowMobileSidebar(!showMobileSidebar)}>
                            ☰ Chats
                        </button>
                    </div>
                )}
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
                        <div
                            className={`resizable-sidebar ${isMobile ? (showMobileSidebar ? 'open' : 'hidden') : ''}`}
                            style={!isMobile ? { width: `${sidebarWidth}px` } : {}}
                        >
                        <aside className="chat-history">
                    <h3>📂 Recent Chats</h3>
                            <ul>
                                {threads.map((t) => (
                                    <ThreadItem
                                        key={t.id}
                                        thread={{ ...t, shortTitle: formatChatTitle(t.title) }}
                                        isActive={t.id === selectedThreadId}
                                        onSelect={selectThread}
                                        onDelete={deleteThread}
                                        onRename={(threadId) => {
                                            const newName = prompt('Enter new chat name:');
                                            if (newName && user) {
                                                const threadRef = doc(db, 'chats', user.uid, 'threads', threadId);
                                                setDoc(threadRef, { title: newName }, { merge: true });

                                                setThreads(prev =>
                                                    prev.map(t =>
                                                        t.id === threadId ? { ...t, title: newName } : t
                                                    )
                                                );
                                            }
                                        }}
                                        loading={loading}
                                    />
                                ))}
                            </ul>
                        </aside>
                            <div className="sidebar-resizer" onMouseDown={startResizing}></div>
                        </div>
                    )}

                    <div className="chat-main">
                        <div className="chat-box">
                            <div className="chat-scroll-area" ref={scrollRef}>
                                {messages.map((msg, index) => (
                                    <div key={index} className={`chat-message ${msg.sender}`}>
                                        <div className="chat-bubble">
                                            <ReactMarkdown components={{
                                                p: (props) => <p className="ai-message" {...props} />
                                            }}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className="chat-input-area">
                            <button type="button" className="icon-btn">
                                <img src={ImageIcon} alt="Upload" className="image-icon" />
                            </button>
                            <textarea
                                ref={textareaRef}
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