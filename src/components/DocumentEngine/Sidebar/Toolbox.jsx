import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import {
    Type,
    Heading,
    Image,
    PenTool,
    Columns,
    Building2,
    Stamp,
    Table,
    AlertCircle,
    Minus,
    Maximize2,
    Calculator,
    UserCheck,
    Layout,
    Plus,
} from 'lucide-react';

const ToolItem = ({ type, icon: Icon, label, description, onAdd }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `tool-${type}`,
        data: {
            type: 'TOOL',
            toolType: type,
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={() => onAdd && onAdd(type)}
            className={`group w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/80 hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing text-left shadow-xs ${
                isDragging ? 'opacity-40 ring-2 ring-indigo-400' : ''
            }`}
        >
            <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-slate-100 group-hover:bg-indigo-50 text-slate-600 group-hover:text-indigo-600 rounded-lg transition-colors shrink-0">
                    <Icon size={16} />
                </div>
                <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-800 block truncate">{label}</span>
                    {description && (
                        <span className="text-[10px] text-slate-400 block truncate">{description}</span>
                    )}
                </div>
            </div>

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    if (onAdd) onAdd(type);
                }}
                title="Add block"
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
            >
                <Plus size={14} />
            </button>
        </div>
    );
};

const Toolbox = ({ onAddBlock }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Content Blocks */}
            <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
                    Content
                </h3>
                <div className="space-y-1.5">
                    <ToolItem
                        type="HEADING"
                        icon={Heading}
                        label="Heading"
                        description="H1, H2, H3 titles"
                        onAdd={onAddBlock}
                    />
                    <ToolItem
                        type="TEXT"
                        icon={Type}
                        label="Paragraph Text"
                        description="Body copy & descriptions"
                        onAdd={onAddBlock}
                    />
                    <ToolItem
                        type="CALLOUT"
                        icon={AlertCircle}
                        label="Callout Box"
                        description="Notes, warnings & alerts"
                        onAdd={onAddBlock}
                    />
                    <ToolItem
                        type="DIVIDER"
                        icon={Minus}
                        label="Divider Line"
                        description="Horizontal separator"
                        onAdd={onAddBlock}
                    />
                    <ToolItem
                        type="SPACER"
                        icon={Maximize2}
                        label="Vertical Spacer"
                        description="Whitespace padding"
                        onAdd={onAddBlock}
                    />
                </div>
            </div>

            {/* Business & Parties */}
            <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
                    Business & Parties
                </h3>
                <div className="space-y-1.5">
                    <ToolItem
                        type="LOGO"
                        icon={Stamp}
                        label="Brand Logo"
                        description="Company brand mark"
                        onAdd={onAddBlock}
                    />
                    <ToolItem
                        type="BUSINESS_INFO"
                        icon={Building2}
                        label="Company Details"
                        description="Sender name, address & tax"
                        onAdd={onAddBlock}
                    />
                    <ToolItem
                        type="CLIENT_INFO"
                        icon={UserCheck}
                        label="Recipient Details"
                        description="Client name, email & address"
                        onAdd={onAddBlock}
                    />
                </div>
            </div>

            {/* Data & Financial */}
            <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
                    Data & Financial
                </h3>
                <div className="space-y-1.5">
                    <ToolItem
                        type="DYNAMIC_TABLE"
                        icon={Table}
                        label="Dynamic Table"
                        description="Line items with live math"
                        onAdd={onAddBlock}
                    />
                    <ToolItem
                        type="TOTALS"
                        icon={Calculator}
                        label="Totals & Terms"
                        description="Subtotal, tax & payment notes"
                        onAdd={onAddBlock}
                    />
                    <ToolItem
                        type="SIGNATURE"
                        icon={PenTool}
                        label="Signature Block"
                        description="E-signature signer slot"
                        onAdd={onAddBlock}
                    />
                </div>
            </div>

            {/* Layout */}
            <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
                    Layout
                </h3>
                <div className="space-y-1.5">
                    <ToolItem
                        type="COLUMNS"
                        icon={Columns}
                        label="Dual Columns"
                        description="2-column side by side"
                        onAdd={onAddBlock}
                    />
                    <ToolItem
                        type="SECTION"
                        icon={Layout}
                        label="Section Container"
                        description="Boxed section panel"
                        onAdd={onAddBlock}
                    />
                </div>
            </div>
        </div>
    );
};

export default Toolbox;
