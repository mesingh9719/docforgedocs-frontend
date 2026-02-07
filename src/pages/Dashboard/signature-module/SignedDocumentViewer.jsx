import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document as PdfDocument, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import api from '../../../api/axios';
import {
    Loader2, AlertCircle, Download,
    ZoomIn, ZoomOut, History, ArrowLeft, Shield, Menu,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Sub Components
import MobileAuditDrawer from './components/MobileAuditDrawer';
import SignatureAuditSidebar from './components/SignatureAuditSidebar'; // Assuming you might extract desktop sidebar too, or inline it for now

// Configure PDF Worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const SignedDocumentViewer = () => {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);

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
    const [showAudit, setShowAudit] = useState(false); // Default hidden on mobile
    const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop sidebar

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000';

    useEffect(() => {
        // adjust initial scale based on window width
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setScale(0.6); // Start smaller on mobile
                setSidebarOpen(false);
            } else {
                setScale(1.0);
                setSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        fetchSignedDocument();
        return () => window.removeEventListener('resize', handleResize);
    }, [documentId]);

    const fetchSignedDocument = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/signatures/${documentId}/view-signed`);
            const doc = response.data.document;
            setDocument(doc);
            setAuditLogs(response.data.audit_logs || []);

            const storageUrl = doc.final_pdf_url || doc.pdf_url;
            if (!storageUrl) {
                setError('PDF URL not available. Document may not have been completed yet.');
                return;
            }
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
                <div className="flex flex-col items-center">
                    <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                    <p className="text-slate-600 font-medium">Retrieving secure document...</p>
                </div>
            </div>
        );
    }

    if (error || !document) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Unavailable</h2>
                    <p className="text-slate-500 mb-6">{error || "Document not found."}</p>
                    <button
                        onClick={() => navigate('/signatures/list')}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold active:scale-95 transition-transform"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[100dvh] bg-slate-100/50 flex flex-col font-sans overflow-hidden">
            {/* Header - Adaptive */}
            <header className="bg-white/80 backdrop-blur-md h-14 md:h-16 border-b border-slate-200/60 px-4 md:px-6 flex items-center justify-between shadow-sm z-30 flex-shrink-0 relative">
                <div className="flex items-center gap-3 overflow-hidden">
                    <button
                        onClick={() => navigate('/signatures/list')}
                        className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-slate-800 text-sm md:text-lg truncate max-w-[150px] md:max-w-xs leading-tight">
                                {document.name}
                            </h1>
                            <div className="hidden md:flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                <Shield size={10} className="fill-emerald-700" /> Verified
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 md:hidden flex items-center gap-1">
                            <Shield size={8} className="text-emerald-500" />
                            Signed & Verified
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAudit(true)}
                        className="md:hidden p-2 text-slate-500 active:bg-slate-100 rounded-xl"
                    >
                        <History size={20} />
                    </button>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sidebarOpen
                            ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                            : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        <History size={16} />
                        <span className="hidden xl:inline">{sidebarOpen ? 'Hide Log' : 'Log'}</span>
                    </button>

                    <button
                        onClick={handleDownloadSigned}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold rounded-lg shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform"
                    >
                        <Download size={16} />
                        <span className="hidden md:inline">Download</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Desktop Thumbnails (Hidden on mobile) */}
                <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto hidden xl:block z-10 flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 backdrop-blur-sm z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{numPages} Pages</span>
                    </div>
                    <div className="p-4 space-y-4">
                        {numPages && Array.from({ length: numPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setCurrentPage(i + 1);
                                    document.getElementById(`pdf-page-${i + 1}`)?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`w-full relative group transition-all ${currentPage === i + 1 ? 'ring-2 ring-indigo-500 rounded-lg scale-[1.02]' : 'hover:opacity-80'}`}
                            >
                                <div className="aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200">
                                    {pdfUrl && (
                                        <PdfDocument file={pdfUrl} className="opacity-75 pointer-events-none">
                                            <Page pageNumber={i + 1} width={200} renderTextLayer={false} renderAnnotationLayer={false} />
                                        </PdfDocument>
                                    )}
                                    <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 rounded font-medium backdrop-blur-sm">
                                        {i + 1}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main PDF Viewer */}
                <div
                    ref={containerRef}
                    className="flex-1 w-full overflow-y-auto overflow-x-hidden p-4 md:p-8 flex flex-col items-center bg-slate-100 scroll-smooth"
                    onScroll={(e) => {
                        // Simple scroll spy logic
                        const container = e.target;
                        const height = container.clientHeight;
                        const scroll = container.scrollTop;
                        // Rough estimation if exact elements tracking is too heavy
                        // Better: Use IntersectionObserver in a real app
                    }}
                >
                    {pdfUrl ? (
                        <PdfDocument
                            file={pdfUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={<Loader2 className="animate-spin text-indigo-500 mt-20" size={32} />}
                            className="flex flex-col items-center gap-4 md:gap-8 pb-32 w-full max-w-4xl mx-auto"
                        >
                            {numPages && Array.from({ length: numPages }, (_, i) => (
                                <div
                                    key={`page-${i + 1}`}
                                    id={`pdf-page-${i + 1}`}
                                    className="relative shadow-xl shadow-slate-200/60 transition-transform duration-200 origin-top"
                                    style={{
                                        width: 'fit-content' // Allows scaling to effect layout
                                    }}
                                >
                                    <Page
                                        pageNumber={i + 1}
                                        scale={scale}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={false}
                                        className="bg-white"
                                        width={window.innerWidth < 768 ? window.innerWidth - 32 : 800} // Dynamic width
                                    />
                                    {/* Mobile Page Indicator Overlay */}
                                    <div className="absolute top-2 right-2 bg-black/30 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md md:hidden">
                                        {i + 1} / {numPages}
                                    </div>
                                </div>
                            ))}
                        </PdfDocument>
                    ) : (
                        <div className="text-slate-400 mt-20">Document not loaded</div>
                    )}
                </div>

                {/* Floating Mobile Audit Fab (Optional) - Removed in favor of Header Action */}

                {/* Mobile PDF Controls (Floating Bottom) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-1 p-1.5 bg-slate-900/80 backdrop-blur-md text-white rounded-full shadow-2xl ring-1 ring-white/10"
                    >
                        <button onClick={() => setScale(s => Math.max(0.4, s - 0.1))} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ZoomOut size={18} /></button>
                        <span className="w-10 text-center text-xs font-mono font-bold">{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ZoomIn size={18} /></button>
                    </motion.div>
                </div>

                {/* Desktop Audit Sidebar (Collapsible) */}
                <SignatureAuditSidebar show={sidebarOpen} auditLogs={auditLogs} />
            </div>

            {/* Mobile Audit Drawer */}
            <MobileAuditDrawer
                show={showAudit}
                onClose={() => setShowAudit(false)}
                auditLogs={auditLogs}
            />
        </div>
    );
};

export default SignedDocumentViewer;
