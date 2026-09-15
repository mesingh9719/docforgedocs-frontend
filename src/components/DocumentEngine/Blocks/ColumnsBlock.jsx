import React from 'react';
import { resolveVariables } from '../../../utils/variableResolver';

const ColumnsBlock = ({ data = {}, onChange, readOnly = false, resolvedContext = null }) => {
    const rawLeftText = data.leftText || 'Left Column Content\nEnter details, addresses, or bullet points here.';
    const rawRightText = data.rightText || 'Right Column Content\nEnter dates, terms, or additional info here.';
    const rawLeftTitle = data.leftTitle || 'Details Left';
    const rawRightTitle = data.rightTitle || 'Details Right';

    const leftTitle = resolvedContext ? resolveVariables(rawLeftTitle, resolvedContext) : rawLeftTitle;
    const rightTitle = resolvedContext ? resolveVariables(rawRightTitle, resolvedContext) : rawRightTitle;
    const leftText = resolvedContext ? resolveVariables(rawLeftText, resolvedContext) : rawLeftText;
    const rightText = resolvedContext ? resolveVariables(rawRightText, resolvedContext) : rawRightText;

    const handleLeftTitle = (e) => !readOnly && onChange && onChange({ ...data, leftTitle: e.target.innerText });
    const handleRightTitle = (e) => !readOnly && onChange && onChange({ ...data, rightTitle: e.target.innerText });
    const handleLeftText = (e) => !readOnly && onChange && onChange({ ...data, leftText: e.target.innerText });
    const handleRightText = (e) => !readOnly && onChange && onChange({ ...data, rightText: e.target.innerText });

    return (
        <div className="w-full my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/30">
                <div
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={handleLeftTitle}
                    className="font-bold text-xs uppercase tracking-wider text-slate-700 outline-none mb-1.5"
                >
                    {leftTitle}
                </div>
                <div
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={handleLeftText}
                    className="text-xs text-slate-600 leading-relaxed outline-none min-h-[40px] whitespace-pre-line"
                >
                    {leftText}
                </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/30">
                <div
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={handleRightTitle}
                    className="font-bold text-xs uppercase tracking-wider text-slate-700 outline-none mb-1.5"
                >
                    {rightTitle}
                </div>
                <div
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={handleRightText}
                    className="text-xs text-slate-600 leading-relaxed outline-none min-h-[40px] whitespace-pre-line"
                >
                    {rightText}
                </div>
            </div>
        </div>
    );
};

export default ColumnsBlock;
