import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
    X,
    Play,
    Edit3,
    FileText,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Monitor,
    Tablet,
    Smartphone,
    Globe,
    Lock,
    Users,
    Building2,
    Layers,
    Sparkles,
} from 'lucide-react';
import Canvas from '../../../components/DocumentEngine/Canvas';
import { getSampleContext } from '../../../utils/variableRegistry';
import { resolveVariables } from '../../../utils/variableResolver';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const VISIBILITY_ICONS = {
    private: Lock,
    team: Users,
    organization: Building2,
    public: Globe,
};

const TemplatePreviewModal = ({
    template,
    isOpen,
    onClose,
    onUse,
    onEdit,
    businessData,
}) => {
    const [zoom, setZoom] = useState(1);
    const [viewport, setViewport] = useState('desktop');
    const [pdfTotalPages, setPdfTotalPages] = useState(1);

    if (!isOpen || !template) return null;

    const isPdfTemplate = template.type === 'pdf_template';
    const content = template.content || {};
    const blocks = content.blocks || [];
    const fields = content.fields || [];
    const pageSettings = content.pageSettings || content.page || {};
    const pdfPath = content.pdf_path || '';
    const baseApi = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
    const pdfUrl = pdfPath ? `${baseApi}/templates/pdf/${pdfPath}` : null;
    const sampleContext = getSampleContext(businessData, content.custom_variables);
    const VisibilityIcon = VISIBILITY_ICONS[template.visibility] || Lock;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn font-sans">
            <div className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden my-auto">
                {/* Modal Header */}
                <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                            isPdfTemplate ? 'bg-purple-50 border border-purple-200 text-purple-600' : 'bg-indigo-50 border border-indigo-100 text-indigo-600'
                        }`}>
                            <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-base font-bold text-slate-900 truncate max-w-md">
                                    {template.name}
                                </h3>
                                {isPdfTemplate ? (
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
                                        PDF Template
                                    </span>
                                ) : template.is_predefined ? (
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                                        Blueprint
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                                        v{template.current_version || 1}
                                    </span>
                                )}
                                {template.visibility && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md capitalize">
                                        <VisibilityIcon size={10} />
                                        {template.visibility}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                {template.description || 'Pre-configured document template ready for customization and document creation.'}
                            </p>
                        </div>
                    </div>

                    {/* Viewport & Zoom Controls */}
                    <div className="hidden md:flex items-center gap-2">
                        {!isPdfTemplate && (
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
                        )}

                        {/* Zoom Controls */}
                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-mono">
                            <button
                                type="button"
                                onClick={() => setZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10))}
                                className="p-1 hover:text-indigo-600 transition"
                                title="Zoom Out"
                            >
                                <ZoomOut size={13} />
                            </button>
                            <span className="px-2 min-w-[42px] text-center">{Math.round(zoom * 100)}%</span>
                            <button
                                type="button"
                                onClick={() => setZoom((z) => Math.min(1.5, Math.round((z + 0.1) * 10) / 10))}
                                className="p-1 hover:text-indigo-600 transition"
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
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {onEdit && (
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onEdit(template);
                                }}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-2xs"
                            >
                                <Edit3 size={14} />
                                <span className="hidden sm:inline">{isPdfTemplate ? 'Open PDF Editor' : 'Customize in Builder'}</span>
                                <span className="sm:hidden">Edit</span>
                            </button>
                        )}

                        {onUse && (
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onUse(template);
                                }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs"
                            >
                                <Play size={14} />
                                <span>Use Template</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Modal Document Canvas Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 flex justify-center bg-slate-100/90">
                    {isPdfTemplate ? (
                        <div
                            className="flex flex-col items-center transition-all duration-300 origin-top"
                            style={{ transform: `scale(${zoom})` }}
                        >
                            {pdfUrl ? (
                                <Document
                                    file={pdfUrl}
                                    onLoadSuccess={({ numPages }) => setPdfTotalPages(numPages || content.total_pages || content.pdf_metadata?.total_pages || 1)}
                                    loading={<div className="p-8 text-xs text-slate-500 font-semibold">Loading PDF Template...</div>}
                                >
                                    {Array.from({ length: pdfTotalPages || content.total_pages || content.pdf_metadata?.total_pages || 1 }, (_, i) => i + 1).map((pageNum) => (
                                        <div key={pageNum} className="relative bg-white rounded-xl shadow-lg border border-slate-200 mb-6 overflow-hidden" style={{ width: '700px' }}>
                                            <Page pageNumber={pageNum} width={700} renderTextLayer={false} renderAnnotationLayer={false} />
                                            {/* Render mapped fields */}
                                            <div className="absolute inset-0 z-10 pointer-events-none">
                                                {fields.filter(f => (f.page || 1) === pageNum).map(f => {
                                                    const val = f.variable_binding ? resolveVariables(`{{${f.variable_binding}}}`, sampleContext) : (f.default_value || f.name);
                                                    return (
                                                        <div
                                                            key={f.id}
                                                            style={{
                                                                left: `${f.x}%`,
                                                                top: `${f.y}%`,
                                                                width: `${f.width}%`,
                                                                height: `${f.height}%`,
                                                                fontSize: `${f.font_size || 11}px`,
                                                                color: f.color || '#1e293b',
                                                            }}
                                                            className="absolute flex items-center px-1 font-semibold truncate bg-indigo-50/20 border border-indigo-200/50 rounded"
                                                        >
                                                            {f.type === 'checkbox' ? '☑' : f.type === 'signature' ? '🖋️ /s/ Signature' : val}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </Document>
                            ) : (
                                <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl max-w-md">
                                    <FileText size={36} className="mx-auto text-purple-600 mb-2" />
                                    <h4 className="font-bold text-slate-800 text-sm">PDF Template</h4>
                                    <p className="text-xs text-slate-500 mt-1">{fields.length} dynamic mapped fields configured.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            className="w-full flex justify-center transition-all duration-300 origin-top"
                            style={{
                                transform: `scale(${zoom})`,
                                maxWidth:
                                    viewport === 'mobile'
                                        ? '420px'
                                        : viewport === 'tablet'
                                        ? '768px'
                                        : '100%',
                            }}
                        >
                            <Canvas
                                blocks={blocks}
                                readOnly={true}
                                businessData={businessData}
                                pageSettings={pageSettings}
                                actions={{}}
                            />
                        </div>
                    )}
                </div>

                {/* Modal Footer Info */}
                <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
                    <div className="flex items-center gap-3">
                        <span>Version {template.current_version || 1}</span>
                        <span>•</span>
                        <span>{isPdfTemplate ? `${fields.length} dynamic mapped fields` : `${blocks.length} configured components`}</span>
                        <span>•</span>
                        <span>Type: {isPdfTemplate ? 'PDF Canvas Template' : 'Visual Block Template'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplatePreviewModal;

