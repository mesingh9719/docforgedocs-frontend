import React, { useState, useEffect } from 'react';
import { Clock, RefreshCcw, X, Loader2, Download, Eye, Share2, Mail, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDocumentVersions, restoreDocumentVersion, getDocumentShares } from '../../../api/documents';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../ConfirmationModal';

const UnifiedVersionHistory = ({ documentId, isOpen, onClose, onRestore, onPreview, onDownload, type = 'sidebar' }) => {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(false);

    // Restore Modal State
    const [restoreModal, setRestoreModal] = useState({
        isOpen: false,
        version: null
    });
    const [isRestoring, setIsRestoring] = useState(false);

    useEffect(() => {
        // If sidebar, load on open. If panel (always visible), load on mount.
        if (documentId && (type === 'panel' || isOpen)) {
            fetchHistory();
        }
    }, [isOpen, documentId, type]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const [versionsRes, sharesRes] = await Promise.allSettled([
                getDocumentVersions(documentId),
                getDocumentShares(documentId)
            ]);

            const versions = versionsRes.status === 'fulfilled' ? versionsRes.value.data.data : [];
            const shares = sharesRes.status === 'fulfilled' ? sharesRes.value.data : [];

            // Standardize and Merge
            const formattedVersions = versions.map(v => ({
                id: v.id,
                type: 'version',
                version_number: v.version_number,
                created_at: v.created_at,
                created_by: v.created_by,
                data: v
            }));

            const formattedShares = shares.map(s => ({
                id: s.id,
                type: 'share',
                email: s.email,
                permission: s.permission,
                created_at: s.created_at,
                created_by: s.created_by || 'You',
                data: s
            }));

            const merged = [...formattedVersions, ...formattedShares].sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            );

            setActivity(merged);
        } catch (error) {
            console.error("Failed to load history", error);
            toast.error("Failed to load history.");
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreRequest = (version) => {
        setRestoreModal({
            isOpen: true,
            version: version
        });
    };

    const handleConfirmRestore = async () => {
        const { version } = restoreModal;
        if (!version) return;

        try {
            setIsRestoring(true);
            const response = await restoreDocumentVersion(documentId, version.id);
            toast.success(`Restored to Version ${version.version_number}`);

            // Pass the restored document data back to the parent to update the UI
            if (onRestore) {
                onRestore(response.data.data);
            }
            setRestoreModal({ isOpen: false, version: null });
            if (onClose) onClose();
            fetchHistory(); // Refresh list to show new version
        } catch (error) {
            console.error("Failed to restore version", error);
            toast.error("Failed to restore version.");
        } finally {
            setIsRestoring(false);
        }
    };

    // Render Logic for List Items (Shared between Sidebar and Panel modes)
    const renderContent = () => (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-indigo-600" />
                </div>
            ) : activity.length === 0 ? (
                <p className="text-center text-slate-500 text-sm py-8">No history available yet.</p>
            ) : (
                activity.map((item) => {
                    if (item.type === 'version') {
                        const version = item.data;
                        return (
                            <div key={`v-${version.id}`} className="relative pl-6 pb-6 border-l-2 border-slate-100 last:border-0 last:pb-0">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white bg-slate-200 shadow-sm flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                </div>
                                <div className="text-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-slate-700">
                                            Version {version.version_number}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2">
                                        Saved by {version.created_by}
                                    </p>

                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        {onPreview && (
                                            <button
                                                onClick={() => onPreview(version)}
                                                className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors flex items-center gap-1"
                                            >
                                                <Eye size={12} /> Preview
                                            </button>
                                        )}
                                        {onDownload && (
                                            <button
                                                onClick={() => onDownload(version)}
                                                className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors flex items-center gap-1"
                                            >
                                                <Download size={12} /> PDF
                                            </button>
                                        )}
                                        {onRestore && (
                                            <button
                                                onClick={() => handleRestoreRequest(version)}
                                                className="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition-colors flex items-center gap-1 ml-auto"
                                            >
                                                <RefreshCcw size={12} /> Restore
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        // SHARE EVENT
                        const share = item.data;
                        return (
                            <div key={`s-${share.id}`} className="relative pl-6 pb-6 border-l-2 border-slate-100 last:border-0 last:pb-0">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white bg-blue-100 shadow-sm flex items-center justify-center">
                                    <Share2 size={10} className="text-blue-600" />
                                </div>
                                <div className="text-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-blue-700 flex items-center gap-1">
                                            Document Shared
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {formatDistanceToNow(new Date(share.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Mail size={12} className="text-slate-400" />
                                            <span className="font-medium text-slate-800">{share.email}</span>
                                        </div>
                                        <p className="text-slate-400">Shared by {share.created_by || 'You'}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })
            )}

            {onRestore && (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 flex gap-2">
                    <AlertCircle size={14} className="shrink-0 text-slate-400" />
                    <p>Restoring creates a new version from the selected state. No data is lost.</p>
                </div>
            )}

            {/* Restore Confirmation Modal - Rendered inside List to avoid z-index issues if panel */}
            <ConfirmationModal
                isOpen={restoreModal.isOpen}
                onClose={() => setRestoreModal({ isOpen: false, version: null })}
                onConfirm={handleConfirmRestore}
                title="Restore Version"
                message={`Are you sure you want to restore Version ${restoreModal.version?.version_number}?`}
                confirmText="Restore Version"
                isLoading={isRestoring}
            />
        </div>
    );

    // MODE 1: SIDEBAR (Drawer)
    if (type === 'sidebar') {
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
                                    <Clock size={16} /> Activity & History
                                </h3>
                                <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                                    <X size={20} />
                                </button>
                            </div>
                            {renderContent()}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    }

    // MODE 2: PANEL (Inline)
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Clock size={14} /> History
                </h3>
            </div>
            {renderContent()}
        </div>
    );
};

export default UnifiedVersionHistory;
