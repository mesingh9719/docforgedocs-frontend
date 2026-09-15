import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    Save,
    Eye,
    Sliders,
    Play,
    Loader2,
    Check,
    Cloud,
    UploadCloud,
    FileUp,
    FileText,
    Braces,
    Type,
    PenTool,
    Calendar,
    CheckSquare,
    Hash,
    Trash2,
    Copy,
    ZoomIn,
    ZoomOut,
    Search,
    Sparkles,
    Lock,
    Users,
    Building2,
    Share2,
    Download,
    Plus,
    X,
    CheckCircle2,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Bold,
    Move
} from 'lucide-react';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

import {
    getTemplate,
    createTemplate,
    updateTemplate,
    duplicateTemplate,
    useTemplate as useTemplateApi,
    publishTemplate,
    uploadTemplatePdf,
    getTemplatePdfBlob,
    renderTemplatePdfBlob,
} from '../../../api/templates';
import { getDocument, updateDocument } from '../../../api/documents';
import { getBusiness } from '../../../api/business';
import { getSampleContext, getAllVariables } from '../../../utils/variableRegistry';
import { resolveVariables } from '../../../utils/variableResolver';

import VariablePicker from '../../../components/DocumentEngine/Variables/VariablePicker';
import TemplateShareModal from './TemplateShareModal';

