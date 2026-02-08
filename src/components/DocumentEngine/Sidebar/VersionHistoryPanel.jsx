import React, { useEffect, useState } from 'react';
import { Clock, RotateCcw, AlertCircle } from 'lucide-react';
import { getDocumentVersions, restoreDocumentVersion } from '../../../api/documents';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const VersionHistoryPanel = ({ documentId, onRestore }) => {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVersions = async () => {
        try {
            setLoading(true);
            const response = await getDocumentVersions(documentId);
            setVersions(response.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (documentId) {
            fetchVersions();
        }
    }, [documentId]);

    const handleRestore = async (version) => {
        if (!window.confirm(`Are you sure you want to restore Version ${version.version_number}? Current changes will be saved as a new version.`)) return;

        try {
            await restoreDocumentVersion(documentId, version.id);
            toast.success(`Restored to Version ${version.version_number}`);
            fetchVersions(); // Refresh list
            if (onRestore) onRestore(); // Reload document in parent
        } catch (error) {
            console.error(error);
            toast.error("Failed to restore version");
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Clock size={16} className="text-indigo-600" />
                    Version History
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="text-center py-8 text-slate-400 text-sm">Loading history...</div>
                ) : versions.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">No history available.</div>
                ) : (
                    versions.map((version, index) => (
                        <div key={version.id} className="relative pl-6 pb-6 border-l border-slate-200 last:border-l-0 last:pb-0">
                            <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white box-content"></div>

                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-bold text-slate-700">version {version.version_number}</span>
                                    {index !== 0 && (
                                        <button
                                            onClick={() => handleRestore(version)}
                                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                                            title="Restore this version"
                                        >
                                            <RotateCcw size={12} /> Restore
                                        </button>
                                    )}
                                </div>
                                <span className="text-xs text-slate-500">
                                    {formatDistanceToNow(new Date(version.created_at))} ago
                                </span>
                                <span className="text-xs text-slate-400">
                                    by {version.created_by}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex gap-2">
                <AlertCircle size={14} className="shrink-0 text-slate-400" />
                <p>Restoring a version creates a new version snapshot of the current state before reverting.</p>
            </div>
        </div>
    );
};

export default VersionHistoryPanel;
