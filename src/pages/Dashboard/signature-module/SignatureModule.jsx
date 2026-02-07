import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, Send, ArrowRight, Settings as SettingsIcon, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PDFUploader from './components/PDFUploader';
import PDFViewer from './components/PDFViewer';
import SignerManagement from './components/SignerManagement';
import SignatureConfigModal from '../../../components/Nda/Signatures/SignatureConfigModal';
import SignatureToolbar from '../../../components/Nda/Signatures/SignatureToolbar';
import SignatureField, { SignatureFieldVisual } from '../../../components/Nda/Signatures/SignatureField';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor, MouseSensor } from '@dnd-kit/core';
import DashboardPageHeader from '../../../components/Dashboard/DashboardPageHeader';

// Mobile Drawers
import MobileSignatureTools from './components/MobileSignatureTools';
import MobileSignerReview from './components/MobileSignerReview';
import PageThumbnailsSidebar from './components/PageThumbnailsSidebar';

const SignatureModule = () => {
    const navigate = useNavigate();

    // Configure sensors for touch support
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, // Slight delay to distinguish scroll from drag
                tolerance: 5,
            },
        })
    );

    const [currentStep, setCurrentStep] = useState(1);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [signers, setSigners] = useState([]);
    const [signatures, setSignatures] = useState([]);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [editingSignature, setEditingSignature] = useState(null);
    const [activeDragId, setActiveDragId] = useState(null);
    const [activeDragData, setActiveDragData] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [sidebarTab, setSidebarTab] = useState('tools'); // 'tools' or 'pages'

    // Mobile States
    const [showMobileTools, setShowMobileTools] = useState(false);
    const [showMobileReview, setShowMobileReview] = useState(false);

    // Sending State
    const [isSending, setIsSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [sendError, setSendError] = useState(null);
    const [redirectProgress, setRedirectProgress] = useState(0);

    const pdfViewerRef = useRef(null);

    const steps = [
        { id: 1, title: 'Upload & Place', icon: Upload },
        { id: 2, title: 'Review & Send', icon: Send }
    ];

    // Effect for Auto-Redirect
    useEffect(() => {
        let interval;
        if (sendSuccess) {
            setRedirectProgress(0);
            const duration = 5000;
            const intervalTime = 50;
            const steps = duration / intervalTime;

            interval = setInterval(() => {
                setRedirectProgress(prev => {
                    const next = prev + (100 / steps);
                    if (next >= 100) {
                        clearInterval(interval);
                        toast.success('Document sent successfully!');
                        navigate('/signatures/list');
                        return 100;
                    }
                    return next;
                });
            }, intervalTime);
        }
        return () => clearInterval(interval);
    }, [sendSuccess, navigate]);

    const handleFileUpload = (file) => {
        setPdfFile(file);
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
    };

    const handleDragStart = (event) => {
        setActiveDragId(event.active.id);
        setActiveDragData(event.active.data.current);
        // On mobile, if dragging from toolbar, we might want to close the drawer?
        // But dragging directly from drawer to background needs careful coordination.
        // For simplicity, we assume robust DnD library handling.
        // Actually, DnD from a fixed drawer onto another layer is tricky.
        // Strategy: "Tap to Add" is often better for mobile.
        // But let's try keep drag interaction first.
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && over.id.startsWith('page-')) {
            const pageNumber = parseInt(over.id.replace('page-', ''));
            const activeRect = active.rect.current.translated;
            const overRect = over.rect;

            if (activeRect && overRect) {
                const x = activeRect.left - overRect.left;
                const y = activeRect.top - overRect.top;
                const xPercent = (x / overRect.width) * 100;
                const yPercent = (y / overRect.height) * 100;

                if (active.data.current.type === 'toolbar-item') {
                    const newSignature = {
                        id: `sig-${Date.now()}`,
                        type: active.data.current.fieldType,
                        position: { x: xPercent, y: yPercent },
                        pageNumber: pageNumber,
                        metadata: {
                            fieldType: active.data.current.fieldType,
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
                    setShowMobileTools(false); // Close drawer after drop
                } else if (active.data.current.type === 'signature-field') {
                    setSignatures(signatures.map(sig => {
                        if (sig.id === active.id) {
                            return { ...sig, pageNumber, position: { x: xPercent, y: yPercent } };
                        }
                        return sig;
                    }));
                }
            }
        }
        setActiveDragId(null);
    };

    const handleUpdateSignature = (updatedMetadata) => {
        if (!editingSignature) return;

        setSignatures(signatures.map(sig =>
            sig.id === editingSignature.id ? { ...sig, metadata: updatedMetadata } : sig
        ));

        const { signeeName, signeeEmail } = updatedMetadata;
        if (signeeName && signeeEmail) {
            const existingSigner = signers.find(s => s.email.toLowerCase() === signeeEmail.trim().toLowerCase());
            if (!existingSigner) {
                setSigners(prev => [...prev, {
                    id: `signer-${Date.now()}`,
                    name: signeeName,
                    email: signeeEmail,
                    role: 'signer',
                    order: signers.length + 1
                }]);
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
            toast.error('Please add at least one signature field');
            return;
        }

        // Sync Signers
        const activeEmails = new Set(signatures.map(s => s.metadata?.signeeEmail?.toLowerCase()?.trim()).filter(Boolean));
        const validSigners = signers.filter(signer => signer.email && activeEmails.has(signer.email.toLowerCase().trim()));
        const reorderedSigners = validSigners.map((s, index) => ({ ...s, order: index + 1 }));

        setSigners(reorderedSigners);
        setCurrentStep(2);
        setShowMobileTools(false);
    };

    const handleSendDocument = async () => {
        if (!pdfFile) return;
        setIsSending(true);
        setSendError(null);

        try {
            // Upload
            const formData = new FormData();
            formData.append('file', pdfFile);
            formData.append('name', pdfFile.name);

            const uploadRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signatures/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData
            });

            if (!uploadRes.ok) throw new Error('Failed to upload document');
            const documentId = (await uploadRes.json()).data.id;

            // Send
            const fields = signatures.map(sig => ({
                signerId: signers.find(s => s.email === sig.metadata.signeeEmail)?.id,
                type: 'signature',
                pageNumber: sig.pageNumber,
                x: sig.position.x,
                y: sig.position.y,
                width: 200,
                height: 60,
                metadata: sig.metadata
            }));

            const payloadSigners = signers.map(s => ({
                id: s.id, name: s.name, email: s.email, order: s.order
            }));

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signatures/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ document_id: documentId, signers: payloadSigners, fields })
            });

            if (!response.ok) throw new Error('Failed to send signature request');
            setSendSuccess(true);
        } catch (error) {
            console.error('Sending Error:', error);
            setSendError(error.message || 'Failed to send.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col font-sans">
            <DashboardPageHeader
                title="E-Signature Module"
                subtitle="Prepare and send documents"
            >
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${currentStep === step.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                <step.icon size={14} />
                                <span className="hidden md:inline">{step.title}</span>
                            </div>
                        ))}
                    </div>

                    {currentStep === 1 && pdfFile && (
                        <button
                            onClick={() => setShowMobileTools(true)}
                            className="lg:hidden p-2 bg-indigo-600 text-white rounded-lg shadow-md active:scale-95 transition-transform"
                        >
                            <SettingsIcon size={20} />
                        </button>
                    )}
                </div>
            </DashboardPageHeader>

            <div className="flex-1 flex overflow-hidden bg-slate-50 border border-slate-200 rounded-xl shadow-sm mb-6 relative">
                <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    {/* STEP 1: UPLOAD & PLACE */}
                    {currentStep === 1 && (
                        <>
                            {/* Desktop Sidebar */}
                            {pdfFile && (
                                <div className="w-80 bg-white border-r border-slate-200 hidden lg:flex flex-col z-20 h-full">
                                    {/* Sidebar Tabs */}
                                    <div className="flex items-center border-b border-slate-200">
                                        <button
                                            onClick={() => setSidebarTab('tools')}
                                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${sidebarTab === 'tools' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                                        >
                                            Tools
                                        </button>
                                        <button
                                            onClick={() => setSidebarTab('pages')}
                                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${sidebarTab === 'pages' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                                        >
                                            Pages
                                        </button>
                                    </div>

                                    {sidebarTab === 'tools' ? (
                                        <>
                                            <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                    <SettingsIcon size={14} />
                                                    Signature Tools
                                                </h3>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                                <SignatureToolbar />
                                                <div className="pt-6 border-t border-slate-100">
                                                    <div className="flex items-center justify-between text-sm mb-3">
                                                        <span className="text-slate-600 font-medium">Signers Required</span>
                                                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">{signers.length}</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {signers.map((signer) => (
                                                            <div key={signer.id} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                                                <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-[10px]">{signer.order}</div>
                                                                <span className="truncate flex-1">{signer.name || signer.email || 'New Signer'}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 border-t border-slate-200 bg-slate-50">
                                                <button
                                                    onClick={handleProceedToReview}
                                                    disabled={signatures.length === 0}
                                                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg hover:shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span>Review & Send</span>
                                                    <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <PageThumbnailsSidebar
                                            pdfUrl={pdfUrl}
                                            numPages={numPages}
                                            currentPage={1} // You might want to track current page from PDFViewer
                                            onPageClick={(page) => {
                                                const el = document.getElementById(`pdf-page-${page}`); // PDFViewer needs to set IDs
                                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            signatures={signatures}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Main Canvas */}
                            <div className="flex-1 bg-slate-100/50 relative flex flex-col h-full overflow-hidden">
                                {!pdfFile ? (
                                    <div className="w-full h-full p-6 flex items-center justify-center overflow-y-auto">
                                        <div className="w-full h-full flex items-center justify-center">
                                            <PDFUploader onFileUpload={handleFileUpload} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full p-4 md:p-8 flex justify-center bg-slate-200/50 relative overflow-hidden">
                                        <div className="w-full h-full bg-white border border-slate-200 relative rounded-xl overflow-hidden shadow-sm">
                                            <div ref={pdfViewerRef} className="h-full w-full relative">
                                                <PDFViewer
                                                    pdfUrl={pdfUrl}
                                                    signatures={signatures}
                                                    onUpdateSignature={handleUpdateSignature}
                                                    onRemoveSignature={handleRemoveSignature}
                                                    onEditSignature={handleEditSignature}
                                                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
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
                            {/* Desktop Review Sidebar */}
                            <div className="w-96 border-r border-slate-200 bg-white hidden lg:flex flex-col h-full shadow-lg z-10">
                                <div className="p-5 border-b border-slate-100 bg-white">
                                    <h2 className="text-lg font-bold text-slate-800">Review Signers</h2>
                                    <p className="text-xs text-slate-500 mt-1">Verify details before sending.</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200">
                                    <SignerManagement signers={signers} onUpdateSigners={setSigners} readOnly={true} />
                                </div>
                                <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                                    <button
                                        onClick={handleSendDocument}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg hover:shadow-emerald-600/20 transition-all"
                                    >
                                        <Send size={18} />
                                        <span>Send Document</span>
                                    </button>
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="w-full py-2.5 text-slate-500 font-medium hover:text-slate-800 bg-white border border-slate-200 rounded-lg"
                                    >
                                        Back to Edit
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Review Button Overlay */}
                            <div className="lg:hidden absolute bottom-6 w-full flex justify-center z-30 pointer-events-none">
                                <button
                                    onClick={() => setShowMobileReview(true)}
                                    className="pointer-events-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-2xl flex items-center gap-2 animate-bounce"
                                >
                                    <Send size={18} />
                                    <span>Finalize & Send</span>
                                </button>
                            </div>

                            {/* Preview Window */}
                            <div className="flex-1 bg-slate-100/50 relative flex flex-col h-full overflow-hidden">
                                <div className="w-full h-full p-4 md:p-8 flex justify-center bg-slate-200/50 relative overflow-hidden">
                                    <div className="w-full h-full bg-white border border-slate-200 relative rounded-xl overflow-hidden shadow-sm">
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

                    <DragOverlay dropAnimation={null}>
                        {activeDragId ? (
                            <div className="w-48 px-4 py-3 bg-indigo-600 text-white rounded-lg shadow-xl flex items-center gap-2 opacity-90 cursor-grabbing">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                <span className="font-medium text-sm">Place Field</span>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {/* Mobile Interactables */}
            <MobileSignatureTools
                show={showMobileTools}
                onClose={() => setShowMobileTools(false)}
                signers={signers}
                onProceed={handleProceedToReview}
                canProceed={signatures.length > 0}
            />

            <MobileSignerReview
                show={showMobileReview}
                onClose={() => setShowMobileReview(false)}
                signers={signers}
                onUpdateSigners={setSigners}
                onSend={handleSendDocument}
                onBack={() => { setShowMobileReview(false); setCurrentStep(1); }}
            />

            <SignatureConfigModal
                isOpen={isConfigModalOpen}
                onClose={() => { setIsConfigModalOpen(false); setEditingSignature(null); }}
                onSave={handleUpdateSignature}
                initialData={editingSignature?.metadata}
            />

            {/* Sending Overlay */}
            <AnimatePresence>
                {(isSending || sendSuccess || sendError) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
                    >
                        <motion.div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-lg overflow-hidden border border-white/20">
                            <div className="p-8 pb-10 flex flex-col items-center text-center relative z-10">
                                {isSending && (
                                    <>
                                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">Sending Document...</h3>
                                        <p className="text-slate-500">Dispatching to all signers securely.</p>
                                    </>
                                )}
                                {sendSuccess && (
                                    <>
                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">Sent Successfully!</h3>
                                        <div className="w-full max-w-xs h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4 mt-2">
                                            <motion.div className="h-full bg-emerald-500" style={{ width: `${redirectProgress}%` }} />
                                        </div>
                                        <button onClick={() => navigate('/signatures/list')} className="text-sm font-bold text-indigo-600">Redirecting...</button>
                                    </>
                                )}
                                {sendError && (
                                    <>
                                        <p className="text-red-500 text-lg font-bold mb-4">{sendError}</p>
                                        <button onClick={() => setSendError(null)} className="px-6 py-2 bg-slate-900 text-white rounded-lg">Try Again</button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SignatureModule;