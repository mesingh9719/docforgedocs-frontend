import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Trash2, ChevronDown, ChevronRight, Plus } from 'lucide-react';

export const BuilderSectionCard = ({
    section,
    onUpdate,
    onRemove,
    isFixed = false,
    placeholderTitle = "Section Title",
    placeholderContent = "Content...",
    children
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="group relative pl-4">
            {/* Timeline Line */}
            <div className="absolute left-[7px] top-8 bottom-[-8px] w-[2px] bg-slate-100 group-last:hidden" />
            <div className="absolute left-0 top-6 w-4 h-4 rounded-full border-2 border-indigo-100 bg-white z-10 flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full ${isFixed ? 'bg-slate-300' : 'bg-indigo-500'}`} />
            </div>

            <div className={`bg-white border rounded-xl shadow-sm transition-all duration-200 ${isExpanded ? 'border-indigo-200 shadow-md ring-1 ring-indigo-500/10' : 'border-slate-200 hover:border-indigo-300'}`}>
                {/* Card Header */}
                <div className="flex items-center gap-3 p-3 select-none">
                    {!isFixed && (
                        <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-indigo-500 transition-colors p-1">
                            <GripVertical size={18} />
                        </div>
                    )}

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                    >
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>

                    <div className="flex-1 min-w-0">
                        {isFixed ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{section.title}</span>
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200">FIXED</span>
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={section.title || ''}
                                onChange={(e) => onUpdate('title', e.target.value)}
                                placeholder={placeholderTitle}
                                className="w-full bg-transparent text-sm font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:placeholder-slate-400"
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                    </div>

                    {!isFixed && (
                        <button
                            onClick={onRemove}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Remove Section"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>

                {/* Card Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="p-3 pt-0 border-t border-slate-50">
                                {isFixed ? (
                                    children
                                ) : (
                                    <textarea
                                        value={section.content || ''}
                                        onChange={(e) => onUpdate('content', e.target.value)}
                                        rows={4}
                                        className="w-full mt-3 p-3 text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-lg focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-y placeholder-slate-300"
                                        placeholder={placeholderContent}
                                    />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export const BuilderAddButton = ({ onClick, label = "Add New Section" }) => (
    <div className="pl-4 relative">
        <div className="absolute left-[7px] top-0 h-8 w-[2px] bg-slate-100" />
        <div className="absolute left-0 top-8 w-4 h-4 rounded-full border-2 border-indigo-100 bg-indigo-50 z-10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
        </div>

        <button
            onClick={onClick}
            className="w-full mt-4 py-3 flex items-center justify-center gap-2 bg-white border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-medium hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 group relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-indigo-50/0 group-hover:bg-indigo-50/30 transition-colors" />
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={14} strokeWidth={3} />
            </div>
            <span>{label}</span>
        </button>
    </div>
);
