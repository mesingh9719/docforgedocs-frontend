import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCw, Download, Maximize2 } from 'lucide-react';

const PDFViewer = ({ pdfUrl }) => {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.25, 0.5));
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const handleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className="relative">
            {/* Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-2">
                <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom Out"
                >
                    <ZoomOut size={18} className="text-slate-700" />
                </button>
                
                <span className="px-3 py-1 text-sm font-medium text-slate-700 bg-slate-50 rounded">
                    {Math.round(zoom * 100)}%
                </span>
                
                <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom In"
                >
                    <ZoomIn size={18} className="text-slate-700" />
                </button>

                <div className="w-px h-6 bg-slate-200 mx-1" />

                <button
                    onClick={handleRotate}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Rotate"
                >
                    <RotateCw size={18} className="text-slate-700" />
                </button>

                <button
                    onClick={handleFullscreen}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Fullscreen"
                >
                    <Maximize2 size={18} className="text-slate-700" />
                </button>
            </div>

            {/* PDF Display */}
            <div className={`
                overflow-auto bg-slate-100 rounded-xl
                ${isFullscreen ? 'fixed inset-0 z-50' : 'max-h-[800px]'}
            `}>
                <div className="p-8 flex items-center justify-center min-h-[600px]">
                    <motion.div
                        animate={{
                            scale: zoom,
                            rotate: rotation
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-white shadow-2xl rounded-lg overflow-hidden"
                        style={{
                            transformOrigin: 'center center'
                        }}
                    >
                        {/* PDF Preview - In real implementation, use a PDF library like react-pdf */}
                        <div className="w-[595px] h-[842px] bg-white p-12 relative">
                            {/* Simulated PDF Content */}
                            <div className="space-y-4">
                                <div className="h-8 bg-slate-800 w-3/4 rounded" />
                                <div className="h-4 bg-slate-300 w-full rounded" />
                                <div className="h-4 bg-slate-300 w-full rounded" />
                                <div className="h-4 bg-slate-300 w-5/6 rounded" />
                                
                                <div className="mt-8 space-y-2">
                                    <div className="h-3 bg-slate-200 w-full rounded" />
                                    <div className="h-3 bg-slate-200 w-full rounded" />
                                    <div className="h-3 bg-slate-200 w-11/12 rounded" />
                                    <div className="h-3 bg-slate-200 w-full rounded" />
                                    <div className="h-3 bg-slate-200 w-4/5 rounded" />
                                </div>

                                <div className="mt-8 space-y-2">
                                    <div className="h-3 bg-slate-200 w-full rounded" />
                                    <div className="h-3 bg-slate-200 w-full rounded" />
                                    <div className="h-3 bg-slate-200 w-11/12 rounded" />
                                </div>

                                <div className="mt-12 p-6 border-2 border-slate-300 rounded-lg bg-slate-50">
                                    <div className="h-4 bg-slate-400 w-1/2 rounded mb-4" />
                                    <div className="space-y-2">
                                        <div className="h-3 bg-slate-300 w-full rounded" />
                                        <div className="h-3 bg-slate-300 w-full rounded" />
                                        <div className="h-3 bg-slate-300 w-3/4 rounded" />
                                    </div>
                                </div>

                                {/* Watermark showing it's a preview */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-slate-200 text-6xl font-bold opacity-20 rotate-[-45deg]">
                                        PREVIEW
                                    </div>
                                </div>
                            </div>

                            {/* Note: In production, use react-pdf or similar library */}
                            {/* Example:
                            <Document file={pdfUrl}>
                                <Page pageNumber={1} scale={zoom} rotate={rotation} />
                            </Document>
                            */}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                </div>
                <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">PDF Preview Mode</p>
                    <p className="text-blue-600">
                        This is a simulated preview. In production, integrate a PDF library like <code className="bg-blue-100 px-1 rounded">react-pdf</code> or <code className="bg-blue-100 px-1 rounded">pdf.js</code> for actual PDF rendering.
                    </p>
                </div>
            </div>

            {/* Exit Fullscreen Button */}
            {isFullscreen && (
                <button
                    onClick={() => setIsFullscreen(false)}
                    className="fixed top-4 right-4 z-[60] px-4 py-2 bg-white/95 backdrop-blur-sm text-slate-700 font-medium rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                    Exit Fullscreen
                </button>
            )}
        </div>
    );
};

export default PDFViewer;