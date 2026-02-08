import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

const FilePreviewModal = ({ node, onClose }) => {
    if (!node) return null;

    const isImage = node.mime_type?.startsWith('image/');
    const isPDF = node.mime_type === 'application/pdf';
    const previewUrl = `/api/v1/drive/nodes/${node.id}/preview`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-800 truncate">{node.name}</h3>
                        <p className="text-sm text-slate-500">{node.mime_type || 'Unknown type'}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <a
                            href={previewUrl}
                            download
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            title="Download"
                        >
                            <Download size={20} />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center p-6">
                    {isImage ? (
                        <img
                            src={previewUrl}
                            alt={node.name}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        />
                    ) : isPDF ? (
                        <iframe
                            src={previewUrl}
                            className="w-full h-full min-h-[600px] rounded-lg shadow-lg bg-white"
                            title={node.name}
                        />
                    ) : (
                        <div className="text-center">
                            <ExternalLink className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-600 font-medium mb-2">Preview not available</p>
                            <p className="text-sm text-slate-500 mb-4">This file type cannot be previewed in the browser</p>
                            <a
                                href={previewUrl}
                                download
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <Download size={18} />
                                Download File
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilePreviewModal;
