import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Download, Printer, ZoomIn, ZoomOut, Save, Mail, Clock, Eye, X, Loader2, Bell, Wand, AlertCircle, FileText, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor, DragOverlay } from '@dnd-kit/core';

import ConsultingAgreementFormSidebar from './ConsultingAgreementFormSidebar';
import ConsultingAgreementDocumentPreview from './ConsultingAgreementDocumentPreview';
import VersionHistorySidebar from './VersionHistorySidebar';
import SendDocumentModal from '../../../components/SendDocumentModal';
import SignatureConfigModal from '../../../components/Nda/Signatures/SignatureConfigModal';

import { useConsultingAgreementDocument } from '../../../hooks/useConsultingAgreementDocument';
import { generateDocumentPdf } from '../../../utils/pdfGenerator';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { generateConsultingAgreementHtml } from '../../../utils/consultingAgreementUtils';
import { generateId } from '../../../utils/ndaUtils';
import { getBusiness } from '../../../api/business';

const ConsultingAgreementEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const [activeTab, setActiveTab] = useState('edit');
    const [zoom, setZoom] = useState(1);
    const [showHistory, setShowHistory] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [previewVersion, setPreviewVersion] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [nameSuggestion, setNameSuggestion] = useState(null);
    const [businessLogo, setBusinessLogo] = useState(null);

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
    } = useConsultingAgreementDocument(id);

    const [sigModal, setSigModal] = useState({ isOpen: false, data: null });
    const deferredFormData = React.useDeferredValue(formData);
    const deferredDocContent = React.useDeferredValue(docContent);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    const nameInputRef = React.useRef(null);

    const handleBack = () => navigate('/documents');
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

    const generateSmartName = () => {
        const client = formData.clientName?.trim();
        const consultant = formData.consultantName?.trim();
        if (client && consultant) {
            setDocumentName(`Consulting Agreement - ${client} & ${consultant}`);
            setNameError(null);
            setNameSuggestion(null);
            toast.success("Generated smart name!");
        } else {
            toast.error("Enter Client and Consultant names first.");
        }
    };

    const convertUrlToBase64 = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error("Failed to convert image to base64", error);
            return null;
        }
    };

    React.useEffect(() => {
        const fetchLogo = async () => {
            try {
                const business = await getBusiness();
                if (business && business.logo) {
                    setBusinessLogo(business.logo);
                }
            } catch (error) {
                console.error("Failed to fetch business logo", error);
            }
        };
        fetchLogo();
    }, []);

    const onSave = async () => {
        const trimmedName = documentName?.trim();
        if (!trimmedName || ['Untitled Consulting Agreement'].includes(trimmedName)) {
            setNameError("Please enter a valid document name.");
            if (nameInputRef.current) nameInputRef.current.focus();
            return;
        }

        try {
            await saveDocument(navigate);
        } catch (error) {
            if (error.response && error.response.status === 422 && error.response.data.suggested_name) {
                const suggestion = error.response.data.suggested_name;
                setNameError(`Name "${trimmedName}" is already taken.`);
                setNameSuggestion(suggestion);
                if (nameInputRef.current) nameInputRef.current.focus();
            }
        }
    };

    const [activeDragItem, setActiveDragItem] = useState(null);

    const handleDragStart = (event) => {
        setActiveDragItem(event.active);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (!over) return;
        if (over.id === 'document-canvas') {
            const canvasNode = document.getElementById('printable-document');
            if (canvasNode && active.rect.current.translated) {
                const canvasRect = canvasNode.getBoundingClientRect();
                const x = (active.rect.current.translated.left - canvasRect.left) / zoom;
                const y = (active.rect.current.translated.top - canvasRect.top) / zoom;

                if (active.data.current?.type === 'toolbar-item') {
                    setSigModal({
                        isOpen: true,
                        data: {
                            id: null,
                            position: { x, y },
                            type: 'all',
                            required: true,
                            order: signatures.length + 1
                        }
                    });
                } else if (active.data.current?.type === 'signature-field') {
                    updateSignature(active.id, { position: { x, y } });
                }
            }
        }
    };

    const handleSaveSignature = (config) => {
        if (config.id) {
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
            data: { id: sig.id, ...sig.metadata }
        });
    };

    const handleAddSignatureMobile = () => {
        setSigModal({
            isOpen: true,
            data: {
                id: null,
                position: { x: 50, y: 100 },
                type: 'all',
                required: true,
                order: signatures.length + 1
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
            let logoBase64 = businessLogo;
            if (businessLogo && !businessLogo.startsWith('data:')) {
                const base64 = await convertUrlToBase64(businessLogo);
                if (base64) logoBase64 = base64;
            }
            const fullHtml = generateConsultingAgreementHtml(formData, docContent, documentName, signatures, logoBase64);
            const response = await generateDocumentPdf(id, fullHtml, documentName);
            if (response.url) window.open(response.url, '_blank');
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
            let logoBase64 = businessLogo;
            if (businessLogo && !businessLogo.startsWith('data:')) {
                const base64 = await convertUrlToBase64(businessLogo);
                if (base64) logoBase64 = base64;
            }
            const fullHtml = generateConsultingAgreementHtml(formData, docContent, documentName, signatures, logoBase64);
            const response = await generateDocumentPdf(id, fullHtml, documentName);
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
        if (updatedDoc && updatedDoc.sent_at) setSentAt(updatedDoc.sent_at);
    };

    const onPreviewVersion = (version) => {
        enterPreviewMode(version);
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
            const versionFormData = content.formData || formData;
            const versionDocContent = content.docContent || docContent;

            let logoBase64 = businessLogo;
            if (businessLogo && !businessLogo.startsWith('data:')) {
                const base64 = await convertUrlToBase64(businessLogo);
                if (base64) logoBase64 = base64;
            }

            const fullHtml = generateConsultingAgreementHtml(versionFormData, versionDocContent, `${documentName} - v${version.version_number}`, [], logoBase64);
            const response = await generateDocumentPdf(id, fullHtml, `${documentName} - v${version.version_number}`);

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
                <SignatureConfigModal
                    isOpen={sigModal.isOpen}
                    onClose={() => setSigModal({ isOpen: false, data: null })}
                    onSave={handleSaveSignature}
                    initialData={sigModal.data}
                    parties={{
                        disclosingPartyName: formData.clientName,
                        receivingPartyName: formData.consultantName,
                        disclosingSignatoryName: formData.clientSignatoryName,
                        receivingSignatoryName: formData.consultantSignatoryName,
                    }}
                />

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

                {previewVersion && (
                    <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-amber-800 text-sm">
                        <div className="flex items-center gap-2">
                            <Eye size={16} />
                            <span className="font-medium">Previewing Version {previewVersion.version_number}</span>
                        </div>
                        <button onClick={onExitPreview} className="text-amber-700 hover:text-amber-900 font-medium hover:underline flex items-center gap-1">
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
                    getHtmlContent={async () => {
                        let logoBase64 = businessLogo;
                        if (businessLogo && !businessLogo.startsWith('data:')) {
                            const base64 = await convertUrlToBase64(businessLogo);
                            if (base64) logoBase64 = base64;
                        }
                        return generateConsultingAgreementHtml(formData, docContent, documentName, signatures, logoBase64);
                    }}
                    signatures={signatures}
                />

                <header className="no-print h-14 md:h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-6 flex items-center justify-between flex-shrink-0 z-30 shadow-sm relative transition-all duration-300">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors flex-shrink-0">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="min-w-0 relative">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <input
                                        ref={nameInputRef}
                                        type="text"
                                        value={documentName}
                                        onChange={(e) => {
                                            setDocumentName(e.target.value);
                                            if (nameError) setNameError(null);
                                        }}
                                        className={`font-bold text-sm md:text-lg bg-transparent border-b-2 focus:ring-0 p-0 m-0 w-auto min-w-[150px] max-w-[300px] placeholder-slate-400 truncate transition-colors ${nameError ? 'border-red-500 text-slate-800 ring-4 ring-red-500/10 rounded-sm px-1 -mx-1' : 'border-transparent hover:border-slate-200 text-slate-800'}`}
                                        placeholder="Enter Document Name"
                                    />
                                    {nameError && (
                                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-red-100 z-50 p-3">
                                            <div className="flex items-start gap-2 text-red-600 mb-2">
                                                <AlertCircle size={16} />
                                                <p className="text-xs font-semibold">{nameError}</p>
                                            </div>
                                            {nameSuggestion && (
                                                <div className="bg-slate-50 rounded p-2">
                                                    <p className="text-[10px] text-slate-500 mb-1 uppercase font-bold">Suggestion:</p>
                                                    <button onClick={() => { setDocumentName(nameSuggestion); setNameError(null); }} className="text-sm font-bold text-indigo-600 hover:underline">{nameSuggestion}</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button onClick={generateSmartName} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><Wand size={16} /></button>
                                {sentAt && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100"><Check size={10} /> Sent</span>}
                            </div>
                            <p className="text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:block mt-0.5">{id ? 'Autosaved locally' : 'Draft'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-1 mr-4">
                            <button onClick={handleZoomOut} className="p-1.5 hover:bg-white rounded-md text-slate-500"><ZoomOut size={16} /></button>
                            <span className="text-xs font-semibold text-slate-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
                            <button onClick={handleZoomIn} className="p-1.5 hover:bg-white rounded-md text-slate-500"><ZoomIn size={16} /></button>
                        </div>
                        <button onClick={() => setShowHistory(true)} className="hidden lg:flex items-center gap-2 px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all"><Clock size={18} /><span>History</span></button>
                        <button onClick={handlePrint} disabled={isGeneratingPdf} className="hidden lg:flex items-center gap-2 px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50">{isGeneratingPdf ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}<span>Print</span></button>
                        <button onClick={handleSendEmail} className={`hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-transparent transition-all ${sentAt ? 'text-amber-600 hover:bg-amber-50 hover:border-amber-200' : 'text-slate-600 hover:bg-slate-50 hover:border-slate-200'}`}>{sentAt ? <Bell size={18} /> : <Mail size={18} />}<span>{sentAt ? 'Remind' : 'Send'}</span></button>
                        <button onClick={handleExport} disabled={isExporting} className="hidden lg:flex items-center gap-2 px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50">{isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}<span>Export</span></button>
                        <button onClick={onSave} className={`hidden lg:flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium shadow-md transition-all ${isSaving ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{isSaving ? <Check size={18} /> : <Save size={18} />}<span>{isSaving ? 'Saved!' : 'Save'}</span></button>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative pb-[70px] lg:pb-0">
                    <div className={`no-print w-full lg:w-[400px] h-full bg-white border-r border-slate-200 overflow-y-auto z-20 shadow-sm flex-shrink-0 lg:order-1 ${isDesktop ? 'block' : (activeTab === 'edit' ? 'block' : 'hidden')}`}>
                        <ConsultingAgreementFormSidebar
                            formData={formData}
                            onChange={handleFormChange}
                            docContent={docContent}
                            onContentChange={handleContentChange}
                            addSection={addSection}
                            removeSection={removeSection}
                            updateSection={updateSection}
                            reorderSections={reorderSections}
                        />
                    </div>

                    <div className={`flex-1 h-full overflow-y-auto bg-slate-50/50 p-4 md:p-8 sm:p-12 flex justify-center items-start scrollbar-thin scrollbar-thumb-slate-300 lg:order-2 ${isDesktop ? 'flex' : (activeTab === 'preview' ? 'flex' : 'hidden')}`} style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                        <ConsultingAgreementDocumentPreview
                            data={deferredFormData}
                            content={deferredDocContent}
                            zoom={zoom}
                            signatures={signatures}
                            onUpdateSignature={updateSignature}
                            onRemoveSignature={removeSignature}
                            onEditSignature={handleEditSignature}
                            businessLogo={businessLogo}
                        />
                        {!isDesktop && activeTab === 'preview' && (
                            <button onClick={handleAddSignatureMobile} className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center z-30">+</button>
                        )}
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

                {!isDesktop && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-between items-center px-6 py-3 pb-safe z-40 safe-area-bottom">
                        <button onClick={() => setActiveTab('edit')} className={`flex flex-col items-center gap-1 ${activeTab === 'edit' ? 'text-indigo-600' : 'text-slate-400'}`}><FileText size={24} /><span className="text-[10px]">Editor</span></button>
                        <button onClick={() => setActiveTab('preview')} className={`flex flex-col items-center gap-1 ${activeTab === 'preview' ? 'text-indigo-600' : 'text-slate-400'}`}><Eye size={24} /><span className="text-[10px]">Preview</span></button>
                        <button onClick={onSave} className={`flex flex-col items-center gap-1 ${isSaving ? 'text-emerald-500' : 'text-slate-400'}`}><Save size={24} /><span className="text-[10px]">Save</span></button>
                        <button onClick={() => setShowMobileMenu(true)} className={`flex flex-col items-center gap-1 ${showMobileMenu ? 'text-indigo-600' : 'text-slate-400'}`}><MoreHorizontal size={24} /><span className="text-[10px]">More</span></button>
                    </div>
                )}
            </div>
        </DndContext>
    );
};

export default ConsultingAgreementEditor;
