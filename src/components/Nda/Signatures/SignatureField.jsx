import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, PenTool } from 'lucide-react';

const SignatureField = ({ id, data, left, top, onEdit, onDelete, isSelected }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { ...data, type: 'signature-field', id } // ensure type is distinguishing
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        left: `${left}px`, // Absolute positioning based on parent container
        top: `${top}px`,
        position: 'absolute',
        zIndex: isDragging ? 999 : (isSelected ? 50 : 10),
        touchAction: 'none'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                group flex flex-col w-64 bg-white/90 backdrop-blur-sm 
                border-2 rounded-lg shadow-sm transition-colors
                ${isSelected ? 'border-indigo-500 shadow-indigo-100 ring-2 ring-indigo-500/20' : 'border-indigo-200 hover:border-indigo-400'}
                ${isDragging ? 'opacity-0' : ''}
            `}
            // We apply listeners to the handle to allow drag, or whole box? 
            // Usually whole box is easier for broad movements, but let's put handle for clarity
            {...listeners}
            {...attributes}
            onClick={(e) => {
                e.stopPropagation();
                onEdit();
            }}
        >
            {/* Header / Drag Handle */}
            <div className="flex items-center justify-between p-1.5 border-b border-indigo-100 bg-indigo-50/50 rounded-t-md">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                    <GripVertical size={14} className="cursor-grab active:cursor-grabbing opacity-50" />
                    <span className="truncate max-w-[120px]">{data.signeeName || "Signature"}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className="p-1 hover:bg-white rounded text-indigo-600 transition-colors"
                        title="Edit"
                    >
                        <Edit2 size={12} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-1 hover:bg-white rounded text-red-500 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>

            {/* Visual Body */}
            <div className="p-3 py-5 bg-white cursor-pointer rounded-b-md flex items-center justify-center gap-2 text-indigo-200">
                <PenTool size={32} strokeWidth={1.5} />
                <div className="border-b-2 border-indigo-100 w-full absolute bottom-4 left-4 right-4"></div>
            </div>

            {/* Order Badge */}
            {data.order && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm border border-white">
                    {data.order}
                </div>
            )}
        </div>
    );
};

export default SignatureField;
