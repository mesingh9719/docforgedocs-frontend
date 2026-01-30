import React from 'react';

const HeadingBlock = ({ data, onChange }) => {
    // defaults
    const level = data.level || 1;
    const text = data.text || '';
    const align = data.align || 'left';

    const Tag = `h${Math.min(level, 3)}`; // h1, h2, h3 only

    const handleChange = (e) => {
        onChange({ text: e.target.innerText });
    };

    return (
        <Tag
            contentEditable
            suppressContentEditableWarning
            onBlur={handleChange}
            className={`
                outline-none font-bold text-slate-900 leading-tight
                ${level === 1 ? 'text-3xl mb-4 mt-6' : ''}
                ${level === 2 ? 'text-2xl mb-3 mt-5' : ''}
                ${level === 3 ? 'text-xl mb-2 mt-4' : ''}
                text-${align}
            `}
            style={{ minHeight: '1.2em' }} // Keep accessible when empty
        >
            {text}
        </Tag>
    );
};

export default HeadingBlock;
