import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react';

const PDFViewer = ({ pdfUrl }) => {
    const [objectUrl, setObjectUrl] = useState(null);

    useEffect(() => {
        if (pdfUrl instanceof File) {
            const url = URL.createObjectURL(pdfUrl);
            setObjectUrl(url);
            
            // Cleanup
            return () => URL.revokeObjectURL(url);
        } else if (typeof pdfUrl === 'string') {
            setObjectUrl(pdfUrl);
        }
    }, [pdfUrl]);

    if (!objectUrl) {
        return (
            <div className="w-full h-[600px] bg-slate-100 rounded-xl flex items-center justify-center">
                <p className="text-slate-500">No PDF loaded</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-2">
                <span className="px-4 py-2 text-sm font-medium text-slate-700">
                    PDF Preview
                </span>
            </div>

            {/* PDF Display using iframe */}
            <div className="overflow-auto bg-slate-100 rounded-xl max-h-[800px]">
                <div className="p-8">
                    <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
                        <iframe
                            src={objectUrl}
                            className="w-full h-[700px]"
                            title="PDF Preview"
                            style={{ border: 'none' }}
                        />
                    </div>
                </div>
            </div>

            {/* Info Note */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                    <strong>Preview Mode:</strong> This is your uploaded PDF. You can scroll through pages using the browser's built-in PDF viewer.
                </p>
            </div>
        </div>
    );
};

export default PDFViewer;