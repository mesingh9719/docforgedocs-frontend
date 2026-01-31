import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Users, CheckCircle, Download, Eye, Settings as SettingsIcon, UserPlus, Send } from 'lucide-react';
import PDFUploader from './components/PDFUploader';
import PDFViewer from './components/PDFViewer';
import SignatureCanvas from './components/SignatureCanvas';
import SignerManagement from './components/SignerManagement';
import SignatureConfigModal from '../../../components/Nda/Signatures/SignatureConfigModal';
import SignatureToolbar from '../../../components/Nda/Signatures/SignatureToolbar';
import SignatureField, { SignatureFieldVisual } from '../../../components/Nda/Signatures/SignatureField';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, MouseSensor, TouchSensor } from '@dnd-kit/core';
import DashboardPageHeader from '../../../components/Dashboard/DashboardPageHeader';

const SignatureModule = () => {
    // ... (state)

    // Configure sensors for better compatibility
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement required before drag starts prevents accidental clicks
            },
        })
    );

    // ... (rest of component)

    // In return statement, update DndContext:
    // <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    const [currentStep, setCurrentStep] = useState(1);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [signers, setSigners] = useState([]);
    const [signatures, setSignatures] = useState([]);
    const [completedSignatures, setCompletedSignatures] = useState([]);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [editingSignature, setEditingSignature] = useState(null);
    const [activeDragId, setActiveDragId] = useState(null);
    const [activeDragData, setActiveDragData] = useState(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const pdfViewerRef = useRef(null);

    const steps = [
        { id: 1, title: 'Upload & Place', icon: Upload, description: 'Prepare document' },
        { id: 2, title: 'Review & Send', icon: Send, description: 'Finalize and send' }
    ];

    const handleFileUpload = (file) => {
        setPdfFile(file);
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
        // Stay on Step 1, but View changes because pdfFile is now set
    };

    const handleDragStart = (event) => {
        setActiveDragId(event.active.id);
        setActiveDragData(event.active.data.current);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        // Check if dropped over a specific page
        if (over && over.id.startsWith('page-')) {
            const pageNumber = parseInt(over.id.replace('page-', ''));
            const activeRect = active.rect.current.translated;
            const overRect = over.rect;

            if (activeRect && overRect) {
                // Calculate position relative to the page
                const x = activeRect.left - overRect.left;
                const y = activeRect.top - overRect.top;

                // Convert to percentage for responsiveness/zoom
                const xPercent = (x / overRect.width) * 100;
                const yPercent = (y / overRect.height) * 100;

                if (active.data.current.type === 'toolbar-item') {
                    const newSignature = {
                        id: `sig-${Date.now()}`,
                        type: active.data.current.fieldType,
                        position: { x: xPercent, y: yPercent }, // Store as percentage
                        pageNumber: pageNumber,
                        metadata: {
                            signeeName: '',
                            signeeEmail: '',
                            type: 'all',
                            required: true,
                            order: signatures.length + 1
                        }
                    };
                    setSignatures([...signatures, newSignature]);
                    setEditingSignature(newSignature);
                    setIsConfigModalOpen(true);
                } else if (active.data.current.type === 'signature-field') {
                    // Handle moving existing signature
                    setSignatures(signatures.map(sig => {
                        if (sig.id === active.id) {
                            return {
                                ...sig,
                                pageNumber: pageNumber,
                                position: { x: xPercent, y: yPercent }
                            };
                        }
                        return sig;
                    }));
                }
            }
        }

        setActiveDragId(null);
    };

    const handleUpdateSignature = (updatedMetadata) => {
        // 1. Update the signature's metadata
        setSignatures(signatures.map(sig =>
            sig.id === editingSignature.id
                ? { ...sig, metadata: updatedMetadata }
                : sig
        ));

        // 2. Check if this signer exists, if not, ADD them
        const { signeeName, signeeEmail } = updatedMetadata;

        if (signeeName && signeeEmail) {
            // Check by email to avoid duplicates
            const existingSigner = signers.find(s => s.email.toLowerCase() === signeeEmail.trim().toLowerCase());

            if (existingSigner) {
                // Optional: Update name if changed? For now, we respect the existing roster entry
            } else {
                // CREATE NEW SIGNER
                const newSigner = {
                    id: `signer-${Date.now()}`,
                    name: signeeName,
                    email: signeeEmail,
                    role: 'signer', // Default,
                    order: signers.length + 1
                };
                setSigners(prev => [...prev, newSigner]);
            }
        }
    };

    const handleRemoveSignature = (id) => {
        setSignatures(signatures.filter(sig => sig.id !== id));
    };

    const handleEditSignature = (signature) => {
        setEditingSignature(signature);
        setIsConfigModalOpen(true);
    };

    const handleProceedToReview = () => {
        if (signatures.length === 0) {
            alert('Please add at least one signature field');
            return;
        }

        // SYNC SIGNERS: Remove signers that no longer have any signature fields
        const activeEmails = new Set(
            signatures
                .map(s => s.metadata?.signeeEmail?.toLowerCase()?.trim())
                .filter(Boolean)
        );

        // Filter existing signers
        const validSigners = signers.filter(signer =>
            signer.email && activeEmails.has(signer.email.toLowerCase().trim())
        );

        // Also, if there are any signature fields with emails that AREN'T in the signer list yet (edge case), add them?
        // Typically handleUpdateSignature handles addition. But let's be safe.
        // Actually, let's just stick to cleaning up for now to fix the reporting bug.
        // Re-calculate orders
        const reorderedSigners = validSigners.map((s, index) => ({
            ...s,
            order: index + 1
        }));

        setSigners(reorderedSigners);
        setCurrentStep(2);
    };

    const handleSendDocument = () => {
        // Mock email notification
        const signersToNotify = signers.length > 0 ? signers : signatures.map(sig => sig.metadata);
        const uniqueSigners = [...new Set(signersToNotify.map(s => s.email || s.signeeEmail))];

        if (uniqueSigners.length > 0) {
            alert(`📧 sent to: \n${uniqueSigners.filter(Boolean).join('\n')}`);
        }
        alert("Document Sent Successfully!");
        // Reset or redirect
    };

    // ... (keep pdf generation logic but rename if needed, mainly for "Download" option) ...

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col">
            <DashboardPageHeader
                title="E-Signature Module"
                subtitle="Manage your documents and signers."
            >
                <div className="flex items-center gap-3">
                    {/* Step Indicator inside Header Action Area or below title?
                        Team.jsx has action buttons here. Let's put steps here or keep them separate?
                        Actually, typical wizards have steps *below* header or *as* header.
                        Let's put the Step navigation here for a cleaner look.
                    */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`
                                    flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                                    ${currentStep === step.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}
                                    ${currentStep > step.id ? 'text-indigo-600' : ''}
                                `}
                            >
                                <step.icon size={14} />
                                <span>{step.title}</span>
                            </div>
                        ))}
                    </div>

                    {currentStep === 1 && pdfFile && (
                        <button
                            onClick={() => setPdfFile(null)}
                            className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 hover:bg-red-50 rounded-md transition-colors"
                        >
                            Replace File
                        </button>
                    )}
                </div>
            </DashboardPageHeader>

            <div className="flex-1 flex overflow-hidden bg-slate-50 border border-slate-200 rounded-xl shadow-sm mb-6 relative">
                <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    {/* STEP 1: UPLOAD & PLACE */}
                    {currentStep === 1 && (
                        <>
                            {/* Left Sidebar - Only show if file is uploaded */}
                            {pdfFile && (
                                <div className="w-72 bg-white border-r border-slate-200 flex flex-col z-20 h-full shadow-lg">
                                    <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                            <SettingsIcon size={14} />
                                            Signature Tools
                                        </h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
                                        <p className="text-xs text-slate-500 mb-2 font-medium">Drag fields onto the document</p>
                                        <SignatureToolbar />

                                        <div className="mt-6 pt-6 border-t border-slate-100">
                                            <div className="flex items-center justify-between text-sm mb-3">
                                                <span className="text-slate-600 font-medium">Signers Required</span>
                                                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">{signers.length}</span>
                                            </div>

                                            {/* Mini Signer List */}
                                            <div className="space-y-2">
                                                {signers.map((signer) => (
                                                    <div key={signer.id} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                                        <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-[10px]">
                                                            {signer.order}
                                                        </div>
                                                        <span className="truncate flex-1">{signer.name || signer.email || 'New Signer'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar Footer */}
                                    <div className="p-4 border-t border-slate-200 bg-slate-50 sticky bottom-0 z-10">
                                        <button
                                            onClick={handleProceedToReview}
                                            disabled={signatures.length === 0}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            <span>Review & Send</span>
                                            <CheckCircle size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Main Content - Independent Scroll Area */}
                            <div className="flex-1 bg-slate-100/50 relative flex flex-col h-full overflow-hidden">
                                {!pdfFile ? (
                                    <div className="w-full h-full p-8 flex items-center justify-center overflow-y-auto">
                                        <div className="max-w-xl w-full">
                                            <PDFUploader onFileUpload={handleFileUpload} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full p-4 md:p-8 flex justify-center bg-slate-200/50 relative overflow-hidden">
                                        <div className="w-full h-full bg-white border border-slate-200 relative rounded-xl overflow-hidden">
                                            <div ref={pdfViewerRef} className="h-full w-full relative">
                                                <PDFViewer
                                                    pdfUrl={pdfUrl}
                                                    signatures={signatures}
                                                    onUpdateSignature={handleUpdateSignature}
                                                    onRemoveSignature={handleRemoveSignature}
                                                    onEditSignature={handleEditSignature}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* STEP 2: REVIEW & SEND */}
                    {currentStep === 2 && (
                        <div className="w-full h-full flex bg-slate-50">
                            {/* Review Sidebar */}
                            <div className="w-96 border-r border-slate-200 bg-white flex flex-col h-full shadow-lg z-10">
                                <div className="p-5 border-b border-slate-100 bg-white sticky top-0">
                                    <h2 className="text-lg font-bold text-slate-800">Review Signers</h2>
                                    <p className="text-xs text-slate-500 mt-1">Verify details before sending.</p>
                                </div>

                                <div className="flex-1 overflow-y-auto flex flex-col p-2 scrollbar-thin scrollbar-thumb-slate-200">
                                    <SignerManagement
                                        signers={signers}
                                        onUpdateSigners={setSigners}
                                        readOnly={true}
                                    />
                                </div>

                                <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3 sticky bottom-0">
                                    <button
                                        onClick={handleSendDocument}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-all text-sm"
                                    >
                                        <Send size={18} />
                                        <span>Send Document</span>
                                    </button>
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="w-full py-2 text-slate-500 font-medium hover:text-slate-700 text-sm"
                                    >
                                        Back to Edit
                                    </button>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="flex-1 bg-slate-100/50 relative flex flex-col h-full overflow-hidden">
                                <div className="w-full h-full p-4 md:p-8 flex justify-center bg-slate-200/50 relative overflow-hidden">
                                    <div className="w-full h-full bg-white border border-slate-200 relative rounded-xl overflow-hidden">
                                        <PDFViewer
                                            pdfUrl={pdfUrl}
                                            signatures={signatures}
                                            readOnly={true}
                                            onUpdateSignature={() => { }}
                                            onRemoveSignature={() => { }}
                                            onEditSignature={() => { }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DragOverlay - Inside the Single DndContext */}
                    <DragOverlay dropAnimation={null}>
                        {activeDragId ? (
                            activeDragData?.type === 'toolbar-item' ? (
                                <div className="w-48 px-4 py-3 bg-indigo-600 text-white rounded-lg shadow-xl flex items-center gap-2 opacity-90 cursor-grabbing">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    <span className="font-medium text-sm">Place Field</span>
                                </div>
                            ) : activeDragData?.type === 'signature-field' ? (
                                <div style={{ transform: 'none' }}>
                                    <SignatureFieldVisual
                                        data={activeDragData}
                                        isSelected={true}
                                        isDragging={true}
                                    // We don't need handlers here for the preview
                                    />
                                </div>
                            ) : null
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>


            <SignatureConfigModal
                isOpen={isConfigModalOpen}
                onClose={() => {
                    setIsConfigModalOpen(false);
                    setEditingSignature(null);
                }}
                onSave={handleUpdateSignature}
                initialData={editingSignature?.metadata}
            />
        </div>
    );
};

export default SignatureModule;