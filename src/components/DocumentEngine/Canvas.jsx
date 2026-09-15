import React from 'react';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical,
    Trash2,
    Copy,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';

// Block Components
import TextBlock from './Blocks/TextBlock';
import HeadingBlock from './Blocks/HeadingBlock';
import ImageBlock from './Blocks/ImageBlock';
import SignatureBlock from './Blocks/SignatureBlock';
import LogoBlock from './Blocks/LogoBlock';
import BusinessInfoBlock from './Blocks/BusinessInfoBlock';
import ClientInfoBlock from './Blocks/ClientInfoBlock';
import DynamicTableBlock from './Blocks/DynamicTableBlock';
import CalloutBlock from './Blocks/CalloutBlock';
import DividerBlock from './Blocks/DividerBlock';
import SpacerBlock from './Blocks/SpacerBlock';
import TotalsBlock from './Blocks/TotalsBlock';
import SectionBlock from './Blocks/SectionBlock';
import ColumnsBlock from './Blocks/ColumnsBlock';

const BlockWrapper = ({
    block,
    actions,
    businessData,
    isSelected,
    onSelect,
    isFirst,
    isLast,
    readOnly,
    resolvedContext,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id, disabled: readOnly });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const normalizedType = (block.type || '').toUpperCase().replace(/-/g, '_');

    const renderBlockContent = () => {
        const blockData = block.data || block.content || {};
        const handleUpdate = (updatedData) => {
            actions.updateBlock(block.id, updatedData);
        };

        switch (normalizedType) {
            case 'HEADING':
                return <HeadingBlock data={blockData} onChange={handleUpdate} readOnly={readOnly} resolvedContext={resolvedContext} />;
            case 'TEXT':
            case 'PARAGRAPH':
            case 'RICH_TEXT':
                return <TextBlock data={blockData} onChange={handleUpdate} readOnly={readOnly} resolvedContext={resolvedContext} />;
            case 'IMAGE':
                return <ImageBlock data={blockData} onChange={handleUpdate} readOnly={readOnly} />;
            case 'SIGNATURE':
                return <SignatureBlock data={blockData} onChange={handleUpdate} readOnly={readOnly} />;
            case 'LOGO':
                return <LogoBlock data={blockData} onChange={handleUpdate} businessData={businessData} readOnly={readOnly} />;
            case 'BUSINESS_INFO':
            case 'COMPANY_INFORMATION':
                return <BusinessInfoBlock data={blockData} onChange={handleUpdate} businessData={businessData} readOnly={readOnly} />;
            case 'CLIENT_INFO':
            case 'CUSTOMER_INFORMATION':
                return <ClientInfoBlock data={blockData} onChange={handleUpdate} readOnly={readOnly} resolvedContext={resolvedContext} />;
            case 'DYNAMIC_TABLE':
            case 'TABLE':
            case 'LINE_ITEMS':
                return <DynamicTableBlock data={blockData} onChange={handleUpdate} readOnly={readOnly} resolvedContext={resolvedContext} />;
            case 'CALLOUT':
                return <CalloutBlock data={blockData} onChange={handleUpdate} readOnly={readOnly} resolvedContext={resolvedContext} />;
            case 'DIVIDER':
                return <DividerBlock data={blockData} onChange={handleUpdate} readOnly={readOnly} />;
            case 'SPACER':
                return <SpacerBlock data={blockData} onChange={handleUpdate} readOnly={readOnly} />;
            case 'TOTALS':
            case 'TAX_SUMMARY':
                return <TotalsBlock data={blockData} onChange={handleUpdate} readOnly={readOnly} resolvedContext={resolvedContext} />;
            case 'SECTION':
                return <SectionBlock data={blockData} onChange={handleUpdate} readOnly={readOnly} resolvedContext={resolvedContext} />;
            case 'COLUMNS':
            case 'GRID':
                return <ColumnsBlock data={blockData} onChange={handleUpdate} readOnly={readOnly} resolvedContext={resolvedContext} />;
            default:
                return (
                    <div className="p-3 bg-amber-50/70 border border-amber-200 text-amber-800 rounded-lg text-xs font-mono">
                        Unknown Block: <span className="font-bold">{block.type}</span>
                    </div>
                );
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative flex items-start -ml-12 mb-2.5 transition-all ${
                isSelected ? 'z-10' : ''
            }`}
        >
            {/* Action Bar (Drag, Move Up/Down, Duplicate, Delete) */}
            {!readOnly && (
                <div
                    className={`w-10 h-full flex flex-col items-center pt-0.5 transition-opacity duration-150 ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                >
                    {/* Drag Handle */}
                    <button
                        {...attributes}
                        {...listeners}
                        type="button"
                        title="Drag to reorder"
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded transition"
                    >
                        <GripVertical size={15} />
                    </button>

                    {/* Move Up */}
                    {!isFirst && actions.moveBlock && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                actions.moveBlock(block.id, 'up');
                            }}
                            title="Move Up"
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                        >
                            <ChevronUp size={13} />
                        </button>
                    )}

                    {/* Move Down */}
                    {!isLast && actions.moveBlock && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                actions.moveBlock(block.id, 'down');
                            }}
                            title="Move Down"
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                        >
                            <ChevronDown size={13} />
                        </button>
                    )}

                    {/* Duplicate */}
                    {actions.duplicateBlock && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                actions.duplicateBlock(block.id);
                            }}
                            title="Duplicate block"
                            className="p-1 mt-0.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                        >
                            <Copy size={13} />
                        </button>
                    )}

                    {/* Delete */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            actions.removeBlock(block.id);
                        }}
                        title="Delete block"
                        className="p-1 mt-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            )}

            {/* Block Content Canvas Item */}
            <div
                className={`flex-1 min-h-[44px] rounded-lg transition-all cursor-pointer ${
                    isSelected
                        ? 'border-2 border-indigo-500 ring-4 ring-indigo-50/80 shadow-sm'
                        : 'border border-transparent hover:border-slate-200'
                }`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onSelect) onSelect(block.id);
                }}
            >
                {renderBlockContent()}
            </div>
        </div>
    );
};

