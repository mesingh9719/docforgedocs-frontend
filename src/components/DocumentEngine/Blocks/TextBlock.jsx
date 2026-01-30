import React from 'react';

const TextBlock = ({ data, onChange }) => {
    const text = data.text || '';

    // In a real implementation this would be a Rich Text Editor (Tiptap)
    // For now we use a simple contentEditable div

    const handleChange = (e) => {
        onChange({ text: e.target.innerText });
    };

    return (
        <div
            contentEditable
            suppressContentEditableWarning
            onBlur={handleChange}
            className="outline-none text-base text-slate-700 leading-relaxed min-h-[24px] empty:before:content-[attr(placeholder)] empty:before:text-slate-300 relative"
            placeholder="Type something..."
        >
            {text}
        </div>
    );
};

export default TextBlock;
