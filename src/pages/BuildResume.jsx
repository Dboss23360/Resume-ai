import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import jsPDF from 'jspdf';
import './BuildResume.css';

function BuildResume() {
    const [jobTitle, setJobTitle] = useState('');
    const [educationList, setEducationList] = useState(['']);
    const [gpa, setGpa] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    useNavigate();
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
            setResult(data.choices?.[0]?.message?.content || 'Failed to generate response.');
        } catch (err) {
            setResult('Something went wrong: ' + err.message);
        }
        setLoading(false);
    };

    const downloadText = () => {
        const blob = new Blob([result], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'myezjobs_resume.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPdf = () => {
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(result, 180);
        doc.text(lines, 10, 10);
        doc.save('myezjobs_resume.pdf');
    };

    return (
        <Layout>
            <div className="resume-container">
                <h1 className="resume-title">Create Your Custom Resume</h1>

                <div className="form-group">
                    <input type="text" placeholder="Job Title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                </div>

                {educationList.map((edu, i) => (
                    <div className="form-group" key={i}>
                        <input
                            type="text"
                            placeholder={`Education #${i + 1}`}
                            value={edu}
                            onChange={e => handleEducationChange(i, e.target.value)}
                        />
                    </div>
                ))}

                <button onClick={addEducationField} className="add-btn">+ Add Education</button>

                <div className="form-group">
                    <input type="text" placeholder="GPA" value={gpa} onChange={e => setGpa(e.target.value)} />
                    <input type="text" placeholder="Skills" value={skills} onChange={e => setSkills(e.target.value)} />
                    <input type="text" placeholder="Experience" value={experience} onChange={e => setExperience(e.target.value)} />
                </div>

                <textarea
                    placeholder="Paste job description here..."
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    rows={5}
                    className="textarea"
                />

                <button onClick={generateResume} className="generate-btn" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Resume'}
                </button>

                {result && (
                    <div className="output-section">
                        <div className="download-buttons">
                            <button onClick={downloadText}>Download as .txt</button>
                            <button onClick={downloadPdf}>Download as .pdf</button>
                        </div>
                        <pre>{result}</pre>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default BuildResume;
