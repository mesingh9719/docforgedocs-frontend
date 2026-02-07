import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, PenTool, Calendar, Type, User, CheckSquare } from 'lucide-react';

// Non-hook visual component for DragOverlay
export const SignatureFieldVisual = ({ style, data, isSelected, isDragging, onEdit, onDelete, listeners, attributes, setNodeRef, readOnly = false }) => {
    const getFieldDetails = () => {
        switch (data.fieldType) {
            case 'date': return { icon: Calendar, label: 'Date' };
            case 'text': return { icon: Type, label: 'Text' };
            case 'initials': return { icon: User, label: 'Initials' };
            case 'checkbox': return { icon: CheckSquare, label: 'Check' };
            default: return { icon: PenTool, label: 'Signature' };
        }
    };

    const { icon: FieldIcon, label: FieldLabel } = getFieldDetails();

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                group flex items-center gap-2 bg-white/95 backdrop-blur-md 
                border shadow-sm transition-all duration-200 py-1.5 px-3 rounded-full
                ${isSelected && !readOnly ? 'border-indigo-500 shadow-indigo-100 ring-2 ring-indigo-500/20' : 'border-slate-300'}
                ${!readOnly ? 'hover:border-indigo-400 hover:shadow-md cursor-grab' : 'cursor-default'}
                ${isDragging ? 'opacity-50 cursor-grabbing' : ''}
                w-auto min-w-[120px] max-w-[240px] select-none
            `}
            {...listeners}
            {...attributes}
            onClick={(e) => {
                if (readOnly) return;
                e.preventDefault();
                e.stopPropagation();
                onEdit && onEdit();
            }}
        >
            {/* Drag Handle Indicator - Hidden in ReadOnly */}
            {!readOnly && (
                <div className={`text-slate-400 ${isSelected ? 'text-indigo-400' : ''}`}>
                    <GripVertical size={14} />
                </div>
            )}

            {/* Field Type Icon */}
            <div className={`text-slate-400 ${isSelected ? 'text-indigo-500' : ''}`}>
                <FieldIcon size={14} />
            </div>

            {/* Name & Type */}
            <div className="flex flex-col leading-none">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected && !readOnly ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {FieldLabel}
                </span>
                <span className={`text-xs font-semibold truncate select-none ${isSelected && !readOnly ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {data.signeeName || "Signer"}
                </span>
            </div>

            {/* Divider & Actions - Hidden in ReadOnly */}
            {!readOnly && (
                <>
                    <div className="w-px h-3 bg-slate-200 mx-0.5" />
                    <div className="flex items-center gap-0.5 relative z-20">
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onEdit && onEdit();
                            }}
                            className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                            <Edit2 size={12} />
                        </button>
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onDelete && onDelete();
                            }}
                            className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </>
            )}

            {/* Order Badge - Always Visible */}
            {data.order && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm border border-white z-10 pointer-events-none">
                    {data.order}
                </div>
            )}
        </div>
    );
};

const SignatureField = ({ id, data, left, top, onEdit, onDelete, isSelected, readOnly = false }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { ...data, type: 'signature-field', id }, // ensure type is distinguishing
        disabled: readOnly
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        left: `${left}%`, // Percentage positioning relative to PDF page
        top: `${top}%`,
        position: 'absolute',
        zIndex: isDragging ? 999 : (isSelected ? 50 : 10),
        touchAction: 'none'
    };

    return (
        <SignatureFieldVisual
            style={style}
            data={data}
            isSelected={isSelected}
            isDragging={isDragging}
            onEdit={onEdit}
            onDelete={onDelete}
            listeners={listeners}
            attributes={attributes}
            setNodeRef={setNodeRef}
            readOnly={readOnly}
        />
    );
};

export default SignatureField;
