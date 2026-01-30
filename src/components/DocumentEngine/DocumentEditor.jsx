import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Eye, Settings, Plus } from 'lucide-react';
import { DndContext, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDocumentEngine } from '../../hooks/useDocumentEngine';

// Placeholder Components (will implementation next)
import { getBusiness } from '../../api/business'; // [NEW] API 
import Canvas from './Canvas';
import Toolbox from './Sidebar/Toolbox';
import ConfigurationPanel from './Sidebar/ConfigurationPanel';
import VariableManager from './Sidebar/VariableManager';

const DocumentEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Core Engine State
    const { documentState, actions } = useDocumentEngine();
    const [activeTab, setActiveTab] = React.useState('edit'); // 'edit', 'preview'
    const [isSaving, setIsSaving] = React.useState(false);
    const [businessData, setBusinessData] = React.useState(null); // [NEW] Business Context

    // Fetch Business Data on Mount
    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const data = await getBusiness();
                setBusinessData(data);

                // Optional: Auto-hydrate variables if new doc
                if (documentState.variables && Object.keys(documentState.variables).length === 0) {
                    actions.addVariable('client_name', { value: '', type: 'text', label: 'Client Name' });
                    actions.addVariable('date', { value: new Date().toLocaleDateString(), type: 'date', label: 'Date' });
                }
            } catch (err) {
                console.error("Failed to load business context", err);
            }
        };
        fetchBusiness();
    }, []);

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    // Handlers
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        // If dropping a Sidebar Tool onto the Canvas
        if (active.data.current?.type === 'TOOL') {
            // Logic to add new block at position
            // For now, simple append
            actions.addBlock(active.data.current.toolType);
            return;
        }

        // If reordering blocks
        if (active.id !== over.id) {
            const oldIndex = documentState.blocks.findIndex((b) => b.id === active.id);
            const newIndex = documentState.blocks.findIndex((b) => b.id === over.id);

            const newBlocks = arrayMove(documentState.blocks, oldIndex, newIndex);
            actions.reorderBlocks(newBlocks);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/documents')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                            <ArrowLeft size={20} />
                        </button>
                        <input
                            type="text"
                            value={documentState.metadata.title}
                            onChange={(e) => actions.setMetadata({ title: e.target.value })}
                            className="text-lg font-bold text-slate-800 border-none focus:ring-0 bg-transparent p-0 placeholder-slate-400"
                            placeholder="Untitled Document"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">
                            <Eye size={18} /> Preview
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm">
                            <Save size={18} /> Save
                        </button>
                    </div>
                </header>

                {/* Main Workspace */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar: Toolbox & Variables */}
                    <div className="w-[300px] bg-white border-r border-slate-200 flex flex-col z-20">
                        <Toolbox />
                        <div className="h-px bg-slate-200 my-2" />
                        <VariableManager variables={documentState.variables} onAdd={actions.addVariable} />
                    </div>

                    {/* Center: Canvas */}
                    <div className="flex-1 bg-slate-100 overflow-y-auto p-8 flex justify-center">
                        <Canvas
                            blocks={documentState.blocks}
                            actions={actions}
                            readOnly={false}
                            businessData={businessData}
                            selectedBlockId={documentState.selectedBlockId} // [NEW] 
                            onSelectBlock={actions.selectBlock} // [NEW]
                        />
                    </div>

                    {/* Right Sidebar: Configuration (Context Aware) */}
                    <div className="w-[280px] bg-white border-l border-slate-200 z-20">
                        <ConfigurationPanel
                            selectedBlock={documentState.blocks.find(b => b.id === documentState.selectedBlockId)} // [NEW] Pass actual block object
                            updateBlock={actions.updateBlock}
                            removeBlock={actions.removeBlock}
                        />
                    </div>
                </div>
            </div>
        </DndContext>
    );
};

export default DocumentEditor;
