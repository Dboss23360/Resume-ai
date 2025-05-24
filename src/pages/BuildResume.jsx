import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TemplateOne from '../components/TemplateOne';
import './BuildResume.css';

export default function BuildResume() {
    const [resumeData, setResumeData] = useState({
        name: 'Your Name',
        title: 'Your Role',
        contact: {
            email: 'you@email.com',
            phone: '(555) 123-4567',
            website: 'yourwebsite.com',
        },
        summary: 'Write a short summary here...',
        experience: [
            {
                role: 'Position Title',
                company: 'Company Name',
                date: 'Jan 2023 – Present',
                bullets: ['Responsibility one', 'Something impactful you did'],
            },
        ],
        education: [
            {
                degree: 'B.A. in Something',
                school: 'Your University',
                date: '2019 – 2023',
            },
        ],
        skills: ['Skill One', 'Skill Two'],
        tools: ['Tool A', 'Tool B'],
        projects: [
            {
                title: 'Project Name',
                bullets: ['What it was', 'Why it mattered'],
            },
        ],
    });

    const updateField = (path, value) => {
        const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
        const newData = { ...resumeData };
        let obj = newData;
        keys.slice(0, -1).forEach((k) => (obj = obj[k]));
        obj[keys.at(-1)] = value;
        setResumeData(newData);
    };

    useEffect(() => {
        document.title = 'Build Resume – MyEzJobs';
    }, []);

    return (
        <Layout>
            <div className="resume-builder">
                <TemplateOne data={resumeData} updateField={updateField} />
            </div>
        </Layout>
    );
}
