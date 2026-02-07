import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Save, Printer, Loader2, AlertCircle, Wand } from 'lucide-react';
import toast from 'react-hot-toast';
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor, DragOverlay } from '@dnd-kit/core';

// Imports adapted for location
import NdaFormSidebar from '../../../Dashboard/templates/NdaFormSidebar';
import NdaDocumentPreview from '../../../Dashboard/templates/NdaDocumentPreview';
import SignatureConfigModal from '../../../../components/Nda/Signatures/SignatureConfigModal';

import { useNdaDocument } from '../../../../hooks/useNdaDocument';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import { generateId } from '../../../../utils/ndaUtils';

const GuestNdaEditor = ({ onSaveRequest }) => {
    const navigate = useNavigate();
    // Pass null to useNdaDocument to invoke "New Document / Default" mode
    // The hook handles 401 on getBusiness gracefully
    const {
        formData,
        docContent,
        signatures,
        documentName,
        setDocumentName,
        isLoading,
        handleFormChange,
        handleContentChange,
        addSection,
        removeSection,
        updateSection,
        reorderSections,
        addSignature,
        updateSignature,
        removeSignature,
        styles,
        updateStyle,
        resetStyles
    } = useNdaDocument(null);

    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [activeTab, setActiveTab] = useState('edit');
    const [zoom, setZoom] = useState(1);
    const [activeDragItem, setActiveDragItem] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [nameSuggestion, setNameSuggestion] = useState(null);
    const nameInputRef = React.useRef(null);

    // Signature Modal State
    const [sigModal, setSigModal] = useState({
        isOpen: false,
        data: null
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    const deferredFormData = React.useDeferredValue(formData);
    const deferredDocContent = React.useDeferredValue(docContent);

    // Handlers
    const handleBack = () => navigate('/create-document'); // Redirect to Landing
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

    const generateSmartName = () => {
        const partyName = formData.receivingPartyName?.trim();
        if (partyName) {
            setDocumentName(`NDA - ${partyName}`);
            setNameError(null);
            setNameSuggestion(null);
            toast.success("Generated smart name!");
        } else {
            toast.error("Enter 'Receiving Party Name' in the form first.");
        }
    };

    const handleSaveClick = () => {
        // Construct the payload for the parent to handle (Signup -> Create)
        const payload = {
            name: documentName,
            type_slug: 'nda',
            content: JSON.stringify({
                formData,
                docContent,
                signatures,
                styles
            }),
            status: 'draft',
            suggestedBusinessName: formData.disclosingPartyName // Pass for Signup Modal
        };
        onSaveRequest(payload);
    };

    // Drag & Drop Handlers (Copied exactly from NdaEditor)
    const handleDragStart = (event) => setActiveDragItem(event.active);
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
                    const sigId = active.id;
                    updateSignature(sigId, { position: { x, y } });
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

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 size={40} className="animate-spin text-indigo-600 mb-4" />
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
                                <div className="h-10 flex items-center justify-center text-indigo-200">Sign Here</div>
                            </div>
                        ) : null
                    ) : null}
                </DragOverlay>

                {/* Toolbar / Header */}
                <header className="no-print h-14 md:h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-6 flex items-center justify-between flex-shrink-0 z-30 shadow-sm relative transition-all duration-300">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={handleBack}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors flex-shrink-0"
                            title="Back"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="min-w-0 relative">
                            <div className="flex items-center gap-2">
                                <input
                                    ref={nameInputRef}
                                    type="text"
                                    value={documentName}
                                    onChange={(e) => {
                                        setDocumentName(e.target.value);
                                        if (nameError) setNameError(null);
                                    }}
                                    className={`font-bold text-sm md:text-lg bg-transparent border-b-2 focus:ring-0 p-0 m-0 w-auto min-w-[150px] max-w-[300px] placeholder-slate-400 truncate transition-colors ${nameError ? 'border-red-500 text-slate-800 ring-4 ring-red-500/10' : 'border-transparent hover:border-slate-200 text-slate-800'}`}
                                    placeholder="Enter Document Name"
                                />
                                <button onClick={generateSmartName} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                                    <Wand size={16} />
                                </button>
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full uppercase tracking-wide">Guest Mode</span>
                            </div>
                            <p className="text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:block mt-0.5">
                                Create your document and sign up to save.
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
                            onClick={handleSaveClick}
                            className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium shadow-md transition-all bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Save size={18} />
                            <span>Save & Create Account</span>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative pb-[70px] lg:pb-0">
                    <div className={`no-print w-full lg:w-[400px] h-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto z-20 shadow-sm flex-shrink-0 lg:order-1 ${isDesktop ? 'block' : (activeTab === 'edit' ? 'block' : 'hidden')}`}>
                        <NdaFormSidebar
                            formData={formData}
                            onChange={handleFormChange}
                            docContent={docContent}
                            onContentChange={handleContentChange}
                            addSection={addSection}
                            removeSection={removeSection}
                            updateSection={updateSection}
                            reorderSections={reorderSections}
                            styles={styles}
                            onStyleUpdate={updateStyle}
                            onStyleReset={resetStyles}
                        />
                    </div>

                    <div className={`flex-1 h-full overflow-y-auto bg-slate-50/50 p-4 md:p-8 sm:p-12 flex justify-center items-start scrollbar-thin scrollbar-thumb-slate-300 lg:order-2 ${isDesktop ? 'flex' : (activeTab === 'preview' ? 'flex' : 'hidden')}`} style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                        <NdaDocumentPreview
                            data={deferredFormData}
                            content={deferredDocContent}
                            zoom={zoom}
                            signatures={signatures}
                            onUpdateSignature={updateSignature}
                            onRemoveSignature={removeSignature}
                            onEditSignature={handleEditSignature}
                            styles={styles}
                        />

                        {!isDesktop && activeTab === 'preview' && (
                            <button onClick={handleAddSignatureMobile} className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center hover:bg-indigo-700 transition-transform active:scale-95 z-30">
                                <span className="text-2xl font-bold">+</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Tab Bar */}
                {!isDesktop && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-between items-center px-6 py-3 pb-safe z-40 safe-area-bottom">
                        <button onClick={() => setActiveTab('edit')} className={`flex flex-col items-center gap-1 ${activeTab === 'edit' ? 'text-indigo-600' : 'text-slate-400'}`}>
                            <span className="text-[10px] font-medium">Editor</span>
                        </button>
                        <button onClick={() => setActiveTab('preview')} className={`flex flex-col items-center gap-1 ${activeTab === 'preview' ? 'text-indigo-600' : 'text-slate-400'}`}>
                            <span className="text-[10px] font-medium">Preview</span>
                        </button>
                        <button onClick={handleSaveClick} className="flex flex-col items-center gap-1 text-slate-400 active:text-indigo-600">
                            <Save size={24} />
                            <span className="text-[10px] font-medium">Save</span>
                        </button>
                    </div>
                )}
            </div>
        </DndContext>
    );
};

export default GuestNdaEditor;
