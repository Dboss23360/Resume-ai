import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function BuildResume() {
    const [jobDescription, setJobDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const generateResume = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/refine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an AI that writes professional resumes and cover letters tailored to job descriptions.'
                        },
                        {
                            role: 'user',
                            content: `Write a resume and cover letter for this job:\nJob Description: ${jobDescription}\nSkills: ${skills}\nExperience: ${experience}`
                        }
                    ]
                })
            });


            const data = await response.json();
            if (data.error) {
                console.error('OpenAI Error:', data.error.message);
                setResult('Error: ' + data.error.message);
            } else {
                setResult(data.choices?.[0]?.message?.content || 'Failed to generate response.');
            }
        } catch (err) {
            console.error('Fetch Error:', err);
            setResult('Something went wrong: ' + err.message);
        }
        setLoading(false);
    };

    const downloadText = () => {
        const element = document.createElement('a');
        const file = new Blob([result], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'resume.txt';
        document.body.appendChild(element);
        element.click();
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

            <h1>Build Resume</h1>

            <textarea
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                cols={60}
            />
            <br /><br />

            <input
                type="text"
                placeholder="Enter your skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                style={{ width: 400 }}
            />
            <br /><br />

            <input
                type="text"
                placeholder="Enter your experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                style={{ width: 400 }}
            />
            <br /><br />

            <button onClick={generateResume} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Resume'}
            </button>

            {result && (
                <div style={{ marginTop: 30, whiteSpace: 'pre-wrap', maxWidth: 700 }}>
                    <button onClick={downloadText} style={{ marginBottom: 20 }}>
                        Download as .txt
                    </button>
                    <br />
                    {result}
                </div>
            )}
        </Layout>
    );
}

export default BuildResume;