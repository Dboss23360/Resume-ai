import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function BuildResume() {
    const [jobTitle, setJobTitle] = useState('');
    const [education, setEducation] = useState('');
    const [gpa, setGpa] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Build Resume – MyEzJobs';
    }, []);

    const generateResume = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://resume-server-r9po.onrender.com/api/refine', {
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
                            content: `Write a resume and cover letter for this job:\nJob Title: ${jobTitle}\nEducation: ${education}\nGPA: ${gpa}\nSkills: ${skills}\nExperience: ${experience}\nJob Description: ${jobDescription}`
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
        element.download = 'myezjobs_resume.txt';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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

            <h1>Create Your Custom Resume</h1>

            <input
                type="text"
                placeholder="Enter job title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                style={{ width: 400 }}
            />
            <br /><br />

            <input
                type="text"
                placeholder="Enter education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                style={{ width: 400 }}
            />
            <br /><br />

            <input
                type="text"
                placeholder="Enter GPA"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                style={{ width: 400 }}
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

            <textarea
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                cols={60}
                style={{ resize: 'vertical' }}
            />
            <br /><br />

            <button
                onClick={generateResume}
                disabled={loading}
                style={{
                    backgroundColor: '#4a56a6',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Generating...' : 'Generate Resume'}
            </button>

            {result && (
                <div style={{ marginTop: 30, whiteSpace: 'pre-wrap', maxWidth: 700, textAlign: 'left' }}>
                    <button
                        onClick={downloadText}
                        style={{
                            marginBottom: 20,
                            backgroundColor: '#4a56a6',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Download as .txt
                    </button>
                    <pre>{result}</pre>
                </div>
            )}
        </Layout>
    );
}

export default BuildResume;
