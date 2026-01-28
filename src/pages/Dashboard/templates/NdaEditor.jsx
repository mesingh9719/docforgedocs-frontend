import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Download, Printer, ZoomIn, ZoomOut, Save, Mail, Clock, Eye, X, Loader2, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';

import NdaFormSidebar from './NdaFormSidebar';
import NdaDocumentPreview from './NdaDocumentPreview';
import VersionHistorySidebar from './VersionHistorySidebar';
import SendDocumentModal from '../../../components/SendDocumentModal';
import SignatureConfigModal from '../../../components/Nda/Signatures/SignatureConfigModal';

import { useNdaDocument } from '../../../hooks/useNdaDocument';
import { generateDocumentPdf } from '../../../utils/pdfGenerator';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { generateNdaHtml, generateId } from '../../../utils/ndaUtils';

const NdaEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    // UI State
    const [activeTab, setActiveTab] = useState('edit');
    const [zoom, setZoom] = useState(1);
    const [showHistory, setShowHistory] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [previewVersion, setPreviewVersion] = useState(null);

    // Business Logic Hook
    const {
        formData,
        docContent,
        signatures,
        documentName,
        setDocumentName,
        sentAt,
        setSentAt,
        isLoading,
        isSaving,
        handleFormChange,
        handleContentChange,
        addSection,
        removeSection,
        updateSection,
        reorderSections,
        addSignature,
        updateSignature,
        removeSignature,
        saveDocument,
        enterPreviewMode,
        exitPreviewMode,
        restoreVersion
    } = useNdaDocument(id);

    // Signature Modal State
    const [sigModal, setSigModal] = useState({
        isOpen: false,
        data: null // can be existing signature or new one with partial data
    });

    // Defer data for smoother preview updates
    const deferredFormData = React.useDeferredValue(formData);
    const deferredDocContent = React.useDeferredValue(docContent);

    // Dnd Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // slight drag required to start
            },
        })
    );

    // Handlers
    const handleBack = () => navigate('/documents');
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

    const onSave = async () => {
        saveDocument(navigate);
    };

    // Drag & Drop Handlers
    const [activeDragItem, setActiveDragItem] = useState(null);

    const handleDragStart = (event) => {
        setActiveDragItem(event.active);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (!over) return;

        // Dropping on the document canvas
        if (over.id === 'document-canvas') {
            const canvasNode = document.getElementById('printable-document');
            if (canvasNode && active.rect.current.translated) {
                const canvasRect = canvasNode.getBoundingClientRect();

                // Calculate position relative to container, adjusting for zoom
                const x = (active.rect.current.translated.left - canvasRect.left) / zoom;
                const y = (active.rect.current.translated.top - canvasRect.top) / zoom;

                // Case 1: Dragging a Toolbar Item (New Signature)
                if (active.data.current?.type === 'toolbar-item') {
                    // Open modal to configure new signature
                    setSigModal({
                        isOpen: true,
                        data: {
                            id: null, // New
                            position: { x, y },
                            type: 'all', // Default
                            required: true,
                            order: signatures.length + 1
                        }
                    });
                }

                // Case 2: Moving existing Signature
                else if (active.data.current?.type === 'signature-field') {
                    const sigId = active.id;
                    updateSignature(sigId, { position: { x, y } });
                }
            }
        }
    };

    const handleSaveSignature = (config) => {
        if (config.id) {
            // Edit existing
            updateSignature(config.id, {
                metadata: {
                    signeeName: config.signeeName,
                    signeeEmail: config.signeeEmail,
                    type: config.type,
                    required: config.required,
                    order: config.order
                }
            });
        } else {
            // Create new (from toolbar drop)
            const newSig = {
                id: generateId(),
                position: sigModal.data.position,
                metadata: {
                    signeeName: config.signeeName,
                    signeeEmail: config.signeeEmail,
                    type: config.type,
                    required: config.required,
                    order: config.order
                }
            };
            addSignature(newSig);
        }
    };

    const handleEditSignature = (sig) => {
        setSigModal({
            isOpen: true,
            data: {
                id: sig.id,
                ...sig.metadata
            }
        });
    };


    const handlePrint = async () => {
        if (!id) {
            toast.error("Please save the document before printing.");
            return;
        }

        setIsGeneratingPdf(true);
        try {
            const fullHtml = generateNdaHtml(formData, docContent, documentName, signatures);
            const response = await generateDocumentPdf(id, fullHtml, documentName);

            if (response.url) {
                window.open(response.url, '_blank');
            }
        } catch (error) {
            console.error("PDF Generation failed", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const handleExport = async () => {
        if (!id) {
            toast.error("Please save the document before exporting.");
            return;
        }

        setIsExporting(true);
        try {
            const fullHtml = generateNdaHtml(formData, docContent, documentName, signatures);
            // Re-using simplified HTML generator for export
            const documentHtml = fullHtml;

            const response = await generateDocumentPdf(id, documentHtml, documentName);

            if (response.url) {
                const link = document.createElement('a');
                link.href = response.url;
                link.download = `${documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Document exported successfully");
            }
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Failed to export document");
        } finally {
            setIsExporting(false);
        }
    };

    const handleSendEmail = () => {
        if (!id) {
            toast.error("Please save the document before sending.");
            return;
        }
        setIsSending(true);
    };

    const handleSendSuccess = (updatedDoc) => {
        if (updatedDoc && updatedDoc.sent_at) {
            setSentAt(updatedDoc.sent_at);
        }
    };

    const onPreviewVersion = (version) => {
        const content = enterPreviewMode(version);
        setPreviewVersion(version);
        setShowHistory(false);
        toast.success(`Previewing Version ${version.version_number}`);
    };

    const onExitPreview = () => {
        exitPreviewMode();
        setPreviewVersion(null);
        toast.success("Exited preview mode");
    };

    const onRestoreVersion = (docData) => {
        restoreVersion(docData);
        setPreviewVersion(null);
    };

    const handleDownloadVersion = async (version) => {
        const toastId = toast.loading("Preparing version PDF...");
        try {
            let content = version.content;
            if (typeof content === 'string') {
                try { content = JSON.parse(content); } catch (e) { }
            }

            // Handle potentially missing data in older versions
            const versionFormData = content.formData || formData;
            const versionDocContent = content.docContent || docContent;

            const fullHtml = generateNdaHtml(versionFormData, versionDocContent, `${documentName} - v${version.version_number}`);

            const response = await generateDocumentPdf(
                id,
                fullHtml,
                `${documentName} - v${version.version_number}`
            );

            if (response.url) {
                const link = document.createElement('a');
                link.href = response.url;
                link.download = `${documentName.replace(/[^a-z0-9]/gi, '_')}_v${version.version_number}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success(`Version ${version.version_number} downloaded`, { id: toastId });
            }
        } catch (error) {
            console.error("Version download failed", error);
            toast.error("Failed to download version PDF", { id: toastId });
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading Document...</p>
                </div>
            </div>
        );
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
                {/* Signature Modal */}
                <SignatureConfigModal
                    isOpen={sigModal.isOpen}
                    onClose={() => setSigModal({ isOpen: false, data: null })}
                    onSave={handleSaveSignature}
                    initialData={sigModal.data}
                    parties={{
                        disclosingPartyName: formData.disclosingPartyName,
                        receivingPartyName: formData.receivingPartyName,
                        disclosingSignatoryName: formData.disclosingSignatoryName,
                        receivingSignatoryName: formData.receivingSignatoryName,
                    }}
                />

                {/* Drag Overlay for Smooth Dragging */}
                <DragOverlay dropAnimation={{
                    sideEffects: ({ active }) => {
                        document.body.style.cursor = 'grabbing';
                        return () => { document.body.style.cursor = ''; };
                    },
                }}>
                    {activeDragItem ? (
                        activeDragItem.data.current?.type === 'toolbar-item' ? (
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-indigo-500 bg-white shadow-xl opacity-90 cursor-grabbing ring-2 ring-indigo-500/20 w-48">
                                <div className="p-2 rounded-md bg-indigo-100 text-indigo-600">
                                    {/* Simplified Icon */}
                                    <div className="w-5 h-5 flex items-center justify-center font-bold">+</div>
                                </div>
                                <span className="text-sm font-medium text-slate-900">Placing Field...</span>
                            </div>
                        ) : activeDragItem.data.current?.type === 'signature-field' ? (
                            <div className="w-64 bg-white/95 backdrop-blur-sm border-2 border-indigo-500 rounded-lg shadow-2xl p-3 flex flex-col cursor-grabbing">
                                <div className="flex items-center gap-2 text-indigo-700 font-semibold border-b pb-2 mb-2">
                                    <span>{activeDragItem.data.current.signeeName || 'Signature'}</span>
                                </div>
                                <div className="h-10 flex items-center justify-center text-indigo-200">
                                    Sign Here
                                </div>
                            </div>
                        ) : null
                    ) : null}
                </DragOverlay>

                {/* Preview Banner */}
                {previewVersion && (
                    <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-amber-800 text-sm">
                        <div className="flex items-center gap-2">
                            <Eye size={16} />
                            <span className="font-medium">Previewing Version {previewVersion.version_number}</span>
                            <span className="text-amber-600 hidden md:inline">({new Date(previewVersion.created_at).toLocaleString()})</span>
                        </div>
                        <button
                            onClick={onExitPreview}
                            className="text-amber-700 hover:text-amber-900 font-medium hover:underline flex items-center gap-1"
                        >
                            <X size={14} /> Exit Preview
                        </button>
                    </div>
                )}

                <SendDocumentModal
                    isOpen={isSending}
                    onClose={() => setIsSending(false)}
                    documentId={id}
                    documentName={documentName}
                    isReminder={!!sentAt}
                    onSuccess={handleSendSuccess}
                    getHtmlContent={async () => generateNdaHtml(formData, docContent, documentName, signatures)}
                    signatures={signatures}
                />

                {/* Toolbar */}
                <header className="no-print h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between flex-shrink-0 z-30 shadow-sm relative z-30">
                    <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                        <button
                            onClick={handleBack}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors flex-shrink-0"
                            title="Back to Documents"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={documentName}
                                    onChange={(e) => setDocumentName(e.target.value)}
                                    className="font-bold text-slate-800 text-sm md:text-lg bg-transparent border-none focus:ring-0 p-0 m-0 w-auto min-w-[120px] max-w-[200px] placeholder-slate-400 truncate"
                                    placeholder="Enter Document Name"
                                />
                                {sentAt && (
                                    <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100">
                                        <Check size={10} /> Sent
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:block">
                                {id ? 'Autosaved locally' : 'Draft'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-1 mr-4">
                            <button onClick={handleZoomOut} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomOut size={16} /></button>
                            <span className="text-xs font-semibold text-slate-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
                            <button onClick={handleZoomIn} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomIn size={16} /></button>
                        </div>

                        <button
                            onClick={() => setShowHistory(true)}
                            className="flex items-center gap-2 p-2 md:px-4 md:py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all"
                            title="Version History"
                        >
                            <Clock size={18} />
                            <span className="hidden lg:inline">History</span>
                        </button>

                        <button
                            onClick={handlePrint}
                            disabled={isGeneratingPdf}
                            className="hidden md:flex items-center gap-2 p-2 md:px-4 md:py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50"
                        >
                            {isGeneratingPdf ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}
                            <span className="hidden lg:inline">{isGeneratingPdf ? 'Generating...' : 'Print'}</span>
                        </button>

                        <button
                            onClick={handleSendEmail}
                            className={`flex items-center gap-2 px-2 md:px-4 py-2 text-sm font-medium rounded-lg border border-transparent transition-all ${sentAt ? 'text-amber-600 hover:bg-amber-50 hover:border-amber-200' : 'text-slate-600 hover:bg-slate-50 hover:border-slate-200'}`}
                        >
                            {sentAt ? <Bell size={18} /> : <Mail size={18} />}
                            <span className="hidden lg:inline">{sentAt ? 'Remind' : 'Send'}</span>
                        </button>

                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-2 md:px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50"
                        >
                            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                            <span className="hidden lg:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
                        </button>

                        <button
                            onClick={onSave}
                            className={`flex items-center gap-2 px-3 md:px-5 py-2 rounded-lg text-white font-medium shadow-md transition-all ${isSaving ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {isSaving ? <Check size={18} /> : <Save size={18} />}
                            <span className="hidden md:inline">{isSaving ? 'Saved!' : 'Save'}</span>
                        </button>
                    </div>
                </header>

                {/* Mobile Tabs */}
                {!isDesktop && (
                    <div className="flex bg-white border-b border-slate-200 px-4">
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'edit' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            Preview
                        </button>
                    </div>
                )}

                {/* MainContent */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
                    {/* Left Panel: Editor Sidebar */}
                    <div className={`
                        no-print w-full lg:w-[400px] h-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200 
                        overflow-y-auto z-20 shadow-sm flex-shrink-0 lg:order-1
                        ${isDesktop ? 'block' : (activeTab === 'edit' ? 'block' : 'hidden')}
                    `}>
                        <NdaFormSidebar
                            formData={formData}
                            onChange={handleFormChange}
                            docContent={docContent}
                            onContentChange={handleContentChange}
                            // Section Handlers
                            addSection={addSection}
                            removeSection={removeSection}
                            updateSection={updateSection}
                            reorderSections={reorderSections}
                        />
                    </div>

                    {/* Right Panel: Live Preview */}
                    <div className={`
                        flex-1 h-full overflow-y-auto bg-slate-100/50 p-4 md:p-8 sm:p-12 
                        flex justify-center items-start scrollbar-thin scrollbar-thumb-slate-300 lg:order-2
                        ${isDesktop ? 'flex' : (activeTab === 'preview' ? 'flex' : 'hidden')}
                    `}>
                        <NdaDocumentPreview
                            data={deferredFormData}
                            content={deferredDocContent}
                            zoom={zoom}
                            signatures={signatures}
                            onUpdateSignature={updateSignature}
                            onRemoveSignature={removeSignature}
                            onEditSignature={handleEditSignature}
                        />
                    </div>
                </div>

                <VersionHistorySidebar
                    documentId={id}
                    isOpen={showHistory}
                    onClose={() => setShowHistory(false)}
                    onPreview={onPreviewVersion}
                    onDownload={handleDownloadVersion}
                    onRestore={onRestoreVersion}
                />
            </div>
        </DndContext>
    );
};

export default NdaEditor;
