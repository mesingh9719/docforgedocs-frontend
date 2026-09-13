import React, { useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Loader2, Check, AlertCircle, Cloud, Send, Copy, Ban } from 'lucide-react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useDocumentEngine } from '../../hooks/useDocumentEngine';
import { useAutosave } from '../../hooks/useAutosave';

// Imports
import { getBusiness } from '../../api/business';
import { getDocument, updateDocument, generatePdf, duplicateDocument, voidDocument } from '../../api/documents';
import Canvas from './Canvas';
import Toolbox from './Sidebar/Toolbox';
import ConfigurationPanel from './Sidebar/ConfigurationPanel';
import VariableManager from './Sidebar/VariableManager';
import EditorHeader from './EditorHeader';
import UnifiedVersionHistory from './Sidebar/UnifiedVersionHistory';

import toast from 'react-hot-toast';

const DocumentEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Core Engine State
    const { documentState, actions } = useDocumentEngine();
    const [activeTab, setActiveTab] = React.useState('build'); // 'build', 'variables', 'history'
    const [isSaving, setIsSaving] = React.useState(false);
    const [businessData, setBusinessData] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

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
                            metadata: content.metadata || { title: doc.data.name, status: doc.data.status },
                            history: { past: [], future: [] }
                        });
                        // Also ensure metadata title matches doc name
                        actions.setMetadata({
                            title: doc.data.name,
                            status: doc.data.status // Load status
                        });
                    } else {
                        // Fallback or Handle Legacy
                        actions.setMetadata({
                            title: doc.data.name,
                            status: doc.data.status
                        });
                    }
                } else {
                    // New Doc defaults
                    if (documentState.variables && Object.keys(documentState.variables).length === 0) {
                        actions.addVariable('client_name', { value: '', type: 'text', label: 'Client Name' });
                        actions.addVariable('date', { value: new Date().toLocaleDateString(), type: 'date', label: 'Date' });
                    }
                }
                setIsLoaded(true);
            } catch (err) {
                console.error("Failed to load context", err);
                toast.error("Failed to load document");
            }
        };
        init();
    }, [id]);

    // Autosave: watch blocks, variables, and metadata for changes
    const autosaveData = useMemo(
        () => JSON.stringify({ blocks: documentState.blocks, variables: documentState.variables, metadata: documentState.metadata }),
        [documentState.blocks, documentState.variables, documentState.metadata]
    );

    const autosaveFn = useCallback(async () => {
        if (!id) return;
        const finalContent = {
            blocks: documentState.blocks,
            variables: documentState.variables,
            metadata: documentState.metadata,
        };
        await updateDocument(id, {
            name: documentState.metadata.title,
            content: JSON.stringify(finalContent),
        });
    }, [id, documentState.blocks, documentState.variables, documentState.metadata]);

    const { saveStatus, lastSavedAt, triggerSave } = useAutosave(autosaveFn, autosaveData, {
        debounceMs: 4000,
        enabled: isLoaded && !!id,
    });

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
            await triggerSave();
            toast.success("Document saved");
        } catch (error) {
            console.error("Save failed", error);
            toast.error("Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSendForSignature = async () => {
        if (!id) return;

        const toastId = toast.loading("Preparing document for signature...");
        setIsSaving(true);

        try {
            // 1. Save current state first
            await triggerSave();

            // 2. Generate HTML from blocks (Simplified for now)
            // TODO: Move this to a proper utility or use server-side rendering
            const htmlContent = `
                <div style="font-family: sans-serif; color: #333;">
                    <h1 style="text-align: center; margin-bottom: 30px;">${documentState.metadata.title}</h1>
                    ${documentState.blocks.map(block => {
                if (block.type === 'text') return `<div style="margin-bottom: 15px;">${block.content || ''}</div>`;
                if (block.type === 'heading') return `<h2 style="margin-top: 20px; margin-bottom: 1px;">${block.content || ''}</h2>`;
                if (block.type === 'image') return `<img src="${block.content}" style="max-width: 100%; margin: 20px 0;" />`;
                return '';
            }).join('')}
                </div>
            `;

            // 3. Generate PDF via API
            await generatePdf(id, htmlContent);

            toast.success("Redirecting to Signature Module...", { id: toastId });

            // 4. Redirect
            setTimeout(() => {
                navigate(`/signatures/edit/${id}`);
            }, 1000);

        } catch (error) {
            console.error("Failed to prepare signature", error);
            toast.error("Failed to proceed to signature", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDuplicate = async () => {
        if (!id) return;
        const toastId = toast.loading("Duplicating document...");
        try {
            const newDoc = await duplicateDocument(id);
            toast.success("Document duplicated", { id: toastId });
            // Navigate to new document
            navigate(`/documents/edit/${newDoc.data.id}`);
            window.location.reload(); // Force reload to init new state properly
        } catch (error) {
            console.error("Duplicate failed", error);
            toast.error("Failed to duplicate document", { id: toastId });
        }
    };

    const handleVoid = async () => {
        if (!id) return;
        if (!window.confirm("Are you sure you want to void this document? This action cannot be undone.")) return;

        const toastId = toast.loading("Voiding document...");
        try {
            await voidDocument(id, "Voided by user from editor");
            toast.success("Document voided", { id: toastId });
            // Refresh state
            const doc = await getDocument(id);
            actions.setMetadata({
                title: doc.data.name,
                status: doc.data.status
            });
        } catch (error) {
            console.error("Void failed", error);
            toast.error("Failed to void document", { id: toastId });
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
                <EditorHeader
                    title={documentState.metadata.title}
                    onTitleChange={(val) => actions.setMetadata({ title: val })}
                    status={documentState.metadata.status}
                    saveStatus={saveStatus}
                    lastSavedAt={lastSavedAt}
                    isSaving={isSaving}
                    onSave={handleSave}
                    onSend={handleSendForSignature}
                    onDuplicate={handleDuplicate}
                    onVoid={handleVoid}
                    showDuplicate={true}
                    showVoid={documentState.metadata.status === 'sent'}
                    onPreview={() => { /* TODO: Implement proper preview modal if needed, or keeping current simple button logic */ }}

                />

                {/* Main Workspace */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar: Toolbox & Variables & History */}
                    <div className="w-[300px] bg-white border-r border-slate-200 flex flex-col z-20">
                        {/* Tabs */}
                        <div className="flex border-b border-slate-200">
                            <button
                                onClick={() => setActiveTab('build')}
                                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'build' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Build
                            </button>
                            <button
                                onClick={() => setActiveTab('variables')}
                                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'variables' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Vars
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                History
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            {activeTab === 'build' && (
                                <div className="flex flex-col h-full">
                                    <Toolbox />
                                </div>
                            )}
                            {activeTab === 'variables' && (
                                <VariableManager variables={documentState.variables} onAdd={actions.addVariable} />
                            )}
                            {activeTab === 'history' && (
                                <UnifiedVersionHistory
                                    documentId={id}
                                    type="panel"
                                    onRestore={(version) => {
                                        window.location.reload();
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Center: Canvas */}
                    <div className="flex-1 bg-slate-100 overflow-y-auto p-8 flex justify-center">
                        <Canvas
                            blocks={documentState.blocks}
                            actions={actions}
                            readOnly={['sent', 'signed', 'completed'].includes(documentState.metadata.status)}
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
