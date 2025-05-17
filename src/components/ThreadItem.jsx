import { useState, useRef, useEffect } from 'react';
import './ThreadItem.css'; // 💡 Create this CSS file (shown below)

function ThreadItem({ thread, isActive, onSelect, onDelete, onRename, loading }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <li className={`chat-thread ${isActive ? 'active-thread' : ''}`}>
            <div className="thread-content" onClick={() => onSelect(thread.id)}>
                {thread.title || 'Untitled'}
            </div>
            <div className="thread-menu" ref={menuRef}>
                <button className="menu-button" onClick={() => setMenuOpen((prev) => !prev)}>⋯</button>
                <div className={`dropdown ${menuOpen ? 'open' : ''}`}>
                    <button onClick={() => { setMenuOpen(false); onRename(thread.id); }}>Rename</button>
                    <button onClick={() => { setMenuOpen(false); onDelete(thread.id); }} disabled={loading}>Delete</button>
                </div>
            </div>
        </li>
    );
}

export default ThreadItem;
