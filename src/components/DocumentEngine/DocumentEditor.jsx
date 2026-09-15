import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Eye,
    EyeOff,
    Loader2,
    Check,
    AlertCircle,
    Cloud,
    Send,
    Copy,
    Ban,
    Download,
    Printer,
    Sparkles,
    Braces,
    Sliders,
    Layers,
} from 'lucide-react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';

import { useDocumentEngine } from '../../hooks/useDocumentEngine';
import { useAutosave } from '../../hooks/useAutosave';
import { getBusiness } from '../../api/business';
import {
    getDocument,
    updateDocument,
    duplicateDocument,
    voidDocument,
} from '../../api/documents';
import { generateDocumentPdf } from '../../utils/pdfGenerator';
import { compileDocumentToPdfHtml } from '../../utils/blockHtmlCompiler';
import { getSampleContext } from '../../utils/variableRegistry';

import Canvas from './Canvas';
import Toolbox from './Sidebar/Toolbox';
import ConfigurationPanel from './Sidebar/ConfigurationPanel';
import VariableManager from './Sidebar/VariableManager';
import VariablePicker from './Variables/VariablePicker';
import EditorHeader from './EditorHeader';
import UnifiedVersionHistory from './Sidebar/UnifiedVersionHistory';

const DocumentEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Core Engine State
    const { documentState, actions } = useDocumentEngine();
    const [activeTab, setActiveTab] = useState('build'); // 'build', 'variables', 'history'
    const [activeMode, setActiveMode] = useState('build'); // 'build' | 'preview'
    const [resolveVariablesPreview, setResolveVariablesPreview] = useState(true);
    const [variablePickerOpen, setVariablePickerOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [businessData, setBusinessData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Fetch Business Data and Document on Mount
    useEffect(() => {
        const init = async () => {
            try {
                // 1. Load Business Context
                const business = await getBusiness().catch(() => null);
                setBusinessData(business);

                // 2. Load Document if ID exists
                if (id) {
                    const doc = await getDocument(id);
                    const docData = doc.data || doc || {};
                    let content = docData.content;
                    if (typeof content === 'string') {
                        try {
                            content = JSON.parse(content);
                        } catch (e) {
                            console.error(e);
                        }
                    }

                    // Load into Engine
                    if (content && content.blocks) {
                        actions.loadDocument({
                            blocks: content.blocks || [],
                            variables: content.variables || {},
                            pageSettings: content.pageSettings || content.page || { size: 'A4', orientation: 'portrait' },
                            metadata: content.metadata || { title: docData.name, status: docData.status },
                            history: { past: [], future: [] },
                        });
                        actions.setMetadata({
                            title: docData.name,
                            status: docData.status,
                        });
                    } else {
                        // Fallback or Handle Legacy
                        actions.setMetadata({
                            title: docData.name,
                            status: docData.status,
                        });
                    }
                } else {
                    // New Doc defaults
                    if (documentState.variables && Object.keys(documentState.variables).length === 0) {
                        actions.addVariable('client.name', { value: 'Acme Corporation', type: 'text', label: 'Client Name' });
                        actions.addVariable('document.date', { value: new Date().toLocaleDateString(), type: 'date', label: 'Date' });
                    }
                }
                setIsLoaded(true);
            } catch (err) {
                console.error('Failed to load document context:', err);
                toast.error('Failed to load document');
            }
        };
        init();
    }, [id]);

    // Variable Context for live interpolation
    const resolvedContext = useMemo(() => {
        return getSampleContext(businessData, documentState.variables);
    }, [businessData, documentState.variables]);

    // Autosave
    const autosaveData = useMemo(
        () =>
            JSON.stringify({
                blocks: documentState.blocks,
                variables: documentState.variables,
                pageSettings: documentState.pageSettings,
                metadata: documentState.metadata,
            }),
        [documentState.blocks, documentState.variables, documentState.pageSettings, documentState.metadata]
    );

    const autosaveFn = useCallback(async () => {
        if (!id) return;
        const finalContent = {
            blocks: documentState.blocks,
            variables: documentState.variables,
            pageSettings: documentState.pageSettings || { size: 'A4', orientation: 'portrait' },
            metadata: documentState.metadata,
        };
        await updateDocument(id, {
            name: documentState.metadata.title || 'Untitled Document',
            content: finalContent,
        });
    }, [id, documentState.blocks, documentState.variables, documentState.pageSettings, documentState.metadata]);

    const { saveStatus, lastSavedAt, triggerSave } = useAutosave(autosaveFn, autosaveData, {
        debounceMs: 4000,
        enabled: isLoaded && !!id,
    });

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        if (active.data.current?.type === 'TOOL') {
            actions.addBlock(active.data.current.toolType);
            return;
        }

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
            toast.success('Document saved successfully');
        } catch (error) {
            console.error('Save failed', error);
            toast.error('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    // PDF Export
    const handleExport = async () => {
        if (!id) {
            toast.error('Please save the document before exporting.');
            return;
        }
        setIsExporting(true);
        const toastId = toast.loading('Compiling document & generating PDF...');
        try {
            // 1. Save changes first
            await triggerSave();

            // 2. Compile block-based HTML with resolved variables
            const fullHtml = compileDocumentToPdfHtml(documentState, businessData);

            // 3. Request PDF generation
            const response = await generateDocumentPdf(
                id,
                fullHtml,
                documentState.metadata.title || 'Document'
            );

            if (response.url) {
                const link = document.createElement('a');
                link.href = response.url;
                link.download = `${(documentState.metadata.title || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success('Document exported to PDF!', { id: toastId });
            } else {
                toast.success('PDF generated successfully', { id: toastId });
            }
        } catch (error) {
            console.error('Export failed', error);
            toast.error('Failed to export PDF', { id: toastId });
        } finally {
            setIsExporting(false);
        }
    };

    // Print
    const handlePrint = () => {
        window.print();
    };

    // Send for Signature Workflow
    const handleSendForSignature = async () => {
        if (!id) return;

        const toastId = toast.loading('Generating PDF and preparing signature fields...');
        setIsSaving(true);

        try {
            await triggerSave();

            // Compile high-fidelity HTML
            const fullHtml = compileDocumentToPdfHtml(documentState, businessData);

            // Generate PDF on backend & lock for signing
            await generateDocumentPdf(id, fullHtml, documentState.metadata.title, null);

            toast.success('Redirecting to Signature Editor...', { id: toastId });

            setTimeout(() => {
                navigate(`/signatures/${id}/edit`);
            }, 700);
        } catch (error) {
            console.error('Failed to prepare signature:', error);
            toast.error('Failed to proceed to signature module', { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDuplicate = async () => {
        if (!id) return;
        const toastId = toast.loading('Duplicating document...');
        try {
            const newDoc = await duplicateDocument(id);
            toast.success('Document duplicated', { id: toastId });
            const newDocId = newDoc.data?.id || newDoc.id;
            navigate(`/documents/general/${newDocId}`);
        } catch (error) {
            console.error('Duplicate failed', error);
            toast.error('Failed to duplicate document', { id: toastId });
        }
    };

    const handleVoid = async () => {
        if (!id) return;
        if (!window.confirm('Are you sure you want to void this document? This action cannot be undone.')) return;

        const toastId = toast.loading('Voiding document...');
        try {
            await voidDocument(id, 'Voided by user from editor');
            toast.success('Document voided', { id: toastId });
            const doc = await getDocument(id);
            const docData = doc.data || doc || {};
            actions.setMetadata({
                title: docData.name,
                status: docData.status,
            });
        } catch (error) {
            console.error('Void failed', error);
            toast.error('Failed to void document', { id: toastId });
        }
    };

    const handleRestoreVersion = (version) => {
        let content = version.content;
        if (typeof content === 'string') {
            try {
                content = JSON.parse(content);
            } catch (e) {
                console.error(e);
            }
        }
        if (content && content.blocks) {
            actions.loadDocument({
                blocks: content.blocks || [],
                variables: content.variables || {},
                pageSettings: content.pageSettings || { size: 'A4', orientation: 'portrait' },
                metadata: content.metadata || { title: documentState.metadata.title, status: documentState.metadata.status },
                history: { past: [], future: [] },
            });
            toast.success(`Restored Version ${version.version_number}`);
        }
    };

    const isReadOnly = activeMode === 'preview' || ['sent', 'signed', 'completed'].includes(documentState.metadata.status);

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
                {/* Header */}
                <EditorHeader
                    title={documentState.metadata.title}
                    onTitleChange={(val) => actions.setMetadata({ title: val })}
                    status={documentState.metadata.status}
                    saveStatus={saveStatus}
                    lastSavedAt={lastSavedAt}
                    isSaving={isSaving || isExporting}
                    onSave={handleSave}
                    onSend={handleSendForSignature}
                    onDuplicate={handleDuplicate}
                    onVoid={handleVoid}
                    showDuplicate={true}
                    showExport={true}
                    onExport={handleExport}
                    showPrint={true}
                    onPrint={handlePrint}
                    showVoid={documentState.metadata.status === 'sent'}
                    onPreview={() => setActiveMode(activeMode === 'preview' ? 'build' : 'preview')}
                    customActions={
                        <div className="flex items-center gap-1.5 mr-1">
                            {/* Mode Toggle (Build / Live Preview) */}
                            <button
                                type="button"
                                onClick={() => setActiveMode(activeMode === 'preview' ? 'build' : 'preview')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-2xs ${
                                    activeMode === 'preview'
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                                title={activeMode === 'preview' ? 'Exit Preview Mode' : 'Preview Real-time Document'}
                            >
                                {activeMode === 'preview' ? <EyeOff size={14} /> : <Eye size={14} />}
                                <span>{activeMode === 'preview' ? 'Editing Mode' : 'Preview'}</span>
                            </button>

                            {/* Live Variables Interpolation Toggle */}
                            <button
                                type="button"
                                onClick={() => setResolveVariablesPreview(!resolveVariablesPreview)}
                                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    resolveVariablesPreview
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                                title="Toggle variable values vs placeholder syntax"
                            >
                                <Sparkles size={13} />
                                <span>{resolveVariablesPreview ? 'Data: Active' : 'Data: Tags'}</span>
                            </button>

                            {/* Variable Picker Trigger */}
                            <button
                                type="button"
                                onClick={() => setVariablePickerOpen(true)}
                                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 rounded-lg text-xs font-semibold transition"
                                title="Open Variable Picker Modal"
                            >
                                <Braces size={13} className="text-indigo-600" />
                                <span>Variables</span>
                            </button>
                        </div>
                    }
                />

                {/* Main Workspace */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar: Toolbox & Variables & History */}
                    {activeMode === 'build' && (
                        <div className="w-[300px] bg-white border-r border-slate-200 flex flex-col z-20 shrink-0">
                            {/* Tabs */}
                            <div className="flex border-b border-slate-200 bg-slate-50/50">
                                <button
                                    onClick={() => setActiveTab('build')}
                                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                                        activeTab === 'build'
                                            ? 'border-indigo-600 text-indigo-600 bg-white'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <Layers size={14} />
                                    Components
                                </button>
                                <button
                                    onClick={() => setActiveTab('variables')}
                                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                                        activeTab === 'variables'
                                            ? 'border-indigo-600 text-indigo-600 bg-white'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <Braces size={14} />
                                    Variables
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                                        activeTab === 'history'
                                            ? 'border-indigo-600 text-indigo-600 bg-white'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    History
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 overflow-y-auto">
                                {activeTab === 'build' && (
                                    <div className="flex flex-col h-full">
                                        <Toolbox />
                                    </div>
                                )}
                                {activeTab === 'variables' && (
                                    <VariableManager
                                        variables={documentState.variables}
                                        onAdd={actions.addVariable}
                                        onRemove={actions.removeVariable}
                                    />
                                )}
                                {activeTab === 'history' && (
                                    <UnifiedVersionHistory
                                        documentId={id}
                                        type="panel"
                                        onRestore={handleRestoreVersion}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Center: Canvas Workspace */}
                    <div className="flex-1 bg-slate-100/90 overflow-y-auto p-6 md:p-10 flex justify-center">
                        <Canvas
                            blocks={documentState.blocks}
                            actions={actions}
                            readOnly={isReadOnly}
                            businessData={businessData}
                            selectedBlockId={activeMode === 'preview' ? null : documentState.selectedBlockId}
                            onSelectBlock={actions.selectBlock}
                            pageSettings={documentState.pageSettings || { size: 'A4', orientation: 'portrait' }}
                            resolvedContext={
                                activeMode === 'preview' || resolveVariablesPreview
                                    ? resolvedContext
                                    : null
                            }
                        />
                    </div>

                    {/* Right Sidebar: Block Configuration */}
                    {activeMode === 'build' && (
                        <div className="w-[290px] bg-white border-l border-slate-200 z-20 shrink-0 overflow-y-auto">
                            <ConfigurationPanel
                                selectedBlock={documentState.blocks.find(
                                    (b) => b.id === documentState.selectedBlockId
                                )}
                                updateBlock={actions.updateBlock}
                                removeBlock={actions.removeBlock}
                            />
                        </div>
                    )}
                </div>

                {/* Variable Picker Modal */}
                <VariablePicker
                    isOpen={variablePickerOpen}
                    onClose={() => setVariablePickerOpen(false)}
                    onSelectVariable={(variableToken) => {
                        toast.success(`Copied ${variableToken}`);
                        navigator.clipboard?.writeText(variableToken);
                    }}
                    customVariables={documentState.variables}
                />
            </div>
        </DndContext>
    );
};

export default DocumentEditor;
