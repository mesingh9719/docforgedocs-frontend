import React from 'react';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

// Block Components
import TextBlock from './Blocks/TextBlock';
import HeadingBlock from './Blocks/HeadingBlock';
import ImageBlock from './Blocks/ImageBlock';
import SignatureBlock from './Blocks/SignatureBlock';
import LogoBlock from './Blocks/LogoBlock'; // [NEW]
import BusinessInfoBlock from './Blocks/BusinessInfoBlock'; // [NEW]

const BlockWrapper = ({ block, actions, businessData, isSelected, onSelect }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const renderBlockContent = () => {
        switch (block.type) {
            case 'HEADING':
                return <HeadingBlock data={block.data} onChange={(d) => actions.updateBlock(block.id, d)} />;
            case 'TEXT':
                return <TextBlock data={block.data} onChange={(d) => actions.updateBlock(block.id, d)} />;
            case 'IMAGE':
                return <ImageBlock data={block.data} onChange={(d) => actions.updateBlock(block.id, d)} />;
            case 'SIGNATURE':
                return <SignatureBlock data={block.data} onChange={(d) => actions.updateBlock(block.id, d)} />;
            case 'LOGO':
                return <LogoBlock data={block.data} onChange={(d) => actions.updateBlock(block.id, d)} businessData={businessData} />;
            case 'BUSINESS_INFO':
                return <BusinessInfoBlock data={block.data} onChange={(d) => actions.updateBlock(block.id, d)} businessData={businessData} />;
            default:
                return <div className="p-4 text-red-500">Unknown Block Type: {block.type}</div>;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative flex items-start -ml-12 mb-2"
        >
            {/* Hover Controls */}
            <div className="w-10 h-full flex flex-col items-center pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded"
                >
                    <GripVertical size={16} />
                </button>

                {/* Delete */}
                <button
                    onClick={() => actions.removeBlock(block.id)}
                    className="p-1 mt-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Content Area */}
            <div
                className={`flex-1 min-h-[40px] border rounded-md transition-colors cursor-pointer ${isSelected ? 'border-2 border-indigo-500 ring-2 ring-indigo-50/50' : 'border-transparent group-hover:border-slate-100'}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(block.id);
                }}
            >
                {renderBlockContent()}
            </div>
        </div>
    );
};

const Canvas = ({ blocks, actions, readOnly, businessData, selectedBlockId, onSelectBlock }) => {
    return (
        <div
            className="w-full max-w-[850px] min-h-[1100px] bg-white shadow-sm border border-slate-200 lg:scale-[1] origin-top p-12 lg:p-16"
            id="document-canvas"
        >
            {blocks.length === 0 && (
                <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                    <p className="mb-2 font-medium">Empty Document</p>
                    <p className="text-sm">Drag blocks from the sidebar to start building.</p>
                </div>
            )}

            <SortableContext
                items={blocks.map(b => b.id)}
                strategy={verticalListSortingStrategy}
            >
                {blocks.map((block) => (
                    <BlockWrapper
                        key={block.id}
                        block={block}
                        actions={actions}
                        businessData={businessData}
                        isSelected={selectedBlockId === block.id}
                        onSelect={onSelectBlock}
                    />
                ))}
            </SortableContext>
        </div>
    );
};

export default Canvas;
