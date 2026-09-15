import React from 'react';

const DividerBlock = ({ data = {}, onChange }) => {
    const style = data.style || 'solid'; // solid, dashed, dotted
    const thickness = data.thickness || 1; // px
    const color = data.color || '#e2e8f0'; // slate-200
    const marginY = data.marginY || 24; // px

    return (
        <div
            className="w-full py-1 group/divider cursor-pointer"
            style={{ marginTop: `${marginY / 2}px`, marginBottom: `${marginY / 2}px` }}
        >
            <hr
                style={{
                    borderTopWidth: `${thickness}px`,
                    borderTopStyle: style,
                    borderTopColor: color,
                    borderBottom: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                }}
                className="transition-colors group-hover/divider:border-indigo-400"
            />
        </div>
    );
};

export default DividerBlock;
