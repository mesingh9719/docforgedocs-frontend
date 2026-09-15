import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutTemplate,
    Plus,
    Search,
    SlidersHorizontal,
    Play,
    Edit3,
    Eye,
    Copy,
    Archive,
    Trash2,
    FileText,
    Sparkles,
    Shield,
    Briefcase,
    Receipt,
    UserCheck,
    ScrollText,
    Layers,
    Loader2,
    RefreshCw,
    MoreVertical,
    Check,
    Share2,
    Lock,
    Users,
    Building2,
    Globe,
    UploadCloud,
} from 'lucide-react';
import toast from 'react-hot-toast';

import {
    getTemplates,
    getPredefinedTemplates,
    duplicateTemplate,
    archiveTemplate,
    deleteTemplate,
    useTemplate,
    publishTemplate,
} from '../../../api/templates';
import { getBusiness } from '../../../api/business';
import TemplatePreviewModal from './TemplatePreviewModal';
import TemplateShareModal from './TemplateShareModal';

const VISIBILITY_ICONS = {
    private: Lock,
    team: Users,
    organization: Building2,
    public: Globe,
};

const CATEGORIES = [
    { id: 'all', label: 'All Templates' },
    { id: 'invoicing', label: 'Invoicing & Billing' },
    { id: 'legal', label: 'Legal & Contracts' },
    { id: 'hr', label: 'HR & Hiring' },
    { id: 'sales', label: 'Sales & Proposals' },
    { id: 'consulting', label: 'Consulting' },
    { id: 'engineering', label: 'Engineering' },
];

const CATEGORY_ICONS = {
    invoicing: Receipt,
    legal: Shield,
    hr: UserCheck,
    sales: Sparkles,
    consulting: Briefcase,
    engineering: Layers,
    general: FileText,
};

