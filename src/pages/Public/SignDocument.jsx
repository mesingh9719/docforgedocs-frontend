

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { pdfjs, Document as PdfDocument, Page } from 'react-pdf';
import { Loader, AlertCircle, CheckCircle, Save, PenTool, Type, Upload as UploadIcon, Trash2, RotateCcw, ZoomIn, ZoomOut, ArrowRight, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import SignedFieldDisplay from './SignedFieldDisplay';
import { useAuth } from '../../context/AuthContext'; // Optional, might not be logged in

// Setup PDF worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const SignDocument = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [documentData, setDocumentData] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [fields, setFields] = useState([]);
    const [pageDimensions, setPageDimensions] = useState({}); // Track actual PDF page sizes
    const [scale, setScale] = useState(1.0); // Zoom scale
    const [currentPage, setCurrentPage] = useState(1); // Track current page in view

    // Signing State
    const [signingField, setSigningField] = useState(null); // Field being signed
    const [signatureMethod, setSignatureMethod] = useState('text'); // text, draw, upload
    const [textSignature, setTextSignature] = useState('');
    const [drawnSignature, setDrawnSignature] = useState(null);
    const [uploadedSignature, setUploadedSignature] = useState(null);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Guided Signing
    const [activeFieldIndex, setActiveFieldIndex] = useState(-1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Derived state for required fields
    const requiredFields = fields.filter(f => f.metadata?.isMine && f.metadata?.required && !f.metadata?.value)
        .sort((a, b) => (a.pageNumber - b.pageNumber) || (a.position.y - b.position.y));

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                // Using the specific public endpoint for signatures
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/signatures/${token}`);
                const { document, current_signer, pdf_url } = response.data;

                setDocumentData(document);
                setCurrentUser(current_signer);
                setPdfUrl(pdf_url);

                // Map API fields to UI format
                const mappedFields = (document.fields || []).map(f => ({
                    id: f.id,
                    type: f.type,
                    pageNumber: f.page_number,
                    position: { x: f.x_position, y: f.y_position },
                    size: { width: f.width, height: f.height },
                    metadata: {
                        ...f.metadata,
                        isMine: f.signer_id === current_signer.id,
                        value: f.value,
                        signeeName: f.signer_id === current_signer.id ? "You" : (document.signers.find(s => s.id === f.signer_id)?.name || "Other")
                    },
                    signerId: f.signer_id
                }));
                setFields(mappedFields);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching signature session:", err);
                setError(err.response?.data?.message || "Failed to load document.");
                setLoading(false);
            }
        };

        if (token) fetchDocument();
    }, [token]);

    // Canvas Logic
    const [pdfWidth, setPdfWidth] = useState(800);

    useEffect(() => {
        const updateWidth = () => {
            const container = document.getElementById('pdf-wrapper');
            if (container) {
                const newWidth = container.clientWidth - 32; // 32px padding
                // Cap at 800px for desktop, but allow full width on mobile
                setPdfWidth(Math.min(newWidth, 800));
            }
        };

        // Initial measurement
        updateWidth();

        // Add listener
        window.addEventListener('resize', updateWidth);
        const timer = setTimeout(updateWidth, 500); // Check again after layout stabilizes

        return () => {
            window.removeEventListener('resize', updateWidth);
            clearTimeout(timer);
        };
    }, []); // Run once on mount

    useEffect(() => {
        if (signingField && signatureMethod === 'draw' && canvasRef.current) {
            const canvas = canvasRef.current;
            // High DPI Canvas
            const ratio = window.devicePixelRatio || 1;
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;

            const context = canvas.getContext('2d');
            context.scale(ratio, ratio);
            context.lineCap = 'round';
            context.strokeStyle = '#1e293b'; // Slate-800
            context.lineWidth = 2.5;
            contextRef.current = context;
        }
    }, [signingField, signatureMethod]);

    const startDrawing = (e) => {
        setIsDrawing(true);
        // Handle both mouse and touch events
        const { offsetX, offsetY } = getCoordinates(e);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        contextRef.current = context;
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault(); // Stop scrolling on mobile

        const { offsetX, offsetY } = getCoordinates(e);
        if (contextRef.current) {
            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
        }
    };

    const getCoordinates = (e) => {
        if (e.touches && e.touches[0]) {
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        }
        return {
            offsetX: e.nativeEvent.offsetX,
            offsetY: e.nativeEvent.offsetY
        };
    };

    const stopDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
        if (canvasRef.current) setDrawnSignature(canvasRef.current.toDataURL());
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        context.clearRect(0, 0, canvas.width, canvas.height); // Note: verify clear rect with scaling
        // Reset full canvas
        canvas.width = canvas.width;
        // Re-scale
        const ratio = window.devicePixelRatio || 1;
        context.scale(ratio, ratio);
        context.lineCap = 'round';
        context.strokeStyle = '#1e293b';
        context.lineWidth = 2.5;

        setDrawnSignature(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setUploadedSignature(e.target.result);
            reader.readAsDataURL(file);
        }
    };



    const handleNextField = () => {
        const nextField = requiredFields[0];
        if (nextField) {
            handleFieldClick(nextField);
            // Also scroll to it
            const pageEl = document.getElementById(`pdf-page-${nextField.pageNumber}`);
            if (pageEl) {
                pageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            toast.success("All required fields completed!");
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleFieldClick = (field) => {
        // Only allow clicking my fields that haven't been signed yet
        if (field.metadata.isMine) {
            const { fieldType } = field.metadata;
            const isSigned = !!field.metadata.value;

            // Checkbox: Toggle on/off even if "signed" (to allow unchecking)
            if (fieldType === 'checkbox') {
                const newValue = field.metadata.value === 'true' ? '' : 'true';
                updateFieldValue(field.id, newValue, 'checkbox');
                return;
            }

            // Date: Auto-fill if empty
            if (fieldType === 'date') {
                if (!field.metadata.value) {
                    const today = new Date().toLocaleDateString();
                    updateFieldValue(field.id, today, 'date');
                    toast.success("Date filled");
                }
                return;
            }

            // If already signed (and not checkbox), prevent re-signing
            if (isSigned) {
                toast("You have already signed this field.");
                return;
            }

            setSigningField(field);

            // Determine allowed method
            if (fieldType === 'text' || fieldType === 'initials') {
                // If it is a text field, default to text input mode
                if (fieldType === 'text') {
                    setSignatureMethod('text_input');
                    setTextSignature(field.metadata.value || '');
                    return;
                }
                // If initials, maybe default to draw or text, but use standard signature modal for now
            }

            // Standard Signature Logic
            const allowedType = field.metadata.type || 'all';
            let defaultMethod = 'text';
            if (allowedType === 'draw') defaultMethod = 'draw';
            if (allowedType === 'upload') defaultMethod = 'upload';
            setSignatureMethod(defaultMethod);

            // Reset states
            setTextSignature('');
            setDrawnSignature(null);
            setUploadedSignature(null);
        }
    };

    const updateFieldValue = (fieldId, val, type) => {
        setFields(prev => prev.map(f =>
            f.id === fieldId
                ? {
                    ...f,
                    metadata: {
                        ...f.metadata,
                        value: val,
                        signatureType: type
                    }
                }
                : f
        ));
    };

    const getSignatureValue = () => {
        if (signatureMethod === 'text' || signatureMethod === 'text_input') return textSignature.trim();
        if (signatureMethod === 'draw') return drawnSignature;
        if (signatureMethod === 'upload') return uploadedSignature;
        return null;
    };

    const submitSignature = async () => {
        const value = getSignatureValue();
        if (!signingField || !value) {
            toast.error("Please provide a signature.");
            return;
        }

        try {
            // Optimistic update locally
            setFields(prev => prev.map(f =>
                f.id === signingField.id
                    ? {
                        ...f,
                        metadata: {
                            ...f.metadata,
                            value: value,
                            signatureType: signatureMethod // Store how it was signed
                        }
                    }
                    : f
            ));

            setSigningField(null);
            toast.success("Signature saved locally. Click 'Finish Signing' when done.");

        } catch (error) {
            console.error(error);
            toast.error("Error updating signature.");
        }
    };

    const handleFinishSigning = async () => {
        const myFields = fields.filter(f => f.metadata.isMine);
        const unsignedFields = myFields.filter(f => !f.metadata.value);

        if (unsignedFields.length > 0) {
            toast.error(`Please sign all ${unsignedFields.length} remaining fields marked as "You".`);
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                fields: myFields.map(f => ({
                    id: f.id,
                    value: f.metadata.value
                }))
            };

            console.log('=== SIGNATURE SUBMISSION DEBUG ===');
            console.log('Token:', token);
            console.log('Payload:', JSON.stringify(payload, null, 2));
            console.log('Number of fields:', payload.fields.length);
            payload.fields.forEach((f, idx) => {
                console.log(`Field ${idx}:`, {
                    id: f.id,
                    valueType: typeof f.value,
                    valueLength: f.value ? f.value.length : 0,
                    valuePreview: f.value ? f.value.substring(0, 100) : 'null'
                });
            });
            console.log('===================================');

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/signatures/${token}/sign`, payload);

            toast.success("Document signed successfully!");
            setTimeout(() => {
                setDocumentData(prev => ({ ...prev, status: 'completed' }));
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to submit signatures.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="text-red-600" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">Go Home</button>
                </div>
            </div>
        );
    }

    // Success State
    if (currentUser?.status === 'signed' || documentData?.status === 'completed') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Document Signed!</h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for signing <strong>{documentData?.name}</strong>.
                        A copy has been sent to all parties.
                    </p>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Return Home</button>
                </div>
            </div>
        );
    }

    // Determine allowed tabs for modal
    const allowedType = signingField?.metadata?.type || 'all';
    const showText = allowedType === 'all' || allowedType === 'text';
    const showDraw = allowedType === 'all' || allowedType === 'draw';
    const showUpload = allowedType === 'all' || allowedType === 'upload';

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            {/* Header */}
            {/* Mobile Header (Native App Style) */}
            <header className="bg-white shadow-sm border-b border-slate-100 flex items-center justify-between px-4 h-14 sticky top-0 z-50 md:hidden">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-800 active:bg-slate-100 rounded-full transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-base font-semibold text-slate-900 truncate max-w-[200px]">{documentData?.name}</h1>
                </div>
                {/* Optional: Right side action or indicator */}
                <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs ring-2 ring-indigo-100">
                    {fields.filter(f => f.metadata?.value).length}/{fields.filter(f => f.metadata?.isMine).length}
                </div>
            </header>

            {/* Desktop Header */}
            <header className="bg-white shadow px-6 py-4 hidden md:flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 text-white p-2 rounded-lg"><CheckCircle size={20} /></div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 leading-tight">{documentData?.name}</h1>
                        <p className="text-xs text-slate-500">Request from {documentData?.creator?.name || 'Sender'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-slate-600">Signing as: <span className="font-semibold text-slate-900">{currentUser?.name}</span></p>
                    <button
                        onClick={handleFinishSigning}
                        disabled={isSubmitting}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition-all shadow-sm ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md active:transform active:scale-95'}`}
                    >
                        {isSubmitting ? <><Loader size={18} className="animate-spin" /> Submitting...</> : <><Save size={18} /> Finish Signing</>}
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-hidden flex justify-center p-4 md:p-8">
                <div className="w-full max-w-7xl h-[calc(100vh-140px)] md:h-[calc(100vh-180px)] bg-white border border-slate-200 relative rounded-xl overflow-hidden shadow-2xl flex">

                    {/* Mobile Sidebar Overlay */}
                    {isSidebarOpen && (
                        <div className="absolute inset-0 z-50 flex md:hidden">
                            <div className="bg-white w-64 h-full shadow-2xl overflow-y-auto p-4 animate-in slide-in-from-left duration-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-slate-800 text-lg">Menu</h3>
                                    <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                                        <X size={24} className="text-slate-500" />
                                    </button>
                                </div>
                                {/* Reusing Sidebar Content Logic - Ideally this should be a component */}
                                <div className="space-y-4">
                                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                        <p className="text-xs text-indigo-800 font-semibold uppercase tracking-wider mb-1">Your Progress</p>
                                        <div className="text-2xl font-bold text-indigo-600 mb-2">
                                            {fields.filter(f => f.metadata?.value).length}/{fields.filter(f => f.metadata?.isMine).length}
                                        </div>
                                        <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-indigo-100">
                                            <div
                                                className="bg-indigo-500 h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${fields.filter(f => f.metadata?.isMine).length === 0 ? 0 : (fields.filter(f => f.metadata?.value).length / fields.filter(f => f.metadata?.isMine).length) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pages</p>
                                        {numPages && Array.from({ length: numPages }, (_, index) => {
                                            const pageNum = index + 1;
                                            const isActive = currentPage === pageNum;
                                            return (
                                                <button
                                                    key={`mob-nav-${pageNum}`}
                                                    onClick={() => {
                                                        const el = document.getElementById(`pdf-page-${pageNum}`);
                                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                                        setCurrentPage(pageNum);
                                                        setIsSidebarOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                    Page {pageNum}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
                        </div>
                    )}

                    {/* Enhanced Page Navigation Sidebar (Desktop) */}
                    <div className="w-64 bg-gradient-to-b from-slate-50 to-slate-100/50 border-r border-slate-200 overflow-y-auto p-4 hidden md:block scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200">
                        {/* Header */}
                        <div className="mb-4">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                                Pages
                            </h3>

                            {/* Enhanced Progress Card */}
                            <div className="bg-white rounded-xl p-3 mb-4 border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-slate-600">Signing Progress</span>
                                    <span className="text-sm font-bold text-indigo-600">
                                        {fields.filter(f => f.metadata?.value).length}/{fields.filter(f => f.metadata?.isMine).length}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            width: `${fields.filter(f => f.metadata?.isMine).length === 0 ? 0 : (fields.filter(f => f.metadata?.value).length / fields.filter(f => f.metadata?.isMine).length) * 100}%`
                                        }}
                                    />
                                </div>
                                {fields.filter(f => f.metadata?.isMine).length > 0 && (
                                    <p className="text-xs text-slate-500 mt-2">
                                        {fields.filter(f => f.metadata?.value).length === fields.filter(f => f.metadata?.isMine).length
                                            ? '✓ All fields signed!'
                                            : `${fields.filter(f => f.metadata?.isMine).length - fields.filter(f => f.metadata?.value).length} remaining`
                                        }
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Page Thumbnails with Previews */}
                        <div className="space-y-3">
                            {numPages && Array.from({ length: numPages }, (_, index) => {
                                const pageNum = index + 1;
                                const pageFields = fields.filter(f => f.pageNumber === pageNum && f.metadata?.isMine);
                                const signedFields = pageFields.filter(f => f.metadata?.value);
                                const isComplete = pageFields.length > 0 && signedFields.length === pageFields.length;
                                const isActive = currentPage === pageNum;

                                return (
                                    <button
                                        key={`nav-page-${pageNum}`}
                                        onClick={() => {
                                            const element = document.getElementById(`pdf-page-${pageNum}`);
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                setCurrentPage(pageNum);
                                            }
                                        }}
                                        className={`w-full rounded-xl border-2 transition-all duration-200 overflow-hidden group ${isActive
                                            ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200'
                                            : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md hover:bg-indigo-50/30'
                                            }`}
                                    >
                                        {/* Thumbnail Preview */}
                                        <div className={`relative bg-slate-100 border-b transition-all ${isActive ? 'border-indigo-200' : 'border-slate-200'
                                            }`}>
                                            <div className="aspect-[8.5/11] overflow-hidden">
                                                {pdfUrl && (
                                                    <PdfDocument file={pdfUrl}>
                                                        <Page
                                                            pageNumber={pageNum}
                                                            width={220}
                                                            renderTextLayer={false}
                                                            renderAnnotationLayer={false}
                                                            className="pointer-events-none"
                                                        />
                                                    </PdfDocument>
                                                )}
                                            </div>
                                            {/* Status Badge Overlay */}
                                            {isComplete && (
                                                <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-lg">
                                                    <CheckCircle size={12} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Page Info */}
                                        <div className="p-2.5">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className={`text-sm font-semibold ${isActive ? 'text-indigo-700' : 'text-slate-700'
                                                    }`}>
                                                    Page {pageNum}
                                                </span>
                                                {pageFields.length > 0 && (
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isComplete
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {signedFields.length}/{pageFields.length}
                                                    </span>
                                                )}
                                            </div>
                                            {pageFields.length > 0 && (
                                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className={`h-1.5 rounded-full transition-all duration-300 ${isComplete ? 'bg-emerald-500' : 'bg-amber-500'
                                                            }`}
                                                        style={{ width: `${(signedFields.length / pageFields.length) * 100}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Enhanced PDF Viewer Container */}
                    <div className="flex-1 relative flex flex-col items-center bg-slate-50 md:bg-gradient-to-br md:from-slate-50 md:to-slate-100/30 overflow-hidden">
                        {/* Desktop Toolbar - Hidden on Mobile */}
                        <div className="hidden md:flex w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 p-3 items-center justify-between px-6 flex-shrink-0 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-bold text-slate-700">
                                        {numPages ? `${numPages} ${numPages === 1 ? 'Page' : 'Pages'}` : 'Loading...'}
                                    </span>
                                </div>
                                {currentPage && (
                                    <>
                                        <div className="w-px h-4 bg-slate-300" />
                                        <span className="text-sm text-slate-500 font-medium">
                                            Viewing Page {currentPage}
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
                                        disabled={scale <= 0.5}
                                        className="p-2 text-slate-600 hover:bg-white hover:text-indigo-600 rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        title="Zoom Out"
                                    >
                                        <ZoomOut size={18} />
                                    </button>
                                    <span className="text-sm font-mono font-bold text-slate-700 w-14 text-center bg-white px-2 py-1 rounded">
                                        {Math.round(scale * 100)}%
                                    </span>
                                    <button
                                        onClick={() => setScale(prev => Math.min(prev + 0.1, 2.0))}
                                        disabled={scale >= 2.0}
                                        className="p-2 text-slate-600 hover:bg-white hover:text-indigo-600 rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        title="Zoom In"
                                    >
                                        <ZoomIn size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Document Content - Scrollable */}
                        <div
                            id="pdf-wrapper"
                            className="flex-1 w-full overflow-y-auto overflow-x-hidden p-0 md:p-8 flex flex-col items-center scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200"
                            onScroll={(e) => {
                                // Track current page based on scroll position
                                const container = e.target;
                                const pages = container.querySelectorAll('[data-page-container]');
                                pages.forEach((page) => {
                                    const rect = page.getBoundingClientRect();
                                    const containerRect = container.getBoundingClientRect();
                                    if (rect.top >= containerRect.top && rect.top < containerRect.top + 200) {
                                        const pageNum = parseInt(page.getAttribute('data-page-number'));
                                        setCurrentPage(pageNum);
                                    }
                                });
                            }}
                        >
                            {pdfUrl && (
                                <PdfDocument
                                    file={pdfUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading={
                                        <div className="flex flex-col items-center justify-center py-20">
                                            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                                            <p className="text-slate-600 font-semibold text-lg">Loading PDF...</p>
                                            <p className="text-slate-400 text-sm mt-1">Please wait while we prepare your document</p>
                                        </div>
                                    }
                                    error={
                                        <div className="text-center py-20 px-6">
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 inline-block">
                                                <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
                                                <p className="text-red-600 font-bold text-lg mb-2">Failed to load PDF document</p>
                                                <p className="text-sm text-slate-500">Please ensure it is a valid PDF file.</p>
                                            </div>
                                        </div>
                                    }
                                    className="flex flex-col items-center gap-8 w-full"
                                >
                                    {numPages && Array.from({ length: numPages }, (_, index) => (
                                        <div
                                            key={`page_${index + 1}`}
                                            id={`pdf-page-${index + 1}`}
                                            data-page-container
                                            data-page-number={index + 1}
                                            className="relative mb-2 md:mb-8 transition-all group"
                                            style={{ width: 'fit-content', margin: window.innerWidth < 768 ? '0 auto 8px auto' : '0 auto 2rem auto' }}
                                        >
                                            {/* Page Number Badge - Desktop Only */}
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 hidden md:block">
                                                <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                    Page {index + 1}
                                                </div>
                                            </div>

                                            {/* PDF Page */}
                                            <div className="bg-white md:rounded-lg shadow-sm md:shadow-xl border-b md:border-2 border-slate-200 overflow-hidden">
                                                <Page
                                                    pageNumber={index + 1}
                                                    renderTextLayer={true}
                                                    renderAnnotationLayer={false}
                                                    className="md:rounded-lg"
                                                    width={pdfWidth}
                                                    scale={scale}
                                                    onLoadSuccess={(page) => {
                                                        const viewport = page.getViewport({ scale: 1.0 });
                                                        setPageDimensions(prev => ({
                                                            ...prev,
                                                            [index + 1]: {
                                                                width: viewport.width,
                                                                height: viewport.height
                                                            }
                                                        }));
                                                    }}
                                                />
                                            </div>

                                            {/* Overlay signature fields */}
                                            {pageDimensions[index + 1] && fields
                                                .filter(f => f.pageNumber === index + 1)
                                                .map(field => {
                                                    // Calculate responsive dimensions
                                                    const originalDims = pageDimensions[index + 1];
                                                    const aspectRatio = originalDims.height / originalDims.width;
                                                    const currentWidth = pdfWidth * scale; // current rendered width
                                                    const currentHeight = currentWidth * aspectRatio;

                                                    return (
                                                        <SignedFieldDisplay
                                                            key={field.id}
                                                            field={field}
                                                            onClick={handleFieldClick}
                                                            pageWidth={currentWidth}
                                                            pageHeight={currentHeight}
                                                        />
                                                    );
                                                })}
                                        </div>
                                    ))}
                                </PdfDocument>
                            )}

                            {/* Explicit Bottom Spacer */}
                            <div className="h-40 w-full flex-shrink-0" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Sticky Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe z-[60] md:hidden flex items-center justify-between gap-4 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium">{fields.filter(f => f.metadata?.value).length}/{fields.filter(f => f.metadata?.isMine).length} Signed</span>
                    <span className="text-xs text-indigo-600 font-bold">{numPages} Pages</span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Finish Button - Always visible in bottom bar */}
                    <button
                        onClick={handleFinishSigning}
                        disabled={isSubmitting}
                        className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-colors border-2 ${isSubmitting ? 'border-slate-200 text-slate-400' : 'border-indigo-100 text-indigo-600 hover:bg-indigo-50'}`}
                    >
                        {isSubmitting ? 'Saving...' : 'Finish'}
                    </button>

                    {/* Next/Start Button - Prominent */}
                    {requiredFields.length > 0 ? (
                        <button
                            onClick={handleNextField}
                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2 text-sm"
                        >
                            {fields.filter(f => f.metadata.isMine && f.metadata.value).length === 0 ? "Start" : "Next"}
                            <ArrowRight size={16} />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm px-4">
                            <CheckCircle size={16} /> All Set!
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop Floating Action Button */}
            <div className="hidden md:flex fixed bottom-10 right-10 z-[60] flex-col items-end gap-3 pointer-events-none">
                {/* Only show if there are required fields remaining */}
                {requiredFields.length > 0 && (
                    <button
                        onClick={handleNextField}
                        className="pointer-events-auto bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 animate-bounce-subtle"
                    >
                        {fields.filter(f => f.metadata.isMine && f.metadata.value).length === 0 ? "Start Signing" : "Next Field"}
                        <ArrowRight size={18} />
                    </button>
                )}
            </div>

            {/* Signing Modal - Bottom Sheet on Mobile, Centered on Desktop */}
            {signingField && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4">
                    <div className="bg-white w-full md:w-full md:max-w-md rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom md:zoom-in duration-200 flex flex-col max-h-[85vh] md:max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">Sign Document</h3>
                            <button onClick={() => setSigningField(null)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {/* Tabs */}
                            {/* Tabs - Hide if we are in direct text input mode */}
                            {signatureMethod !== 'text_input' && (
                                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                                    {showText && (
                                        <button
                                            onClick={() => setSignatureMethod('text')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-xs transition-all ${signatureMethod === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                                        >
                                            <Type size={16} /> Type
                                        </button>
                                    )}
                                    {showDraw && (
                                        <button
                                            onClick={() => setSignatureMethod('draw')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-xs transition-all ${signatureMethod === 'draw' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                                        >
                                            <PenTool size={16} /> Draw
                                        </button>
                                    )}
                                    {showUpload && (
                                        <button
                                            onClick={() => setSignatureMethod('upload')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-xs transition-all ${signatureMethod === 'upload' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                                        >
                                            <UploadIcon size={16} /> Upload
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Inputs */}
                            {signatureMethod === 'text' && (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500">Type your name below. We'll convert it to a signature.</p>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={textSignature}
                                        onChange={(e) => setTextSignature(e.target.value)}
                                        placeholder={`Signed by ${currentUser.name}`}
                                        className="w-full text-xl font-handwriting px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                                        style={{ fontFamily: 'Dancing Script, cursive' }}
                                    />
                                </div>
                            )}

                            {signatureMethod === 'text_input' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Type size={18} className="text-indigo-600" />
                                        <h3 className="font-semibold text-slate-700">{signingField.metadata.label || "Enter Text"}</h3>
                                    </div>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={textSignature}
                                        onChange={(e) => setTextSignature(e.target.value)}
                                        placeholder={signingField.metadata.placeholder || "Type here..."}
                                        className="w-full text-base px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            )}

                            {signatureMethod === 'draw' && (
                                <div className="space-y-4">
                                    <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 touch-none">
                                        <canvas
                                            ref={canvasRef}
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing}
                                            onTouchMove={draw}
                                            onTouchEnd={stopDrawing}
                                            className="w-full h-48 cursor-crosshair block rounded-xl"
                                            style={{ width: '100%', height: '192px' }}
                                        />
                                        <button onClick={clearCanvas} className="absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow border border-slate-200 hover:bg-red-50 hover:text-red-500" title="Clear">
                                            <Trash2 size={16} />
                                        </button>
                                        {!isDrawing && !drawnSignature && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                                                <span className="text-slate-400 text-sm">Draw here</span>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={clearCanvas} className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700">
                                        <RotateCcw size={14} /> Clear Signature
                                    </button>
                                </div>
                            )}

                            {signatureMethod === 'upload' && (
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
                                        {uploadedSignature ? (
                                            <div className="space-y-4">
                                                <img src={uploadedSignature} alt="Uploaded" className="max-h-24 mx-auto" />
                                                <button onClick={() => setUploadedSignature(null)} className="text-xs font-medium text-red-600 hover:text-red-700">Remove & Retry</button>
                                            </div>
                                        ) : (
                                            <>
                                                <UploadIcon size={32} className="text-slate-400 mx-auto mb-2" />
                                                <p className="text-xs text-slate-500 mb-4">PNG, JPG (max 5MB)</p>
                                                <label className="inline-block cursor-pointer">
                                                    <span className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50">Choose Image</span>
                                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 filter-none z-10 sticky bottom-0">
                            <button onClick={() => setSigningField(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                            <button
                                onClick={submitSignature}
                                disabled={!getSignatureValue()}
                                className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Apply Signature
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Font loader for signature style */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
                .font-handwriting { font-family: 'Dancing Script', cursive; }
            `}</style>
        </div>
    );
};

export default SignDocument;
