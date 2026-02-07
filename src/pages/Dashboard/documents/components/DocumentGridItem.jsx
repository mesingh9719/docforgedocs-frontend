import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FileText, PenTool, Clock, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const DocumentGridItem = memo(({ doc, getStatusStyle, variants, onViewHistory, handleView }) => {
    return (
        <motion.div
            variants={variants}
            className="group relative bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:shadow-lg hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between h-full"
            onClick={() => handleView(doc)}
        >
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-lg transition-colors ${doc.signers_count > 0
                            ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-100'
                            : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'
                        }`}>
                        {doc.signers_count > 0 ? <PenTool size={20} /> : <FileText size={20} />}
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={(e) => onViewHistory(e, doc.id)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="View Share History"
                        >
                            <Mail size={14} />
                        </button>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(doc.status)}`}>
                            {doc.status}
                        </span>
                    </div>
                </div>

                <h3 className="font-semibold text-slate-800 mb-1.5 group-hover:text-indigo-600 transition-colors line-clamp-1 text-base">
                    {doc.title || doc.name}
                </h3>
                <p className="text-xs font-medium text-slate-500 mb-4 uppercase tracking-wider">
                    {doc.type?.name || doc.type}
                </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
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
                    <span className="text-xs font-medium text-slate-600 truncate max-w-[100px]" title={doc.creator?.name}>
                        {doc.creator?.name || 'Unknown'}
                    </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                </span>
            </div>
        </motion.div>
    );
});

export default DocumentGridItem;
