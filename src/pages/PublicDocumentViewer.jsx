import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2, AlertCircle, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText } from 'lucide-react';

// Configure PDF Worker
// Replicating configuration from signature module's PDFViewer.jsx
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PublicDocumentViewer = () => {
    const { token } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // PDF State
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    // Use environment variable for API URL or fallback
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                // Ensure we hit the correct public endpoint
                // Adjust path if route is not under /v1 in api.php
                const response = await axios.get(`/public/documents/${token}`);
                setDocument(response.data.data);
            } catch (err) {
                console.error("Failed to load public document", err);
                setError("Document not found or access denied.");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchDocument();
        }
    }, [token]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleDownload = () => {
        // Trigger download via new endpoint which logs the action
        // We use window.location.href to trigger a browser download
        // Ensure the URL is constructed correctly based on where the route is mounted
        // If API_URL includes /api/v1, we append /public/documents/...
        window.location.href = `${API_URL}/public/documents/${token}/download`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 size={40} className="text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (error || !document) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-slate-100">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Unavailable</h2>
                    <p className="text-slate-500">{error || "This document could not be found."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white h-16 border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
                        DF
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-800 text-lg leading-tight truncate max-w-[200px] md:max-w-md">
                            {document.name}
                        </h1>
                        <p className="text-xs text-slate-500">Shared via DocForge</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md shadow-indigo-100 active:scale-95"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Download PDF</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-slate-100 p-4 md:p-8 flex flex-col items-center">

                {document.pdf_url ? (
                    <div className="w-full max-w-4xl flex flex-col items-center">
                        {/* Controls */}
                        <div className="bg-white rounded-full shadow-lg border border-slate-200 px-6 py-2 mb-6 flex items-center gap-6 sticky top-20 z-40 transition-all opacity-90 hover:opacity-100">
                            <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                                <button
                                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                                    disabled={pageNumber <= 1}
                                    className="p-1.5 hover:bg-slate-100 rounded-full disabled:opacity-30 transition-colors text-slate-700"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-sm font-medium text-slate-600 min-w-[3rem] text-center">
                                    {pageNumber} / {numPages || '--'}
                                </span>
                                <button
                                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
                                    disabled={pageNumber >= numPages}
                                    className="p-1.5 hover:bg-slate-100 rounded-full disabled:opacity-30 transition-colors text-slate-700"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
                                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                                    title="Zoom Out"
                                >
                                    <ZoomOut size={18} />
                                </button>
                                <span className="text-xs font-medium text-slate-500 w-12 text-center">{Math.round(scale * 100)}%</span>
                                <button
                                    onClick={() => setScale(prev => Math.min(prev + 0.1, 2.0))}
                                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                                    title="Zoom In"
                                >
                                    <ZoomIn size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Document Canvas */}
                        <div className="bg-white shadow-2xl rounded-sm overflow-hidden print:shadow-none transition-transform duration-200">
                            <Document
                                file={`${API_URL}/public/documents/${token}/preview`}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={
                                    <div className="h-96 w-full flex items-center justify-center bg-white">
                                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                                    </div>
                                }
                                error={
                                    <div className="h-64 w-full flex flex-col items-center justify-center p-8 text-slate-400 bg-white">
                                        <FileText size={48} className="mb-2" />
                                        <p>Failed to load PDF preview.</p>
                                        <p className="text-xs text-slate-300 mt-2">Could not access the PDF file.</p>
                                    </div>
                                }
                                className="pdf-document"
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                    className="pdf-page"
                                />
                            </Document>
                        </div>
                    </div>
                ) : (
                    /* Fallback to simple download view if PDF URL is missing (e.g. old docs) */
                    <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
                        <AlertCircle size={64} className="text-slate-300 mb-6" />
                        <h3 className="text-2xl font-bold text-slate-800 mb-3">Preview Unavailable</h3>
                        <p className="text-slate-500 mb-8 max-w-md text-lg">
                            A PDF preview is not available for this document. You can download the file to view it.
                        </p>
                        <button
                            onClick={handleDownload}
                            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-1"
                        >
                            Download Document
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicDocumentViewer;
