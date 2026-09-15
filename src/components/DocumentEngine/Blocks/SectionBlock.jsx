import React from 'react';
import { resolveVariables } from '../../../utils/variableResolver';

const SectionBlock = ({ data = {}, onChange, readOnly = false, resolvedContext = null }) => {
    const rawTitle = data.title || 'Section Header';
    const rawSubtitle = data.subtitle || 'Optional section subtitle or description';
    const bgColor = data.bgColor || 'bg-slate-50/50';
    const borderColor = data.borderColor || 'border-slate-200';

    const title = resolvedContext ? resolveVariables(rawTitle, resolvedContext) : rawTitle;
    const subtitle = resolvedContext ? resolveVariables(rawSubtitle, resolvedContext) : rawSubtitle;

    const handleTitleChange = (e) => {
        if (!readOnly && onChange) {
            onChange({ ...data, title: e.target.innerText });
        }
    };

    const handleSubtitleChange = (e) => {
        if (!readOnly && onChange) {
            onChange({ ...data, subtitle: e.target.innerText });
        }
    };

    return (
        <div className={`my-4 p-5 rounded-xl border ${borderColor} ${bgColor} transition-all`}>
            <div
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onBlur={handleTitleChange}
                className="font-bold text-lg text-slate-900 outline-none cursor-text mb-1"
            >
                {title}
            </div>
            <div
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onBlur={handleSubtitleChange}
                className="text-xs text-slate-500 outline-none cursor-text"
            >
                {subtitle}
            </div>
        </div>
    );
};

export default SectionBlock;
