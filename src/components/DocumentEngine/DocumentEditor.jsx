import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Eye, Settings, Plus } from 'lucide-react';
import { DndContext, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDocumentEngine } from '../../hooks/useDocumentEngine';

// Imports
import { getBusiness } from '../../api/business';
import { getDocument, updateDocument } from '../../api/documents'; // Added updateDocument for saving
import Canvas from './Canvas';
import Toolbox from './Sidebar/Toolbox';
import ConfigurationPanel from './Sidebar/ConfigurationPanel';
import VariableManager from './Sidebar/VariableManager';
import toast from 'react-hot-toast';

const DocumentEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Core Engine State
    const { documentState, actions } = useDocumentEngine();
    const [activeTab, setActiveTab] = React.useState('edit'); // 'edit', 'preview'
    const [isSaving, setIsSaving] = React.useState(false);
    const [businessData, setBusinessData] = React.useState(null);

    // Fetch Business Data and Document on Mount
    useEffect(() => {
        const init = async () => {
            try {
                // 1. Load Business Context
                const business = await getBusiness();
                setBusinessData(business);

                // 2. Load Document if ID exists
                if (id) {
                    const doc = await getDocument(id);
                    // Parse content if string
                    let content = doc.data.content;
                    if (typeof content === 'string') {
                        try { content = JSON.parse(content); } catch (e) { }
                    }

                    // Load into Engine
                    if (content && content.blocks) {
                        actions.loadDocument({
                            blocks: content.blocks,
                            variables: content.variables || {},
                            metadata: content.metadata || { title: doc.data.name },
                            history: { past: [], future: [] }
                        });
                        // Also ensure metadata title matches doc name
                        actions.setMetadata({ title: doc.data.name });
                    } else {
                        // Fallback or Handle Legacy
                        actions.setMetadata({ title: doc.data.name });
                    }
                } else {
                    // New Doc defaults
                    if (documentState.variables && Object.keys(documentState.variables).length === 0) {
                        actions.addVariable('client_name', { value: '', type: 'text', label: 'Client Name' });
                        actions.addVariable('date', { value: new Date().toLocaleDateString(), type: 'date', label: 'Date' });
                    }
                }
            } catch (err) {
                console.error("Failed to load context", err);
                toast.error("Failed to load document");
            }
        };
        init();
    }, [id]);

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

    const handleSave = async () => {
        if (!id) return;
        setIsSaving(true);
        try {
            const finalContent = {
                blocks: documentState.blocks,
                variables: documentState.variables,
                metadata: documentState.metadata
            };

            const payload = {
                name: documentState.metadata.title,
                content: JSON.stringify(finalContent),
                // We preserve other fields if needed, but update helper might handle partials
                // DocumentController update method expects: name, content, description, status
            };

            await updateDocument(id, payload);
            toast.success("Document saved successfully");
        } catch (error) {
            console.error("Save failed", error);
            toast.error("Failed to save changes");
        } finally {
            setIsSaving(false);
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
                            className="text-lg font-bold text-slate-800 border-none focus:ring-0 bg-transparent p-0 placeholder-slate-400 focus:outline-none"
                            placeholder="Untitled Document"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">
                            <Eye size={18} /> Preview
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {isSaving ? 'Saving...' : 'Save'}
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
                            selectedBlockId={documentState.selectedBlockId}
                            onSelectBlock={actions.selectBlock}
                        />
                    </div>

                    {/* Right Sidebar: Configuration (Context Aware) */}
                    <div className="w-[280px] bg-white border-l border-slate-200 z-20">
                        <ConfigurationPanel
                            selectedBlock={documentState.blocks.find(b => b.id === documentState.selectedBlockId)}
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
