export default function EditableText({ value, onChange, className }) {
    return (
        <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onChange(e.target.innerText)}
            className={`editable ${className || ''}`}
        >
            {value}
        </div>
    );
}
