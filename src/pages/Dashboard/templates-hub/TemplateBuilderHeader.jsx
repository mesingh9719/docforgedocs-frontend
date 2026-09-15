import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Eye,
    Sliders,
    Play,
    Loader2,
    Check,
    Cloud,
    Tag,
    Copy,
    Braces,
    Sparkles,
    Globe,
    Lock,
    Users,
    Building2,
    Share2,
    UploadCloud,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Smartphone,
    Tablet,
    Monitor,
} from 'lucide-react';

const CATEGORIES = [
    { value: 'general', label: 'General' },
    { value: 'invoicing', label: 'Invoicing & Billing' },
    { value: 'legal', label: 'Legal & Contracts' },
    { value: 'hr', label: 'HR & Hiring' },
    { value: 'sales', label: 'Sales & Proposals' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'engineering', label: 'Engineering' },
];

const VISIBILITY_ICONS = {
    private: Lock,
    team: Users,
    organization: Building2,
    public: Globe,
};

const TemplateBuilderHeader = ({
    templateName,
    setTemplateName,
    category,
    setCategory,
    version = 1,
    status = 'active',
    visibility = 'private',
    isSaving,
    hasUnsavedChanges,
    activeMode,
    setActiveMode,
    resolveVariablesPreview = true,
    setResolveVariablesPreview,
    onOpenVariablePicker,
    onOpenShareModal,
    onPublish,
    onSave,
    onUse,
    onDuplicate,
    isPredefined,
    zoom = 1,
    setZoom = () => {},
    viewport = 'desktop',
    setViewport = () => {},
}) => {
    const navigate = useNavigate();
    const VisibilityIcon = VISIBILITY_ICONS[visibility] || Lock;

    return (
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between z-30 shrink-0 select-none font-sans">
            {/* Left: Back button + Template Title + Lifecycle & Visibility Badges */}
            <div className="flex items-center gap-3 min-w-0">
                <button
                    type="button"
                    onClick={() => navigate('/templates')}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                    title="Back to Templates Hub"
                >
                    <ArrowLeft size={18} />
                </button>

                <div className="flex items-center gap-2 min-w-0">
                    <input
                        type="text"
                        value={templateName || ''}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Template Title"
                        className="text-sm md:text-base font-bold text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded-lg px-2 py-1 outline-none transition max-w-[160px] sm:max-w-xs md:max-w-md truncate"
                    />

                    <select
                        value={category || 'general'}
                        onChange={(e) => setCategory(e.target.value)}
                        className="hidden sm:inline-block text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg px-2.5 py-1 outline-none transition cursor-pointer"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>

                    <span className="hidden md:inline-flex items-center px-2 py-0.5 text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
                        v{version}
                    </span>

                    {/* Status Badge */}
                    {status === 'draft' ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-md uppercase">
                            Draft
                        </span>
                    ) : (
                        <span className="hidden lg:inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md uppercase">
                            Active
                        </span>
                    )}

                    {/* Visibility Badge & Share Action */}
                    {!isPredefined && onOpenShareModal && (
                        <button
                            type="button"
                            onClick={onOpenShareModal}
                            className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-md transition"
                            title="Configure Visibility & Sharing"
                        >
                            <VisibilityIcon size={11} />
                            <span className="capitalize">{visibility}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Center: Mode Switcher + Viewport & Zoom Controls */}
            <div className="hidden lg:flex items-center gap-3">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
                    <button
                        type="button"
                        onClick={() => setActiveMode('build')}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            activeMode === 'build'
                                ? 'bg-white text-indigo-600 shadow-xs'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Sliders size={13} />
                        <span>Builder</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveMode('preview')}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            activeMode === 'preview'
                                ? 'bg-white text-indigo-600 shadow-xs'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Eye size={13} />
                        <span>Preview</span>
                    </button>
                </div>

                {/* In Preview: Viewport Switcher & Zoom */}
                {activeMode === 'preview' && (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-slate-500">
                            <button
                                type="button"
                                onClick={() => setViewport('desktop')}
                                className={`p-1.5 rounded-md transition ${viewport === 'desktop' ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-700'}`}
                                title="Desktop View"
                            >
                                <Monitor size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewport('tablet')}
                                className={`p-1.5 rounded-md transition ${viewport === 'tablet' ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-700'}`}
                                title="Tablet View"
                            >
                                <Tablet size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewport('mobile')}
                                className={`p-1.5 rounded-md transition ${viewport === 'mobile' ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-700'}`}
                                title="Mobile View"
                            >
                                <Smartphone size={14} />
                            </button>
                        </div>

                        {/* Zoom Controls */}
                        <div className="flex items-center bg-slate-100 px-1.5 py-0.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">
                            <button
                                type="button"
                                onClick={() => setZoom(Math.max(0.6, zoom - 0.1))}
                                className="p-1 hover:text-slate-900 transition"
                                title="Zoom Out"
                            >
                                <ZoomOut size={13} />
                            </button>
                            <span className="px-1 text-[11px] w-10 text-center">{Math.round(zoom * 100)}%</span>
                            <button
                                type="button"
                                onClick={() => setZoom(Math.min(1.4, zoom + 0.1))}
                                className="p-1 hover:text-slate-900 transition"
                                title="Zoom In"
                            >
                                <ZoomIn size={13} />
                            </button>
                            {zoom !== 1 && (
                                <button
                                    type="button"
                                    onClick={() => setZoom(1)}
                                    className="p-1 hover:text-indigo-600 transition ml-0.5"
                                    title="Reset Zoom"
                                >
                                    <RotateCcw size={11} />
                                </button>
                            )}
                        </div>

                        {setResolveVariablesPreview && (
                            <button
                                type="button"
                                onClick={() => setResolveVariablesPreview(!resolveVariablesPreview)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
                                    resolveVariablesPreview
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                <Sparkles size={13} />
                                <span>{resolveVariablesPreview ? 'Data: Active' : 'Data: Tags'}</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Right: Actions (Publish, Share, Save, Use) */}
            <div className="flex items-center gap-2 md:gap-3">
                {/* Publish Button for Drafts */}
                {status === 'draft' && onPublish && (
                    <button
                        type="button"
                        onClick={onPublish}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl transition shadow-2xs"
                        title="Publish this template version to active status"
                    >
                        <UploadCloud size={14} />
                        <span>Publish</span>
                    </button>
                )}

                {/* Variable Picker CTA */}
                {onOpenVariablePicker && (
                    <button
                        type="button"
                        onClick={onOpenVariablePicker}
                        title="Open Variable Picker"
                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-100 rounded-xl transition shadow-2xs"
                    >
                        <Braces size={14} />
                        <span>Variables</span>
                    </button>
                )}

                {/* Share CTA */}
                {onOpenShareModal && !isPredefined && (
                    <button
                        type="button"
                        onClick={onOpenShareModal}
                        title="Share & Permissions"
                        className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-2xs"
                    >
                        <Share2 size={13} />
                        <span>Share</span>
                    </button>
                )}

                {/* Autosave Status */}
                <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400">
                    {isSaving ? (
                        <>
                            <Loader2 size={13} className="animate-spin text-indigo-600" />
                            <span>Saving...</span>
                        </>
                    ) : hasUnsavedChanges ? (
                        <>
                            <Cloud size={13} className="text-amber-500" />
                            <span className="text-amber-600 font-medium">Unsaved</span>
                        </>
                    ) : (
                        <>
                            <Check size={13} className="text-emerald-500" />
                            <span className="text-emerald-600 font-medium">Saved</span>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition shadow-xs"
                >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>Save</span>
                </button>

                {onUse && (
                    <button
                        type="button"
                        onClick={onUse}
                        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/80 rounded-xl transition shadow-2xs"
                    >
                        <Play size={13} />
                        <span>Use</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default TemplateBuilderHeader;
