import React, { memo } from 'react';
import { Document, Page } from 'react-pdf';
import { motion } from 'framer-motion';
import { Layers, List } from 'lucide-react';

const PageThumbnailsSidebar = memo(({ pdfUrl, numPages, onPageClick, currentPage, signatures }) => {

    // Group signatures by page for display
    const getPageSignatures = (pageNum) => {
        return signatures.filter(s => s.pageNumber === pageNum);
    };

    if (!pdfUrl || !numPages) return null;

    return (
        <div className="w-full flex flex-col h-full bg-slate-50 border-r border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Layers size={14} className="text-indigo-600" />
                    Pages ({numPages})
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300">
                <Document file={pdfUrl} loading={<div className="text-xs text-slate-400 text-center py-4">Loading thumbnails...</div>}>
                    {Array.from({ length: numPages }, (_, index) => {
                        const pageNum = index + 1;
                        const pageSigs = getPageSignatures(pageNum);
                        const isCurrent = currentPage === pageNum;

                        return (
                            <div key={`thumb-${pageNum}`} className="relative group">
                                <div className="flex items-start gap-2 mb-1">
                                    <span className={`text-[10px] font-bold w-4 ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>{pageNum}</span>
                                </div>
                                <button
                                    onClick={() => onPageClick(pageNum)}
                                    className={`w-full relative transition-all duration-200 group-hover:scale-[1.02] ${isCurrent ? 'ring-2 ring-indigo-500 rounded-sm shadow-md' : 'hover:ring-2 hover:ring-indigo-200 rounded-sm'}`}
                                >
                                    <div className="aspect-[3/4] bg-white border border-slate-200 rounded-sm overflow-hidden relative shadow-sm">
                                        <Page
                                            pageNumber={pageNum}
                                            width={180}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            className="pointer-events-none opacity-90"
                                        />

                                        {/* Overlay Signature Badges */}
                                        {pageSigs.length > 0 && (
                                            <div className="absolute inset-0 bg-transparent">
                                                {pageSigs.map((sig, i) => (
                                                    <div
                                                        key={sig.id}
                                                        className="absolute w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm border border-white z-10 transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125"
                                                        style={{
                                                            left: `${sig.position.x}%`,
                                                            top: `${sig.position.y}%`
                                                        }}
                                                        title={`Signer ${sig.metadata?.order || '?'}`}
                                                    >
                                                        {sig.metadata?.order || i + 1}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Page Count Badge if has signatures */}
                                    {pageSigs.length > 0 && (
                                        <div className="absolute top-1 rights-1 flex flex-col gap-1 items-end p-1">
                                            <div className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full shadow-sm font-bold border border-white">
                                                {pageSigs.length} Fields
                                            </div>
                                        </div>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </Document>
            </div>
        </div>
    );
});

export default PageThumbnailsSidebar;
