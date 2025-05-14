import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import './Chat.css';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = 'Chat – MyEzJobs';
    }, []);

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
                            content: 'You are a friendly AI career coach helping users with resumes, job hunting, and interview prep.'
                        },
                        ...newMessages.map(m => ({
                            role: m.sender === 'user' ? 'user' : 'assistant',
                            content: m.text
                        }))
                    ]
                }),
            });

            const data = await response.json();
            const aiReply = data.choices?.[0]?.message?.content || 'No response.';
            setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
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

    return (
        <Layout>
            <div className="chat-page">
                <h1>Chat With Career Assistant AI</h1>

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
                    <span className="icon">🖼️</span>
                    <textarea
                        placeholder="Ask anything about resumes, careers, or interviews"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        rows={2}
                    />
                    <button onClick={sendMessage} disabled={loading}>
                        {loading ? '...' : '➤'}
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default Chat;
