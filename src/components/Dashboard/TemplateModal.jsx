import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, FileBadge, ArrowRight, FileCheck, Briefcase, Handshake, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const templates = [
    {
        id: 'nda',
        title: 'Non-Disclosure Agreement',
        description: 'Standard confidentiality agreement for business partnerships.',
        icon: FileBadge,
        color: 'bg-indigo-500',
        available: true,
        route: '/documents/nda'
    },
    {
        id: 'offer-letter',
        title: 'Employment Offer Letter',
        description: 'Formal job offer with compensation and benefits details.',
        icon: Briefcase,
        color: 'bg-blue-500',
        available: true,
        route: '/documents/offer-letter'
    },
    {
        id: 'consulting-agreement',
        title: 'Consulting Agreement',
        description: 'Contract defining scope, services, and payment terms.',
        icon: Handshake,
        color: 'bg-violet-500',
        available: true,
        route: '/documents/consulting-agreement'
    },
    {
        id: 'proposal',
        title: 'Business Proposal',
        description: 'Comprehensive proposal with timeline, scope, and pricing.',
        icon: FileText,
        color: 'bg-emerald-500',
        available: true,
        route: '/documents/proposal'
    },
    {
        id: 'invoice',
        title: 'Service Invoice',
        description: 'Professional invoice template with tax calculations.',
        icon: FileCheck,
        color: 'bg-orange-500',
        available: true,
        route: '/documents/invoice'
    }
];

const TemplateModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    const handleSelect = (template) => {
        if (!template.available) return;
        navigate(template.route);
        onClose();
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto max-w-4xl h-fit max-h-[90vh] z-[9999] p-4 pointer-events-none flex items-center justify-center"
                    >
                        <div className="bg-white/95 backdrop-blur-md w-full rounded-2xl shadow-2xl overflow-hidden border border-white/20 relative pointer-events-auto flex flex-col max-h-full">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-gradient-to-br from-slate-50 to-white/50">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Document</h2>
                                    <p className="text-sm text-slate-500 mt-1">Select a premium template to get started with your document.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                            title="Grid View"
                                        >
                                            <LayoutGrid size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                            title="List View"
                                        >
                                            <List size={18} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className={`p-6 overflow-y-auto ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-3'}`}>
                                {templates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => handleSelect(template)}
                                        disabled={!template.available}
                                        className={`group relative transition-all text-left outline-none focus:ring-2 ring-indigo-500/20 rounded-xl
                                            ${viewMode === 'grid'
                                                ? 'p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 bg-white flex flex-col items-start gap-4'
                                                : 'p-4 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 flex items-center gap-4 bg-white'
                                            }
                                            ${!template.available && 'opacity-60 cursor-not-allowed grayscale'}
                                        `}
                                    >
                                        <div className={`
                                            flex items-center justify-center text-white shadow-lg rounded-xl transition-transform group-hover:scale-110 duration-300
                                            ${viewMode === 'grid' ? 'w-14 h-14 mb-2' : 'w-12 h-12'}
                                            ${template.color}
                                        `}>
                                            <template.icon size={viewMode === 'grid' ? 28 : 24} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-bold text-slate-800 flex items-center gap-2 ${viewMode === 'grid' ? 'text-lg' : 'text-base'}`}>
                                                {template.title}
                                                {!template.available && (
                                                    <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">Soon</span>
                                                )}
                                            </h3>
                                            <p className={`text-slate-500 leading-relaxed ${viewMode === 'grid' ? 'text-sm mt-2 line-clamp-3' : 'text-sm mt-0.5 line-clamp-1'}`}>
                                                {template.description}
                                            </p>
                                        </div>

                                        {template.available && (
                                            <div className={`
                                                text-slate-300 group-hover:text-indigo-500 transition-colors
                                                ${viewMode === 'grid' ? 'absolute top-6 right-6 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300' : ''}
                                            `}>
                                                <ArrowRight size={20} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Footer hint */}
                            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
                                Can't find what you're looking for? <button className="text-indigo-600 hover:underline">Request a template</button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default TemplateModal;
