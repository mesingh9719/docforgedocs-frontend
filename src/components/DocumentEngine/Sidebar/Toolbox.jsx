import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Type, Heading, Image, PenTool, Columns, Building2, Stamp } from 'lucide-react';

const ToolItem = ({ type, icon: Icon, label }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `tool-${type}`,
        data: {
            type: 'TOOL',
            toolType: type
        }
    });

    return (
        <button
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-grab active:cursor-grabbing text-left ${isDragging ? 'opacity-50' : ''}`}
        >
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                <Icon size={20} />
            </div>
            <span className="text-sm font-medium text-slate-700">{label}</span>
        </button>
    );
};

const Toolbox = () => {
    return (
        <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Content Blocks</h3>

            <div className="space-y-2">
                <ToolItem type="HEADING" icon={Heading} label="Heading" />
                <ToolItem type="TEXT" icon={Type} label="Text Paragraph" />
                <ToolItem type="IMAGE" icon={Image} label="Image" />
                <ToolItem type="LOGO" icon={Stamp} label="Smart Logo" /> {/* [NEW] */}
                <ToolItem type="BUSINESS_INFO" icon={Building2} label="Business Details" /> {/* [NEW] */}
                <ToolItem type="SIGNATURE" icon={PenTool} label="Signature Field" />
            </div>

            <div className="h-px bg-slate-100 my-6" />

            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Layout</h3>
            <div className="space-y-2">
                <div className="opacity-50 pointer-events-none" title="Coming Soon">
                    <ToolItem type="COLUMNS" icon={Columns} label="Columns (Soon)" />
                </div>
            </div>
        </div>
    );
};

export default Toolbox;
