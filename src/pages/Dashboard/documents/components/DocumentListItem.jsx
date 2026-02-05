import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, PenTool, Mail, MoreVertical, CheckSquare, Square, Eye, Trash2, RotateCcw, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const DocumentListItem = memo(({
    doc,
    getStatusStyle,
    variants,
    isSelected,
    toggleSelect,
    onViewHistory,
    activeMenuId,
    setActiveMenuId,
    handleView,
    handleDelete,
    handleRestore,
    viewMode
}) => {
    return (
        <motion.div
            variants={variants}
            className={`relative group bg-white hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 ${isSelected ? 'bg-indigo-50/50' : ''}`}
            onClick={() => handleView(doc)}
        >
            {/* Mobile View */}
            <div className="md:hidden p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div onClick={(e) => { e.stopPropagation(); toggleSelect(doc.id); }}>
                            {isSelected ? <CheckSquare size={20} className="text-indigo-600" /> : <Square size={20} className="text-slate-300" />}
                        </div>
                        <div className={`p-2 rounded-lg ${doc.signers_count > 0 ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {doc.signers_count > 0 ? <PenTool size={16} /> : <FileText size={16} />}
                        </div>
                        <div>
                            <span className="font-semibold text-sm text-slate-900 line-clamp-1">{doc.title || doc.name}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-slate-500 capitalize">{doc.type?.name || doc.type}</span>
                                <span className="text-[10px] text-slate-400">•</span>
                                <span className="text-xs text-slate-500">{formatDistanceToNow(new Date(doc.updated_at))} ago</span>
                            </div>
                        </div>
                    </div>
                    <button
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

            {/* Desktop View */}
            <div className="hidden md:grid px-6 py-4 grid-cols-[auto_3fr_1fr_1fr_1fr_1fr_auto] gap-6 items-center">
                <div onClick={(e) => { e.stopPropagation(); toggleSelect(doc.id); }} className="cursor-pointer">
                    {isSelected
                        ? <CheckSquare size={18} className="text-indigo-600" />
                        : <Square size={18} className="text-slate-300 group-hover:text-slate-400" />
                    }
                </div>

                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors ${doc.signers_count > 0 ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                        {doc.signers_count > 0 ? <PenTool size={18} /> : <FileText size={18} />}
                    </div>
                    <div>
                        <span className="font-semibold text-sm text-slate-700 block group-hover:text-indigo-600 transition-colors">
                            {doc.title || doc.name}
                        </span>
                        {doc.signers_count > 0 && (
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium mt-1 inline-block">
                                Signature Required
                            </span>
                        )}
                    </div>
                </div>

                <div className="text-sm text-slate-500 font-medium capitalize">{doc.type?.name || doc.type}</div>

                <div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(doc.status)}`}>
                        {doc.status}
                    </span>
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
                    <motion.div
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
                                <button
                                    onClick={() => { handleDelete(doc.id); setActiveMenuId(null); }}
                                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => { handleRestore(doc.id); setActiveMenuId(null); }}
                                className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                                <RotateCcw size={16} /> Restore
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
});

export default DocumentListItem;
