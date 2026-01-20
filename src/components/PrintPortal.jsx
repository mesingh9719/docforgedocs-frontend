import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

/**
 * PrintPortal Component
 * 
 * Renders content into a dedicated #print-root div at the body level.
 * This completely isolates print content from the main app layout structure (flex, grid, overflow),
 * solving issues with cut-off pages and scrollbars.
 */
const PrintPortal = ({ children }) => {
    const [mountNode, setMountNode] = useState(null);

    useEffect(() => {
        const el = document.getElementById('print-root');
        if (el) {
            setMountNode(el);
        } else {
            // Fallback if index.html wasn't updated
            const newEl = document.createElement('div');
            newEl.id = 'print-root';
            document.body.appendChild(newEl);
            setMountNode(newEl);
        }
    }, []);

    if (!mountNode) return null;

    return ReactDOM.createPortal(children, mountNode);
};

export default PrintPortal;
