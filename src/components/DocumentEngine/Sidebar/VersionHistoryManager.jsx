import React, { useState, useEffect } from 'react';
import { History, Plus, RotateCcw, Check, Loader2, Clock, GitCommit, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTemplateVersions, createTemplateVersion } from '../../../api/templates';

const VersionHistoryManager = ({
    templateId,
    currentVersion = 1,
    isPredefined = false,
    onRestoreVersion,
}) => {
    const [versions, setVersions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newSummary, setNewSummary] = useState('');
    const [isSubmittingSnapshot, setIsSubmittingSnapshot] = useState(false);
    const [restoringVersionId, setRestoringVersionId] = useState(null);

    const loadVersions = async () => {
        if (!templateId || isPredefined) return;
        try {
            setIsLoading(true);
            const res = await getTemplateVersions(templateId);
            setVersions(res.data?.data || res.data || []);
        } catch (err) {
            console.error('Failed to load version history:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVersions();
    }, [templateId, currentVersion]);

    const handleCreateSnapshot = async () => {
        if (!templateId) {
            toast.error('Please save your template first before creating snapshots.');
            return;
        }

        try {
            setIsSubmittingSnapshot(true);
            const summary = newSummary.trim() || `Manual snapshot v${currentVersion + 1}`;
            await createTemplateVersion(templateId, {
                change_summary: summary,
            });
            toast.success('Version snapshot created!');
            setNewSummary('');
            setIsCreating(false);
            await loadVersions();
        } catch (err) {
            console.error('Failed to create snapshot:', err);
            toast.error('Failed to create version snapshot.');
        } finally {
            setIsSubmittingSnapshot(false);
        }
    };

    const handleRestore = async (version) => {
        if (!onRestoreVersion) return;
        setRestoringVersionId(version.id);
        try {
            await onRestoreVersion(version.id, version.version_number);
            await loadVersions();
        } finally {
            setRestoringVersionId(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Just now';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="h-full flex flex-col bg-white font-sans text-xs">
            {/* Header */}
            <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700">
                    <History size={16} className="text-indigo-600" />
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                        Version History
                    </span>
                </div>
                {!isPredefined && templateId && (
                    <button
                        type="button"
                        onClick={() => setIsCreating(!isCreating)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/80 rounded-lg transition"
                    >
                        <Plus size={13} />
                        <span>Snapshot</span>
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Snapshot Creation Box */}
                {isCreating && (
                    <div className="bg-slate-50 border border-indigo-200 rounded-xl p-3.5 space-y-3 shadow-xs">
                        <span className="font-bold text-slate-800 text-xs block">
                            Create Named Version Snapshot
                        </span>
                        <div>
                            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                                Change Summary / Release Note
                            </label>
                            <input
                                type="text"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                                placeholder="e.g. Added legal terms and payment schedule"
                                value={newSummary}
                                onChange={(e) => setNewSummary(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-2 pt-1">
                            <button
                                type="button"
                                onClick={handleCreateSnapshot}
                                disabled={isSubmittingSnapshot}
                                className="flex-1 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-1"
                            >
                                {isSubmittingSnapshot && <Loader2 size={13} className="animate-spin" />}
                                <span>Save Snapshot</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Predefined info */}
                {isPredefined && (
                    <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-950 text-xs space-y-1">
                        <span className="font-bold block text-indigo-900">Blueprint Version</span>
                        <p className="text-[11px] text-indigo-800/80 leading-relaxed">
                            This is a system blueprint with fixed version 1. Click "Duplicate" or customize blocks to create your editable enterprise version.
                        </p>
                    </div>
                )}

                {/* Loading state */}
                {isLoading && (
                    <div className="flex items-center justify-center py-8 text-slate-400 gap-2">
                        <Loader2 size={16} className="animate-spin text-indigo-600" />
                        <span>Loading version snapshots...</span>
                    </div>
                )}

                {/* Versions Timeline List */}
                {!isLoading && !isPredefined && (
                    <div className="space-y-3">
                        {versions.length === 0 ? (
                            <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 bg-slate-50/40">
                                <FileText size={24} className="mx-auto mb-1.5 text-slate-300" />
                                <p className="text-[11px]">Version history will appear after saving.</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                    Each save and snapshot creates an audit snapshot.
                                </p>
                            </div>
                        ) : (
                            <div className="relative pl-4 border-l-2 border-slate-200 space-y-4">
                                {versions.map((ver) => {
                                    const isCurrent = ver.version_number === currentVersion;
                                    const isRestoring = restoringVersionId === ver.id;

                                    return (
                                        <div key={ver.id} className="relative group">
                                            {/* Dot indicator */}
                                            <div
                                                className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 bg-white transition ${
                                                    isCurrent
                                                        ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-600'
                                                        : 'border-slate-300 group-hover:border-slate-400'
                                                }`}
                                            />

                                            <div
                                                className={`p-3 rounded-xl border transition-all ${
                                                    isCurrent
                                                        ? 'bg-indigo-50/30 border-indigo-200 shadow-2xs'
                                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-1 mb-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                                                                isCurrent
                                                                    ? 'bg-indigo-600 text-white'
                                                                    : 'bg-slate-100 text-slate-700'
                                                            }`}
                                                        >
                                                            v{ver.version_number}
                                                        </span>
                                                        {isCurrent && (
                                                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
                                                                Current
                                                            </span>
                                                        )}
                                                    </div>

                                                    {!isCurrent && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRestore(ver)}
                                                            disabled={isRestoring}
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg transition"
                                                            title={`Restore template to version ${ver.version_number}`}
                                                        >
                                                            {isRestoring ? (
                                                                <Loader2 size={11} className="animate-spin text-indigo-600" />
                                                            ) : (
                                                                <RotateCcw size={11} />
                                                            )}
                                                            <span>Restore</span>
                                                        </button>
                                                    )}
                                                </div>

                                                <p className="text-slate-700 font-medium text-[11px] mt-1">
                                                    {ver.change_summary || `Version ${ver.version_number} snapshot`}
                                                </p>

                                                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1.5">
                                                    <Clock size={11} />
                                                    <span>{formatDate(ver.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VersionHistoryManager;
