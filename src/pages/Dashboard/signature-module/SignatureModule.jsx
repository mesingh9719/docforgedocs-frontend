import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Users, CheckCircle, Download, Eye, Settings as SettingsIcon } from 'lucide-react';
import PDFUploader from './components/PDFUploader';
import PDFViewer from './components/PDFViewer';
import SignatureCanvas from './components/SignatureCanvas';
import SignerManagement from './components/SignerManagement';
import SignatureConfigModal from '../../../components/Nda/Signatures/SignatureConfigModal';
import SignatureLayer from '../../../components/Nda/Signatures/SignatureLayer';
import SignatureToolbar from '../../../components/Nda/Signatures/SignatureToolbar';
import { DndContext, DragOverlay } from '@dnd-kit/core';

const SignatureModule = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [signers, setSigners] = useState([]);
    const [signatures, setSignatures] = useState([]);
    const [completedSignatures, setCompletedSignatures] = useState([]);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [editingSignature, setEditingSignature] = useState(null);
    const [activeDragId, setActiveDragId] = useState(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const pdfViewerRef = useRef(null);

    const steps = [
        { id: 1, title: 'Upload Document', icon: Upload, description: 'Upload your PDF document' },
        { id: 2, title: 'Place Signatures', icon: FileText, description: 'Add signature fields' },
        { id: 3, title: 'Collect Signatures', icon: Users, description: 'Get signatures from signers' },
        { id: 4, title: 'Complete', icon: CheckCircle, description: 'Download signed document' }
    ];

    const handleFileUpload = (file) => {
        setPdfFile(file);
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
        setCurrentStep(2);
    };

    const handleDragStart = (event) => {
        setActiveDragId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (over && over.id === 'document-canvas') {
            const rect = event.activatorEvent.target.getBoundingClientRect();
            const containerRect = pdfViewerRef.current?.getBoundingClientRect();
            
            if (containerRect) {
                const x = event.delta.x + rect.left - containerRect.left;
                const y = event.delta.y + rect.top - containerRect.top;
                
                if (active.data.current.type === 'toolbar-item') {
                    const newSignature = {
                        id: `sig-${Date.now()}`,
                        type: active.data.current.fieldType,
                        position: { x: Math.max(0, x), y: Math.max(0, y) },
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
                }
            }
        }
        
        setActiveDragId(null);
    };

    const handleUpdateSignature = (updatedMetadata) => {
        setSignatures(signatures.map(sig => 
            sig.id === editingSignature.id 
                ? { ...sig, metadata: updatedMetadata }
                : sig
        ));
    };

    const handleRemoveSignature = (id) => {
        setSignatures(signatures.filter(sig => sig.id !== id));
    };

    const handleEditSignature = (signature) => {
        setEditingSignature(signature);
        setIsConfigModalOpen(true);
    };

    const handleProceedToSigning = () => {
        if (signatures.length === 0) {
            alert('Please add at least one signature field');
            return;
        }
        setCurrentStep(3);
    };

    const handleCompleteSignature = (signatureData) => {
        setCompletedSignatures([...completedSignatures, signatureData]);
        
        const allSigned = signatures.every(sig => 
            completedSignatures.some(cs => cs.fieldId === sig.id) || 
            signatureData.fieldId === sig.id
        );
        
        if (allSigned) {
            setCurrentStep(4);
        }
    };

    const handleDownload = () => {
        console.log('Downloading signed PDF with signatures:', completedSignatures);
        alert('Download functionality would be implemented here');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <FileText className="text-white" size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800 tracking-tight">E-Signature Module</h1>
                                <p className="text-xs text-slate-500 font-medium">Sign documents digitally with ease</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {currentStep >= 2 && currentStep < 4 && (
                                <button
                                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    <Eye size={16} />
                                    {isPreviewMode ? 'Edit Mode' : 'Preview'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center gap-2">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            backgroundColor: currentStep >= step.id ? '#6366f1' : '#e2e8f0',
                                            scale: currentStep === step.id ? 1.1 : 1
                                        }}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                                            currentStep >= step.id ? 'shadow-indigo-200' : 'shadow-slate-200'
                                        }`}
                                    >
                                        <step.icon 
                                            size={20} 
                                            className={currentStep >= step.id ? 'text-white' : 'text-slate-400'} 
                                            strokeWidth={2.5}
                                        />
                                    </motion.div>
                                    <div className="text-center hidden sm:block">
                                        <p className={`text-xs font-bold ${
                                            currentStep >= step.id ? 'text-indigo-600' : 'text-slate-400'
                                        }`}>
                                            {step.title}
                                        </p>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-16 h-1 rounded-full transition-colors ${
                                        currentStep > step.id ? 'bg-indigo-600' : 'bg-slate-200'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-3xl mx-auto"
                        >
                            <PDFUploader onFileUpload={handleFileUpload} />
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="place-signatures"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
                        >
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <SettingsIcon size={20} className="text-indigo-600" />
                                        Signature Tools
                                    </h3>
                                    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                                        <SignatureToolbar />
                                    </DndContext>
                                    
                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <h4 className="text-sm font-bold text-slate-700 mb-3">
                                            Placed Fields ({signatures.length})
                                        </h4>
                                        {signatures.length === 0 ? (
                                            <p className="text-xs text-slate-500 italic">
                                                Drag fields onto the document
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                {signatures.map((sig) => (
                                                    <div 
                                                        key={sig.id}
                                                        className="p-2 bg-slate-50 rounded-lg text-xs flex items-center justify-between"
                                                    >
                                                        <span className="font-medium text-slate-700 truncate">
                                                            {sig.metadata.signeeName || 'Unnamed Signer'}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 bg-white px-2 py-1 rounded">
                                                            #{sig.metadata.order}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleProceedToSigning}
                                        disabled={signatures.length === 0}
                                        className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Proceed to Signing
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-3">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                                        <div ref={pdfViewerRef} className="relative">
                                            <PDFViewer pdfUrl={pdfUrl} />
                                            <SignatureLayer
                                                signatures={signatures}
                                                onUpdateSignature={handleUpdateSignature}
                                                onRemoveSignature={handleRemoveSignature}
                                                onEditSignature={handleEditSignature}
                                            />
                                        </div>
                                        <DragOverlay>
                                            {activeDragId ? (
                                                <div className="w-64 h-24 bg-indigo-100 border-2 border-indigo-400 rounded-lg opacity-75" />
                                            ) : null}
                                        </DragOverlay>
                                    </DndContext>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div
                            key="collect-signatures"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <SignatureCanvas
                                signatures={signatures}
                                pdfUrl={pdfUrl}
                                onComplete={handleCompleteSignature}
                                onBack={() => setCurrentStep(2)}
                            />
                        </motion.div>
                    )}

                    {currentStep === 4 && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                    className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-200"
                                >
                                    <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
                                </motion.div>
                                
                                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                                    Document Signed Successfully!
                                </h2>
                                <p className="text-slate-600 mb-8">
                                    All signatures have been collected and your document is ready to download.
                                </p>

                                <div className="bg-slate-50 rounded-xl p-6 mb-8">
                                    <h3 className="text-sm font-bold text-slate-700 mb-4">Signature Summary</h3>
                                    <div className="space-y-3">
                                        {signatures.map((sig) => {
                                            const completed = completedSignatures.find(cs => cs.fieldId === sig.id);
                                            return (
                                                <div key={sig.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                                            <CheckCircle size={16} className="text-emerald-600" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-medium text-slate-700">
                                                                {sig.metadata.signeeName}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {completed?.timestamp || 'Just now'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-medium text-emerald-600">
                                                        Signed
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all"
                                    >
                                        <Download size={20} />
                                        Download Signed PDF
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPdfFile(null);
                                            setPdfUrl(null);
                                            setSignatures([]);
                                            setCompletedSignatures([]);
                                            setCurrentStep(1);
                                        }}
                                        className="px-8 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-all"
                                    >
                                        Sign Another Document
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

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