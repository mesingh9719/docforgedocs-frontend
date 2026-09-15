import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';
import { Loader2, Braces, Layers, Sliders, History } from 'lucide-react';

import { useDocumentEngine } from '../../../hooks/useDocumentEngine';
import { getBusiness } from '../../../api/business';
import {
    getTemplate,
    createTemplate,
    updateTemplate,
    duplicateTemplate,
    useTemplate as useTemplateApi,
    publishTemplate,
    restoreTemplateVersion,
} from '../../../api/templates';
import { getSampleContext } from '../../../utils/variableRegistry';

import Canvas from '../../../components/DocumentEngine/Canvas';
import Toolbox from '../../../components/DocumentEngine/Sidebar/Toolbox';
import ConfigurationPanel from '../../../components/DocumentEngine/Sidebar/ConfigurationPanel';
import VariableManager from '../../../components/DocumentEngine/Sidebar/VariableManager';
import VersionHistoryManager from '../../../components/DocumentEngine/Sidebar/VersionHistoryManager';
import VariablePicker from '../../../components/DocumentEngine/Variables/VariablePicker';
import TemplateShareModal from './TemplateShareModal';
import TemplateBuilderHeader from './TemplateBuilderHeader';

const DEFAULT_BLOCK_DATA = {
    HEADING: { text: 'Document Section Heading', level: 1, align: 'left' },
    TEXT: { text: 'Enter text, paragraph details, terms, or descriptions with dynamic variables like {{client.name}}...' },
    CALLOUT: { title: 'Important Notice', text: 'Please review all terms and conditions carefully.', theme: 'info' },
    DIVIDER: { style: 'solid', thickness: 1, color: '#e2e8f0', marginY: 24 },
    SPACER: { height: 32 },
    LOGO: { width: 150, align: 'left' },
    BUSINESS_INFO: { align: 'left' },
    CLIENT_INFO: {
        label: 'PREPARED FOR / CLIENT:',
        clientName: '{{client.name}}',
        companyName: '{{client.company}}',
        clientEmail: '{{client.email}}',
        clientPhone: '{{client.phone}}',
        clientAddress: '{{client.address}}',
    },
    DYNAMIC_TABLE: {
        title: 'Line Items & Services',
        currency: '$',
        taxRate: 10,
        discountRate: 0,
        showTotals: true,
        columns: [
            { key: 'description', label: 'Item & Description', type: 'text', width: '50%' },
            { key: 'quantity', label: 'Qty', type: 'number', width: '15%' },
            { key: 'rate', label: 'Rate', type: 'currency', width: '15%' },
            { key: 'total', label: 'Amount', type: 'calculated', width: '20%' },
        ],
        rows: [
            { description: 'Initial Service Phase / Milestone', quantity: 1, rate: 1200 },
            { description: 'Technical Implementation & Delivery', quantity: 1, rate: 2400 },
        ],
    },
    TOTALS: {
        currency: '$',
        subtotal: 3600,
        taxRate: 10,
        discount: 0,
        shipping: 0,
        notes: 'Payment is due within 30 days of invoice date.',
    },
    SIGNATURE: {
        signee: 'client',
        required: true,
    },
    COLUMNS: {
        leftTitle: 'From (Provider)',
        leftText: '{{company.name}}\n{{company.address}}\n{{company.email}}',
        rightTitle: 'To (Recipient)',
        rightText: '{{client.company}}\n{{client.address}}\n{{client.email}}',
    },
    SECTION: {
        title: 'Section Title',
        subtitle: 'Additional details and supplementary terms',
        bgColor: 'bg-slate-50/60',
        borderColor: 'border-slate-200',
    },
};

const TemplateBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { documentState, actions } = useDocumentEngine();
    const [templateMeta, setTemplateMeta] = useState({
        name: 'New Document Template',
        description: '',
        category: 'general',
        type: 'custom',
        status: 'active',
        visibility: 'private',
        version: 1,
        is_predefined: false,
    });

    const [businessData, setBusinessData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [activeMode, setActiveMode] = useState('build'); // 'build' | 'preview'
    const [resolveVariablesPreview, setResolveVariablesPreview] = useState(true);
    const [variablePickerOpen, setVariablePickerOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [sidebarTab, setSidebarTab] = useState('components'); // 'components' | 'variables' | 'history'
    const [zoom, setZoom] = useState(1);
    const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'

    // Dnd Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    // Initial Load
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true);
                const business = await getBusiness();
                setBusinessData(business);

                if (id) {
                    const res = await getTemplate(id);
                    const tpl = res.data || res || {};
                    setTemplateMeta({
                        name: tpl.name || 'Untitled Template',
                        description: tpl.description || '',
                        category: tpl.category || 'general',
                        type: tpl.type || 'custom',
                        status: tpl.status || 'active',
                        visibility: tpl.visibility || 'private',
                        version: tpl.current_version || 1,
                        is_predefined: tpl.is_predefined || false,
                    });

                    let content = tpl.content;
                    if (typeof content === 'string') {
                        try {
                            content = JSON.parse(content);
                        } catch (e) {
                            content = {};
                        }
                    }

                    if (content) {
                        actions.loadDocument(content);
                    }
                } else {
                    const blueprint = location.state?.blueprint;
                    if (blueprint) {
                        setTemplateMeta({
                            name: `${blueprint.name} (Custom)`,
                            description: blueprint.description || '',
                            category: blueprint.category || 'general',
                            type: 'custom',
                            status: 'active',
                            visibility: 'private',
                            version: 1,
                            is_predefined: false,
                        });
                        actions.loadDocument(blueprint.content || {});
                    } else {
                        // Default blank template starter blocks
                        actions.loadDocument({
                            blocks: [
                                { type: 'LOGO', data: { width: 140, align: 'left' } },
                                { type: 'HEADING', data: { text: 'Custom Document Template', level: 1 } },
                                { type: 'DIVIDER', data: { style: 'solid', thickness: 1 } },
                                { type: 'CLIENT_INFO', data: DEFAULT_BLOCK_DATA.CLIENT_INFO },
                                { type: 'DYNAMIC_TABLE', data: DEFAULT_BLOCK_DATA.DYNAMIC_TABLE },
                                { type: 'SIGNATURE', data: DEFAULT_BLOCK_DATA.SIGNATURE },
                            ],
                            pageSettings: {
                                size: 'A4',
                                orientation: 'portrait',
                                fontFamily: 'Inter, sans-serif',
                                backgroundColor: '#ffffff',
                            },
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to load template builder context:', err);
                toast.error('Failed to load template data.');
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [id]);

    // Compute Sample Context for dynamic preview
    const sampleContext = useMemo(() => {
        return getSampleContext(businessData, documentState.variables);
    }, [businessData, documentState.variables]);

    // Handle Adding Block from Toolbox
    const handleAddBlock = useCallback(
        (type) => {
            const normalizedType = type.toUpperCase().replace(/-/g, '_');
            const defaultData = DEFAULT_BLOCK_DATA[normalizedType] || {};
            actions.addBlock(type, JSON.parse(JSON.stringify(defaultData)));
            setHasUnsavedChanges(true);
        },
        [actions]
    );

    // Handle Drag and Drop End
    const handleDragEnd = useCallback(
        (event) => {
            const { active, over } = event;
            if (!over) return;

            if (active.data?.current?.type === 'TOOL') {
                const toolType = active.data.current.toolType;
                handleAddBlock(toolType);
                return;
            }

            if (active.id !== over.id) {
                const oldIndex = documentState.blocks.findIndex((b) => b.id === active.id);
                const newIndex = documentState.blocks.findIndex((b) => b.id === over.id);
                if (oldIndex !== -1 && newIndex !== -1) {
                    const reordered = arrayMove(documentState.blocks, oldIndex, newIndex);
                    actions.reorderBlocks(reordered);
                    setHasUnsavedChanges(true);
                }
            }
        },
        [documentState.blocks, actions, handleAddBlock]
    );

    // Selected block reference for inspector
    const selectedBlock = useMemo(() => {
        return documentState.blocks.find((b) => b.id === documentState.selectedBlockId) || null;
    }, [documentState.blocks, documentState.selectedBlockId]);

    // Handle Variable Insertion into active block
    const handleInsertVariable = (tag, key) => {
        if (selectedBlock) {
            const blockData = selectedBlock.data || {};
            if (selectedBlock.type === 'HEADING' || selectedBlock.type === 'heading') {
                actions.updateBlock(selectedBlock.id, {
                    text: `${blockData.text || ''} ${tag}`.trim(),
                });
            } else if (selectedBlock.type === 'TEXT' || selectedBlock.type === 'text' || selectedBlock.type === 'paragraph') {
                actions.updateBlock(selectedBlock.id, {
                    text: `${blockData.text || ''} ${tag}`.trim(),
                });
            } else if (selectedBlock.type === 'CALLOUT' || selectedBlock.type === 'callout') {
                actions.updateBlock(selectedBlock.id, {
                    text: `${blockData.text || ''} ${tag}`.trim(),
                });
            } else {
                toast.success(`Copied ${tag} for insertion!`);
            }
            setHasUnsavedChanges(true);
        } else {
            toast.success(`Copied ${tag} to clipboard!`);
        }
    };

    // Save Template Handler
    const handleSave = async () => {
        try {
            setIsSaving(true);
            const contentPayload = {
                blocks: documentState.blocks.map((b) => ({
                    id: b.id,
                    type: b.type,
                    data: b.data || b.content || {},
                    styles: b.styles || {},
                })),
                pageSettings: documentState.pageSettings || {},
                variables: documentState.variables || {},
                metadata: {
                    title: templateMeta.name,
                    category: templateMeta.category,
                    version: templateMeta.version,
                },
            };

            if (id && !templateMeta.is_predefined) {
                const res = await updateTemplate(id, {
                    name: templateMeta.name,
                    description: templateMeta.description,
                    category: templateMeta.category,
                    type: templateMeta.type,
                    status: templateMeta.status,
                    visibility: templateMeta.visibility,
                    content: contentPayload,
                });
                const updated = res.data;
                setTemplateMeta((prev) => ({
                    ...prev,
                    version: updated.current_version || prev.version + 1,
                }));
                toast.success('Template updated successfully!');
            } else {
                const res = await createTemplate({
                    name: templateMeta.name,
                    description: templateMeta.description,
                    category: templateMeta.category,
                    type: 'custom',
                    status: 'active',
                    visibility: templateMeta.visibility || 'private',
                    content: contentPayload,
                });
                const created = res.data;
                toast.success('Template created and published!');
                navigate(`/templates/builder/${created.id}`, { replace: true });
            }
            setHasUnsavedChanges(false);
        } catch (err) {
            console.error('Failed to save template:', err);
            toast.error(err.response?.data?.detail || 'Failed to save template.');
        } finally {
            setIsSaving(false);
        }
    };

    // Publish Template Handler (for draft templates)
    const handlePublish = async () => {
        if (!id) {
            toast.error('Please save your template first before publishing.');
            return;
        }
        try {
            setIsSaving(true);
            const res = await publishTemplate(id);
            setTemplateMeta((prev) => ({
                ...prev,
                status: 'active',
                version: res.data.current_version || prev.version,
            }));
            toast.success('Template published to Active status!');
        } catch (err) {
            console.error('Failed to publish template:', err);
            toast.error('Failed to publish template.');
        } finally {
            setIsSaving(false);
        }
    };

    // Restore Template Version Handler
    const handleRestoreVersion = async (versionId, versionNumber) => {
        if (!id) return;
        try {
            setIsSaving(true);
            const res = await restoreTemplateVersion(id, versionId);
            const updated = res.data || res || {};
            setTemplateMeta((prev) => ({
                ...prev,
                version: updated.current_version || versionNumber,
                status: updated.status || prev.status,
            }));

            let content = updated.content;
            if (typeof content === 'string') {
                try {
                    content = JSON.parse(content);
                } catch (e) {
                    content = {};
                }
            }

            if (content) {
                actions.loadDocument(content);
            }
            toast.success(`Template restored to version v${versionNumber}!`);
        } catch (err) {
            console.error('Failed to restore version:', err);
            toast.error('Failed to restore template version.');
        } finally {
            setIsSaving(false);
        }
    };

    // Duplicate Template Handler
    const handleDuplicate = async () => {
        if (!id) return;
        try {
            const res = await duplicateTemplate(id, {
                new_name: `${templateMeta.name} (Copy)`,
            });
            toast.success('Template duplicated!');
            const newId = res.data?.id || res.id;
            navigate(`/templates/builder/${newId}`);
        } catch (err) {
            toast.error('Failed to duplicate template.');
        }
    };

    // Use Template Handler
    const handleUse = async () => {
        if (!id) {
            toast('Please save your template first before using it.', { icon: 'ℹ️' });
            return;
        }
        try {
            const res = await useTemplateApi(id);
            const route = res.data?.editor_route || res.editor_route || '/documents';
            toast.success('Template loaded into editor!');
            navigate(route);
        } catch (err) {
            toast.error('Failed to instantiate template.');
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
                <Loader2 size={36} className="animate-spin text-indigo-600 mb-4" />
                <p className="text-sm font-semibold text-slate-700">Loading Template Studio...</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col bg-slate-100 overflow-hidden font-sans">
            {/* Top Navigation Bar */}
            <TemplateBuilderHeader
                templateName={templateMeta.name}
                setTemplateName={(name) => {
                    setTemplateMeta((prev) => ({ ...prev, name }));
                    setHasUnsavedChanges(true);
                }}
                category={templateMeta.category}
                setCategory={(category) => {
                    setTemplateMeta((prev) => ({ ...prev, category }));
                    setHasUnsavedChanges(true);
                }}
                version={templateMeta.version}
                status={templateMeta.status}
                visibility={templateMeta.visibility || 'private'}
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
                activeMode={activeMode}
                setActiveMode={setActiveMode}
                resolveVariablesPreview={resolveVariablesPreview}
                setResolveVariablesPreview={setResolveVariablesPreview}
                onOpenVariablePicker={() => setVariablePickerOpen(true)}
                onOpenShareModal={() => setShareModalOpen(true)}
                onPublish={templateMeta.status === 'draft' && id ? handlePublish : null}
                onSave={handleSave}
                onUse={id ? handleUse : null}
                onDuplicate={id ? handleDuplicate : null}
                isPredefined={templateMeta.is_predefined}
                zoom={zoom}
                setZoom={setZoom}
                viewport={viewport}
                setViewport={setViewport}
            />

            {/* Studio Workspace */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Sidebar: Components, Variables, and History Tabs */}
                    {activeMode === 'build' && (
                        <aside className="w-80 bg-white border-r border-slate-200/80 flex flex-col shrink-0 z-20 shadow-xs">
                            <div className="p-2 border-b border-slate-100 flex gap-1 bg-slate-50/60">
                                <button
                                    type="button"
                                    onClick={() => setSidebarTab('components')}
                                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                                        sidebarTab === 'components'
                                            ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <Sliders size={13} />
                                    <span>Blocks</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSidebarTab('variables')}
                                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                                        sidebarTab === 'variables'
                                            ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <Braces size={13} />
                                    <span>Variables</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSidebarTab('history')}
                                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                                        sidebarTab === 'history'
                                            ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <History size={13} />
                                    <span>History</span>
                                </button>
                            </div>

                            {sidebarTab === 'components' ? (
                                <Toolbox onAddBlock={handleAddBlock} />
                            ) : sidebarTab === 'variables' ? (
                                <VariableManager
                                    variables={documentState.variables}
                                    onAdd={(key, config) => {
                                        actions.addVariable(key, config);
                                        setHasUnsavedChanges(true);
                                    }}
                                    onRemove={(key) => {
                                        const updatedVars = { ...documentState.variables };
                                        delete updatedVars[key];
                                        actions.loadDocument({
                                            ...documentState,
                                            variables: updatedVars,
                                        });
                                        setHasUnsavedChanges(true);
                                    }}
                                />
                            ) : (
                                <VersionHistoryManager
                                    templateId={id}
                                    currentVersion={templateMeta.version}
                                    isPredefined={templateMeta.is_predefined}
                                    onRestoreVersion={handleRestoreVersion}
                                />
                            )}
                        </aside>
                    )}

                    {/* Middle Canvas: Document Workspace with Zoom & Viewport */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-12 flex justify-center bg-slate-100/90 relative">
                        <div
                            className="w-full flex justify-center transition-all duration-300 origin-top"
                            style={{
                                transform: activeMode === 'preview' ? `scale(${zoom})` : 'none',
                                maxWidth:
                                    activeMode === 'preview'
                                        ? viewport === 'mobile'
                                            ? '420px'
                                            : viewport === 'tablet'
                                            ? '768px'
                                            : '100%'
                                        : '100%',
                            }}
                        >
                            <Canvas
                                blocks={documentState.blocks}
                                actions={actions}
                                readOnly={activeMode === 'preview'}
                                businessData={businessData}
                                selectedBlockId={documentState.selectedBlockId}
                                onSelectBlock={(id) => actions.selectBlock(id)}
                                pageSettings={documentState.pageSettings}
                                resolvedContext={
                                    activeMode === 'preview' && resolveVariablesPreview
                                        ? sampleContext
                                        : null
                                }
                            />
                        </div>
                    </main>

                    {/* Right Sidebar: Properties & Page Settings Inspector */}
                    {activeMode === 'build' && (
                        <aside className="w-80 bg-white border-l border-slate-200/80 flex flex-col shrink-0 z-20 shadow-xs">
                            <ConfigurationPanel
                                selectedBlock={selectedBlock}
                                updateBlock={(id, data) => {
                                    actions.updateBlock(id, data);
                                    setHasUnsavedChanges(true);
                                }}
                                removeBlock={(id) => {
                                    actions.removeBlock(id);
                                    setHasUnsavedChanges(true);
                                }}
                                duplicateBlock={(id) => {
                                    actions.duplicateBlock(id);
                                    setHasUnsavedChanges(true);
                                }}
                                pageSettings={documentState.pageSettings}
                                setPageSettings={(settings) => {
                                    actions.setPageSettings(settings);
                                    setHasUnsavedChanges(true);
                                }}
                            />
                        </aside>
                    )}
                </div>
            </DndContext>

            {/* Variable Picker Modal */}
            <VariablePicker
                isOpen={variablePickerOpen}
                onClose={() => setVariablePickerOpen(false)}
                onSelectVariable={handleInsertVariable}
                customVariables={documentState.variables}
            />

            {/* Template Share Modal */}
            <TemplateShareModal
                template={
                    id
                        ? {
                              id,
                              name: templateMeta.name,
                              visibility: templateMeta.visibility || 'private',
                          }
                        : null
                }
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                onUpdated={(updatedTpl) => {
                    setTemplateMeta((prev) => ({
                        ...prev,
                        visibility: updatedTpl.visibility,
                    }));
                }}
            />
        </div>
    );
};

export default TemplateBuilder;

