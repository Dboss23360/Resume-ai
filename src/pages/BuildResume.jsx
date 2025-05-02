import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import jsPDF from 'jspdf';

function BuildResume() {
    const [jobTitle, setJobTitle] = useState('');
    const [educationList, setEducationList] = useState(['']);
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

    const handleEducationChange = (index, value) => {
        const updated = [...educationList];
        updated[index] = value;
        setEducationList(updated);
    };

    const addEducationField = () => {
        setEducationList([...educationList, '']);
    };

    const generateResume = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://resume-server-r9po.onrender.com/api/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an AI that writes professional resumes and cover letters tailored to job descriptions.'
                        },
                        {
                            role: 'user',
                            content: `Write a resume and cover letter using this info:\nJob Title: ${jobTitle}\nEducation: ${educationList.join('; ')}\nGPA: ${gpa}\nSkills: ${skills}\nJob Experience: ${experience}\nJob Description: ${jobDescription}`
                        }
                    ]
                })
            });

            const data = await response.json();
            if (data.error) {
                setResult('Error: ' + data.error.message);
            } else {
                setResult(data.choices?.[0]?.message?.content || 'Failed to generate response.');
            }
        } catch (err) {
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

    const downloadPdf = () => {
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(result, 180);
        doc.text(lines, 10, 10);
        doc.save('myezjobs_resume.pdf');
    };

    return (
        <Layout>
            <button onClick={() => navigate('/')} style={{ backgroundColor: '#4a56a6', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', marginBottom: 20 }}>
                ← Back to Home
            </button>

            <h1>Create Your Custom Resume</h1>

            <input type="text" placeholder="Enter job title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} style={{ width: 400, marginBottom: 10 }} /><br />
            {educationList.map((edu, i) => (
                <input
                    key={i}
                    type="text"
                    placeholder={`Education #${i + 1}`}
                    value={edu}
                    onChange={e => handleEducationChange(i, e.target.value)}
                    style={{ width: 400, marginBottom: 8 }}
                />
            ))}
            <button onClick={addEducationField} style={{ marginBottom: 20, backgroundColor: '#eee', padding: '6px 12px', borderRadius: 4 }}>+ Add Education</button><br />

            <input type="text" placeholder="Enter GPA" value={gpa} onChange={e => setGpa(e.target.value)} style={{ width: 400, marginBottom: 10 }} /><br />
            <input type="text" placeholder="Enter your skills" value={skills} onChange={e => setSkills(e.target.value)} style={{ width: 400, marginBottom: 10 }} /><br />
            <input type="text" placeholder="Enter job experience" value={experience} onChange={e => setExperience(e.target.value)} style={{ width: 400, marginBottom: 10 }} /><br />

            <textarea
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                rows={6}
                style={{ width: '100%', maxWidth: 700, resize: 'vertical', marginBottom: 20 }}
            /><br />

            <button
                onClick={generateResume}
                disabled={loading}
                style={{ backgroundColor: '#4a56a6', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
                {loading ? 'Generating...' : 'Generate Resume'}
            </button>

            {result && (
                <div style={{ marginTop: 30, maxWidth: 700, textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                    <button onClick={downloadText} style={{ marginRight: 10, backgroundColor: '#4a56a6', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none' }}>
                        Download as .txt
                    </button>
                    <button onClick={downloadPdf} style={{ backgroundColor: '#4a56a6', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none' }}>
                        Download as .pdf
                    </button>
                    <pre style={{ marginTop: 20 }}>{result}</pre>
                </div>
            )}
        </Layout>
    );
}

export default BuildResume;
