import StatusBadge from '../ui/StatusBadge';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Loader2, Check, AlertCircle, Cloud, Send, Copy, Ban, Download, Printer } from 'lucide-react';

const EditorHeader = ({
    title,
    onTitleChange,
    status,
    saveStatus,
    lastSavedAt,
    isSaving,
    onSave,
    onBack,
    onSend,
    onPreview,
    onExport,
    onPrint,
    onDuplicate,
    onVoid,
    showVoid,
    showDuplicate,
    showExport = false,
    showPrint = false,
    customActions
}) => {
    const navigate = useNavigate();

    // Default Back Handler
    const handleBack = onBack || (() => navigate('/documents'));

    // Render Save Status Indicator
    const renderSaveStatus = () => {
        switch (saveStatus) {
            case 'saving':
                return <span className="flex items-center gap-1.5 text-xs text-slate-400"><Loader2 className="animate-spin" size={14} /> Saving...</span>;
            case 'saved':
                return <span className="flex items-center gap-1.5 text-xs text-green-500"><Check size={14} /> {lastSavedAt ? `Saved at ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Saved'}</span>;
            case 'error':
                return <span className="flex items-center gap-1.5 text-xs text-red-500"><AlertCircle size={14} /> Save failed</span>;
            case 'unsaved':
                return <span className="flex items-center gap-1.5 text-xs text-amber-500"><Cloud size={14} /> Unsaved changes</span>;
            default:
                return null;
        }
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 flex-shrink-0">
            {/* Left: Navigation & Title */}
            <div className="flex items-center gap-4">
                <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
                        readOnly={!onTitleChange}
                        className="text-lg font-bold text-slate-800 border-none focus:ring-0 bg-transparent p-0 placeholder-slate-400 focus:outline-none truncate max-w-[300px]"
                        placeholder="Untitled Document"
                    />
                    {/* Status Badge can go here if needed, or in the title input group */}
                </div>
                {status && status !== 'draft' && (
                    <StatusBadge status={status} />
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {renderSaveStatus()}

                {/* Custom Actions Slot */}
                {customActions}

                {/* Void Action */}
                {showVoid && (
                    <button
                        onClick={onVoid}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg text-sm"
                        title="Void Document"
                    >
                        <Ban size={16} />
                        <span className="hidden xl:inline">Void</span>
                    </button>
                )}

                {/* Duplicate Action */}
                {showDuplicate && (
                    <button
                        onClick={onDuplicate}
                        className="flex items-center gap-2 px-3 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg text-sm"
                        title="Duplicate Document"
                    >
                        <Copy size={16} />
                        <span className="hidden xl:inline">Duplicate</span>
                    </button>
                )}

                {/* Print Action */}
                {showPrint && (
                    <button
                        onClick={onPrint}
                        className="flex items-center gap-2 px-3 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg text-sm"
                        title="Print"
                    >
                        <Printer size={16} />
                        <span className="hidden xl:inline">Print</span>
                    </button>
                )}

                {/* Export Action */}
                {showExport && (
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 px-3 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg text-sm"
                        title="Export PDF"
                    >
                        <Download size={16} />
                        <span className="hidden xl:inline">Export</span>
                    </button>
                )}

                {/* Preview Action */}
                {onPreview && (
                    <button
                        onClick={onPreview}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg text-sm"
                    >
                        <Eye size={16} /> <span className="hidden sm:inline">Preview</span>
                    </button>
                )}

                {/* Save Action */}
                {onSave && (
                    <button
                        onClick={onSave}
                        disabled={isSaving || saveStatus === 'saving'}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 shadow-sm disabled:opacity-50 text-sm transition-all"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                )}

                {/* Send Functionality - Primary CTA */}
                {onSend && (
                    <button
                        onClick={onSend}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm text-sm transition-all active:scale-95"
                    >
                        <Send size={16} />
                        <span>Send</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default EditorHeader;
