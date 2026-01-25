import React, { useState, useEffect } from 'react';
import { Clock, RefreshCcw, X, Loader2, Download, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDocumentVersions, restoreDocumentVersion } from '../../../api/documents';
import toast from 'react-hot-toast';

const VersionHistorySidebar = ({ documentId, isOpen, onClose, onRestore, onPreview, onDownload }) => {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [restoringId, setRestoringId] = useState(null);

    useEffect(() => {
        if (isOpen && documentId) {
            fetchVersions();
        }
    }, [isOpen, documentId]);

    const fetchVersions = async () => {
        try {
            setLoading(true);
            const response = await getDocumentVersions(documentId);
            setVersions(response.data.data);
        } catch (error) {
            console.error("Failed to load versions", error);
            toast.error("Failed to load history.");
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (version) => {
        if (!confirm(`Are you sure you want to restore Version ${version.version_number}? Current changes will be saved as a new version.`)) {
            return;
        }

        try {
            setRestoringId(version.id);
            const response = await restoreDocumentVersion(documentId, version.id);
            toast.success(`Restored to Version ${version.version_number}`);

            // Pass the restored document data back to the parent to update the UI
            if (onRestore) {
                onRestore(response.data.data); // Assuming API returns the updated document resource
            }
            onClose();
        } catch (error) {
            console.error("Failed to restore version", error);
            toast.error("Failed to restore version.");
        } finally {
            setRestoringId(null);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <Clock size={16} /> Version History
                            </h3>
                            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin text-indigo-600" />
                                </div>
                            ) : versions.length === 0 ? (
                                <p className="text-center text-slate-500 text-sm py-8">No history available yet.</p>
                            ) : (
                                versions.map((version, index) => {
                                    const isCurrent = index === 0;

                                    return (
                                        <div key={version.id} className="relative pl-6 pb-6 border-l-2 border-slate-100 last:border-0 last:pb-0">
                                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${isCurrent ? 'bg-emerald-500 shadow-sm' : 'bg-slate-200'}`}></div>
                                            <div className="text-sm">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`font-medium ${isCurrent ? 'text-emerald-700' : 'text-slate-900'}`}>
                                                        {isCurrent ? `Version ${version.version_number} (Current)` : `Version ${version.version_number}`}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {new Date(version.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mb-2">
                                                    Updated by {version.created_by} <br />
                                                    {new Date(version.created_at).toLocaleTimeString()}
                                                </p>

                                                <div className="flex items-center gap-2 mt-2">
                                                    {!isCurrent && (
                                                        <button
                                                            onClick={() => onPreview && onPreview(version)}
                                                            className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors flex items-center gap-1"
                                                            title="Preview this version in the editor"
                                                        >
                                                            <Clock size={12} /> Preview
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => onDownload && onDownload(version)}
                                                        className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors flex items-center gap-1"
                                                        title="Download PDF of this version"
                                                    >
                                                        <Loader2 size={12} className={version.isDownloading ? "animate-spin" : "hidden"} />
                                                        {!version.isDownloading && <Download size={12} />}
                                                        PDF
                                                    </button>

                                                    {!isCurrent && (
                                                        <button
                                                            onClick={() => handleRestore(version)}
                                                            disabled={restoringId === version.id}
                                                            className="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition-colors flex items-center gap-1 ml-auto"
                                                            title="Restore this version as the current document"
                                                        >
                                                            {restoringId === version.id ? (
                                                                <Loader2 size={12} className="animate-spin" />
                                                            ) : (
                                                                <RefreshCcw size={12} />
                                                            )}
                                                            Restore
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default VersionHistorySidebar;
