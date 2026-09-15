import React from 'react';
import { resolveVariables } from '../../../utils/variableResolver';

const TextBlock = ({ data = {}, onChange, readOnly = false, resolvedContext = null }) => {
    const rawText = data.text || '';
    const displayText = resolvedContext ? resolveVariables(rawText, resolvedContext) : rawText;

    const handleChange = (e) => {
        if (!readOnly && onChange) {
            onChange({ ...data, text: e.target.innerText });
        }
    };

    return (
        <div
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onBlur={handleChange}
            className="outline-none text-sm md:text-base text-slate-700 leading-relaxed min-h-[28px] empty:before:content-[attr(placeholder)] empty:before:text-slate-300 relative whitespace-pre-wrap font-sans transition-colors"
            placeholder="Type text or enter dynamic variables like {{client.name}}..."
        >
            {displayText}
        </div>
    );
};

export default TextBlock;
