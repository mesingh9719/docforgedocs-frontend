import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, FileBadge, ArrowRight, FileCheck } from 'lucide-react';
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
        id: 'proposal',
        title: 'Business / Project Proposal',
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

    const handleSelect = (template) => {
        if (!template.available) return;
        navigate(template.route);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto max-w-2xl h-fit z-50 p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Create New Document</h2>
                                    <p className="text-sm text-slate-500">Choose a template to get started</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 grid gap-4">
                                {templates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => handleSelect(template)}
                                        disabled={!template.available}
                                        className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all text-left w-full
                                            ${template.available
                                                ? 'border-slate-200 hover:border-indigo-300 hover:shadow-md cursor-pointer bg-white'
                                                : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg ${template.color}`}>
                                            <template.icon size={24} />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                                {template.title}
                                                {!template.available && (
                                                    <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">Coming Soon</span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                                        </div>

                                        {template.available && (
                                            <div className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                                                <ArrowRight size={20} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TemplateModal;
