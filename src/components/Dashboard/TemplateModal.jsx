import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    FileText,
    FileBadge,
    ArrowRight,
    FileCheck,
    Briefcase,
    Handshake,
    LayoutGrid,
    List,
    Search,
    Sparkles,
    Shield,
    Receipt,
    UserCheck,
    Layers,
    Plus,
    Loader2,
    LayoutTemplate,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPredefinedTemplates, getTemplates, useTemplate } from '../../api/templates';
import { createDocument } from '../../api/documents';

const CATEGORY_COLORS = {
    invoicing: 'bg-orange-500 text-white',
    legal: 'bg-indigo-500 text-white',
    hr: 'bg-blue-500 text-white',
    sales: 'bg-emerald-500 text-white',
    consulting: 'bg-violet-500 text-white',
    engineering: 'bg-slate-700 text-white',
    general: 'bg-indigo-600 text-white',
};

const CATEGORY_ICONS = {
    invoicing: Receipt,
    legal: Shield,
    hr: UserCheck,
    sales: Sparkles,
    consulting: Briefcase,
    engineering: Layers,
    general: FileText,
};

const TemplateModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'blueprints' | 'my_templates'
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [blueprints, setBlueprints] = useState([]);
    const [myTemplates, setMyTemplates] = useState([]);
    const closeButtonRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return undefined;

        closeButtonRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);

        // Fetch templates
        const fetchTemplatesData = async () => {
            try {
                setIsLoading(true);
                const [preRes, myRes] = await Promise.all([
                    getPredefinedTemplates().catch(() => ({ data: [] })),
                    getTemplates({ tab: 'my_templates' }).catch(() => ({ data: [] })),
                ]);
                setBlueprints(preRes.data || []);
                setMyTemplates(myRes.data || []);
            } catch (err) {
                console.error('Failed to load templates in modal:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplatesData();

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Combine & Filter list
    const filteredTemplates = useMemo(() => {
        let list = [];
        if (activeTab === 'all') {
            list = [...blueprints, ...myTemplates];
        } else if (activeTab === 'blueprints') {
            list = blueprints;
        } else if (activeTab === 'my_templates') {
            list = myTemplates;
        }

        if (!searchQuery.trim()) return list;

        const q = searchQuery.toLowerCase();
        return list.filter(
            (t) =>
                (t.name && t.name.toLowerCase().includes(q)) ||
                (t.description && t.description.toLowerCase().includes(q)) ||
                (t.category && t.category.toLowerCase().includes(q))
        );
    }, [activeTab, blueprints, myTemplates, searchQuery]);

    const handleSelectTemplate = async (template) => {
        try {
            setIsCreating(true);
            const res = await useTemplate(template.id);
            const route = res.data?.editor_route || res.editor_route || '/documents';
            toast.success(`Document created from ${template.name}!`);
            onClose();
            navigate(route);
        } catch (err) {
            console.error('Failed to instantiate template:', err);
            toast.error('Failed to create document from template.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleCreateBlank = async () => {
        try {
            setIsCreating(true);
            const res = await createDocument({
                name: 'Untitled Document',
                type_slug: 'general',
                content: {
                    blocks: [
                        { id: 'b-1', type: 'heading', content: { text: 'Untitled Document', level: 1 } },
                        { id: 'b-2', type: 'text', content: { text: 'Start typing your document content here...' } },
                    ],
                    variables: {},
                    pageSettings: { size: 'A4', orientation: 'portrait' },
                    metadata: { title: 'Untitled Document', status: 'draft' },
                },
            });
            toast.success('Blank document created!');
            onClose();
            const docId = res.data?.id || res.id;
            navigate(`/documents/general/${docId}`);
        } catch (err) {
            console.error('Failed to create blank document:', err);
            toast.error('Failed to create blank document.');
        } finally {
            setIsCreating(false);
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
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 15 }}
                        className="fixed inset-0 z-[9999] p-3 sm:p-6 pointer-events-none flex items-center justify-center"
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="new-document-title"
                            className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80 relative pointer-events-auto flex flex-col max-h-[92vh]"
                        >
                            {/* Header */}
                            <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col gap-4 bg-slate-50/50">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="min-w-0">
                                        <h2 id="new-document-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                            Create New Document
                                        </h2>
                                        <p className="text-sm text-slate-500 mt-0.5">
                                            Choose a template blueprint or start with a custom template.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                            <button
                                                type="button"
                                                onClick={() => setViewMode('grid')}
                                                className={`p-1.5 rounded-md transition-all ${
                                                    viewMode === 'grid'
                                                        ? 'bg-white shadow-xs text-indigo-600'
                                                        : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                                title="Grid View"
                                                aria-label="Grid view"
                                            >
                                                <LayoutGrid size={17} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setViewMode('list')}
                                                className={`p-1.5 rounded-md transition-all ${
                                                    viewMode === 'list'
                                                        ? 'bg-white shadow-xs text-indigo-600'
                                                        : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                                title="List View"
                                                aria-label="List view"
                                            >
                                                <List size={17} />
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={onClose}
                                            ref={closeButtonRef}
                                            aria-label="Close new document dialog"
                                            className="p-2 hover:bg-slate-200/70 rounded-full transition-colors text-slate-400 hover:text-slate-700"
                                        >
                                            <X size={22} />
                                        </button>
                                    </div>
                                </div>

                                {/* Controls: Tabs & Search */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                                    <div className="flex bg-slate-200/60 p-1 rounded-xl gap-1 text-xs font-semibold text-slate-600 self-start">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('all')}
                                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                                activeTab === 'all'
                                                    ? 'bg-white text-slate-900 shadow-xs'
                                                    : 'hover:text-slate-900'
                                            }`}
                                        >
                                            All Templates ({blueprints.length + myTemplates.length})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('blueprints')}
                                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                                activeTab === 'blueprints'
                                                    ? 'bg-white text-slate-900 shadow-xs'
                                                    : 'hover:text-slate-900'
                                            }`}
                                        >
                                            System Blueprints ({blueprints.length})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('my_templates')}
                                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                                activeTab === 'my_templates'
                                                    ? 'bg-white text-slate-900 shadow-xs'
                                                    : 'hover:text-slate-900'
                                            }`}
                                        >
                                            My Templates ({myTemplates.length})
                                        </button>
                                    </div>

                                    <div className="relative min-w-[220px]">
                                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search templates..."
                                            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content Grid / List */}
                            <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-slate-50/30">
                                {isCreating && (
                                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-20 flex flex-col items-center justify-center">
                                        <Loader2 size={32} className="animate-spin text-indigo-600 mb-2" />
                                        <p className="text-sm font-bold text-slate-800">Creating your document...</p>
                                    </div>
                                )}

                                {isLoading ? (
                                    <div className="py-16 flex flex-col items-center justify-center text-slate-400">
                                        <Loader2 size={28} className="animate-spin text-indigo-500 mb-2" />
                                        <p className="text-xs font-medium">Loading available templates...</p>
                                    </div>
                                ) : (
                                    <div
                                        className={
                                            viewMode === 'grid'
                                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                                                : 'flex flex-col gap-2.5'
                                        }
                                    >
                                        {/* Quick Starter: Blank Document */}
                                        <button
                                            type="button"
                                            onClick={handleCreateBlank}
                                            className={`group relative text-left transition-all rounded-xl border border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/20 hover:bg-indigo-50/50 ${
                                                viewMode === 'grid'
                                                    ? 'p-5 flex flex-col items-start justify-between min-h-[160px]'
                                                    : 'p-4 flex items-center justify-between'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                                                    <Plus size={22} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                                                        Blank Document
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                                        Start fresh with an empty canvas and drag-and-drop components.
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                Create Blank <ArrowRight size={14} />
                                            </span>
                                        </button>

                                        {/* Templates Items */}
                                        {filteredTemplates.map((template) => {
                                            const IconComp = CATEGORY_ICONS[template.category] || FileText;
                                            const colorClass = CATEGORY_COLORS[template.category] || 'bg-slate-700 text-white';

                                            return (
                                                <button
                                                    key={template.id || template.slug}
                                                    type="button"
                                                    onClick={() => handleSelectTemplate(template)}
                                                    className={`group relative text-left transition-all rounded-xl border border-slate-200/80 hover:border-indigo-400 bg-white hover:shadow-md ${
                                                        viewMode === 'grid'
                                                            ? 'p-5 flex flex-col justify-between min-h-[160px]'
                                                            : 'p-3.5 flex items-center justify-between'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3.5 min-w-0">
                                                        <div
                                                            className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0 ${colorClass}`}
                                                        >
                                                            <IconComp size={22} />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                                                <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                                                                    {template.name}
                                                                </h3>
                                                                {template.is_predefined ? (
                                                                    <span className="px-2 py-0.2 text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                                                                        Blueprint
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 py-0.2 text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                                                                        Custom
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                                {template.description || 'Predefined document layout ready to customize.'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 w-full">
                                                        <span className="capitalize text-[11px] font-medium text-slate-500">
                                                            {template.category || 'General'}
                                                        </span>
                                                        <span className="font-semibold text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Use Template <ArrowRight size={13} />
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                <span>
                                    Want to design or manage templates?{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onClose();
                                            navigate('/templates');
                                        }}
                                        className="text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1 ml-1"
                                    >
                                        <LayoutTemplate size={13} />
                                        Open Templates Hub
                                    </button>
                                </span>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
                                >
                                    Cancel
                                </button>
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
