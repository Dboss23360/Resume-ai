import { useState } from 'react';

function ThreadItem({ thread, isActive, onSelect, onDelete, onRename, loading }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <li className={`chat-thread ${isActive ? 'active-thread' : ''}`}>
            <div className="thread-content" onClick={() => onSelect(thread.id)}>
                {thread.title || 'Untitled'}
            </div>
            <div className="thread-menu">
                <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>⋯</button>
                {menuOpen && (
                    <div className="dropdown">
                        <button onClick={() => { setMenuOpen(false); onRename(thread.id); }}>Rename</button>
                        <button onClick={() => { setMenuOpen(false); onDelete(thread.id); }} disabled={loading}>Delete</button>
                    </div>
                )}
            </div>
        </li>
    );
}

export default ThreadItem;
