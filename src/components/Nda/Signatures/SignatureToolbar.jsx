import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { PenTool, Calendar, Stamp, Type, User, CheckSquare } from 'lucide-react';

const DraggableToolbarItem = ({ type, icon: Icon, label }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `toolbar-${type}`,
        data: { type: 'toolbar-item', fieldType: type }
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
                flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white 
                cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow-sm transition-all
                ${isDragging ? 'opacity-50 border-indigo-500 ring-2 ring-indigo-500/20' : ''}
            `}
            style={{ touchAction: 'none' }}
        >
            <div className={`p-2 rounded-md ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                <Icon size={18} />
            </div>
            <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
    );
};

const SignatureToolbar = () => {
    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Signature Tools</h3>

            <DraggableToolbarItem
                type="signature"
                icon={PenTool}
                label="Signature Field"
            />
            <DraggableToolbarItem
                type="initials"
                icon={User}
                label="Initials"
            />

            <DraggableToolbarItem
                type="date"
                icon={Calendar}
                label="Date Signed"
            />

            <DraggableToolbarItem
                type="text"
                icon={Type}
                label="Text Box"
            />

            <DraggableToolbarItem
                type="checkbox"
                icon={CheckSquare}
                label="Checkbox"
            />

            <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-xs text-indigo-700 border border-indigo-100">
                <p>Drag fields onto the document to request information.</p>
            </div>
        </div>
    );
};

export default SignatureToolbar;
