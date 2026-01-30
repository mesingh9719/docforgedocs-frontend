import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Download, Printer, ZoomIn, ZoomOut, Save, Mail, Bell, Loader2, Clock, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ProposalFormSidebar from './ProposalFormSidebar';
import ProposalDocumentPreview from './ProposalDocumentPreview';
import PrintPortal from '../../../components/PrintPortal';
import SendDocumentModal from '../../../components/SendDocumentModal';
import VersionHistorySidebar from './VersionHistorySidebar';
import { createDocument, getDocument, updateDocument } from '../../../api/documents';
import { getBusiness } from '../../../api/business';
import { generateDocumentPdf, wrapHtmlForPdf } from '../../../utils/pdfGenerator';
import { renderToStaticMarkup } from 'react-dom/server';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultContent = {
    title: "Business / Project Proposal",

    // Dynamic Sections Array
    sections: [
        {
            id: '1',
            title: 'Introduction',
            content: "This proposal is submitted by {{providerCompany}} to {{clientName}} to outline the scope, deliverables, timelines, and commercial terms for {{projectDescription}}. This document is intended to present a clear understanding of the proposed engagement and to serve as a basis for mutual agreement."
        },
        {
            id: '2',
            title: 'Client Objectives',
            content: "The objective of this proposal is to assist {{clientCompany}} in achieving the following goals:\n\n1. [Objective 1]\n2. [Objective 2]\n3. [Objective 3]"
        },
        {
            id: '3',
            title: 'Scope of Work',
            content: "The scope of work under this proposal shall include, but is not limited to, the following services:\n\n**4.1 Services Included**\n[Service 1]\n[Service 2]\n\n**4.2 Services Excluded**\nAny services not explicitly mentioned above shall be considered outside the scope and may be provided under a separate agreement or change request."
        },
        {
            id: '4',
            title: 'Deliverables',
            content: "The following deliverables shall be provided as part of this engagement:\n\n1. [Deliverable 1]\n2. [Deliverable 2]\n\nAll deliverables shall be submitted in the agreed format and within the defined timeline."
        },
        // Timeline is special, handled via separate data prop but placed here conceptually
        {
            id: '5',
            title: 'Project Timeline',
            content: "The estimated timeline for completion of the project is as follows (see table below). Timelines are indicative and subject to client approvals and dependencies."
        },
        {
            id: '6',
            title: 'Commercials & Pricing',
            content: "The total professional fees for the services described in this proposal shall be: {{totalProjectCost}}.\n\n**Payment Terms**\n- [Percentage] payable upon acceptance\n- [Percentage] payable upon milestone completion\n- [Percentage] payable upon final delivery\n\nAll payments shall be made within {{paymentDays}} days from the date of invoice."
        },
        {
            id: '7',
            title: 'Client Responsibilities',
            content: "The Client agrees to:\n- Provide accurate and timely information\n- Share necessary access, approvals, and feedback\n- Assign a single point of contact for communication\n\nDelays caused due to client dependencies may impact project timelines."
        },
        {
            id: '8',
            title: 'Confidentiality',
            content: "Both parties agree to maintain strict confidentiality of all proprietary, technical, commercial, and business information exchanged during the course of this engagement. Confidential information shall not be disclosed to any third party without prior written consent."
        },
        {
            id: '9',
            title: 'Intellectual Property Rights',
            content: "Unless otherwise agreed in writing:\n- All intellectual property developed during the project shall remain the property of {{providerCompany}} until full payment is received.\n- Upon full payment, ownership or license rights shall be transferred as mutually agreed."
        },
        {
            id: '10',
            title: 'Limitation of Liability',
            content: "In no event shall either party be liable for indirect, incidental, or consequential damages. The total liability of {{providerCompany}} shall not exceed the total fees paid under this proposal."
        },
        {
            id: '11',
            title: 'Term & Termination',
            content: "This proposal shall remain valid for {{validityDays}} days from the proposal date. Either party may terminate the engagement by providing {{noticeDays}} days written notice. Fees for work completed up to the termination date shall be payable."
        },
        {
            id: '12',
            title: 'Governing Law',
            content: "This proposal shall be governed by and construed in accordance with the laws of {{jurisdiction}}, and courts of {{courtCity}} shall have exclusive jurisdiction."
        }
    ]
};

const ProposalEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isDesktop = useMediaQuery('(min-width: 1024px)'); // lg breakpoint
    const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'

    const [zoom, setZoom] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [documentName, setDocumentName] = useState('Untitled Proposal');
    const [showHistory, setShowHistory] = useState(false);
    const [previewVersion, setPreviewVersion] = useState(null);
    const originalState = React.useRef(null);

    // State for the Document Variables (Inputs)
    const [formData, setFormData] = useState({
        proposalTitle: 'Website Redesign Project',
        // ... (rest of initial state)
        proposalDate: new Date().toLocaleDateString(),
        // Branding
        logoSize: 80,
        logoAlignment: 'center', // left, center, right
        brandingEnabled: true,
        referenceNo: '',
        referenceNo: '',
        clientName: '',
        clientCompany: '',
        clientAddress: '',
        providerName: '',
        providerCompany: '',
        providerAddress: '',
        projectDescription: '',
        totalProjectCost: '',
        paymentDays: '15',
        validityDays: '30',
        noticeDays: '30',
        jurisdiction: '',
        courtCity: '',
        timeline: [
            { phase: 'Phase 1', description: 'Requirement Analysis', duration: '5 days' },
            { phase: 'Phase 2', description: 'Execution / Development', duration: '15 days' },
            { phase: 'Phase 3', description: 'Review & Final Delivery', duration: '5 days' },
        ]
    });

    // State for the Document Structure (Template Text)
    const [docContent, setDocContent] = useState(defaultContent);

    // Performance Optimization: Defer the preview data
    const deferredFormData = React.useDeferredValue(formData);
    const deferredDocContent = React.useDeferredValue(docContent);

    // ... (existing effects: loadDocument, fetchBusinessDetails) 

    // Load Document
    useEffect(() => {
        if (id) {
            loadDocument(id);
        }
    }, [id]);

    const loadDocument = async (docId) => {
        try {
            const doc = await getDocument(docId);
            if (doc.data.name) setDocumentName(doc.data.name);
            const content = doc.data.content || {};
            if (content.formData) {
                setFormData(prev => ({ ...prev, ...content.formData }));
            }
            if (content.docContent) setDocContent(content.docContent);
        } catch (error) {
            console.error("Failed to load", error);
        }
    };

    // Load Business Details for Defaults
    useEffect(() => {
        if (!id) {
            const fetchBusinessDetails = async () => {
                try {
                    const business = await getBusiness();
                    if (business) {
                        setFormData(prev => ({
                            ...prev,
                            providerName: business.name || '',
                            providerCompany: business.name || '',
                            providerAddress: [business.address, business.city, business.state, business.country].filter(Boolean).join(', '),
                            businessLogo: business.logo || null
                        }));
                    }
                } catch (error) {
                    console.error("Failed to load business details", error);
                }
            };
            fetchBusinessDetails();
        }
    }, [id]);

    // ... (rest of handlers: handleChange, handleContentChange, updateTimeline, etc.)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContentChange = (e) => {
        const { name, value } = e.target;
        setDocContent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Special handler for timeline array
    const updateTimeline = (index, field, value) => {
        const newTimeline = [...formData.timeline];
        newTimeline[index][field] = value;
        setFormData(prev => ({ ...prev, timeline: newTimeline }));
    };

    const addTimelineRow = () => {
        setFormData(prev => ({
            ...prev,
            timeline: [...prev.timeline, { phase: 'New Phase', description: '', duration: '' }]
        }));
    };

    const removeTimelineRow = (index) => {
        if (formData.timeline.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            timeline: prev.timeline.filter((_, i) => i !== index)
        }));
    };

    // ----- Section Management Handlers -----

    const addSection = () => {
        const newSection = {
            id: generateId(),
            title: "New Section",
            content: "Enter the details of this new clause here..."
        };
        setDocContent(prev => ({
            ...prev,
            sections: [...prev.sections, newSection]
        }));
    };

    const removeSection = (id) => {
        setDocContent(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== id)
        }));
    };

    const updateSection = (id, field, value) => {
        setDocContent(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === id ? { ...s, [field]: value } : s
            )
        }));
    };

    const reorderSections = (newSections) => {
        setDocContent(prev => ({
            ...prev,
            sections: newSections
        }));
    };

    // ... (rest of handlers: handleBack, zoom, save, print, etc.)

    const handleBack = () => navigate('/documents');
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                name: documentName,
                type_slug: 'proposal',
                content: {
                    formData,
                    docContent
                },
                status: 'draft'
            };

            if (id) {
                await updateDocument(id, payload);
                toast.success("Proposal updated successfully");
            } else {
                const newDoc = await createDocument(payload);
                toast.success("Proposal created successfully");
                navigate(`/documents/proposal/${newDoc.data.id}`, { replace: true });
            }
        } catch (error) {
            console.error("Failed to save", error);
            toast.error("Failed to save proposal");
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    const [isPrinting, setIsPrinting] = useState(false);
    const lastGeneratedData = React.useRef(null);
    const [cachedPdfUrl, setCachedPdfUrl] = useState(null);

    const handlePrint = async () => {
        if (!id) {
            toast.error("Please save the document before printing.");
            return;
        }

        const currentDataString = JSON.stringify({ formData, docContent });
        if (cachedPdfUrl && lastGeneratedData.current === currentDataString) {
            window.open(cachedPdfUrl, '_blank');
            return;
        }

        setIsPrinting(true);
        try {
            const documentHtml = renderToStaticMarkup(
                <ProposalDocumentPreview data={formData} content={docContent} zoom={1} printing={true} />
            );

            const response = await generateDocumentPdf(
                id,
                documentHtml,
                documentName
            );

            if (response.url) {
                setCachedPdfUrl(response.url);
                lastGeneratedData.current = currentDataString;
                window.open(response.url, '_blank');
            }
        } catch (error) {
            console.error("PDF Generation failed", error);
            toast.error("Failed to generate PDF");
        } finally {
            setIsPrinting(false);
        }
    };

    const [isSending, setIsSending] = useState(false);
    const [sentAt, setSentAt] = useState(null);

    const handleSendEmail = () => {
        if (!id) {
            toast.error("Please save the document before sending.");
            return;
        }
        setIsSending(true);
    };

    const handleSendSuccess = (updatedDoc) => {
        if (updatedDoc && updatedDoc.sent_at) {
            setSentAt(updatedDoc.sent_at);
        }
    };

    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (!id) {
            toast.error("Please save the document before exporting.");
            return;
        }

        setIsExporting(true);
        try {
            const documentHtml = renderToStaticMarkup(
                <ProposalDocumentPreview data={formData} content={docContent} zoom={1} printing={true} />
            );

            const response = await generateDocumentPdf(
                id,
                documentHtml,
                documentName
            );

            if (response.url) {
                const link = document.createElement('a');
                link.href = response.url;
                link.download = `${documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Proposal exported successfully");
            }
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Failed to export proposal");
        } finally {
            setIsExporting(false);
        }
    };

    const handlePreviewVersion = (version) => {
        if (!originalState.current) {
            originalState.current = { formData, docContent };
        }

        let content = version.content;
        if (typeof content === 'string') {
            try { content = JSON.parse(content); } catch (e) { }
        }
        if (content.formData) setFormData(content.formData);
        if (content.docContent) setDocContent(content.docContent);

        setPreviewVersion(version);
        setShowHistory(false);
        toast.success(`Previewing Version ${version.version_number}`);
    };

    const handleExitPreview = () => {
        if (originalState.current) {
            setFormData(originalState.current.formData);
            setDocContent(originalState.current.docContent);
            originalState.current = null;
        }
        setPreviewVersion(null);
        toast.success("Exited preview mode");
    };

    const handleDownloadVersion = async (version) => {
        const toastId = toast.loading("Preparing version PDF...");
        try {
            let content = version.content;
            if (typeof content === 'string') {
                try { content = JSON.parse(content); } catch (e) { }
            }

            // Render HTML for this version
            const documentHtml = renderToStaticMarkup(
                <ProposalDocumentPreview data={content.formData || formData} content={content.docContent || docContent} zoom={1} printing={true} />
            );

            const response = await generateDocumentPdf(
                id,
                documentHtml,
                `${documentName} - v${version.version_number}`
            );

            if (response.url) {
                const link = document.createElement('a');
                link.href = response.url;
                link.download = `${documentName.replace(/[^a-z0-9]/gi, '_')}_v${version.version_number}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success(`Version ${version.version_number} downloaded`, { id: toastId });
            }
        } catch (error) {
            console.error("Version download failed", error);
            toast.error("Failed to download version PDF", { id: toastId });
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
            {/* Preview Banner */}
            {previewVersion && (
                <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-amber-800 text-sm">
                    <div className="flex items-center gap-2">
                        <Eye size={16} />
                        <span className="font-medium">Previewing Version {previewVersion.version_number}</span>
                        <span className="text-amber-600 hidden md:inline">({new Date(previewVersion.created_at).toLocaleString()})</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExitPreview}
                            className="text-amber-700 hover:text-amber-900 font-medium hover:underline flex items-center gap-1"
                        >
                            <X size={14} /> Exit Preview
                        </button>
                    </div>
                </div>
            )}

            {isPrinting && (
                <PrintPortal>
                    <ProposalDocumentPreview data={formData} content={docContent} zoom={1} />
                </PrintPortal>
            )}

            <SendDocumentModal
                isOpen={isSending}
                onClose={() => setIsSending(false)}
                documentId={id}
                documentName={documentName}
                isReminder={!!sentAt}
                onSuccess={handleSendSuccess}
                getHtmlContent={async () => {
                    const documentHtml = renderToStaticMarkup(
                        <ProposalDocumentPreview data={formData} content={docContent} zoom={1} printing={true} />
                    );
                    return wrapHtmlForPdf(documentHtml, documentName);
                }}
            />

            {/* Toolbar */}
            <header className="no-print h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-6 flex items-center justify-between flex-shrink-0 z-30 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors flex-shrink-0"
                        title="Back to Documents"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={documentName}
                                onChange={(e) => setDocumentName(e.target.value)}
                                className="font-bold text-slate-800 text-sm md:text-lg bg-transparent border-none focus:ring-0 p-0 m-0 w-auto min-w-[120px] max-w-[200px] placeholder-slate-400 truncate"
                                placeholder="Enter Document Name"
                            />
                            {sentAt && (
                                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100">
                                    <Check size={10} /> Sent
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:block">Last saved: Just now</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    {/* Zoom, History, Print - Hidden on small mobile to save space */}
                    <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-1 mr-4">
                        <button onClick={handleZoomOut} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomOut size={16} /></button>
                        <span className="text-xs font-semibold text-slate-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
                        <button onClick={handleZoomIn} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomIn size={16} /></button>
                    </div>

                    <button
                        onClick={() => setShowHistory(true)}
                        className="flex items-center gap-2 p-2 md:px-4 md:py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all"
                    >
                        <Clock size={18} />
                        <span className="hidden lg:inline">History</span>
                    </button>

                    <button
                        onClick={handlePrint}
                        className="hidden md:flex items-center gap-2 p-2 md:px-4 md:py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all"
                    >
                        <Printer size={18} />
                        <span className="hidden lg:inline">Print</span>
                    </button>

                    <button
                        onClick={handleSendEmail}
                        className={`flex items-center gap-2 px-2 md:px-4 py-2 text-sm font-medium rounded-lg border border-transparent transition-all ${sentAt ? 'text-amber-600 hover:bg-amber-50 hover:border-amber-200' : 'text-slate-600 hover:bg-slate-50 hover:border-slate-200'}`}
                    >
                        {sentAt ? <Bell size={18} /> : <Mail size={18} />}
                        <span className="hidden lg:inline">{sentAt ? 'Remind' : 'Send'}</span>
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-2 md:px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50"
                    >
                        {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                        <span className="hidden lg:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
                    </button>

                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-3 md:px-5 py-2 rounded-lg text-white font-medium shadow-md transition-all ${isSaving ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isSaving ? <Check size={18} /> : <Save size={18} />}
                        <span className="hidden md:inline">{isSaving ? 'Saved!' : 'Save'}</span>
                    </button>
                </div>
            </header>

            {/* Mobile Tabs */}
            {!isDesktop && (
                <div className="flex bg-white border-b border-slate-200 px-4">
                    <button
                        onClick={() => setActiveTab('edit')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'edit' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Preview
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">

                {/* Left Panel: Editor Sidebar */}
                <div className={`
                    no-print w-full lg:w-[400px] h-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200 
                    overflow-y-auto z-20 shadow-sm flex-shrink-0 lg:order-1
                    ${isDesktop ? 'block' : (activeTab === 'edit' ? 'block' : 'hidden')}
                `}>
                    <ProposalFormSidebar
                        formData={formData}
                        onChange={handleChange}
                        docContent={docContent}
                        onContentChange={handleContentChange}
                        // Section Handlers
                        addSection={addSection}
                        removeSection={removeSection}
                        updateSection={updateSection}
                        reorderSections={reorderSections}
                        // Timeline Handlers
                        updateTimeline={updateTimeline}
                        addTimelineRow={addTimelineRow}
                        removeTimelineRow={removeTimelineRow}
                    />
                </div>

                {/* Right Panel: Live Preview */}
                <div className={`
                    flex-1 h-full overflow-y-auto bg-slate-50/50 p-4 md:p-8 sm:p-12 
                    flex justify-center items-start scrollbar-thin scrollbar-thumb-slate-300 lg:order-2
                    ${isDesktop ? 'flex' : (activeTab === 'preview' ? 'flex' : 'hidden')}
                `}
                    style={{
                        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                >
                    <ProposalDocumentPreview
                        data={deferredFormData}
                        content={deferredDocContent}
                        zoom={zoom}
                    />
                </div>
            </div>
            <VersionHistorySidebar
                documentId={id}
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                onPreview={handlePreviewVersion}
                onDownload={handleDownloadVersion}
                onRestore={(docData) => {
                    if (docData && docData.content) {
                        let content = docData.content;
                        if (typeof content === 'string') {
                            try { content = JSON.parse(content); } catch (e) { }
                        }
                        if (content.formData) setFormData(content.formData);
                        if (content.docContent) setDocContent(content.docContent);
                    }
                    setPreviewVersion(null);
                    originalState.current = null;
                }}
            />
        </div>
    );
};

export default ProposalEditor;
