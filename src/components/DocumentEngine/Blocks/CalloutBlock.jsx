import React from 'react';
import { Info, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { resolveVariables } from '../../../utils/variableResolver';

const THEMES = {
    info: {
        bg: 'bg-blue-50/70 border-blue-200 text-blue-950',
        iconBg: 'bg-blue-100 text-blue-600',
        Icon: Info,
    },
    warning: {
        bg: 'bg-amber-50/70 border-amber-200 text-amber-950',
        iconBg: 'bg-amber-100 text-amber-600',
        Icon: AlertTriangle,
    },
    success: {
        bg: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
        iconBg: 'bg-emerald-100 text-emerald-600',
        Icon: CheckCircle,
    },
    note: {
        bg: 'bg-indigo-50/70 border-indigo-200 text-indigo-950',
        iconBg: 'bg-indigo-100 text-indigo-600',
        Icon: HelpCircle,
    },
};

const CalloutBlock = ({ data = {}, onChange, readOnly = false, resolvedContext = null }) => {
    const themeKey = data.theme || 'info';
    const theme = THEMES[themeKey] || THEMES.info;
    const IconComponent = theme.Icon;

    const rawTitle = data.title || 'Important Note';
    const rawText = data.text || 'Please review the terms and conditions outlined in this section before proceeding.';

    const displayTitle = resolvedContext ? resolveVariables(rawTitle, resolvedContext) : rawTitle;
    const displayText = resolvedContext ? resolveVariables(rawText, resolvedContext) : rawText;

    const handleTitleChange = (e) => {
        if (!readOnly && onChange) {
            onChange({ ...data, title: e.target.innerText });
        }
    };

    const handleTextChange = (e) => {
        if (!readOnly && onChange) {
            onChange({ ...data, text: e.target.innerText });
        }
    };

    return (
        <div className={`my-4 p-4 rounded-xl border flex items-start gap-3.5 transition-all ${theme.bg}`}>
            <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${theme.iconBg}`}>
                <IconComponent size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <div
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={handleTitleChange}
                    className="font-semibold text-sm outline-none mb-1 cursor-text"
                >
                    {displayTitle}
                </div>
                <div
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={handleTextChange}
                    className="text-xs leading-relaxed opacity-90 outline-none cursor-text"
                >
                    {displayText}
                </div>
            </div>
        </div>
    );
};

export default CalloutBlock;