const FIELD_TYPES = [
    { type: 'variable_text', label: 'Dynamic Variable', icon: Braces, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { type: 'text', label: 'Custom Text', icon: Type, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { type: 'signature', label: 'Signature Field', icon: PenTool, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { type: 'date', label: 'Date', icon: Calendar, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { type: 'number', label: 'Number / Amount', icon: Hash, color: 'text-teal-600 bg-teal-50 border-teal-200' },
];

const FONT_FAMILIES = [
    { id: 'Helvetica', label: 'Helvetica / Sans' },
    { id: 'Times-Roman', label: 'Times New Roman / Serif' },
    { id: 'Courier', label: 'Courier / Monospace' },
];

const CATEGORIES = [
    { value: 'general', label: 'General' },
    { value: 'invoicing', label: 'Invoicing & Billing' },
    { value: 'legal', label: 'Legal & Contracts' },
    { value: 'hr', label: 'HR & Hiring' },
    { value: 'sales', label: 'Sales & Proposals' },
];

export default function PdfTemplateEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const isDocumentRoute = location.pathname.startsWith('/documents/');

    // Core Template / Document State
    const [templateId, setTemplateId] = useState(id || null);
    const [templateName, setTemplateName] = useState('Untitled PDF Template');
    const [templateDescription, setTemplateDescription] = useState('');
    const [category, setCategory] = useState('general');
    const [version, setVersion] = useState(1);
    const [status, setStatus] = useState('draft');
    const [visibility, setVisibility] = useState('private');

    // PDF Source State
    const [pdfPath, setPdfPath] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfMetadata, setPdfMetadata] = useState({ pages: [], total_pages: 0, file_size: 0 });
    const [numPages, setNumPages] = useState(0);

    // Mapped Fields & Custom Variables
    const [fields, setFields] = useState([]);
    const [customVariables, setCustomVariables] = useState({});
    const [selectedFieldId, setSelectedFieldId] = useState(null);

    // Editor UI State
    const [activeMode, setActiveMode] = useState('design'); // 'design' | 'form' | 'preview'
    const [leftTab, setLeftTab] = useState('elements'); // 'elements' | 'variables' | 'pages'
    const [scale, setScale] = useState(1.0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchFieldQuery, setSearchFieldQuery] = useState('');
    const [formValues, setFormValues] = useState({});

    // Drag / Resize State
    const [draggingFieldId, setDraggingFieldId] = useState(null);
    const [resizingFieldId, setResizingFieldId] = useState(null);
    const dragStartRef = useRef(null);

    // Modals & Async States
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isRendering, setIsRendering] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showVariablePicker, setShowVariablePicker] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [business, setBusiness] = useState(null);

    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    // 1. Initial Load: Business Context & Template / Document Details
    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            try {
                const bizData = await getBusiness();
                if (isMounted) setBusiness(bizData);
            } catch (err) {
                console.error('Failed to load business context:', err);
            }

            if (id) {
                try {
                    if (isDocumentRoute) {
                        const doc = await getDocument(id);
                        if (!isMounted) return;
                        const docData = doc.data || doc || {};
                        setTemplateName(docData.name || 'Untitled Document');
                        setPdfPath(docData.pdf_path || docData.content?.pdf_path || '');
                        if (docData.content?.fields) setFields(docData.content.fields);
                        if (docData.content?.pdf_metadata) setPdfMetadata(docData.content.pdf_metadata);
                        if (docData.content?.custom_variables) setCustomVariables(docData.content.custom_variables);
                    } else {
                        const tmpl = await getTemplate(id);
                        if (!isMounted) return;
                        const tmplData = tmpl.data || tmpl || {};
                        setTemplateName(tmplData.name || 'Untitled PDF Template');
                        setTemplateDescription(tmplData.description || '');
                        setCategory(tmplData.category || 'general');
                        setVersion(tmplData.current_version || tmplData.version || 1);
                        setStatus(tmplData.status || 'draft');
                        setVisibility(tmplData.visibility || 'private');
                        const content = tmplData.content || {};
                        setPdfPath(content.pdf_path || '');
                        if (content.fields) setFields(content.fields);
                        if (content.pdf_metadata) setPdfMetadata(content.pdf_metadata);
                        if (content.custom_variables) setCustomVariables(content.custom_variables);
                    }
                } catch (err) {
                    console.error('Error loading PDF template:', err);
                    toast.error('Failed to load PDF template.');
                }
            }
            if (isMounted) setIsLoading(false);
        };
        init();
        return () => { isMounted = false; };
    }, [id, isDocumentRoute]);

    // 2. Fetch or Create PDF Blob URL whenever templateId or pdfPath is set
    useEffect(() => {
        let objectUrl = null;
        const fetchPdfBlob = async () => {
            if (templateId && !isDocumentRoute) {
                try {
                    const blob = await getTemplatePdfBlob(templateId);
                    objectUrl = URL.createObjectURL(blob);
                    setPdfUrl(objectUrl);
                } catch (err) {
                    console.warn('Direct PDF blob endpoint unavailable, using static fallback:', err);
                    if (pdfPath) {
                        const baseApi = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
                        setPdfUrl(`${baseApi}/templates/pdf/${pdfPath}`);
                    }
                }
            } else if (pdfPath) {
                const baseApi = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
                setPdfUrl(`${baseApi}/templates/pdf/${pdfPath}`);
            }
        };

        if (pdfPath || (templateId && !isDocumentRoute)) {
            fetchPdfBlob();
        }

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [templateId, pdfPath, isDocumentRoute]);

    // Sample context for live previews
    const sampleContext = useMemo(() => {
        return getSampleContext(business, customVariables);
    }, [business, customVariables]);

    // Registered variables list
    const registeredVariablesList = useMemo(() => {
        return Object.values(getAllVariables(customVariables));
    }, [customVariables]);

    // Track unsaved changes
    const markDirty = useCallback(() => {
        setHasUnsavedChanges(true);
    }, []);

    // 3. File Upload Handler
    const handleFileUpload = async (file) => {
        if (!file || file.type !== 'application/pdf') {
            toast.error('Please upload a valid PDF document (.pdf)');
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading('Uploading & analyzing PDF document...');
        try {
            const defaultName = templateName === 'Untitled PDF Template' 
                ? file.name.replace(/\.[^/.]+$/, "") 
                : templateName;
            
            const result = await uploadTemplatePdf(file, defaultName, templateDescription);
            
            setPdfPath(result.pdf_path);
            setPdfMetadata(result.pdf_metadata || { pages: [], total_pages: result.total_pages || 1 });
            setNumPages(result.total_pages || 1);
            if (result.template_id) {
                setTemplateId(result.template_id);
                if (!id) {
                    navigate(`/templates/pdf-editor/${result.template_id}`, { replace: true });
                }
            }
            
            // Create local object URL for instant rendering
            const localUrl = URL.createObjectURL(file);
            setPdfUrl(localUrl);

            toast.success(`PDF uploaded successfully (${result.total_pages || 1} pages)`, { id: toastId });
            markDirty();
        } catch (err) {
            console.error('PDF upload failed:', err);
            toast.error(err.response?.data?.detail || 'Failed to upload PDF.', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    // 4. Add New Field
    const handleAddField = (type = 'variable_text', variableBinding = '', defaultName = '') => {
        const id = `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const typeInfo = FIELD_TYPES.find(t => t.type === type) || FIELD_TYPES[0];
        
        let initialWidth = 24;
        let initialHeight = 3.6;
        if (type === 'checkbox') {
            initialWidth = 5;
            initialHeight = 3.0;
        } else if (type === 'signature') {
            initialWidth = 28;
            initialHeight = 7.0;
        }

        const newField = {
            id,
            name: defaultName || (variableBinding ? variableBinding.split('.').pop().replace(/_/g, ' ') : `${typeInfo.label}`),
            type,
            variable_binding: variableBinding,
            page: currentPage || 1,
            x: 20 + (fields.length % 5) * 3,
            y: 20 + (fields.length % 8) * 4,
            width: initialWidth,
            height: initialHeight,
            font_size: 11,
            font_family: 'Helvetica',
            font_weight: 'normal',
            text_align: 'left',
            color: '#1e293b',
            background_color: 'rgba(238, 242, 255, 0.4)',
            border_color: '#6366f1',
            required: false,
            read_only: false,
            placeholder: '',
            default_value: '',
            sample_value: '',
            signer_role: 'client',
        };

        setFields(prev => [...prev, newField]);
        setSelectedFieldId(id);
        markDirty();
        toast.success(`Added ${newField.name}`);
    };

    // 5. Update Field Property
    const handleUpdateField = (fieldId, updates) => {
        setFields(prev => prev.map(f => f.id === fieldId ? { ...f, ...updates } : f));
        markDirty();
    };

    // 6. Delete Field
    const handleDeleteField = (fieldId) => {
        setFields(prev => prev.filter(f => f.id !== fieldId));
        if (selectedFieldId === fieldId) setSelectedFieldId(null);
        markDirty();
        toast.success('Field deleted');
    };

    // 7. Duplicate Field
    const handleDuplicateField = (field) => {
        const duplicate = {
            ...field,
            id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: `${field.name} (Copy)`,
            x: Math.min(field.x + 3, 100 - field.width),
            y: Math.min(field.y + 3, 100 - field.height),
        };
        setFields(prev => [...prev, duplicate]);
        setSelectedFieldId(duplicate.id);
        markDirty();
        toast.success('Field duplicated');
    };

    // Selected field helper
    const selectedField = useMemo(() => {
        return fields.find(f => f.id === selectedFieldId) || null;
    }, [fields, selectedFieldId]);

    // 8. Save Template
    const handleSave = async () => {
        if (!pdfPath && !pdfUrl) {
            toast.error('Please upload a PDF document before saving.');
            return;
        }

        setIsSaving(true);
        const toastId = toast.loading('Saving PDF template...');
        try {
            const payload = {
                name: templateName,
                description: templateDescription,
                category,
                type: 'pdf_template',
                content: {
                    pdf_path: pdfPath,
                    pdf_metadata: pdfMetadata,
                    fields,
                    custom_variables: customVariables,
                    total_pages: numPages || pdfMetadata.total_pages || 1,
                },
                status,
                visibility,
            };

            if (isDocumentRoute && id) {
                await updateDocument(id, {
                    name: templateName,
                    content: payload.content,
                });
            } else if (templateId) {
                await updateTemplate(templateId, payload);
            } else {
                const res = await createTemplate(payload);
                const newId = res.data?.id || res.id;
                setTemplateId(newId);
                navigate(`/templates/pdf-editor/${newId}`, { replace: true });
            }

            setHasUnsavedChanges(false);
            toast.success('Template saved successfully!', { id: toastId });
        } catch (err) {
            console.error('Failed to save template:', err);
            toast.error(err.response?.data?.detail || 'Failed to save template.', { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    // 9. Publish Template
    const handlePublish = async () => {
        if (!templateId) {
            await handleSave();
        }
        try {
            await publishTemplate(templateId, { note: 'Published from PDF Template Editor' });
            setStatus('active');
            toast.success('Template published successfully!');
        } catch (err) {
            console.error('Failed to publish template:', err);
            toast.error('Failed to publish template.');
        }
    };

    // 10. Download Rendered Flattened PDF
    const handleDownloadRenderedPdf = async () => {
        if (!templateId) {
            toast.error('Please save the template first to generate the rendered PDF.');
            return;
        }

        setIsRendering(true);
        const toastId = toast.loading('Rendering flattened PDF with resolved variables...');
        try {
            // Build field values payload from formValues or sampleContext bindings
            const resolvedValues = {};
            fields.forEach(field => {
                if (formValues[field.id] !== undefined && formValues[field.id] !== '') {
                    resolvedValues[field.id] = formValues[field.id];
                } else if (field.variable_binding) {
                    const sample = resolveVariables(`{{${field.variable_binding}}}`, sampleContext);
                    resolvedValues[field.id] = sample !== `{{${field.variable_binding}}}` ? sample : (field.default_value || '');
                } else {
                    resolvedValues[field.id] = field.default_value || field.sample_value || '';
                }
            });

            const blob = await renderTemplatePdfBlob(templateId, {
                field_values: resolvedValues,
            });

            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${templateName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_rendered.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);

            toast.success('Flattened PDF downloaded!', { id: toastId });
        } catch (err) {
            console.error('Error rendering PDF:', err);
            toast.error(err.response?.data?.detail || 'Failed to render PDF.', { id: toastId });
        } finally {
            setIsRendering(false);
        }
    };

    // 11. Use Template (instantiate document)
    const handleUseTemplate = async () => {
        if (!templateId) return;
        try {
            const res = await useTemplateApi(templateId, {
                name: `${templateName} - ${new Date().toLocaleDateString()}`,
            });
            toast.success('Document created!');
            const route = res.data?.editor_route || res.editor_route || res.route;
            const docId = res.data?.document_id || res.document_id;
            if (route) {
                navigate(route);
            } else if (docId) {
                navigate(`/documents/pdf-editor/${docId}`);
            } else {
                navigate('/documents');
            }
        } catch (err) {
            console.error('Failed to use template:', err);
            toast.error('Failed to instantiate document from template.');
        }
    };

    // Keyboard Shortcuts (Ctrl+S / Cmd+S, Delete, Arrows)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedFieldId && activeMode === 'design') {
                const targetTag = e.target.tagName.toLowerCase();
                if (targetTag !== 'input' && targetTag !== 'textarea' && targetTag !== 'select') {
                    e.preventDefault();
                    handleDeleteField(selectedFieldId);
                }
            }
            if (selectedField && activeMode === 'design') {
                const targetTag = e.target.tagName.toLowerCase();
                if (targetTag !== 'input' && targetTag !== 'textarea' && targetTag !== 'select') {
                    const step = e.shiftKey ? 5 : 1;
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        handleUpdateField(selectedField.id, { x: Math.max(0, selectedField.x - step) });
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        handleUpdateField(selectedField.id, { x: Math.min(100 - selectedField.width, selectedField.x + step) });
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        handleUpdateField(selectedField.id, { y: Math.max(0, selectedField.y - step) });
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        handleUpdateField(selectedField.id, { y: Math.min(100 - selectedField.height, selectedField.y + step) });
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSave, selectedFieldId, selectedField, activeMode]);

    // Drag / Resize Event Listeners on Window
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!dragStartRef.current) return;
            const { type, fieldId, startX, startY, origX, origY, origW, origH, containerW, containerH } = dragStartRef.current;
            
            const deltaXPercent = ((e.clientX - startX) / containerW) * 100;
            const deltaYPercent = ((e.clientY - startY) / containerH) * 100;

            if (type === 'move') {
                const newX = Math.max(0, Math.min(100 - origW, origX + deltaXPercent));
                const newY = Math.max(0, Math.min(100 - origH, origY + deltaYPercent));
                handleUpdateField(fieldId, { x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 });
            } else if (type === 'resize-se') {
                const newW = Math.max(4, Math.min(100 - origX, origW + deltaXPercent));
                const newH = Math.max(2, Math.min(100 - origY, origH + deltaYPercent));
                handleUpdateField(fieldId, { width: Math.round(newW * 10) / 10, height: Math.round(newH * 10) / 10 });
            } else if (type === 'resize-e') {
                const newW = Math.max(4, Math.min(100 - origX, origW + deltaXPercent));
                handleUpdateField(fieldId, { width: Math.round(newW * 10) / 10 });
            } else if (type === 'resize-s') {
                const newH = Math.max(2, Math.min(100 - origY, origH + deltaYPercent));
                handleUpdateField(fieldId, { height: Math.round(newH * 10) / 10 });
            }
        };

        const handleMouseUp = () => {
            if (dragStartRef.current) {
                dragStartRef.current = null;
                setDraggingFieldId(null);
                setResizingFieldId(null);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Filtered elements for list
    const filteredFields = useMemo(() => {
        if (!searchFieldQuery) return fields;
        const q = searchFieldQuery.toLowerCase();
        return fields.filter(f => f.name.toLowerCase().includes(q) || (f.variable_binding && f.variable_binding.toLowerCase().includes(q)));
    }, [fields, searchFieldQuery]);

    // Fields on current page
    const fieldsByPage = useMemo(() => {
        const map = {};
        fields.forEach(f => {
            const p = f.page || 1;
            if (!map[p]) map[p] = [];
            map[p].push(f);
        });
        return map;
    }, [fields]);

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium text-sm">Loading PDF Template Studio...</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-100/70 overflow-hidden font-sans select-none">
            {/* Top Navigation Bar */}
            <header className="h-16 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between z-30 shrink-0 shadow-xs">
                {/* Left: Back + Title + Badges */}
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        type="button"
                        onClick={() => navigate(isDocumentRoute ? '/documents' : '/templates')}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                        title="Back"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div className="flex items-center gap-2 min-w-0">
                        <input
                            type="text"
                            value={templateName}
                            onChange={(e) => { setTemplateName(e.target.value); markDirty(); }}
                            placeholder="Template Title"
                            className="text-base font-bold text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded-lg px-2 py-1 outline-none transition max-w-xs md:max-w-sm truncate"
                        />

                        <div className="hidden sm:flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                                <FileText size={12} />
                                PDF Template
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                v{version}.0
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                status === 'active' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                                {status === 'active' ? 'Published' : 'Draft'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Center: Mode Switcher */}
                <div className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-xs">
                    <button
                        type="button"
                        onClick={() => setActiveMode('design')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            activeMode === 'design'
                                ? 'bg-white text-indigo-600 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Sliders size={14} />
                        Field Mapper
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveMode('form')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            activeMode === 'form'
                                ? 'bg-white text-indigo-600 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Type size={14} />
                        Form Fill
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveMode('preview')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            activeMode === 'preview'
                                ? 'bg-white text-indigo-600 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Eye size={14} />
                        Live Preview
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Zoom controls */}
                    <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-slate-600">
                        <button
                            type="button"
                            onClick={() => setScale(s => Math.max(0.4, Math.round((s - 0.15) * 100) / 100))}
                            className="p-1.5 hover:text-slate-900 hover:bg-white rounded transition cursor-pointer"
                            title="Zoom Out"
                        >
                            <ZoomOut size={14} />
                        </button>
                        <span className="text-xs font-mono font-medium px-2 min-w-[48px] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            type="button"
                            onClick={() => setScale(s => Math.min(2.2, Math.round((s + 0.15) * 100) / 100))}
                            className="p-1.5 hover:text-slate-900 hover:bg-white rounded transition cursor-pointer"
                            title="Zoom In"
                        >
                            <ZoomIn size={14} />
                        </button>
                    </div>

                    {!isDocumentRoute && (
                        <button
                            type="button"
                            onClick={() => setShowShareModal(true)}
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                            title="Share & Permissions"
                        >
                            <Share2 size={14} />
                            Share
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleDownloadRenderedPdf}
                        disabled={isRendering}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50"
                        title="Download Flattened PDF"
                    >
                        {isRendering ? <Loader2 size={14} className="animate-spin text-indigo-600" /> : <Download size={14} />}
                        <span className="hidden sm:inline">Export PDF</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer ${
                            hasUnsavedChanges
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                                : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                    >
                        {isSaving ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : hasUnsavedChanges ? (
                            <Cloud size={14} />
                        ) : (
                            <Check size={14} />
                        )}
                        <span>{hasUnsavedChanges ? 'Save Changes' : 'Saved'}</span>
                    </button>

                    {!isDocumentRoute && status !== 'active' && (
                        <button
                            type="button"
                            onClick={handlePublish}
                            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xl transition cursor-pointer"
                        >
                            <Sparkles size={14} />
                            Publish
                        </button>
                    )}

                    {!isDocumentRoute && (
                        <button
                            type="button"
                            onClick={handleUseTemplate}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl transition cursor-pointer"
                        >
                            <Play size={14} />
                            <span className="hidden md:inline">Use Template</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Elements / Variables / Pages */}
                <aside className="w-72 bg-white border-r border-slate-200/80 flex flex-col shrink-0 z-20 shadow-xs">
                    {/* Sidebar Tabs */}
                    <div className="grid grid-cols-3 border-b border-slate-200 text-xs font-semibold text-slate-600">
                        <button
                            type="button"
                            onClick={() => setLeftTab('elements')}
                            className={`py-2.5 text-center transition cursor-pointer border-b-2 ${
                                leftTab === 'elements'
                                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
                                    : 'border-transparent hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            Elements
                        </button>
                        <button
                            type="button"
                            onClick={() => setLeftTab('variables')}
                            className={`py-2.5 text-center transition cursor-pointer border-b-2 ${
                                leftTab === 'variables'
                                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
                                    : 'border-transparent hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            Variables
                        </button>
                        <button
                            type="button"
                            onClick={() => setLeftTab('pages')}
                            className={`py-2.5 text-center transition cursor-pointer border-b-2 ${
                                leftTab === 'pages'
                                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
                                    : 'border-transparent hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            Pages ({numPages || 1})
                        </button>
                    </div>

                    {/* Tab 1: Elements Palette & Field List */}
                    {leftTab === 'elements' && (
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
                            {/* Quick Add Palette */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                                    Add Field Overlay
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {FIELD_TYPES.map(({ type, label, icon: Icon, color }) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => handleAddField(type)}
                                            className="flex flex-col items-start p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-200 transition text-left group cursor-pointer"
                                        >
                                            <div className={`p-1.5 rounded-lg ${color} mb-1.5 group-hover:scale-105 transition-transform`}>
                                                <Icon size={16} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-800">{label}</span>
                                            <span className="text-[10px] text-slate-400">Click to place</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Placed Fields on Document */}
                            <div className="flex-1 flex flex-col min-h-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Mapped Fields ({fields.length})
                                    </h3>
                                    {fields.length > 0 && (
                                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                            Page {currentPage}
                                        </span>
                                    )}
                                </div>

                                <div className="relative mb-2">
                                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchFieldQuery}
                                        onChange={(e) => setSearchFieldQuery(e.target.value)}
                                        placeholder="Search fields..."
                                        className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 transition"
                                    />
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                                    {filteredFields.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400 text-xs">
                                            No fields mapped yet.<br />Click an element above to add.
                                        </div>
                                    ) : (
                                        filteredFields.map(field => {
                                            const isSelected = selectedFieldId === field.id;
                                            const typeInfo = FIELD_TYPES.find(t => t.type === field.type) || FIELD_TYPES[0];
                                            const Icon = typeInfo.icon;
                                            return (
                                                <div
                                                    key={field.id}
                                                    onClick={() => {
                                                        setSelectedFieldId(field.id);
                                                        if (field.page) setCurrentPage(field.page);
                                                    }}
                                                    className={`p-2.5 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-indigo-50/80 border-indigo-400 shadow-xs'
                                                            : 'bg-white border-slate-200/80 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className={`p-1 rounded-md ${typeInfo.color}`}>
                                                            <Icon size={14} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-semibold text-slate-900 truncate">
                                                                {field.name}
                                                            </p>
                                                            <p className="text-[10px] text-slate-500 truncate font-mono">
                                                                {field.variable_binding ? `{{${field.variable_binding}}}` : `Page ${field.page}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-80 hover:opacity-100">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); handleDuplicateField(field); }}
                                                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition cursor-pointer"
                                                            title="Duplicate"
                                                        >
                                                            <Copy size={13} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteField(field.id); }}
                                                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Dynamic Variables Explorer */}
                    {leftTab === 'variables' && (
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Variable Registry
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowVariablePicker(true)}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                                >
                                    <Sparkles size={12} />
                                    Browse All
                                </button>
                            </div>

                            <p className="text-xs text-slate-500">
                                Click any dynamic variable below to immediately create and bind an overlay field onto the active page.
                            </p>

                            <div className="space-y-1.5 overflow-y-auto pr-1">
                                {registeredVariablesList.slice(0, 30).map((v) => (
                                    <div
                                        key={v.key}
                                        onClick={() => handleAddField('variable_text', v.key, v.label)}
                                        className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-indigo-50/70 hover:border-indigo-300 transition flex items-center justify-between cursor-pointer group"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition">
                                                {v.label}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-mono">
                                                {`{{${v.key}}}`}
                                            </p>
                                        </div>
                                        <Plus size={14} className="text-slate-300 group-hover:text-indigo-600 transition" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Pages Navigator */}
                    {leftTab === 'pages' && (
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Document Pages
                            </h3>
                            <div className="space-y-2">
                                {Array.from({ length: numPages || 1 }, (_, i) => i + 1).map((pageNum) => {
                                    const count = (fieldsByPage[pageNum] || []).length;
                                    const isCurrent = currentPage === pageNum;
                                    return (
                                        <div
                                            key={pageNum}
                                            onClick={() => {
                                                setCurrentPage(pageNum);
                                                const el = document.getElementById(`pdf-page-${pageNum}`);
                                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }}
                                            className={`p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                                                isCurrent
                                                    ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-xs'
                                                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                                                    isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {pageNum}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold">Page {pageNum}</p>
                                                    <p className="text-[10px] text-slate-400">{count} field{count === 1 ? '' : 's'} placed</p>
                                                </div>
                                            </div>
                                            {isCurrent && <CheckCircle2 size={16} className="text-indigo-600" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Center: Interactive Multi-Page PDF Canvas & Overlays */}
                <main
                    ref={containerRef}
                    className="flex-1 overflow-y-auto overflow-x-auto p-6 md:p-10 flex flex-col items-center bg-slate-100/90 relative"
                    onClick={() => {
                        if (activeMode === 'design') setSelectedFieldId(null);
                    }}
                >
                    {!pdfUrl ? (
                        /* Empty State: Upload Base PDF Dropzone */
                        <div className="max-w-xl w-full my-auto bg-white border-2 border-dashed border-indigo-200/80 rounded-3xl p-10 text-center shadow-sm">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                                <FileUp size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Upload Base PDF Document</h2>
                            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                                Upload your PDF contract, invoice, or certificate template. You can then map dynamic variables, text fields, and signatures directly onto the pages.
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                                }}
                                className="hidden"
                            />

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button
                                    type="button"
                                    disabled={isUploading}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                                    <span>{isUploading ? 'Analyzing Document...' : 'Choose PDF File'}</span>
                                </button>
                            </div>

                            <p className="text-xs text-slate-400 mt-4">
                                Supports multi-page PDF documents up to 50MB
                            </p>
                        </div>
                    ) : (
                        /* Loaded Multi-page PDF Viewer */
                        <div className="flex flex-col items-center gap-8 w-full max-w-full">
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={({ numPages }) => {
                                    setNumPages(numPages);
                                }}
                                loading={
                                    <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                                        <p className="text-sm font-medium">Rendering PDF Pages...</p>
                                    </div>
                                }
                                error={
                                    <div className="p-8 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-center max-w-md">
                                        <p className="font-bold text-sm mb-1">Failed to render PDF</p>
                                        <p className="text-xs">Ensure the backend server is running and serving storage files.</p>
                                    </div>
                                }
                            >
                                {Array.from({ length: numPages || 1 }, (_, i) => i + 1).map((pageNum) => {
                                    const pageFields = fieldsByPage[pageNum] || [];
                                    return (
                                        <div
                                            key={pageNum}
                                            id={`pdf-page-${pageNum}`}
                                            className="relative bg-white rounded-xl shadow-lg border border-slate-200/90 overflow-hidden mb-6 transition-all"
                                            style={{
                                                width: `${800 * scale}px`,
                                                margin: '0 auto',
                                            }}
                                            onClick={() => {
                                                setCurrentPage(pageNum);
                                            }}
                                        >
                                            {/* Render PDF Page via React-PDF */}
                                            <Page
                                                pageNumber={pageNum}
                                                width={800 * scale}
                                                renderTextLayer={false}
                                                renderAnnotationLayer={false}
                                            />

                                            {/* Overlay Layer for Mapped Fields */}
                                            <div
                                                className="absolute inset-0 z-10 pointer-events-auto"
                                                onClick={(e) => {
                                                    // Clicking on page canvas deselects active field
                                                    if (e.target === e.currentTarget && activeMode === 'design') {
                                                        setSelectedFieldId(null);
                                                    }
                                                }}
                                            >
                                                {pageFields.map((field) => {
                                                    const isSelected = selectedFieldId === field.id;
                                                    const typeInfo = FIELD_TYPES.find(t => t.type === field.type) || FIELD_TYPES[0];
                                                    const Icon = typeInfo.icon;

                                                    // Calculate preview text value
                                                    let displayVal = field.name;
                                                    if (activeMode === 'form') {
                                                        displayVal = formValues[field.id] !== undefined ? formValues[field.id] : (field.default_value || '');
                                                    } else if (activeMode === 'preview') {
                                                        if (formValues[field.id] !== undefined && formValues[field.id] !== '') {
                                                            displayVal = formValues[field.id];
                                                        } else if (field.variable_binding) {
                                                            const resolved = resolveVariables(`{{${field.variable_binding}}}`, sampleContext);
                                                            displayVal = resolved !== `{{${field.variable_binding}}}` ? resolved : field.name;
                                                        } else {
                                                            displayVal = field.sample_value || field.default_value || field.name;
                                                        }
                                                    }

                                                    return (
                                                        <div
                                                            key={field.id}
                                                            id={`field-box-${field.id}`}
                                                            style={{
                                                                left: `${field.x}%`,
                                                                top: `${field.y}%`,
                                                                width: `${field.width}%`,
                                                                height: `${field.height}%`,
                                                                fontSize: `${Math.max(8, field.font_size * scale)}px`,
                                                                fontFamily: field.font_family === 'Courier' ? 'monospace' : field.font_family === 'Times-Roman' ? 'serif' : 'sans-serif',
                                                                fontWeight: field.font_weight || 'normal',
                                                                textAlign: field.text_align || 'left',
                                                                color: field.color || '#1e293b',
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedFieldId(field.id);
                                                                setCurrentPage(pageNum);
                                                            }}
                                                            className={`absolute group select-none transition-shadow ${
                                                                activeMode === 'design'
                                                                    ? `border rounded-md ${
                                                                        isSelected
                                                                            ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/40 shadow-md z-30'
                                                                            : 'border-indigo-300 bg-indigo-50/30 hover:border-indigo-500 hover:bg-indigo-50/50 z-20'
                                                                    }`
                                                                    : activeMode === 'form'
                                                                    ? 'border border-amber-300 bg-amber-50/60 rounded-md z-20'
                                                                    : 'bg-transparent border-transparent z-10'
                                                            }`}
                                                        >
                                                            {/* Field Content Rendering by Mode */}
                                                            {activeMode === 'design' && (
                                                                <div className="w-full h-full flex items-center px-1.5 min-w-0 overflow-hidden relative">
                                                                    {/* Drag Grabber Handle */}
                                                                    <div
                                                                        onMouseDown={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedFieldId(field.id);
                                                                            const pageEl = document.getElementById(`pdf-page-${pageNum}`);
                                                                            if (!pageEl) return;
                                                                            const rect = pageEl.getBoundingClientRect();
                                                                            dragStartRef.current = {
                                                                                type: 'move',
                                                                                fieldId: field.id,
                                                                                startX: e.clientX,
                                                                                startY: e.clientY,
                                                                                origX: field.x,
                                                                                origY: field.y,
                                                                                origW: field.width,
                                                                                origH: field.height,
                                                                                containerW: rect.width,
                                                                                containerH: rect.height,
                                                                            };
                                                                            setDraggingFieldId(field.id);
                                                                        }}
                                                                        className="mr-1 cursor-grab active:cursor-grabbing text-indigo-400 hover:text-indigo-600"
                                                                        title="Drag to reposition"
                                                                    >
                                                                        <Move size={12} />
                                                                    </div>

                                                                    <div className="flex items-center gap-1 min-w-0 flex-1 truncate">
                                                                        <Icon size={12} className="text-indigo-600 shrink-0" />
                                                                        <span className="text-[11px] font-semibold text-slate-800 truncate">
                                                                            {field.name}
                                                                        </span>
                                                                        {field.variable_binding && (
                                                                            <span className="text-[9px] font-mono text-indigo-700 bg-indigo-100/80 px-1 py-0.2 rounded shrink-0">
                                                                                {field.variable_binding}
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {/* Selected Field Resize Handles */}
                                                                    {isSelected && (
                                                                        <>
                                                                            {/* SE Corner */}
                                                                            <div
                                                                                onMouseDown={(e) => {
                                                                                    e.stopPropagation();
                                                                                    const pageEl = document.getElementById(`pdf-page-${pageNum}`);
                                                                                    if (!pageEl) return;
                                                                                    const rect = pageEl.getBoundingClientRect();
                                                                                    dragStartRef.current = {
                                                                                        type: 'resize-se',
                                                                                        fieldId: field.id,
                                                                                        startX: e.clientX,
                                                                                        startY: e.clientY,
                                                                                        origX: field.x,
                                                                                        origY: field.y,
                                                                                        origW: field.width,
                                                                                        origH: field.height,
                                                                                        containerW: rect.width,
                                                                                        containerH: rect.height,
                                                                                    };
                                                                                    setResizingFieldId(field.id);
                                                                                }}
                                                                                className="absolute -right-1.5 -bottom-1.5 w-3.5 h-3.5 bg-indigo-600 border-2 border-white rounded-full cursor-se-resize shadow-sm"
                                                                            />
                                                                            {/* East Edge */}
                                                                            <div
                                                                                onMouseDown={(e) => {
                                                                                    e.stopPropagation();
                                                                                    const pageEl = document.getElementById(`pdf-page-${pageNum}`);
                                                                                    if (!pageEl) return;
                                                                                    const rect = pageEl.getBoundingClientRect();
                                                                                    dragStartRef.current = {
                                                                                        type: 'resize-e',
                                                                                        fieldId: field.id,
                                                                                        startX: e.clientX,
                                                                                        startY: e.clientY,
                                                                                        origX: field.x,
                                                                                        origY: field.y,
                                                                                        origW: field.width,
                                                                                        origH: field.height,
                                                                                        containerW: rect.width,
                                                                                        containerH: rect.height,
                                                                                    };
                                                                                    setResizingFieldId(field.id);
                                                                                }}
                                                                                className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-indigo-600 border border-white rounded-xs cursor-e-resize"
                                                                            />
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {activeMode === 'form' && (
                                                                <div className="w-full h-full flex items-center px-1">
                                                                    {field.type === 'checkbox' ? (
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={!!formValues[field.id]}
                                                                            onChange={(e) => {
                                                                                setFormValues(prev => ({ ...prev, [field.id]: e.target.checked }));
                                                                            }}
                                                                            className="w-4 h-4 text-indigo-600 rounded cursor-pointer mx-auto"
                                                                        />
                                                                    ) : field.type === 'signature' ? (
                                                                        <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-emerald-700 bg-emerald-50/80 border border-dashed border-emerald-300 rounded">
                                                                            🖋️ Signature Area
                                                                        </div>
                                                                    ) : (
                                                                        <input
                                                                            type="text"
                                                                            value={formValues[field.id] || ''}
                                                                            placeholder={field.name}
                                                                            onChange={(e) => {
                                                                                setFormValues(prev => ({ ...prev, [field.id]: e.target.value }));
                                                                            }}
                                                                            className="w-full h-full text-[11px] bg-white/90 border border-amber-300 rounded px-1.5 outline-none focus:ring-1 focus:ring-amber-500"
                                                                        />
                                                                    )}
                                                                </div>
                                                            )}

                                                            {activeMode === 'preview' && (
                                                                <div className="w-full h-full flex items-center px-1 overflow-hidden">
                                                                    {field.type === 'checkbox' ? (
                                                                        <span className="text-base font-bold text-slate-800">
                                                                            {formValues[field.id] ? '☑' : '☐'}
                                                                        </span>
                                                                    ) : field.type === 'signature' ? (
                                                                        <span className="italic font-serif text-slate-800 text-sm font-semibold">
                                                                            /s/ {resolveVariables('{{customer.name}}', sampleContext) || 'Authorized Signature'}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="truncate w-full">
                                                                            {displayVal}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </Document>
                        </div>
                    )}
                </main>

                {/* Right Sidebar: Field Inspector & Properties */}
                <aside className="w-80 bg-white border-l border-slate-200/80 flex flex-col shrink-0 z-20 shadow-xs overflow-y-auto">
                    {selectedField ? (
                        <div className="p-4 flex flex-col gap-5">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Field Inspector</h3>
                                    <p className="text-[11px] text-slate-400">Configure positioning and variable mapping</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => handleDuplicateField(selectedField)}
                                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                        title="Duplicate field"
                                    >
                                        <Copy size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteField(selectedField.id)}
                                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                        title="Delete field"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>

                            {/* Field Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Field Label / Name</label>
                                <input
                                    type="text"
                                    value={selectedField.name || ''}
                                    onChange={(e) => handleUpdateField(selectedField.id, { name: e.target.value })}
                                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:bg-white transition"
                                />
                            </div>

                            {/* Field Type */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Field Type</label>
                                <select
                                    value={selectedField.type || 'variable_text'}
                                    onChange={(e) => handleUpdateField(selectedField.id, { type: e.target.value })}
                                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:bg-white transition"
                                >
                                    {FIELD_TYPES.map(t => (
                                        <option key={t.type} value={t.type}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Variable Binding */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-bold text-slate-700">Dynamic Variable Binding</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowVariablePicker(true)}
                                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                                    >
                                        <Sparkles size={11} />
                                        Picker
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={selectedField.variable_binding || ''}
                                        onChange={(e) => handleUpdateField(selectedField.id, { variable_binding: e.target.value })}
                                        placeholder="e.g. customer.name, invoice.total"
                                        className="flex-1 text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:bg-white transition"
                                    />
                                    {selectedField.variable_binding && (
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateField(selectedField.id, { variable_binding: '' })}
                                            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                                            title="Clear binding"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                {selectedField.variable_binding && (
                                    <p className="text-[10px] text-indigo-600 mt-1 font-mono">
                                        Resolved sample: {resolveVariables(`{{${selectedField.variable_binding}}}`, sampleContext)}
                                    </p>
                                )}
                            </div>

                            {/* Typography Controls */}
                            {selectedField.type !== 'checkbox' && (
                                <div className="space-y-3 pt-2 border-t border-slate-200">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Typography</h4>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Font Size</label>
                                            <input
                                                type="number"
                                                min="8"
                                                max="36"
                                                value={selectedField.font_size || 11}
                                                onChange={(e) => handleUpdateField(selectedField.id, { font_size: parseInt(e.target.value) || 11 })}
                                                className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Font Family</label>
                                            <select
                                                value={selectedField.font_family || 'Helvetica'}
                                                onChange={(e) => handleUpdateField(selectedField.id, { font_family: e.target.value })}
                                                className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                            >
                                                {FONT_FAMILIES.map(f => (
                                                    <option key={f.id} value={f.id}>{f.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateField(selectedField.id, { text_align: 'left' })}
                                                className={`p-1.5 rounded transition cursor-pointer ${selectedField.text_align === 'left' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'}`}
                                            >
                                                <AlignLeft size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateField(selectedField.id, { text_align: 'center' })}
                                                className={`p-1.5 rounded transition cursor-pointer ${selectedField.text_align === 'center' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'}`}
                                            >
                                                <AlignCenter size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateField(selectedField.id, { text_align: 'right' })}
                                                className={`p-1.5 rounded transition cursor-pointer ${selectedField.text_align === 'right' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'}`}
                                            >
                                                <AlignRight size={14} />
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleUpdateField(selectedField.id, { font_weight: selectedField.font_weight === 'bold' ? 'normal' : 'bold' })}
                                            className={`p-2 rounded-lg border transition cursor-pointer ${selectedField.font_weight === 'bold' ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                                            title="Toggle Bold"
                                        >
                                            <Bold size={14} />
                                        </button>

                                        <input
                                            type="color"
                                            value={selectedField.color || '#1e293b'}
                                            onChange={(e) => handleUpdateField(selectedField.id, { color: e.target.value })}
                                            className="w-9 h-8 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                                            title="Text Color"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Position & Dimensions */}
                            <div className="space-y-3 pt-2 border-t border-slate-200">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Page & Geometry (%)</h4>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[11px] font-medium text-slate-600 mb-1">Target Page</label>
                                        <select
                                            value={selectedField.page || 1}
                                            onChange={(e) => handleUpdateField(selectedField.id, { page: parseInt(e.target.value) || 1 })}
                                            className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                        >
                                            {Array.from({ length: numPages || 1 }, (_, i) => i + 1).map(p => (
                                                <option key={p} value={p}>Page {p}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-medium text-slate-600 mb-1">X Position (%)</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="100"
                                            value={selectedField.x}
                                            onChange={(e) => handleUpdateField(selectedField.id, { x: parseFloat(e.target.value) || 0 })}
                                            className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-medium text-slate-600 mb-1">Y Position (%)</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="100"
                                            value={selectedField.y}
                                            onChange={(e) => handleUpdateField(selectedField.id, { y: parseFloat(e.target.value) || 0 })}
                                            className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-medium text-slate-600 mb-1">Width (%)</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="4"
                                            max="100"
                                            value={selectedField.width}
                                            onChange={(e) => handleUpdateField(selectedField.id, { width: parseFloat(e.target.value) || 10 })}
                                            className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Rules & Validation */}
                            <div className="space-y-2 pt-2 border-t border-slate-200">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Field Rules</h4>
                                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!selectedField.required}
                                        onChange={(e) => handleUpdateField(selectedField.id, { required: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    Required Field
                                </label>
                                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!selectedField.read_only}
                                        onChange={(e) => handleUpdateField(selectedField.id, { read_only: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    Read-only in form mode
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="p-5 flex flex-col gap-5">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 mb-1">Document Settings</h3>
                                <p className="text-xs text-slate-500">Configure global metadata and permissions</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={templateDescription}
                                    onChange={(e) => { setTemplateDescription(e.target.value); markDirty(); }}
                                    placeholder="Enter brief description of this PDF template..."
                                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:bg-white transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => { setCategory(e.target.value); markDirty(); }}
                                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:bg-white transition"
                                >
                                    {CATEGORIES.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                <h4 className="text-xs font-bold text-slate-700">Document Summary</h4>
                                <div className="text-xs text-slate-600 flex justify-between">
                                    <span>Total Pages:</span>
                                    <span className="font-semibold">{numPages || 1}</span>
                                </div>
                                <div className="text-xs text-slate-600 flex justify-between">
                                    <span>Mapped Fields:</span>
                                    <span className="font-semibold">{fields.length}</span>
                                </div>
                                <div className="text-xs text-slate-600 flex justify-between">
                                    <span>Base PDF:</span>
                                    <span className="font-semibold truncate max-w-[140px]">{pdfPath.split('/').pop() || 'Loaded'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* Variable Picker Modal */}
            <VariablePicker
                isOpen={showVariablePicker}
                onClose={() => setShowVariablePicker(false)}
                customVariables={customVariables}
                onSelectVariable={(v) => {
                    if (selectedField) {
                        handleUpdateField(selectedField.id, {
                            variable_binding: v.key,
                            name: selectedField.name === 'Dynamic Variable' || !selectedField.name ? v.label : selectedField.name,
                        });
                    } else {
                        handleAddField('variable_text', v.key, v.label);
                    }
                    setShowVariablePicker(false);
                }}
            />

            {/* Template Share & Permissions Modal */}
            <TemplateShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                template={{
                    id: templateId,
                    name: templateName,
                    visibility,
                    status,
                }}
                onShareUpdated={(updated) => {
                    setVisibility(updated.visibility);
                }}
            />
        </div>
    );
}
