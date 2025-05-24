import EditableText from './EditableText';
import './TemplateOne.css';

export default function TemplateOne({ data, updateField }) {
    return (
        <div className="template-one">
            <EditableText
                value={data.name}
                onChange={(val) => updateField('name', val)}
                className="name"
            />
            <EditableText
                value={data.title}
                onChange={(val) => updateField('title', val)}
                className="title"
            />
            <EditableText
                value={data.summary}
                onChange={(val) => updateField('summary', val)}
                className="summary"
            />

            <div className="section">
                <h3>Experience</h3>
                {data.experience.map((item, i) => (
                    <div key={i}>
                        <EditableText
                            value={item.role}
                            onChange={(val) => updateField(`experience[${i}].role`, val)}
                        />
                        <EditableText
                            value={item.company}
                            onChange={(val) => updateField(`experience[${i}].company`, val)}
                        />
                        {item.bullets.map((bullet, j) => (
                            <EditableText
                                key={j}
                                value={bullet}
                                onChange={(val) =>
                                    updateField(`experience[${i}].bullets[${j}]`, val)
                                }
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
