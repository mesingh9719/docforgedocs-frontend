import React from 'react';

const SpacerBlock = ({ data = {}, onChange }) => {
    const height = data.height || 32; // default 32px

    return (
        <div
            className="w-full relative group/spacer flex items-center justify-center transition-all"
            style={{ height: `${height}px` }}
        >
            <div className="w-full border-t border-dashed border-slate-200 opacity-0 group-hover/spacer:opacity-100 flex items-center justify-center transition-opacity">
                <span className="bg-slate-100 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded -mt-2.5">
                    Spacer: {height}px
                </span>
            </div>
        </div>
    );
};

export default SpacerBlock;
