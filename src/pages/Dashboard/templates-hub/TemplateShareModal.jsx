import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Lock,
    Users,
    Building2,
    Globe,
    Copy,
    Check,
    Share2,
    Loader2,
    Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { shareTemplate } from '../../../api/templates';

const VISIBILITY_OPTIONS = [
    {
        id: 'private',
        label: 'Private',
        description: 'Only you can view, edit, and create documents with this template.',
        icon: Lock,
        badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
        id: 'team',
        label: 'Team Workspace',
        description: 'Members of your business workspace can view and instantiate documents.',
        icon: Users,
        badgeColor: 'bg-indigo-50 text-indigo-700',
    },
    {
        id: 'organization',
        label: 'Organization Wide',
        description: 'All departments and teams across your organization can access this template.',
        icon: Building2,
        badgeColor: 'bg-violet-50 text-violet-700',
    },
    {
        id: 'public',
        label: 'Public / Community',
        description: 'Available to all users across the organization as a shared blueprint.',
        icon: Globe,
        badgeColor: 'bg-emerald-50 text-emerald-700',
    },
];

const TemplateShareModal = ({ template, isOpen, onClose, onUpdated }) => {
    const [visibility, setVisibility] = useState(template?.visibility || 'private');
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (template?.visibility) {
            setVisibility(template.visibility);
        }
    }, [template]);

    if (!isOpen || !template) return null;

    const shareUrl = template.type === 'pdf_template'
        ? `${window.location.origin}/templates/pdf-editor/${template.id}`
        : `${window.location.origin}/templates/builder/${template.id}`;

    const handleCopyLink = () => {
        navigator.clipboard?.writeText(shareUrl);
        setCopied(true);
        toast.success('Template link copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const res = await shareTemplate(template.id, { visibility });
            toast.success(`Template visibility updated to ${visibility}!`);
            if (onUpdated) onUpdated(res.data);
            onClose();
        } catch (err) {
            console.error('Failed to update visibility:', err);
            toast.error('Failed to update template sharing permissions.');
        } finally {
            setIsSaving(false);
        }
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
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[9998]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        className="fixed inset-0 z-[9999] p-4 flex items-center justify-center pointer-events-none"
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 pointer-events-auto flex flex-col font-sans"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
                                        <Share2 size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">
                                            Share & Visibility Settings
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                                            {template.name}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 flex flex-col gap-4">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Visibility Level
                                </label>

                                <div className="flex flex-col gap-2.5">
                                    {VISIBILITY_OPTIONS.map((opt) => {
                                        const IconComp = opt.icon;
                                        const isSelected = visibility === opt.id;

                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setVisibility(opt.id)}
                                                className={`p-3.5 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                                                    isSelected
                                                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                                                }`}
                                            >
                                                <div
                                                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                                                    }`}
                                                >
                                                    <IconComp size={18} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-slate-900">
                                                            {opt.label}
                                                        </span>
                                                        {isSelected && (
                                                            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                                        {opt.description}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Link Sharing Section */}
                                <div className="mt-2 pt-4 border-t border-slate-100">
                                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                                        Template Link
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={shareUrl}
                                            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 focus:outline-none select-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCopyLink}
                                            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shrink-0"
                                        >
                                            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                            <span>{copied ? 'Copied' : 'Copy'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs text-slate-400">
                                    Changes take effect immediately for workspace members.
                                </span>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition"
                                    >
                                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                                        <span>Save Permissions</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default TemplateShareModal;
