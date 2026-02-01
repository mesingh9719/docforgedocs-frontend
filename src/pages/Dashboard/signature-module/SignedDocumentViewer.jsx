import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document as PdfDocument, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import api from '../../../api/axios';
import {
    Loader2, AlertCircle, Download,
    ZoomIn, ZoomOut, Lock, History,
    Clock, CheckCircle, ArrowLeft, Shield, User,
    PenTool
} from 'lucide-react';
import { motion } from 'framer-motion';

// Configure PDF Worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const SignedDocumentViewer = () => {
    const { documentId } = useParams();
    const navigate = useNavigate();

    // Document State
    const [document, setDocument] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // PDF State
    const [pdfUrl, setPdfUrl] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [pageDimensions, setPageDimensions] = useState({});
    const [showAudit, setShowAudit] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000';

    useEffect(() => {
        fetchSignedDocument();
    }, [documentId]);

    const fetchSignedDocument = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/signatures/${documentId}/view-signed`);
            const doc = response.data.document;
            setDocument(doc);
            setAuditLogs(response.data.audit_logs || []);

            // Get the storage URL directly (has the correct file path)
            const storageUrl = doc.final_pdf_url || doc.pdf_url;

            console.log('=== PDF Loading Debug ===');
            console.log('Document ID:', documentId);
            console.log('Document Status:', doc.status);
            console.log('Storage URL:', storageUrl);
            console.log('=======================');

            if (!storageUrl) {
                setError('PDF URL not available. Document may not have been completed yet.');
                return;
            }

            // Use storage URL directly - CORS middleware should handle it
            setPdfUrl(storageUrl);
        } catch (err) {
            console.error("Failed to load signed document", err);
            setError("Document not found or not completed yet.");
        } finally {
            setLoading(false);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        console.log('PDF loaded successfully:', numPages, 'pages');
    };

    const handleDownloadSigned = () => {
        if (document?.final_pdf_url) {
            const downloadUrl = document.final_pdf_url.startsWith('http')
                ? document.final_pdf_url
                : `${API_BASE_URL}${document.final_pdf_url}`;
            window.location.href = downloadUrl;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 size={48} className="text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Loading signed document...</p>
                </div>
            </div>
        );
    }

    if (error || !document) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-slate-200">
                    <AlertCircle size={56} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Document Unavailable</h2>
                    <p className="text-slate-500 mb-6">{error || "This document could not be found."}</p>
                    <button
                        onClick={() => navigate('/signatures/list')}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Back to List
                    </button>
                </div>
            </div>
        );
    }

    // Verified Badge Component
    const VerifiedBadge = () => (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-xs font-semibold shadow-sm">
            <Shield size={12} className="fill-emerald-700" />
            <span>Verified & Secured</span>
        </div>
    );

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Retrieving secure document...</p>
            </div>
        );
    }

    if (error || !document) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Document Unavailable</h2>
                    <p className="text-slate-500 mb-6">{error || "This document is not accessible."}</p>
                    <button
                        onClick={() => navigate('/signatures/list')}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-md shadow-indigo-200"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-50/50 flex flex-col overflow-hidden font-sans">
            {/* Premium Header */}
            <header className="bg-white h-16 border-b border-slate-200/60 px-6 flex items-center justify-between shadow-sm z-20 flex-shrink-0 backdrop-blur-sm bg-white/90 supports-[backdrop-filter]:bg-white/60">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/signatures/list')}
                        className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
                        title="Back to List"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="w-px h-6 bg-slate-200" />

                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-bold text-slate-800 text-lg tracking-tight">{document.name}</h1>
                            <VerifiedBadge />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            {document.file_size && formatFileSize(document.file_size)} • PDF Document
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAudit(!showAudit)}
                        className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${showAudit
                            ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                            : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                    >
                        <History size={16} />
                        <span className="hidden lg:inline">{showAudit ? 'Hide Audit' : 'Audit Trail'}</span>
                    </button>

                    <button
                        onClick={handleDownloadSigned}
                        disabled={!document.final_pdf_url && !document.pdf_url}
                        className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={16} />
                        Download
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Thumbnails Sidebar */}
                <div className="w-72 bg-white border-r border-slate-200 overflow-y-auto hidden xl:block z-10 flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/30 sticky top-0 z-10 backdrop-blur-sm">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {numPages} Pages
                        </h3>
                    </div>

                    <div className="p-4 space-y-4">
                        {numPages && Array.from({ length: numPages }, (_, index) => {
                            const pageNum = index + 1;
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
                                    className={`group w-full relative transition-all duration-200 ${isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                                        }`}
                                >
                                    <div className={`relative rounded-lg overflow-hidden border-2 transition-all ${isActive
                                        ? 'border-indigo-600 shadow-md ring-2 ring-indigo-100'
                                        : 'border-slate-100 group-hover:border-indigo-300'
                                        }`}>
                                        <div className="aspect-[3/4] bg-slate-100 relative">
                                            {pdfUrl && (
                                                <PdfDocument file={pdfUrl} className="opacity-90">
                                                    <Page
                                                        pageNumber={pageNum}
                                                        width={240}
                                                        renderTextLayer={false}
                                                        renderAnnotationLayer={false}
                                                        className="pointer-events-none"
                                                    />
                                                </PdfDocument>
                                            )}
                                        </div>

                                        {/* Page Number Overlay */}
                                        <div className={`absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-md ${isActive
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-black/50 text-white'
                                            }`}>
                                            {pageNum}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 relative flex flex-col bg-slate-100/50">

                    {/* Floating Toolbar */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white/90 backdrop-blur-md border border-slate-200/60 p-1.5 rounded-full shadow-xl flex items-center gap-1 ring-1 ring-black/5"
                        >
                            <button
                                onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
                                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                title="Zoom Out"
                            >
                                <ZoomOut size={18} />
                            </button>
                            <span className="w-12 text-center text-xs font-semibold text-slate-600 tabular-nums">
                                {Math.round(scale * 100)}%
                            </span>
                            <button
                                onClick={() => setScale(prev => Math.min(prev + 0.1, 2.0))}
                                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                title="Zoom In"
                            >
                                <ZoomIn size={18} />
                            </button>
                        </motion.div>
                    </div>

                    {/* Scrollable Document Area */}
                    <div
                        className="flex-1 w-full overflow-y-auto overflow-x-hidden p-8 lg:p-12 flex flex-col items-center scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent scroll-smooth"
                        onScroll={(e) => {
                            const container = e.target;
                            const pages = container.querySelectorAll('[data-page-container]');
                            pages.forEach((page) => {
                                const rect = page.getBoundingClientRect();
                                const containerRect = container.getBoundingClientRect();
                                // More precise "in view" detection
                                if (rect.top <= containerRect.top + containerRect.height / 3 && rect.bottom >= containerRect.top + containerRect.height / 3) {
                                    const pageNum = parseInt(page.getAttribute('data-page-number'));
                                    setCurrentPage(pageNum);
                                }
                            });
                        }}
                    >
                        {pdfUrl ? (
                            <PdfDocument
                                file={pdfUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={
                                    <div className="my-20 flex flex-col items-center">
                                        <Loader2 size={32} className="text-indigo-500 animate-spin mb-3" />
                                        <span className="text-slate-400 text-sm">Rendering pages...</span>
                                    </div>
                                }
                                error={
                                    <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center max-w-sm">
                                        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                                        <p className="text-red-700 font-medium">Failed to render PDF</p>
                                    </div>
                                }
                                className="flex flex-col items-center gap-8 w-full max-w-5xl"
                            >
                                {numPages && Array.from({ length: numPages }, (_, index) => (
                                    <div
                                        key={`page_${index + 1}`}
                                        id={`pdf-page-${index + 1}`}
                                        data-page-container
                                        data-page-number={index + 1}
                                        className="relative group transition-all duration-300"
                                        style={{ width: 'fit-content' }}
                                    >
                                        <div className="bg-white rounded shadow-2xl shadow-indigo-100/50 ring-1 ring-slate-900/5 overflow-hidden transition-shadow group-hover:shadow-indigo-200/50">
                                            <Page
                                                pageNumber={index + 1}
                                                renderTextLayer={true}
                                                renderAnnotationLayer={false}
                                                width={800} // Standard Viewing Width
                                                scale={scale}
                                                className="bg-white"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </PdfDocument>
                        ) : (
                            <div className="flex items-center justify-center p-20 text-slate-400">
                                Document not loaded
                            </div>
                        )}

                        <div className="h-32 flex-shrink-0" /> {/* Spacer for floating toolbar */}
                    </div>
                </div>

                {/* Audit Trail Sidebar */}
                <motion.aside
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                        width: showAudit ? 340 : 0,
                        opacity: showAudit ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-white border-l border-slate-200 overflow-hidden flex flex-col shadow-2xl z-30 ring-1 ring-slate-900/5"
                >
                    <div className="p-5 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <History size={18} className="text-indigo-600" />
                            Activity Log
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-white scrollbar-thin scrollbar-thumb-slate-300">
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-[15px] top-4 bottom-0 w-0.5 bg-slate-200" />

                            <div className="space-y-8 relative">
                                {auditLogs.map((log, idx) => {
                                    const isLast = idx === auditLogs.length - 1;
                                    const getIcon = (action) => {
                                        switch (action) {
                                            case 'COMPLETED': return <CheckCircle size={16} className="text-emerald-600" />;
                                            case 'SIGNED': return <PenTool size={16} className="text-indigo-600" />;
                                            case 'VIEWED': return <User size={16} className="text-amber-600" />;
                                            default: return <Clock size={16} className="text-slate-500" />;
                                        }
                                    };

                                    const getBg = (action) => {
                                        switch (action) {
                                            case 'COMPLETED': return 'bg-emerald-100 ring-emerald-200';
                                            case 'SIGNED': return 'bg-indigo-100 ring-indigo-200';
                                            case 'VIEWED': return 'bg-amber-100 ring-amber-200';
                                            default: return 'bg-slate-100 ring-slate-200';
                                        }
                                    };

                                    return (
                                        <motion.div
                                            key={log.id}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="relative pl-12"
                                        >
                                            {/* Node */}
                                            <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white shadow-md z-10 ${getBg(log.action)}`}>
                                                {getIcon(log.action)}
                                            </div>

                                            {/* content */}
                                            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider px-2 py-0.5 bg-slate-100 rounded-md group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                                                        {log.action}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-mono">
                                                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <User size={12} className="text-slate-500" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-700 truncate max-w-[160px]" title={log.metadata?.signer_name}>
                                                        {log.metadata?.signer_name || log.user || 'System'}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                    <div className="flex items-center gap-1.5 text-slate-500">
                                                        <Clock size={10} />
                                                        <span className="text-[10px] font-medium">
                                                            {new Date(log.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {log.ip_address && (
                                                        <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded" title="IP Address">
                                                            {log.ip_address}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Secure Footer */}
                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
                        <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                            <Lock size={10} />
                            End-to-End Encrypted Audit Trail
                        </p>
                    </div>
                </motion.aside>
            </div>
        </div>
    );
};

export default SignedDocumentViewer;
