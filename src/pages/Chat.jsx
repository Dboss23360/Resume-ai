import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/refine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: 'You are a friendly career coach helping users with resumes, job hunting, and interview advice.' },
                        ...newMessages.map(m => ({
                            role: m.sender === 'user' ? 'user' : 'assistant',
                            content: m.text
                        }))
                    ]
                })
            });


            const data = await response.json();
            if (data.error) {
                console.error('OpenAI Error:', data.error.message);
                setMessages(prev => [...prev, { sender: 'ai', text: `Error: ${data.error.message}` }]);
            } else {
                const aiReply = data.choices?.[0]?.message?.content || 'No response.';
                setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
            }
        } catch (err) {
            console.error('Fetch Error:', err);
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
            <button
                onClick={() => navigate('/')}
                style={{
                    backgroundColor: '#4a56a6',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                }}
            >
                ⬅ Back to Home
            </button>

            <h1>Chat with Career Assistant AI</h1>

            <div
                style={{
                    border: '1px solid #ccc',
                    padding: 20,
                    height: 400,
                    width: '100%',
                    maxWidth: 600,
                    overflowY: 'auto',
                    marginBottom: 20,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            margin: '8px 0',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: msg.sender === 'user' ? '#4a56a6' : '#f1f1f1',
                                color: msg.sender === 'user' ? '#fff' : '#000',
                                padding: '10px 14px',
                                borderRadius: '16px',
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
                placeholder="Ask anything about resumes, careers, interviews..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={3}
                style={{
                    width: '100%',
                    maxWidth: 600,
                    padding: 10,
                    fontSize: '1rem',
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    resize: 'none',
                    marginBottom: 10
                }}
            />
            <br />

            <button
                onClick={sendMessage}
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    fontSize: '1rem',
                    borderRadius: 6,
                    backgroundColor: '#4a56a6',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                {loading ? 'Sending...' : 'Send'}
            </button>
        </Layout>
    );
}

export default Chat;