const Canvas = ({
    blocks = [],
    actions = {},
    readOnly = false,
    businessData = null,
    selectedBlockId = null,
    onSelectBlock = () => {},
    pageSettings = {},
    resolvedContext = null,
}) => {
    const size = pageSettings.size || 'A4';
    const orientation = pageSettings.orientation || 'portrait';
    const backgroundColor = pageSettings.backgroundColor || '#ffffff';
    const fontFamily = pageSettings.fontFamily || 'Inter, sans-serif';

    // Size styling
    const sizeClasses = orientation === 'landscape'
        ? 'max-w-[1120px] min-h-[792px]'
        : 'max-w-[850px] min-h-[1100px]';

    return (
        <div
            className={`w-full ${sizeClasses} shadow-md border border-slate-200/80 rounded-sm origin-top p-10 lg:p-14 transition-all`}
            style={{
                backgroundColor,
                fontFamily,
            }}
            id="document-canvas"
            onClick={() => {
                if (onSelectBlock) onSelectBlock(null);
            }}
        >
            {blocks.length === 0 && (
                <div className="text-center py-24 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/40">
                    <p className="mb-2 font-semibold text-slate-600">Canvas is Empty</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Click or drag components from the library on the left to start assembling your template.
                    </p>
                </div>
            )}

            <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
            >
                {blocks.map((block, idx) => (
                    <BlockWrapper
                        key={block.id}
                        block={block}
                        actions={actions}
                        businessData={businessData}
                        isSelected={selectedBlockId === block.id}
                        onSelect={onSelectBlock}
                        isFirst={idx === 0}
                        isLast={idx === blocks.length - 1}
                        readOnly={readOnly}
                        resolvedContext={resolvedContext}
                    />
                ))}
            </SortableContext>
        </div>
    );
};

export default Canvas;
