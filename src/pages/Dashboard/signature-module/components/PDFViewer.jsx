
import React, { useState, useEffect } from 'react';
import { Document, pdfjs } from 'react-pdf';
import { ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react';
import PDFPageRenderer from './PDFPageRenderer';
import SignatureField from '../../../../components/Nda/Signatures/SignatureField';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = ({ pdfUrl, signatures = [], onUpdateSignature, onRemoveSignature, onEditSignature, readOnly = false }) => {
    const [numPages, setNumPages] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [rotation, setRotation] = useState(0);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2.0));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

    // Group signatures by page
    const signaturesByPage = signatures.reduce((acc, sig) => {
        const page = sig.pageNumber || 1;
        if (!acc[page]) acc[page] = [];
        acc[page].push(sig);
        return acc;
    }, {});

    return (
        <div className="relative flex flex-col items-center bg-slate-100/50 h-full w-full rounded-xl border border-slate-200 overflow-hidden">
            {/* Toolbar */}
            <div className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 p-2 flex items-center justify-between px-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {numPages ? `${numPages} Pages` : 'Loading Document...'}
                </span>

                <div className="flex items-center gap-2">
                    <button onClick={handleZoomOut} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Zoom Out">
                        <ZoomOut size={18} />
                    </button>
                    <span className="text-xs font-mono font-medium text-slate-600 w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button onClick={handleZoomIn} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Zoom In">
                        <ZoomIn size={18} />
                    </button>
                    <div className="w-px h-4 bg-slate-300 mx-1" />
                    <button onClick={() => setRotation((r) => r + 90)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Rotate">
                        <RotateCw size={18} />
                    </button>
                </div>
            </div>

            {/* Document Content */}
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden p-8 flex flex-col items-center scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col items-center gap-8" // Gap between pages
                    loading={
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                            <p className="text-slate-500 font-medium">Loading PDF...</p>
                        </div>
                    }
                    error={
                        <div className="text-center py-20">
                            <p className="text-red-500 font-medium">Failed to load PDF.</p>
                            <p className="text-sm text-slate-400 mt-2">Please ensure it is a valid PDF file.</p>
                        </div>
                    }
                >
                    {Array.from(new Array(numPages), (el, index) => {
                        const pageNumber = index + 1;
                        const pageSignatures = signaturesByPage[pageNumber] || [];

                        return (
                            <div key={`page_${pageNumber}`}>
                                <PDFPageRenderer
                                    pageNumber={pageNumber}
                                    scale={scale}
                                >
                                    {pageSignatures.map(sig => (
                                        <SignatureField
                                            key={sig.id}
                                            id={sig.id}
                                            data={sig.metadata}
                                            left={sig.position.x}
                                            top={sig.position.y}
                                            onEdit={() => onEditSignature(sig)}
                                            onDelete={() => onRemoveSignature(sig.id)}
                                            readOnly={readOnly}
                                        />
                                    ))}
                                </PDFPageRenderer>
                            </div>
                        );
                    })}
                </Document>

                {/* Explicit Bottom Spacer to ensure scrolling past the last page */}
                <div className="h-40 w-full flex-shrink-0" />
            </div>
        </div>
    );
};

export default PDFViewer;