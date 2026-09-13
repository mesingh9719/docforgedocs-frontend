import StatusBadge from '../../../../components/ui/StatusBadge';
import React, { memo } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { FileText, PenTool, Mail, MoreVertical, CheckSquare, Square, Eye, Trash2, RotateCcw, Clock, Copy, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const DocumentListItem = memo(({
    doc,
    variants,
    isSelected,
    toggleSelect,
    onViewHistory,
    activeMenuId,
    setActiveMenuId,
    handleView,
    handleDelete,
    handleRestore,
    handleDuplicate,
    handleSign,
    viewMode,
    permissions = {}
}) => {
    const documentType = doc.document_type || doc.type;
    const typeName = typeof documentType === 'string' ? documentType : documentType?.name || 'General';

    return (
        <Motion.div
            variants={variants}
            className={`document-row relative group hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 ${isSelected ? 'bg-indigo-50/50' : 'bg-white'}`}
            onClick={() => handleView(doc)}
        >
            {/* Mobile View */}
            <div className="xl:hidden p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button aria-label={`Select ${doc.title || doc.name}`} aria-pressed={isSelected} className="shrink-0 p-1" onClick={(e) => { e.stopPropagation(); toggleSelect(doc.id); }}>
                            {isSelected ? <CheckSquare size={20} className="text-indigo-600" /> : <Square size={20} className="text-slate-400" />}
                        </button>
                        <div className={`p-2 rounded-lg ${doc.signers_count > 0 ? 'bg-slate-100 text-slate-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {doc.signers_count > 0 ? <PenTool size={16} /> : <FileText size={16} />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <button onClick={(e) => { e.stopPropagation(); handleView(doc); }} className="text-left font-semibold text-sm text-slate-900 line-clamp-2 break-words">{doc.title || doc.name}</button>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-xs text-slate-500 capitalize">{typeName}</span>
                                <span className="text-[10px] text-slate-400">•</span>
                                <span className="text-xs text-slate-500">{formatDistanceToNow(new Date(doc.updated_at))} ago</span>
                            </div>
                        </div>
                    </div>
                    <button
                        aria-label={`Actions for ${doc.title || doc.name}`} aria-expanded={activeMenuId === doc.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === doc.id ? null : doc.id);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 relative z-10"
                    >
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            <div className="xl:hidden px-4 pb-4 flex items-center justify-between gap-3 text-xs text-slate-500"><StatusBadge status={doc.status} /><span className="truncate">{doc.creator?.name || 'Unknown owner'}</span></div>

            {/* Desktop View */}
            <div className="hidden xl:grid px-6 py-5 grid-cols-[24px_minmax(0,2.5fr)_minmax(0,1fr)_90px_100px_minmax(0,1fr)_72px] gap-4 items-center">
                <button aria-label={`Select ${doc.title || doc.name}`} aria-pressed={isSelected} onClick={(e) => { e.stopPropagation(); toggleSelect(doc.id); }} className="cursor-pointer">
                    {isSelected
                        ? <CheckSquare size={18} className="text-indigo-600" />
                        : <Square size={18} className="text-slate-300 group-hover:text-slate-400" />
                    }
                </button>

                <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg transition-colors ${doc.signers_count > 0 ? 'bg-slate-100 text-slate-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                        {doc.signers_count > 0 ? <PenTool size={18} /> : <FileText size={18} />}
                    </div>
                    <div className="min-w-0">
                        <button onClick={(e) => { e.stopPropagation(); handleView(doc); }} className="text-left font-medium text-sm text-slate-800 block group-hover:text-indigo-600 transition-colors break-words">
                            {doc.title || doc.name}
                        </button>
                        {doc.signers_count > 0 && (
                            <StatusBadge status="signature_required" className="mt-1" />
                        )}
                    </div>
                </div>

                <div className="text-sm text-slate-500 font-medium capitalize">{typeName}</div>

                <div>
                    <StatusBadge status={doc.status} />
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-400" />
                    {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                </div>

                <div className="flex items-center gap-2">
                    {doc.creator?.avatar_url ? (
                        <img
                            src={doc.creator.avatar_url}
                            alt={doc.creator.name}
                            className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                            {doc.creator?.name ? doc.creator.name.substring(0, 2).toUpperCase() : 'NA'}
                        </div>
                    )}
                    <span className="text-xs font-medium text-slate-600 truncate max-w-[80px]">
                        {doc.creator?.name || 'Unknown'}
                    </span>
                </div>

                <div className="flex justify-end gap-1 relative">
                    <button
                        onClick={(e) => onViewHistory(e, doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                        title="View History"
                    >
                        <Mail size={16} />
                    </button>
                    <button
                        aria-label={`Actions for ${doc.title || doc.name}`} aria-expanded={activeMenuId === doc.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === doc.id ? null : doc.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                    >
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>

            {/* Context Menu */}
            <AnimatePresence>
                {activeMenuId === doc.id && (
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-4 md:right-8 top-12 md:top-10 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 p-1.5 flex flex-col gap-0.5 origin-top-right"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {viewMode === 'active' ? (
                            <>
                                <button
                                    onClick={() => {
                                        handleView(doc);
                                        setActiveMenuId(null);
                                    }}
                                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
                                >
                                    <Eye size={16} /> View/Edit
                                </button>
                                {permissions.canCreate && (
                                    <button
                                        onClick={() => {
                                            handleDuplicate(doc);
                                        }}
                                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
                                    >
                                        <Copy size={16} /> Duplicate
                                    </button>
                                )}
                                {doc.status?.toLowerCase() === 'draft' &&
                                    !['nda', 'proposal', 'invoice'].includes(documentType?.slug) &&
                                    (!doc.content?.blocks?.length) &&
                                    (!doc.signers?.some(s => ['sent', 'viewed', 'signed'].includes(s.status))) &&
                                    permissions.canSign && (
                                        <button
                                            onClick={() => {
                                                handleSign(doc);
                                                setActiveMenuId(null);
                                            }}
                                            className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
                                        >
                                            <PenTool size={16} /> Sign Document
                                        </button>
                                    )}
                                {doc.pdf_url && (
                                    <a
                                        href={doc.pdf_url}
                                        download
                                        onClick={() => setActiveMenuId(null)}
                                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
                                    >
                                        <Download size={16} /> Download PDF
                                    </a>
                                )}
                                {permissions.canDelete && (
                                    <>
                                        <div className="h-px bg-slate-100 my-1"></div>
                                        <button
                                            onClick={() => { handleDelete(doc.id); setActiveMenuId(null); }}
                                            className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            permissions.canDelete && (
                                <button
                                    onClick={() => { handleRestore(doc.id); setActiveMenuId(null); }}
                                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                >
                                    <RotateCcw size={16} /> Restore
                                </button>
                            )
                        )}
                    </Motion.div>
                )}
            </AnimatePresence>

        </Motion.div>
    );
});

DocumentListItem.displayName = 'DocumentListItem';
export default DocumentListItem;
