import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

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
                headers: {
                    'Content-Type': 'application/json',
                },
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
            <h1 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>Chat with Career Assistant AI</h1>

            <div
                style={{
                    backgroundColor: '#1b1b1d',
                    border: '1px solid #333',
                    padding: 20,
                    height: 420,
                    width: '100%',
                    maxWidth: 700,
                    overflowY: 'auto',
                    marginBottom: 20,
                    borderRadius: 12,
                }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            marginBottom: 10,
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: msg.sender === 'user' ? '#a084dc' : '#302b63',
                                color: '#fff',
                                padding: '10px 14px',
                                borderRadius: '18px',
                                maxWidth: '80%',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                            }}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            <textarea
                placeholder="Ask anything about resumes, careers, or interviews..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={3}
                style={{
                    width: '100%',
                    maxWidth: 700,
                    padding: 12,
                    fontSize: '1rem',
                    borderRadius: 10,
                    border: '1.5px solid #555',
                    backgroundColor: '#0f0f11',
                    color: '#fff',
                    resize: 'none',
                    marginBottom: 14,
                }}
            />
            <br />

            <button
                onClick={sendMessage}
                disabled={loading}
                style={{
                    padding: '12px 24px',
                    fontSize: '1rem',
                    borderRadius: 30,
                    backgroundColor: '#a084dc',
                    color: 'white',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s ease',
                }}
            >
                {loading ? 'Sending...' : 'Send'}
            </button>
        </Layout>
    );
}

export default Chat;
