import React from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * Component to display a signed signature field value
 * Used in public signing view to show signatures after they've been added
 * 
 * IMPORTANT: Coordinates are stored as percentages (0-100) relative to PDF page size
 */
const SignedFieldDisplay = ({ field, onClick, pageWidth, pageHeight }) => {
    const { metadata, position, size } = field;
    const { value, signeeName, isMine } = metadata || {};

    // Use percentages for positioning to match Creator View behavior
    // This allows the browser to handle scaling relative to the container width/height
    const leftStyle = `${position.x}%`;
    const topStyle = `${position.y}%`;

    // Use default pixel values if page dimensions not available
    const widthPx = size?.width || 200;
    const heightPx = size?.height || 50;

    const handleClick = (e) => {
        e.stopPropagation();
        console.log('Signature field clicked:', field.id, {
            isMine,
            hasValue: !!value,
            position: `${position.x}%, ${position.y}%`,
            style: `${leftStyle}, ${topStyle}`
        });

        if (onClick) {
            onClick(field);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`absolute border rounded-lg flex items-center justify-center text-center overflow-hidden transition-all shadow-sm ${isMine && !value ? 'cursor-pointer animate-pulse-subtle bg-indigo-50/90 border-indigo-400 active:scale-95' : 'cursor-default'
                } ${value
                    ? 'border-emerald-500 bg-emerald-50/90'
                    : isMine
                        ? 'hover:bg-indigo-100 hover:border-indigo-500 hover:shadow-md'
                        : 'border-slate-300 bg-slate-50/50'
                }`}
            style={{
                left: leftStyle,
                top: topStyle,
                width: `${widthPx}px`,
                height: `${heightPx}px`,
                zIndex: 10,
                // Ensure minimum touch target size visually or via padding if possible, 
                // but positioning is strict PDF coordinates. 
                // We rely on the visual cue being strong.
            }}
        >
            {value ? (
                // Show the actual signature
                <div className="w-full h-full flex items-center justify-center p-2">
                    {metadata.fieldType === 'checkbox' ? (
                        <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors ${value === 'true' ? 'bg-indigo-600 border-indigo-600' : 'border-slate-400 bg-white'}`}>
                            {value === 'true' && <CheckCircle size={16} className="text-white" />}
                        </div>
                    ) : value.startsWith('data:image') ? (
                        <img
                            src={value}
                            alt="Signature"
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <span className={`${metadata.fieldType === 'text' || metadata.fieldType === 'date' ? 'font-sans text-sm font-medium' : 'font-handwriting text-xl'} text-slate-700`}>
                            {value}
                        </span>
                    )}
                    {isMine && (
                        <CheckCircle size={16} className="absolute top-1 right-1 text-emerald-600" />
                    )}
                </div>
            ) : (
                // Show placeholder if not signed yet
                <div className="flex flex-col items-center justify-center h-full w-full">
                    {isMine ? (
                        <div className="flex items-center gap-1.5 px-2">
                            {/* Icon based on type */}
                            {metadata.fieldType === 'checkbox' ? (
                                <span className="text-indigo-600 font-bold text-xs uppercase">Tap to Toggle</span>
                            ) : (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    <span className="text-xs md:text-sm font-bold text-indigo-700 truncate">
                                        {metadata.label || (metadata.fieldType === 'date' ? 'Insert Date' : 'Tap to Sign')}
                                    </span>
                                </>
                            )}
                        </div>
                    ) : (
                        <span className="text-xs text-slate-400 font-medium italic px-1 truncate">{signeeName || 'Pending'}</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default SignedFieldDisplay;