const TemplateCard = ({
    template,
    onPreview,
    onEdit,
    onUse,
    onDuplicate,
    onArchive,
    onDelete,
    onShare,
    onPublish,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isPdfTemplate = template.type === 'pdf_template';
    const IconComponent = isPdfTemplate ? FileText : (CATEGORY_ICONS[template.category] || FileText);
    const VisibilityIcon = VISIBILITY_ICONS[template.visibility] || Lock;
    const blocksCount = isPdfTemplate
        ? (template.content?.fields?.length || 0)
        : (template.content?.blocks?.length || 0);

    return (
        <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative">
            {/* Card Header & Badges */}
            <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors shrink-0 ${
                        isPdfTemplate
                            ? 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-100'
                            : 'bg-slate-50 group-hover:bg-indigo-50 border-slate-100 group-hover:border-indigo-100 text-slate-600 group-hover:text-indigo-600'
                    }`}>
                        <IconComponent size={20} />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {isPdfTemplate ? (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/80 rounded-full">
                                PDF Template
                            </span>
                        ) : template.is_predefined ? (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full">
                                Blueprint
                            </span>
                        ) : (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-full">
                                Custom
                            </span>
                        )}

                        {/* Status Tag */}
                        {template.status === 'draft' ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-md uppercase">
                                Draft
                            </span>
                        ) : null}

                        {/* Visibility Tag */}
                        {!template.is_predefined && template.visibility && (
                            <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md capitalize"
                                title={`Visibility: ${template.visibility}`}
                            >
                                <VisibilityIcon size={10} />
                                <span>{template.visibility}</span>
                            </span>
                        )}

                        <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-md">
                            v{template.current_version || 1}
                        </span>

                        {/* Actions Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(!menuOpen);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            >
                                <MoreVertical size={16} />
                            </button>

                            {menuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-20"
                                        onClick={() => setMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30 text-xs font-medium text-slate-700">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onPreview(template);
                                            }}
                                            className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <Eye size={14} className="text-slate-400" />
                                            Preview Document
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onEdit(template);
                                            }}
                                            className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <Edit3 size={14} className="text-slate-400" />
                                            {isPdfTemplate ? 'PDF Template Studio' : 'Visual Builder'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onDuplicate(template);
                                            }}
                                            className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <Copy size={14} className="text-slate-400" />
                                            Duplicate Template
                                        </button>

                                        {!template.is_predefined && onShare && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMenuOpen(false);
                                                    onShare(template);
                                                }}
                                                className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                                            >
                                                <Share2 size={14} className="text-slate-400" />
                                                Share & Permissions
                                            </button>
                                        )}

                                        {!template.is_predefined && template.status === 'draft' && onPublish && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMenuOpen(false);
                                                    onPublish(template);
                                                }}
                                                className="w-full px-3.5 py-2 text-left hover:bg-emerald-50 flex items-center gap-2 text-emerald-700"
                                            >
                                                <Sparkles size={14} />
                                                Publish Template
                                            </button>
                                        )}

                                        {!template.is_predefined && onArchive && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMenuOpen(false);
                                                    onArchive(template);
                                                }}
                                                className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                                            >
                                                <Archive size={14} className="text-slate-400" />
                                                {template.status === 'archived' ? 'Restore Active' : 'Archive Template'}
                                            </button>
                                        )}

                                        {!template.is_predefined && onDelete && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMenuOpen(false);
                                                    onDelete(template);
                                                }}
                                                className="w-full px-3.5 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-red-600"
                                            >
                                                <Trash2 size={14} />
                                                Delete Template
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                    {template.name}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {template.description || 'Pre-configured document template ready for customization and document creation.'}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span>{blocksCount} {isPdfTemplate ? 'Mapped Fields' : 'Components'}</span>
                    <span>•</span>
                    <span className="capitalize">{template.category || 'General'}</span>
                    {template.usage_count > 0 && (
                        <>
                            <span>•</span>
                            <span>{template.usage_count} uses</span>
                        </>
                    )}
                </div>
            </div>

            {/* Card Footer Actions */}
            <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                    type="button"
                    onClick={() => onPreview(template)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white px-2.5 py-1.5 rounded-lg border border-transparent hover:border-slate-200 transition cursor-pointer"
                >
                    <Eye size={13} />
                    Preview
                </button>

                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => onEdit(template)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition shadow-2xs cursor-pointer"
                    >
                        <Edit3 size={13} />
                        {isPdfTemplate ? 'Edit PDF' : 'Build'}
                    </button>

                    <button
                        type="button"
                        onClick={() => onUse(template)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-xl transition shadow-xs cursor-pointer"
                    >
                        <Play size={13} />
                        Use
                    </button>
                </div>
            </div>
        </div>
    );
};

const CreateTemplateModal = ({ isOpen, onClose, predefinedTemplates, onStartBlank, onStartPdf, onStartBlueprint }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn font-sans">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Create New Template</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Choose how you would like to begin designing your document template.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Blank Visual Builder Option */}
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onStartBlank();
                        }}
                        className="p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 text-left transition group cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus size={20} />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mb-1">Visual Block Canvas</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Assemble your template block-by-block with headings, tables, and signatures.
                        </p>
                    </button>

                    {/* PDF Template Studio Option */}
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onStartPdf();
                        }}
                        className="p-5 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/20 hover:border-purple-500 hover:bg-purple-50/50 text-left transition group cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <FileText size={20} />
                        </div>
                        <h4 className="font-bold text-sm text-purple-900 mb-1">Upload PDF Template</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Upload an existing PDF and map dynamic variables, fields, and signers onto its pages.
                        </p>
                    </button>
                </div>

                {/* Pre-built Blueprint Quick Pick */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-emerald-500" />
                        Or Start From Pre-built Blueprints
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {predefinedTemplates.map((blueprint) => (
                            <button
                                key={blueprint.id || blueprint.slug}
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onStartBlueprint(blueprint);
                                }}
                                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left flex items-center justify-between transition cursor-pointer"
                            >
                                <div className="min-w-0 pr-2">
                                    <span className="text-xs font-bold text-slate-800 block truncate">{blueprint.name}</span>
                                    <span className="text-[10px] text-slate-400 capitalize">{blueprint.category}</span>
                                </div>
                                <span className="text-xs font-semibold text-indigo-600 shrink-0">Select</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const VISIBILITY_FILTERS = [
    { id: 'all', label: 'All Visibilities' },
    { id: 'private', label: 'Private' },
    { id: 'team', label: 'Team Workspace' },
    { id: 'organization', label: 'Organization' },
    { id: 'public', label: 'Public' },
];

const TemplatesPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('blueprints'); // 'blueprints' | 'my_templates' | 'archived'
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedVisibility, setSelectedVisibility] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [predefinedTemplates, setPredefinedTemplates] = useState([]);
    const [myTemplates, setMyTemplates] = useState([]);
    const [businessData, setBusinessData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [shareModalTemplate, setShareModalTemplate] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    // Fetch Data
    const loadAllTemplates = async () => {
        try {
            setIsLoading(true);
            const [preRes, myRes, bData] = await Promise.all([
                getPredefinedTemplates(),
                getTemplates({ tab: 'all' }),
                getBusiness().catch(() => null),
            ]);
            setPredefinedTemplates(preRes.data || []);
            setMyTemplates(myRes.data || []);
            setBusinessData(bData);
        } catch (err) {
            console.error('Failed to load templates:', err);
            toast.error('Failed to load templates data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAllTemplates();
    }, []);

    // Filter Logic
    const currentList = useMemo(() => {
        let list = [];
        if (activeTab === 'blueprints') {
            list = predefinedTemplates;
        } else if (activeTab === 'my_templates') {
            list = myTemplates.filter((t) => !t.is_predefined && t.status !== 'archived');
        } else if (activeTab === 'archived') {
            list = myTemplates.filter((t) => t.status === 'archived');
        }

        return list.filter((item) => {
            const matchesCategory =
                selectedCategory === 'all' || item.category === selectedCategory;
            const matchesVisibility =
                selectedVisibility === 'all' || (item.visibility || 'private') === selectedVisibility;
            const matchesSearch =
                !searchQuery ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesVisibility && matchesSearch;
        });
    }, [activeTab, predefinedTemplates, myTemplates, selectedCategory, selectedVisibility, searchQuery]);

    // Action Handlers
    const handleEditInBuilder = (template) => {
        if (template.type === 'pdf_template') {
            navigate(`/templates/pdf-editor/${template.id}`);
        } else {
            navigate(`/templates/builder/${template.id}`);
        }
    };

    const handleUseTemplate = async (template) => {
        try {
            const res = await useTemplate(template.id);
            const route = res.data?.editor_route || res.editor_route || '/documents';
            toast.success(`Template loaded! Opening editor...`);
            navigate(route);
        } catch (err) {
            console.error('Failed to use template:', err);
            toast.error('Failed to use template.');
        }
    };

    const handlePublishTemplate = async (template) => {
        try {
            await publishTemplate(template.id);
            toast.success(`Template "${template.name}" published to active!`);
            await loadAllTemplates();
        } catch (err) {
            console.error('Failed to publish template:', err);
            toast.error('Failed to publish template.');
        }
    };

    const handleDuplicate = async (template) => {
        try {
            const res = await duplicateTemplate(template.id, {
                new_name: `${template.name} (Custom Copy)`,
            });
            toast.success('Template duplicated!');
            await loadAllTemplates();
            const newId = res.data?.id || res.id;
            if (template.type === 'pdf_template') {
                navigate(`/templates/pdf-editor/${newId}`);
            } else {
                navigate(`/templates/builder/${newId}`);
            }
        } catch (err) {
            toast.error('Failed to duplicate template.');
        }
    };

    const handleArchive = async (template) => {
        try {
            await archiveTemplate(template.id);
            toast.success(template.status === 'archived' ? 'Template restored!' : 'Template archived!');
            await loadAllTemplates();
        } catch (err) {
            toast.error('Failed to update template archive status.');
        }
    };

    const handleDelete = async (template) => {
        if (!window.confirm(`Are you sure you want to delete "${template.name}"?`)) return;
        try {
            await deleteTemplate(template.id);
            toast.success('Template deleted!');
            await loadAllTemplates();
        } catch (err) {
            toast.error('Failed to delete template.');
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto font-sans">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                            <LayoutTemplate size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                Document Templates
                            </h1>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Discover blueprints, build custom visual templates, and standardize business documents.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs"
                    >
                        <Plus size={16} />
                        Create Template
                    </button>
                </div>
            </div>

            {/* Navigation Tabs (Blueprints, My Templates, Archived) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl flex-wrap">
                    <button
                        type="button"
                        onClick={() => setActiveTab('blueprints')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                            activeTab === 'blueprints'
                                ? 'bg-white text-indigo-600 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Sparkles size={14} />
                        Predefined Blueprints
                        <span className="px-1.5 py-0.5 text-[10px] bg-indigo-50 text-indigo-700 rounded-md">
                            {predefinedTemplates.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('my_templates')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                            activeTab === 'my_templates'
                                ? 'bg-white text-indigo-600 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <FileText size={14} />
                        My Custom Templates
                        <span className="px-1.5 py-0.5 text-[10px] bg-slate-200 text-slate-700 rounded-md">
                            {myTemplates.filter((t) => !t.is_predefined && t.status !== 'archived').length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('archived')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                            activeTab === 'archived'
                                ? 'bg-white text-indigo-600 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Archive size={14} />
                        Archived
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search templates..."
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                    />
                </div>
            </div>

            {/* Filter Section: Categories & Visibility */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                {/* Category Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                                selectedCategory === cat.id
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Visibility Filter (for custom templates) */}
                {activeTab === 'my_templates' && (
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
                        {VISIBILITY_FILTERS.map((vf) => (
                            <button
                                key={vf.id}
                                type="button"
                                onClick={() => setSelectedVisibility(vf.id)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                                    selectedVisibility === vf.id
                                        ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {vf.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content List / Grid */}
            {isLoading ? (
                <div className="py-24 text-center">
                    <Loader2 size={32} className="animate-spin text-indigo-600 mx-auto mb-3" />
                    <p className="text-xs font-semibold text-slate-600">Loading templates...</p>
                </div>
            ) : currentList.length === 0 ? (
                <div className="py-20 text-center bg-white border border-slate-200/80 rounded-2xl p-8">
                    <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <LayoutTemplate size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">No templates found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                        {searchQuery
                            ? `No templates matched "${searchQuery}". Try adjusting your query.`
                            : 'No templates matching the selected filters. Start creating your first custom template.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
                    >
                        <Plus size={14} />
                        Create New Template
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentList.map((tpl) => (
                        <TemplateCard
                            key={tpl.id}
                            template={tpl}
                            onPreview={(t) => setPreviewTemplate(t)}
                            onEdit={handleEditInBuilder}
                            onUse={handleUseTemplate}
                            onDuplicate={handleDuplicate}
                            onArchive={handleArchive}
                            onDelete={handleDelete}
                            onShare={(t) => setShareModalTemplate(t)}
                            onPublish={handlePublishTemplate}
                        />
                    ))}
                </div>
            )}

            {/* Full Document Preview Modal */}
            <TemplatePreviewModal
                template={previewTemplate}
                isOpen={!!previewTemplate}
                onClose={() => setPreviewTemplate(null)}
                onEdit={handleEditInBuilder}
                onUse={handleUseTemplate}
                businessData={businessData}
            />

            {/* Template Share Modal */}
            <TemplateShareModal
                template={shareModalTemplate}
                isOpen={!!shareModalTemplate}
                onClose={() => setShareModalTemplate(null)}
                onUpdated={() => loadAllTemplates()}
            />

            {/* Create Template Modal */}
            <CreateTemplateModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                predefinedTemplates={predefinedTemplates}
                onStartBlank={() => navigate('/templates/builder')}
                onStartPdf={() => navigate('/templates/pdf-editor')}
                onStartBlueprint={(blueprint) =>
                    navigate('/templates/builder', { state: { blueprint } })
                }
            />
        </div>
    );
};

export default TemplatesPage;
