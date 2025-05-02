import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import Worker from 'pdfjs-dist/legacy/build/pdf.worker?worker';

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerPort = new Worker();

function RefineResume() {
    const [existingResume, setExistingResume] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [dropMessage, setDropMessage] = useState('Drop your resume file here (PDF, TXT) or paste it below');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Refine Resume – MyEzJobs';
    }, []);

    const refineResume = async () => {
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
                            content: 'You are a resume expert who refines and enhances resumes for clarity, impact, and professionalism.'
                        },
                        {
                            role: 'user',
                            content: `Please refine and improve this resume:\n\n${existingResume}`
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

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;

        setDropMessage('Reading file...');
        const fileName = file.name.toLowerCase();
        const reader = new FileReader();

        if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
            reader.onload = async () => {
                try {
                    const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        const pageText = content.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n';
                    }
                    setExistingResume(fullText.trim());
                    setDropMessage('PDF uploaded successfully!');
                } catch (err) {
                    console.error('PDF parsing error:', err);
                    setDropMessage(`Error reading PDF: ${err.message}`);
                }
            };
            reader.readAsArrayBuffer(file);
        } else if (file.type === 'text/plain' || fileName.endsWith('.txt')) {
            reader.onload = () => {
                setExistingResume(reader.result.trim());
                setDropMessage('Text file uploaded successfully!');
            };
            reader.readAsText(file);
        } else {
            setDropMessage('Unsupported file type. Use PDF or TXT.');
        }
    };

    const downloadText = () => {
        const element = document.createElement('a');
        const file = new Blob([result], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'refined_resume.txt';
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

            <h1>Refine Resume</h1>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: 10 }}>
                Paste your resume or drag in a file below:
            </p>

            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                    width: '100%',
                    maxWidth: 700,
                    border: '2px dashed #ccc',
                    borderRadius: 6,
                    padding: 20,
                    marginBottom: 20,
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9',
                    color: '#777',
                }}
            >
                {dropMessage}
            </div>

            <textarea
                placeholder="Paste your current resume..."
                value={existingResume}
                onChange={(e) => setExistingResume(e.target.value)}
                rows={10}
                style={{
                    width: '100%',
                    maxWidth: 700,
                    padding: 10,
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    marginBottom: 20
                }}
            />
            <br />

            <button onClick={refineResume} disabled={loading || !existingResume.trim()}>
                {loading ? 'Refining...' : 'Refine Resume'}
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

export default RefineResume;
